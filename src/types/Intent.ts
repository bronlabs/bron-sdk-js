import { IntentOrderStatus } from './IntentOrderStatus.js';

export interface Intent {
  createdAt: string;
  expiresAt?: string;
  fromAmount?: string;
  fromAssetId: string;
  intentId: string;
  price?: string;
  status: IntentOrderStatus;
  toAmount?: string;
  toAssetId: string;
  updatedAt: string;
  userSettlementDeadline?: string;
}
