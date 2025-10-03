export interface BalancesQuery {
  accountIds?: string[];
  balanceIds?: string[];
  assetIds?: string[];
  networkIds?: string[];
  accountTypes?: string[];
  excludedAccountTypes?: string[];
  nonEmpty?: boolean;
  limit?: string;
  offset?: string;
}
