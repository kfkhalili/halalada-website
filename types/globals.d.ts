// Extend the Window interface to include the cardano property
interface Window {
  cardano?: {
    [key: string]: any; // Replace `any` with specific wallet API types if known
  };
}
