interface WalletAPI {
  enable: () => Promise<any>;
  isEnabled: () => Promise<boolean>;
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
}

interface Window {
  cardano?: {
    eternl?: WalletAPI;
    flint?: WalletAPI;
    nami?: WalletAPI;
    yoroi?: WalletAPI;
    [key: string]: WalletAPI | undefined; // Allow indexing by string
  };
}
