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
  fromWorkspaceImageId?: string;
  fromWorkspaceName?: string;
  fromWorkspaceTag?: string;
  memo?: string;
  signingRequestId?: string;
  toAccountId?: string;
  toAddress?: string;
  toWorkspaceImageId?: string;
  toWorkspaceName?: string;
  toWorkspaceTag?: string;
  withdrawTransactionId?: string;
}
