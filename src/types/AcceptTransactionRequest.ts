import { CreateTransaction } from './CreateTransaction.js';

export interface AcceptTransactionRequest {
  transactionId: string;
  accept: boolean;
}
