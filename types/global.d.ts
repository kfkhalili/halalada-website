// CIP-30 Wallet API Standard Interface
interface WalletApi {
  getNetworkId(): Promise<number>; // Returns 0 for testnet, 1 for mainnet
  getUtxos(amount?: string, paginate?: Paginate): Promise<Utxo[] | null>;
  getBalance(): Promise<string>; // Returns the wallet's balance in lovelace
  getUsedAddresses(paginate?: Paginate): Promise<string[]>; // Array of used addresses (Bech32)
  getUnusedAddresses(): Promise<string[]>; // Array of unused addresses (Bech32)
  getChangeAddress(): Promise<string>; // Single change address (Bech32)
  getRewardAddresses(): Promise<string[]>; // Array of staking/reward addresses (Bech32)
  signTx(tx: string, partialSign?: boolean): Promise<string>; // Signs a transaction
  submitTx(tx: string): Promise<string>; // Submits a transaction to the blockchain
  signData(address: string, payload: string): Promise<SignedData>; // Signs arbitrary data
  getCollateral(): Promise<Utxo[] | null>; // Returns collateral UTXOs
}

// Supporting Types
interface Paginate {
  page: number; // Current page number
  limit: number; // Number of items per page
}

interface Utxo {
  txHash: string; // Transaction hash
  outputIndex: number; // Output index
  amount: Token[]; // List of tokens
  address: string; // Address associated with the UTXO
  datumHash?: string; // Optional datum hash
}

interface Token {
  unit: string; // Policy ID + Asset Name or "lovelace"
  quantity: string; // Amount of the token in the UTXO
}

interface SignedData {
  signature: string; // The signature
  key: string; // The public key used for signing
}

interface CardanoWallet {
  name: string; // Wallet name (e.g., "eternl", "nami", "yoroi", etc.)
  icon: string; // URL to the wallet's icon
  version: string; // Wallet version
  apiVersion: string; // CIP-30 API version
  enable(): Promise<WalletApi>; // Enables the wallet and returns its API
  isEnabled(): Promise<boolean>; // Checks if the wallet is already enabled
  experimental?: Record<string, unknown>; // Optional experimental features
}

interface WindowCardano {
  eternl?: CardanoWallet; // Eternl wallet
  nami?: CardanoWallet; // Nami wallet
  yoroi?: CardanoWallet; // Yoroi wallet
  flint?: CardanoWallet; // Flint wallet
  [key: string]: CardanoWallet | undefined; // Support for other wallets
}

// Add the interface to the global `window` object
declare global {
  interface Window {
    cardano?: WindowCardano;
  }
}
