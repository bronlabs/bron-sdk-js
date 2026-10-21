import type { RecordStatus } from "./RecordStatus.js";
import type { RecordType } from "./RecordType.js";

export interface AddressBookRecord {
  accountIds?: string[];
  activatedAt?: string;
  address?: string;
  createdAt: string;
  createdBy?: string;
  email?: string;
  externalId: string;
  imageId?: string;
  isFavorite?: boolean;
  labels?: string[];
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
