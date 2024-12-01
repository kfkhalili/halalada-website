import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  walletAtom,
  walletStatusAtom,
  selectWalletModalAtom,
  donateModalAtom,
  premiumAccessStatusAtom,
} from "./atoms";
import PubSub from "pubsub-js";
import * as cbor from "cbor-web";
import { CardanoAPI, Blockfrost, Spend } from "@lib/cardano-api";
import toast from "react-hot-toast";
import { config } from "@shared/config";

export const useRestoreWallet = () => {
  const { connectWallet } = useWallet();
  const [wallet] = useAtom(walletAtom);

  useEffect(() => {
    if (wallet) {
      connectWallet(wallet.walletKey);
    }
  }, []);
};

export function useWallet() {
  const [wallet, setWallet] = useAtom(walletAtom);
  const [premiumAccessStatus, setPremiumAccessStatus] = useAtom(
    premiumAccessStatusAtom
  );
  const [walletStatus, setWalletStatus] = useAtom(walletStatusAtom);
  const [_, setSelectWalletModal] = useAtom(selectWalletModalAtom);
  const [__, setDonateModal] = useAtom(donateModalAtom);

  function selectWallet() {
    setSelectWalletModal(true);
  }

  function selectDonation() {
    setDonateModal(true);
  }

  async function connectWallet(walletKey: string) {
    setWalletStatus("connecting");

    try {
      await waitForExtension(walletKey);

      const emurgoSerializationLib = await import(
        "@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.js"
      );

      await CardanoAPI.register({
        wallet: walletKey,
        plugins: [Blockfrost(), Spend()],
        cardanoSerializationLibrary: emurgoSerializationLib,
      });

      const response: Boolean | undefined | null =
        await CardanoAPI?.baseCommands.enable();

      if (response) {
        const balance = await CardanoAPI.baseCommands.getBalance();
        const paymentAddress = await CardanoAPI.baseCommands.getChangeAddress(
          CardanoAPI.addressReturnType.bech32
        );
        const decodedBalance = await decodeBalance(String(balance));

        setWallet({
          walletKey,
          balance: decodedBalance,
          address: paymentAddress,
        });
        setWalletStatus("connected");

        PubSub.publish("wallet.connected");
      } else {
        setWalletStatus("disconnected");
        toast.error("Could not connect to wallet");
      }
    } catch (e) {
      setWalletStatus("disconnected");
      toast.error("Could not connect to wallet");
      console.error(e);
    }
  }

  function disconnectWallet() {
    setWalletStatus("disconnected");
    setWallet(null);
  }

  async function delegate() {
    const executeDelegation = async () => {
      try {
        //@ts-ignore
        const stake = await CardanoAPI?.plugins.spend.delegate({
          // mainnet
          stakepoolId:
            "6c518b4861bb88b1395ceb116342cecbcfb8736282655f9a61c4c368",
        });

        if (stake) {
          toast.success(
            "Successfully delegated to our HLAL1 stake pool! Thank You!"
          );
        }
      } catch (e) {
        toast.error(
          "Error occurred while delegating or a user cancelled delegation process."
        );
        console.log("failed while delegating", e);
      }
    };

    if (walletStatus !== "connected") {
      selectWallet();

      const token = PubSub.subscribe("wallet.connected", () => {
        executeDelegation();
        PubSub.unsubscribe(token);
      });
    } else {
      executeDelegation();
    }
  }

  async function donate() {
    const executeDonation = async (amount: number) => {
      try {
        //@ts-ignore
        const result = await CardanoAPI?.plugins.spend.send({
          // mainnet
          address:
            "addr1q8nq8wdhrpq402qj4hyn5rxn624l0ccua8k3epl2xl3fz57zddeldn7syvs5x2uvuefk66azhr7lelrj423lxapuxkksknwfdj",
          amount,
          metadataLabel: "674",
          metadata: { msg: ["CBI"] },
        });

        if (result) {
          toast.success(
            `Successfully donated ${amount} ADA to Cardano Blockchain Insights! Thank You!`
          );
        }
      } catch (e) {
        toast.error(
          "Error occurred while donating or a user cancelled transaction."
        );
        console.log("failed while donating", e);
      }
    };

    if (walletStatus !== "connected") {
      selectWallet();

      const connectionToken = PubSub.subscribe("wallet.connected", () => {
        selectDonation();

        PubSub.unsubscribe(connectionToken);
      });
    } else {
      selectDonation();
    }

    const donationToken = PubSub.subscribe(
      "donation.confirmed",
      (msg, data) => {
        executeDonation(data.amount);
        PubSub.unsubscribe(donationToken);
      }
    );
  }

  function checkPremiumAccessByToken() {
    const executeGetAssets = async () => {
      setPremiumAccessStatus("checking");

      //@ts-ignore
      const rewardAddress = await CardanoAPI.baseCommands.getRewardAddress(
        CardanoAPI.addressReturnType.bech32
      );

      //@ts-ignore
      const result = await CardanoAPI?.plugins.spend.getAssets(rewardAddress);

      if (result) {
        const hasAccess = result.some(
          (asset: { unit: string; quantity: string }) =>
            asset.unit === config.accessToken &&
            Number(asset.quantity) >= config.accessTokenQuantity
        );
        setPremiumAccessStatus(hasAccess ? "granted" : "denied");
      }
    };

    if (walletStatus !== "connected") {
      const token = PubSub.subscribe("wallet.connected", () => {
        executeGetAssets();
        PubSub.unsubscribe(token);
      });
    } else {
      executeGetAssets();
    }
  }

  function confirmDonation(amount: number) {
    PubSub.publish("donation.confirmed", { amount });
  }

  return {
    connectWallet,
    disconnectWallet,
    delegate,
    donate,
    checkPremiumAccessByToken,
    confirmDonation,
    selectWallet,
    wallet,
    status: walletStatus,
    premiumAccessStatus,
  };
}

async function decodeBalance(cborValue: string) {
  if (!cborValue) {
    return 0;
  }

  const hexPairs = cborValue.match(/.{1,2}/g) || [];
  const buffer = new Uint8Array(
    hexPairs.map((byte: string) => parseInt(byte, 16))
  );

  const decodedBalance = await cbor.decodeFirst(buffer);

  // cover edge case
  if (Array.isArray(decodedBalance)) {
    return decodedBalance[0];
  }

  return decodedBalance;
}

//@ts-ignore
function waitForExtension(walletKey) {
  let attempts = 0;

  //@ts-ignore
  const isExtensionLoaded = () => window.cardano && window.cardano[walletKey];

  return new Promise((resolve, reject) => {
    if (isExtensionLoaded()) {
      resolve(null);
      return;
    }

    const interval = setInterval(function () {
      if (isExtensionLoaded()) {
        clearInterval(interval);
        resolve(null);
      } else {
        attempts++;

        if (attempts > 20) {
          clearInterval(interval);
          reject("Could not connect to wallet");
        }
      }
    }, 200);
  });
}
