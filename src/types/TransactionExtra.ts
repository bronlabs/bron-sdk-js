export interface TransactionExtra {
  approvers?: { approvedBy?: string[]; availableApprovers?: string[]; limitId?: string; number?: string; skipApproval?: boolean };
  blockchainDetails?: { blockchainTxId?: string; networkId?: string }[];
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
