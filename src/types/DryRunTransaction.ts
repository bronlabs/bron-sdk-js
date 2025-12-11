import { TransactionEstimation } from './TransactionEstimation.js';
import { TransactionExtra } from './TransactionExtra.js';
import { TransactionType } from './TransactionType.js';
import { Warning } from './Warning.js';

export interface DryRunTransaction {
  accountId: string;
  estimations?: TransactionEstimation[];
  externalId?: string;
  extra?: TransactionExtra;
  params?: Record<string, any>;
  transactionType: TransactionType;
  warning?: Warning;
}
