import { HttpClient } from "../utils/http.js";
import { GetDepositAddressesParams, GetDepositAddressesResponse } from "../types/addresses.js";

export class AddressesAPI {
  private client: HttpClient;
  private workspaceId: string;

  constructor(client: HttpClient, workspaceId: string) {
    this.client = client;
    this.workspaceId = workspaceId;
  }

  async getDepositAddresses(params?: GetDepositAddressesParams): Promise<GetDepositAddressesResponse> {
    // Convert params to query object (arrays as comma-separated strings)
    const query: Record<string, string> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          if (value.length) query[key] = value.join(",");
        } else if (value !== undefined) {
          query[key] = String(value);
        }
      }
    }
    return this.client.request<GetDepositAddressesResponse>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/addresses`,
      query: Object.keys(query).length ? query : undefined,
    });
  }
}  