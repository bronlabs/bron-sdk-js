import type { FeeLevel } from "./FeeLevel.js";

export interface IntentsParams {
  feeAssetId?: string;
  feeLevel?: FeeLevel;
  intentId: string;
}
