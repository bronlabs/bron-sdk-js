import { AccountType } from './AccountType.js';

export interface Balance {
  accountId: string;
  accountType: AccountType;
  assetId: string;
  balanceId: string;
  createdAt?: string;
  networkId?: string;
  symbol?: string;
  totalBalance?: string;
  updatedAt?: string;
  workspaceId: string;
}
