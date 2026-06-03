export interface TransactionLimitsQuery {
  limitIds?: string[];
  statuses?: string[];
  fromAccountIds?: string[];
  toAddressBookRecordIds?: string[];
  toAccountIds?: string[];
  appliesToUserIds?: string[];
  limit?: string;
  offset?: string;
}
