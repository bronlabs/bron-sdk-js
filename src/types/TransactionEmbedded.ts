import { SigningRequest } from './SigningRequest.js';

export interface TransactionEmbedded {
  currentSigningRequest?: SigningRequest;
}
