import type { FeeLevel } from "./FeeLevel.js";
import type { RequestedNetworkFees } from "./RequestedNetworkFees.js";

export interface RecreateSigningRequest {
  cancelTransaction?: boolean;
  feeLevel?: FeeLevel;
  networkFees?: RequestedNetworkFees;
  primitivesVersion?: string;
  signingRequestId: string;
}
