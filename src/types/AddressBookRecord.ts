import { RecordType } from './RecordType.js';
import { RecordStatus } from './RecordStatus.js';

export interface AddressBookRecord {
  accountIds?: string[];
  address?: string;
  createdAt: string;
  createdBy?: string;
  externalId: string;
  imageId?: string;
  lastUsedAt?: string;
  memo?: string;
  name: string;
  networkId?: string;
  recordId: string;
  recordType: RecordType;
  status: RecordStatus;
  tag?: string;
  updatedAt?: string;
  updatedBy?: string;
  workspaceId: string;
}
