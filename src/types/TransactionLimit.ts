import { LimitAppliesTo } from './LimitAppliesTo.js';
import { LimitDestinations } from './LimitDestinations.js';
import { LimitRule } from './LimitRule.js';
import { TransactionLimitType } from './TransactionLimitType.js';
import { LimitSources } from './LimitSources.js';
import { TransactionLimitStatus } from './TransactionLimitStatus.js';
import { LimitTransactionParams } from './LimitTransactionParams.js';

export interface TransactionLimit {
  appliesTo: LimitAppliesTo;
  createdAt: string;
  createdBy?: string;
  destinations: LimitDestinations;
  externalId: string;
  limitId: string;
  limitRule: LimitRule;
  limitType: TransactionLimitType;
  sources: LimitSources;
  status: TransactionLimitStatus;
  transactionParams: LimitTransactionParams;
  updatedAt?: string;
  updatedBy?: string;
  workspaceId: string;
}
