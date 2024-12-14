import React from "react";
import NextImage from "next/image";
import { useAtom } from "jotai";
import { Modal } from "@components/shared/Modal";
import { config } from "@shared/config";
import { selectWalletModalAtom } from "../atoms";
import { useWallet } from "../useWallet";

export const SelectWalletModal: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(selectWalletModalAtom);
  const { connectWallet } = useWallet();

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      title="Select Wallet"
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <div className="grid grid-cols-2 gap-6">
        {Object.values(config.wallets).map((wallet) => (
          <button
            key={wallet.name}
            className="p-3 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-all flex flex-col items-center"
            onClick={() => {
              connectWallet(wallet.walletKey);
              setIsOpen(false);
            }}
          >
            <div className="flex justify-center items-center mb-2">
              <NextImage
                objectFit="contain"
                height={80}
                width={80}
                src={wallet.logo}
                alt=""
              />
            </div>
            <div className="text-slate-100 text-lg">{wallet.name}</div>
          </button>
        ))}
      </div>
    </Modal>
  );
};
