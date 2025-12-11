import { EventType } from './EventType.js';
import { EventExtra } from './EventExtra.js';

export interface TransactionEstimation {
  amount?: string;
  assetId: string;
  createdAt: string;
  estimationId: string;
  eventType: EventType;
  extra?: EventExtra;
  networkId?: string;
  symbol?: string;
  transactionId: string;
  usdAmount?: string;
}
