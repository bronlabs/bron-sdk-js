export interface TransactionLimit {
  appliesTo: { userIds?: string[] };
  createdAt: string;
  createdBy?: string;
  destinations: { accountIds?: string[]; addressBookRecordIds?: string[]; toAccounts?: boolean; toAddressBook?: boolean; toExternalAddresses?: boolean };
  externalId: string;
  limitId: string;
  limitRule: { approve?: { authorisedApproversUserIds?: string[]; numberOfApprovals: string }; securityDelay?: { durationHours: string }; skipApproval?: boolean };
  limitType: "transactions-volume" | "transaction-amount";
  sources: { accountIds?: string[] };
  status: "new" | "active" | "deactivated" | "declined";
  transactionParams: { aboveAmount?: { amount?: string }; durationHours?: string };
  updatedAt?: string;
  updatedBy?: string;
  workspaceId: string;
}
