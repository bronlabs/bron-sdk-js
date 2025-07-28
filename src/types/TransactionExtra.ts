export interface TransactionExtra {
  approvers?: { approvedBy?: string[]; availableApprovers?: string[]; limitId?: string; number?: string; securityDelayDuration?: string; securityDelayExpiresAt?: string; skipApproval?: boolean };
  blockchainDetails?: { blockchainTxId?: string; networkId?: string }[];
  blockchainRequest?: { networkId?: string };
  confirmations?: string;
  depositTransactionId?: string;
  description?: string;
  externalBroadcast?: boolean;
  fromAccountId?: string;
  fromAddress?: string;
  memo?: string;
  signingRequestId?: string;
  toAccountId?: string;
  toAddress?: string;
  withdrawTransactionId?: string;
}
