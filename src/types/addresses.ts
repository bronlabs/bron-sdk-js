export interface DepositAddress {
  acceptsAllAssets: boolean;
  accountId: string;
  accountType: string;
  activatedAssets: any[]; // You can type this more strictly if needed
  address: string;
  addressId: string;
  createdAt: string;
  createdBy: string;
  externalId: string;
  memo?: string;
  metadata: Record<string, any>;
  networkId: string;
  requiresAssetsActivation: boolean;
  status: string;
  updatedAt: string;
  updatedBy: string;
  workspaceId: string;
}

export interface GetDepositAddressesParams {
  addressIds?: string[];
  externalId?: string;
  accountTypes?: string[];
  networkId?: string;
  address?: string;
  statuses?: string[];
  sortDirection?: "ASC" | "DESC";
  limit?: string;
  offset?: string;
}

export interface GetDepositAddressesResponse {
  addresses: DepositAddress[];
} 