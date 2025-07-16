export interface Account {
  accountId: string;
  accountName: string;
  accountType: string;
  createdAt: string;
  createdBy: string;
  externalId: string;
  extra?: Record<string, any>;
  isTestnet?: boolean;
  parentAccountId?: string;
  status: string;
  updatedAt: string;
  workspaceId: string;
}

export interface AccountsResponse {
  accounts: Account[];
} 