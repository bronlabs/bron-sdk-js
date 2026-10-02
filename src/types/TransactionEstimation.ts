import type { EventExtra } from "./EventExtra.js";
import type { EventType } from "./EventType.js";

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
