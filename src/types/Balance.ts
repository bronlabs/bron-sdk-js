export interface Balance {
  accountId: string;
  accountType: "vault";
  assetId: string;
  balanceId: string;
  createdAt?: string;
  networkId?: string;
  symbol?: string;
  totalBalance?: string;
  updatedAt?: string;
  workspaceId: string;
}
