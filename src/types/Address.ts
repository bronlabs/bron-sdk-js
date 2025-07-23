export interface Address {
  acceptsAllAssets: boolean;
  accountId?: string;
  accountType: "vault";
  activatedAssets?: {  }[];
  address?: string;
  addressId: string;
  createdAt: string;
  createdBy: string;
  externalId: string;
  memo?: string;
  metadata?: { [key: string]: any };
  networkId: string;
  requiresAssetsActivation: boolean;
  status: "new" | "pending" | "approval-pending" | "enabled" | "disabled" | "error" | "account-archived";
  updatedAt: string;
  updatedBy: string;
  workspaceId?: string;
}
