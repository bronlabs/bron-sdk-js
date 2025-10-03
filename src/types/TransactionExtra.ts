import { TransactionApprovers } from './TransactionApprovers.js';
import { BlockchainTxDetails } from './BlockchainTxDetails.js';
import { BlockchainRequest } from './BlockchainRequest.js';

export interface TransactionExtra {
  approvers?: TransactionApprovers;
  blockchainDetails?: BlockchainTxDetails[];
  blockchainRequest?: BlockchainRequest;
  confirmations?: string;
  depositTransactionId?: string;
  description?: string;
  fromAccountId?: string;
  fromAddress?: string;
  memo?: string;
  signingRequestId?: string;
  toAccountId?: string;
  toAddress?: string;
  withdrawTransactionId?: string;
}
