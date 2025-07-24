import { Addresses } from "../types/Addresses.js";
import { HttpClient } from "../utils/http.js";
export interface DepositAddressesParams {
  addressIds?: string[];
  externalId?: string;
  accountTypes?: string[];
  networkId?: string;
  address?: string;
  statuses?: string[];
  sortDirection?: string;
  limit?: string;
  offset?: string;
  workspaceId: string;
}

export class AddressesAPI {
  constructor(private http: HttpClient, private workspaceId?: string) {}
  async getDepositAddresses(params: DepositAddressesParams): Promise<Addresses> {
    return this.http.request<Addresses>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/addresses`,
    query: params
  });
  }
}