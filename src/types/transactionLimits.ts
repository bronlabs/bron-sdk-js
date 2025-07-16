export interface TransactionLimit {
  appliesTo: {
    userIds?: string[];
    groupIds?: string[];
  };
  createdAt: string;
  createdBy: string;
  destinations: {
    accountIds?: string[];
    addressBookRecordIds?: string[];
    toAccounts?: boolean;
    toAddressBook?: boolean;
    toExternalAddresses?: boolean;
  };
  externalId: string;
  limitId: string;
  limitRule: {
    approve?: {
      authorisedApproversUserIds?: string[];
      numberOfApprovals?: string;
    };
    skipApproval?: boolean;
  };
  limitType: string;
  sources: {
    accountIds?: string[];
  };
  status: string;
  transactionParams?: {
    aboveAmount?: {
      amount: string;
    };
    durationHours?: string;
  };
  updatedAt: string;
  updatedBy: string;
  workspaceId: string;
}

export interface GetTransactionLimitsParams {
  statuses?: string[];
  fromAccountIds?: string[];
  toAddressBookRecordIds?: string[];
  toAccountIds?: string[];
  appliesToUserIds?: string[];
  appliesToGroupIds?: string[];
  limit?: string;
  offset?: string;
}

export interface GetTransactionLimitsResponse {
  limits: TransactionLimit[];
} 