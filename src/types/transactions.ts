export interface TransactionExtra {
  approvers?: {
    approvedBy?: string[];
    availableApprovers?: string[];
    limitId?: string;
    number?: string;
    skipApproval?: boolean;
  };
  blockchainDetails?: Array<{
    blockchainTxId: string;
    networkId: string;
  }>;
  confirmations?: string;
  depositTransactionId?: string;
  description?: string;
  externalBroadcast?: boolean;
  fromAccountId?: string;
  fromAddress?: string;
  memo?: string;
  toAccountId?: string;
  toAddress?: string;
  withdrawTransactionId?: string;
}

export interface Transaction {
  accountId: string;
  accountType: string;
  createdAt: string;
  createdBy: string;
  externalId: string;
  extra: TransactionExtra;
  params?: object;
  status: string;
  terminatedAt?: string;
  transactionId: string;
  transactionType: string;
  updatedAt: string;
  workspaceId: string;
}

export interface GetTransactionsParams {
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
  sortDirection?: "ASC" | "DESC";
  limit?: string;
  offset?: string;
}

export interface GetTransactionsResponse {
  transactions: Transaction[];
}

export interface CreateTransactionRequest {
  accountId: string;
  externalId: string;
  transactionType: string;
  params?: object;
}
