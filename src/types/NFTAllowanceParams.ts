import type { FeeLevel } from "./FeeLevel.js";
import type { RequestedNetworkFees } from "./RequestedNetworkFees.js";

export interface NFTAllowanceParams {
  amount?: string;
  approvalForAll?: boolean;
  assetId: string;
  feeLevel?: FeeLevel;
  networkFees?: RequestedNetworkFees;
  toAddress?: string;
  tokenId?: string;
}
