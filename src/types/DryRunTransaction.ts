import type { TransactionEstimation } from "./TransactionEstimation.js";
import type { TransactionExtra } from "./TransactionExtra.js";
import type { TransactionType } from "./TransactionType.js";
import type { Warning } from "./Warning.js";

export interface DryRunTransaction {
  accountId: string;
  description?: string;
  estimations?: TransactionEstimation[];
  externalId?: string;
  extra?: TransactionExtra;
  params?: Record<string, any>;
  transactionType: TransactionType;
  warning?: Warning;
}
