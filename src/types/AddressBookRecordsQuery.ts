export interface AddressBookRecordsQuery {
  recordIds?: string[];
  networkIds?: string[];
  addresses?: string[];
  memo?: string;
  tag?: string;
  limit?: string;
  offset?: string;
  recordType?: string;
  recordTypes?: string[];
  statuses?: string[];
}
