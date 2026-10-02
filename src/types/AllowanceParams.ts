import type { FeeLevel } from "./FeeLevel.js";
import type { RequestedNetworkFees } from "./RequestedNetworkFees.js";

export interface AllowanceParams {
  amount?: string;
  assetId: string;
  feeLevel?: FeeLevel;
  networkFees?: RequestedNetworkFees;
  toAddress: string;
  unlimited?: boolean;
}
