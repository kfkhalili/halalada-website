interface CardanoWallet {
  name: string;
  icon: string;
  version: string;
  apiVersion: string;
  enable(): Promise<WalletApi>;
  isEnabled(): Promise<boolean>;
  experimental?: Record<string, unknown>;
}

interface WindowCardano {
  eternl?: CardanoWallet;
  nami?: CardanoWallet;
  yoroi?: CardanoWallet;
  flint?: CardanoWallet;
  [key: string]: CardanoWallet | undefined;
}

interface Window {
  cardano?: WindowCardano;
}
