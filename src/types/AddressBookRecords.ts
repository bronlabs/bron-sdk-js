export interface AddressBookRecords {
  records: { accountIds?: string[]; address: string; createdAt: string; createdBy?: string; externalId: string; lastUsedAt?: string; memo?: string; name: string; networkId: string; recordId: string; status: "new" | "active" | "rejected" | "deleted"; updatedAt?: string; updatedBy?: string; workspaceId: string }[];
}
