export interface CreateAddressBookRecord {
  accountIds?: string[];
  address: string;
  externalId: string;
  memo?: string;
  name: string;
  networkId: string;
}
