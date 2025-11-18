export interface BalancesQuery {
  accountIds?: string[];
  balanceIds?: string[];
  assetId?: string;
  assetIds?: string[];
  networkId?: string;
  networkIds?: string[];
  accountTypes?: string[];
  excludedAccountTypes?: string[];
  nonEmpty?: boolean;
  limit?: string;
  offset?: string;
}
