import { AttestationSignature } from './AttestationSignature.js';
import { SigningRequest } from './SigningRequest.js';
import { TransactionEvent } from './TransactionEvent.js';

export interface TransactionEmbedded {
  attestationSignature?: AttestationSignature;
  currentSigningRequest?: SigningRequest;
  events?: TransactionEvent[];
}
