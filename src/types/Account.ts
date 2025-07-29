import { AccountType } from './AccountType.js';
import { AccountExtra } from './AccountExtra.js';
import { AccountStatus } from './AccountStatus.js';

export interface Account {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  createdAt: string;
  createdBy?: string;
  externalId: string;
  extra?: AccountExtra;
  isTestnet?: boolean;
  parentAccountId?: string;
  status: AccountStatus;
  updatedAt?: string;
  workspaceId: string;
}
