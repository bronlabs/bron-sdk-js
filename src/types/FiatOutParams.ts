import { FeeLevel } from './FeeLevel.js';

export interface FiatOutParams {
  amount: string;
  assetId: string;
  feeLevel?: FeeLevel;
  fiatAssetId: string;
  toAddressBookRecordId: string;
}
