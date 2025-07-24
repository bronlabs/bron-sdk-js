export interface TransactionLimitsQuery {
  statuses?: string[];
  fromAccountIds?: string[];
  toAddressBookRecordIds?: string[];
  toAccountIds?: string[];
  appliesToUserIds?: string[];
  appliesToGroupIds?: string[];
  limit?: string;
  offset?: string;
}
