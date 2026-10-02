import type { AccountExtra } from "./AccountExtra.js";
import type { AccountStatus } from "./AccountStatus.js";
import type { AccountType } from "./AccountType.js";

export interface Account {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  createdAt: string;
  createdBy?: string;
  externalId: string;
  extra?: AccountExtra;
  icon?: string;
  isTestnet?: boolean;
  parentAccountId?: string;
  status: AccountStatus;
  updatedAt?: string;
  workspaceId: string;
}
