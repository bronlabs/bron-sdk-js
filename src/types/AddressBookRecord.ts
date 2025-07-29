import { RecordStatus } from './RecordStatus.js';

export interface AddressBookRecord {
  accountIds?: string[];
  address: string;
  createdAt: string;
  createdBy?: string;
  externalId: string;
  lastUsedAt?: string;
  memo?: string;
  name: string;
  networkId: string;
  recordId: string;
  status: RecordStatus;
  updatedAt?: string;
  updatedBy?: string;
  workspaceId: string;
}
