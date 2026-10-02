import type { LimitAppliesTo } from "./LimitAppliesTo.js";
import type { LimitDestinations } from "./LimitDestinations.js";
import type { LimitRule } from "./LimitRule.js";
import type { LimitSources } from "./LimitSources.js";
import type { LimitTransactionParams } from "./LimitTransactionParams.js";
import type { TransactionLimitStatus } from "./TransactionLimitStatus.js";
import type { TransactionLimitType } from "./TransactionLimitType.js";

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
