import { FeeLevel } from './FeeLevel.js';

export interface FiatExchangeParams {
  amount: string;
  feeLevel?: FeeLevel;
  fromAccountId?: string;
  fromAssetId: string;
  fromBankAccountId?: string;
  fromNetworkId: string;
  toAccountId?: string;
  toAssetId: string;
  toBankAccountId?: string;
  toNetworkId: string;
}
