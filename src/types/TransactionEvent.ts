import { AccountType } from './AccountType.js';
import { EventType } from './EventType.js';
import { EventExtra } from './EventExtra.js';

export interface TransactionEvent {
  accountId: string;
  accountType: AccountType;
  amount?: string;
  assetId: string;
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
