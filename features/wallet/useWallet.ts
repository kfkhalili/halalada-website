import { useCallback } from "react";
import * as Cardano from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { walletAtom, selectWalletModalAtom, walletStatusAtom } from "./atoms";

export const useRestoreWallet = () => {
  const { connectWallet } = useWallet();
  const [wallet] = useAtom(walletAtom);

  useEffect(() => {
    if (wallet?.walletKey) {
      connectWallet(wallet.walletKey).catch((err) => {
        console.error("Failed to restore wallet:", err);
      });
    }
  }, [wallet?.walletKey, connectWallet]); // Use walletKey and memoized connectWallet
};

export const useWallet = () => {
  const [_, setSelectWalletModal] = useAtom(selectWalletModalAtom);
  const [wallet, setWallet] = useAtom(walletAtom);
  const [status, setStatus] = useAtom(walletStatusAtom);

  const connectWallet = useCallback(
    async (walletKey: string) => {
      setStatus("connecting");

      try {
        if (!window.cardano || !window.cardano[walletKey]) {
          throw new Error(`${walletKey} wallet is not installed.`);
        }

        const api = await window.cardano[walletKey].enable();

        const utxosHex = await api.getUtxos();
        const utxos: Cardano.TransactionUnspentOutput[] = utxosHex.map(
          (utxo: string) =>
            Cardano.TransactionUnspentOutput.from_bytes(
              Buffer.from(utxo, "hex")
            )
        );

        const totalBalance = utxos.reduce(
          (sum: number, utxo: Cardano.TransactionUnspentOutput) => {
            return sum + parseInt(utxo.output().amount().coin().to_str());
          },
          0
        );

        const address = await api.getChangeAddress();
        const addressBech32 = Cardano.Address.from_bytes(
          Buffer.from(address, "hex")
        ).to_bech32();

        setWallet({
          walletKey,
          balance: totalBalance,
          address: addressBech32,
        });

        setStatus("connected");
      } catch (error) {
        console.error("Wallet connection error:", error);
        setStatus("disconnected");
      }
    },
    [setWallet, setStatus]
  );

  const selectWallet = () => {
    setSelectWalletModal(true);
  };

  const delegate = async () => {};

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setStatus("disconnected");
  }, [setWallet, setStatus]);

  return {
    wallet,
    status,
    delegate,
    selectWallet,
    connectWallet,
    disconnectWallet,
  };
};
