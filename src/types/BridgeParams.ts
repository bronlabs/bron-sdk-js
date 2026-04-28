import { FeeLevel } from './FeeLevel.js';

export interface BridgeParams {
  amount: string;
  feeLevel?: FeeLevel;
  sourceAssetId: string;
}
