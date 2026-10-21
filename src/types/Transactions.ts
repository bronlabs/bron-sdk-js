import type { Transaction } from "./Transaction.js";
import type { TransactionEmbedded } from "./TransactionEmbedded.js";

export interface Transactions {
  _embedded?: TransactionEmbedded;
  transactions: Transaction[];
}
