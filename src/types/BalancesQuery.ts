export interface BalancesQuery {
  accountId?: string;
  accountIds?: string[];
  balanceIds?: string[];
  assetId?: string;
  assetIds?: string[];
  assetNotIn?: string[];
  networkId?: string;
  networkIds?: string[];
  accountTypes?: string[];
  excludedAccountTypes?: string[];
  updatedSince?: string;
  nonEmpty?: boolean;
  limit?: string;
  offset?: string;
}
