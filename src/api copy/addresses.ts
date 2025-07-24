import { HttpClient } from "../utils/http.js";
import { Addresses } from "../types/Addresses.js";

type GetDepositAddressesParams = {
  addressIds?: string[];
  externalId?: string;
  accountTypes?: string[];
  networkId?: string;
  address?: string;
  statuses?: string[];
  sortDirection?: "ASC" | "DESC";
  limit?: string;
  offset?: string;
};

export class AddressesAPI {
  private client: HttpClient;
  private workspaceId: string;

  constructor(client: HttpClient, workspaceId: string) {
    this.client = client;
    this.workspaceId = workspaceId;
  }

  async getDepositAddresses(params?: GetDepositAddressesParams): Promise<Addresses> {
    return this.client.request<Addresses>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/addresses`,
      query: params
    });
  }
}  