import { SigningRequest } from './SigningRequest.js';
import { TransactionEvent } from './TransactionEvent.js';

export interface TransactionEmbedded {
  currentSigningRequest?: SigningRequest;
  events?: TransactionEvent[];
}
