import { WithdrawalParams } from './WithdrawalParams.js';
import { TransactionType } from './TransactionType.js';

export interface CreateTransaction {
  accountId: string;
  expiresAt?: string;
  externalId: string;
  params?: any;
  transactionType: TransactionType;
}
