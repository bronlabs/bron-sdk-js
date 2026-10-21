import type { BlockchainRequest } from "./BlockchainRequest.js";
import type { BlockchainTxDetails } from "./BlockchainTxDetails.js";
import type { BronLockExtra } from "./BronLockExtra.js";
import type { FiatRampExtra } from "./FiatRampExtra.js";
import type { LoanExtra } from "./LoanExtra.js";
import type { QuoteDetails } from "./QuoteDetails.js";
import type { TransactionApprovers } from "./TransactionApprovers.js";

export interface TransactionExtra {
  approvers?: TransactionApprovers;
  blockchainDetails?: BlockchainTxDetails[];
  blockchainRequest?: BlockchainRequest;
  bronLock?: BronLockExtra;
  confirmations?: string;
  depositTransactionId?: string;
  description?: string;
  estimatedPrice?: string;
  fiatRamp?: FiatRampExtra;
  fromAccountId?: string;
  fromAddress?: string;
  fromWorkspaceIcon?: string;
  fromWorkspaceName?: string;
  fromWorkspaceTag?: string;
  loan?: LoanExtra;
  memo?: string;
  price?: string;
  quoteDetails?: QuoteDetails;
  quoteId?: string;
  signingRequestId?: string;
  toAccountId?: string;
  toAddress?: string;
  toWorkspaceIcon?: string;
  toWorkspaceName?: string;
  toWorkspaceTag?: string;
  withdrawTransactionId?: string;
}
