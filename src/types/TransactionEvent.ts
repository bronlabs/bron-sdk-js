import type { AccountType } from "./AccountType.js";
import type { EventExtra } from "./EventExtra.js";
import type { EventType } from "./EventType.js";

export interface TransactionEvent {
  accountId: string;
  accountType: AccountType;
  amount?: string;
  assetId: string;
  blockchainTxId?: string;
  createdAt: string;
  eventId: string;
  eventType: EventType;
  extra?: EventExtra;
  networkId?: string;
  symbol?: string;
  transactionId: string;
  usdAmount?: string;
  workspaceId: string;
}
