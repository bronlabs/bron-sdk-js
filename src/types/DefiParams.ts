import { FeeLevel } from './FeeLevel.js';

export interface DefiParams {
  data?: string;
  externalBroadcast?: boolean;
  feeLevel?: FeeLevel;
  method: string;
  networkId: string;
  origin: string;
  rawTransaction?: string;
  rawTransactions?: string[];
  to?: string;
  value?: string;
}
