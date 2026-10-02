import type { TransactionType } from "./TransactionType.js";

export interface CreateTransaction {
  accountId: string;
  description?: string;
  expiresAt?: string;
  externalId: string;
  params?: any;
  transactionType: TransactionType;
}
