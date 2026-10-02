import type { AccountType } from "./AccountType.js";
import type { TransactionEmbedded } from "./TransactionEmbedded.js";
import type { TransactionExtra } from "./TransactionExtra.js";
import type { TransactionStatus } from "./TransactionStatus.js";
import type { TransactionType } from "./TransactionType.js";

export interface Transaction {
  accountId: string;
  accountType: AccountType;
  createdAt: string;
  createdBy?: string;
  embedded?: TransactionEmbedded;
  expiresAt?: string;
  externalId: string;
  extra?: TransactionExtra;
  params?: any;
  status: TransactionStatus;
  terminatedAt?: string;
  transactionId: string;
  transactionType: TransactionType;
  updatedAt?: string;
  workspaceId: string;
}
