import { FeeLevel } from './FeeLevel.js';

export interface RawTransactionParams {
  amount?: string;
  assetId: string;
  data?: string;
  feeLevel?: FeeLevel;
  rawTransactions?: string[];
  toAddress: string;
}
