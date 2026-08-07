import { IntentOrderStatus } from './IntentOrderStatus.js';

export interface Intent {
  createdAt: string;
  expiresAt?: string;
  fromAmount?: string;
  fromAssetId: string;
  fromTokenId?: string;
  intentId: string;
  price?: string;
  status: IntentOrderStatus;
  toAmount?: string;
  toAssetId: string;
  toTokenId?: string;
  updatedAt: string;
  userSettlementDeadline?: string;
}
