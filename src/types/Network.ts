export interface Network {
  addressExplorerUrl?: string;
  confirmations?: string;
  explorerUrl?: string;
  isTestnet?: boolean;
  name?: string;
  networkId?: string;
  tags?: "show-vault" | "supports-rbf" | "supports-memo" | "swap" | "supports-parallel-signing" | "supports-chained-signing"[];
}
