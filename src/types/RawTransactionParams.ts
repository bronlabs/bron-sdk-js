import { FeeLevel } from './FeeLevel.js';
import { RequestedNetworkFees } from './RequestedNetworkFees.js';

export interface RawTransactionParams {
  amount?: string;
  assetId: string;
  data?: string;
  feeLevel?: FeeLevel;
  networkFees?: RequestedNetworkFees;
  rawTransactions?: string[];
  skipSimulation?: boolean;
  toAddress: string;
}
