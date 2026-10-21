import type { FeeLevel } from "./FeeLevel.js";

export interface FiatOutParams {
  amount?: string;
  assetId: string;
  feeLevel?: FeeLevel;
  fiatAmount?: string;
  fiatAssetId: string;
  paymentPurpose?: string;
  processingTier?: string;
  reference?: string;
  toAddressBookRecordId: string;
}
