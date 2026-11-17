import type { AttestationSignature } from "./AttestationSignature.js";
import type { IntentsQuoteEmbedded } from "./IntentsQuoteEmbedded.js";
import type { QuoteDetails } from "./QuoteDetails.js";
import type { SigningRequest } from "./SigningRequest.js";
import type { TransactionEstimation } from "./TransactionEstimation.js";
import type { TransactionEvent } from "./TransactionEvent.js";

export interface TransactionEmbedded {
  attestationSignature?: AttestationSignature;
  currentSigningRequest?: SigningRequest;
  estimations?: TransactionEstimation[];
  events?: TransactionEvent[];
  intentsQuote?: IntentsQuoteEmbedded;
  quoteDetails?: QuoteDetails;
}
