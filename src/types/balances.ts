export interface Balance {
  balanceId: string;
  accountId: string;
  accountType: string;
  workspaceId: string;
  assetId: string;
  createdAt?: string;
  updatedAt?: string;
  networkId?: string;
  symbol?: string;
  totalBalance?: string;
}

export interface BalancesResponse {
  balances: Balance[];
} 