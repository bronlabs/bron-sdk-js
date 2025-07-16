export interface AddressBookRecord {
  accountIds: string[];
  address: string;
  createdAt: string;
  createdBy: string;
  externalId: string;
  lastUsedAt: string;
  memo?: string;
  name: string;
  networkId: string;
  recordId: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  workspaceId: string;
}

export interface AddressBookRecordsResponse {
  records: AddressBookRecord[];
} 