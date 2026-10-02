import type { AttestationSignature } from "./AttestationSignature.js";
import type { SigningRequest } from "./SigningRequest.js";
import type { TransactionEvent } from "./TransactionEvent.js";

export interface TransactionEmbedded {
  attestationSignature?: AttestationSignature;
  currentSigningRequest?: SigningRequest;
  events?: TransactionEvent[];
}
