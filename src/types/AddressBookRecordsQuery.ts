export interface AddressBookRecordsQuery {
  recordIds?: string[];
  networkIds?: string[];
  addresses?: string[];
  memo?: string;
  limit?: string;
  offset?: string;
  statuses?: string[];
}
