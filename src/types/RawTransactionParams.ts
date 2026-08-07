import { FeeLevel } from './FeeLevel.js';
import { RequestedNetworkFees } from './RequestedNetworkFees.js';

export interface RawTransactionParams {
  amount?: string;
  assetId?: string;
  data?: string;
  externalBroadcast?: boolean;
  feeLevel?: FeeLevel;
  networkFees?: RequestedNetworkFees;
  networkId?: string;
  rawTransactions?: string[];
  skipSimulation?: boolean;
  toAddress?: string;
}
