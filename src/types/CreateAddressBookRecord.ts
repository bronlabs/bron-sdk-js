import { RecordType } from './RecordType.js';

export interface CreateAddressBookRecord {
  accountIds?: string[];
  address?: string;
  externalId: string;
  imageId?: string;
  memo?: string;
  name: string;
  networkId?: string;
  recordType?: RecordType;
  tag?: string;
}
