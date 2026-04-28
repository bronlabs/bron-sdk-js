import { FeeLevel } from './FeeLevel.js';

export interface DefiParams {
  data?: string;
  externalBroadcast?: boolean;
  feeLevel?: FeeLevel;
  networkId: string;
  origin: string;
  rawTransactions?: string[];
  to?: string;
  value?: string;
}
