export interface AccountsQuery {
  accountTypes?: string[];
  excludedAccountTypes?: string[];
  statuses?: string[];
  accountIds?: string[];
  offset?: string;
  limit?: string;
  isTestnet?: boolean;
}
