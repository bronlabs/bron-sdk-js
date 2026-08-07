import { FeeLevel } from './FeeLevel.js';
import { RequestedNetworkFees } from './RequestedNetworkFees.js';

export interface IntentSolverSettlementParams {
  amount: string;
  assetId?: string;
  feeLevel?: FeeLevel;
  includeFee?: boolean;
  intentId: string;
  memo?: string;
  networkFees?: RequestedNetworkFees;
  networkId?: string;
  symbol?: string;
  toAccountId?: string;
  toAddress?: string;
  toAddressBookRecordId?: string;
  toWorkspaceTag?: string;
}
