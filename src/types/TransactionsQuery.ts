export interface TransactionsQuery {
  transactionIds?: string[];
  transactionTypes?: string[];
  accountTypes?: string[];
  accountIds?: string[];
  transactionStatuses?: string[];
  transactionStatusNotIn?: string[];
  blockchainTxId?: string;
  toAccountId?: string;
  toAddress?: string;
  isTerminated?: boolean;
  terminatedAtFrom?: string;
  terminatedAtTo?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  canSignWithDeviceId?: string;
  sortDirection?: string;
  limit?: string;
  offset?: string;
  externalId?: string;
}
