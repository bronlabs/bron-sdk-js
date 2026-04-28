import { FeeLevel } from './FeeLevel.js';
import { RequestedNetworkFees } from './RequestedNetworkFees.js';

export interface NFTWithdrawalParams {
  amount: string;
  assetId: string;
  feeLevel?: FeeLevel;
  includeFee?: boolean;
  networkFees?: RequestedNetworkFees;
  toAccountId?: string;
  toAddress?: string;
  toAddressBookRecordId?: string;
  tokenId: string;
}
