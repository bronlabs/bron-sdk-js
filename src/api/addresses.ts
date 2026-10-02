import type { Addresses } from "../types/Addresses.js";
import type { AddressesQuery } from "../types/AddressesQuery.js";
import type { HttpClient } from "../utils/http.js";

export class AddressesAPI {
  constructor(
    private http: HttpClient,
    private workspaceId?: string,
  ) {}

  async getAddresses(query?: AddressesQuery): Promise<Addresses> {
    return this.http.request<Addresses>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/addresses`,
      query,
    });
  }
}
