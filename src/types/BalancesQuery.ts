export interface BalancesQuery {
  accountIds?: string[];
  balanceIds?: string[];
  assetIds?: string[];
  networkId?: string;
  accountTypes?: string[];
  excludedAccountTypes?: string[];
  nonEmpty?: boolean;
  limit?: string;
  offset?: string;
}
