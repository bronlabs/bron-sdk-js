export interface Accounts {
  accounts: { accountId: string; accountName: string; accountType: "vault"; createdAt: string; createdBy?: string; externalId: string; extra?: {  }; isTestnet?: boolean; parentAccountId?: string; status: "active" | "archived" | "shard-generating"; updatedAt?: string; workspaceId: string }[];
}
