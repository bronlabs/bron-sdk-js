export interface TransactionApprovers {
  approvedBy?: string[];
  availableApprovers?: string[];
  limitId?: string;
  number?: string;
  securityDelayDuration?: string;
  securityDelayExpiresAt?: string;
  skipApproval?: boolean;
}
