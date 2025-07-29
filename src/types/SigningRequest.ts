import { MessagesForSigning } from './MessagesForSigning.js';
import { Signed } from './Signed.js';
import { BlockchainSigningRequest } from './BlockchainSigningRequest.js';
import { SigningRequestStatus } from './SigningRequestStatus.js';
import { TransactionType } from './TransactionType.js';

export interface SigningRequest {
  accountId?: string;
  blockchainNonce?: string;
  messagesForSigning?: MessagesForSigning;
  networkId?: string;
  requestParameters?: Record<string, any>;
  shouldBeBroadcasted?: boolean;
  signed?: Signed;
  signingData?: BlockchainSigningRequest;
  signingRequestId?: string;
  status?: SigningRequestStatus;
  transactionId?: string;
  transactionType?: TransactionType;
  workspaceId?: string;
}
