import { TransactionEmbedded } from './TransactionEmbedded.js';
import { Transaction } from './Transaction.js';

export interface Transactions {
  embedded?: TransactionEmbedded;
  transactions: Transaction[];
}
