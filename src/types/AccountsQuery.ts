export interface AccountsQuery {
  accountTypes?: string[];
  excludedAccountTypes?: string[];
  statuses?: string[];
  accountIds?: string[];
  isDefiVault?: boolean;
  offset?: string;
  limit?: string;
  isTestnet?: boolean;
}
