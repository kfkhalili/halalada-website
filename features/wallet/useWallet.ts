import { useEffect } from "react";
import { useAtom } from "jotai";
import { walletAtom, walletStatusAtom, selectWalletModalAtom } from "./atoms";
import PubSub from "pubsub-js";
import { CardanoAPI, Blockfrost } from "@lib/cardano-api";
import toast from "react-hot-toast";
import { config } from "@shared/config";

export const useRestoreWallet = () => {
  const { connectWallet } = useWallet();
  const [wallet] = useAtom(walletAtom);

  useEffect(() => {
    if (wallet?.walletKey) {
      connectWallet(wallet.walletKey).catch((err) => {
        console.error("Failed to restore wallet:", err);
      });
    }
  }, []);
};

export const useWallet = () => {
  const [wallet, setWallet] = useAtom(walletAtom);
  const [walletStatus, setWalletStatus] = useAtom(walletStatusAtom);
  const [_, setSelectWalletModal] = useAtom(selectWalletModalAtom);

  function selectWallet() {
    setSelectWalletModal(true);
  }

  async function connectWallet(walletKey: string) {
    setWalletStatus("connecting");

    try {
      await waitForExtension(walletKey);

      const emurgoSerializationLib = await import(
        "@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib"
      );

      await CardanoAPI.register({
        wallet: walletKey,
        plugins: [Blockfrost()],
        cardanoSerializationLibrary: emurgoSerializationLib,
      });

      const response: Boolean | undefined | null =
        await CardanoAPI?.baseCommands.enable();

      if (response) {
        const balance = await CardanoAPI.baseCommands.getBalance();
        const paymentAddress = await CardanoAPI.baseCommands.getChangeAddress(
          CardanoAPI.addressReturnType.bech32
        );
        setWallet({
          walletKey,
          balance: balance,
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
          // testnet pools
          // stakepoolId: '7b3170bbd9a2a806ac886dcdcedabc93869ebc8891ae006df1189e2f',
          // stakepoolId: '5f5ed4eb2ba354ab2ad7c8859f3dacf93564637a105e80c8d8a7dc3c',

          // prod
          stakepoolId:
            "6c518b4861bb88b1395ceb116342cecbcfb8736282655f9a61c4c368",
        });

        if (stake) {
          toast.success(
            "Successfully delegated to our CRFA stake pool! Thank You!"
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

  return {
    connectWallet,
    disconnectWallet,
    delegate,
    selectWallet,
    wallet,
    status: walletStatus,
  };
};

//@ts-ignore
function waitForExtension(walletKey) {
  let attemps = 0;

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
        attemps++;

        if (attemps > 20) {
          clearInterval(interval);
          reject("Could not connect to wallet");
        }
      }
    }, 200);
  });
}
