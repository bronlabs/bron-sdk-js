import type { BlockchainSigningRequest } from "./BlockchainSigningRequest.js";
import type { MessagesForSigning } from "./MessagesForSigning.js";
import type { Signed } from "./Signed.js";
import type { SigningRequestStatus } from "./SigningRequestStatus.js";
import type { TransactionType } from "./TransactionType.js";

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
