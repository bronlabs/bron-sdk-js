import type { FeeLevel } from "./FeeLevel.js";
import type { RequestedNetworkFees } from "./RequestedNetworkFees.js";

export interface WithdrawalParams {
  amount: string;
  assetId?: string;
  feeAssetId?: string;
  feeLevel?: FeeLevel;
  includeFee?: boolean;
  memo?: string;
  networkFees?: RequestedNetworkFees;
  networkId?: string;
  symbol?: string;
  toAccountId?: string;
  toAddress?: string;
  toAddressBookRecordId?: string;
  toWorkspaceTag?: string;
}
