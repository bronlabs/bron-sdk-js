import { Addresses } from "../types/Addresses.js";
import { DepositAddressesQuery } from "../types/DepositAddressesQuery.js";
import { HttpClient } from "../utils/http.js";

export class AddressesAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getDepositAddresses(query?: DepositAddressesQuery): Promise<Addresses> {
    return this.http.request<Addresses>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/addresses`,
      query
    });
  }
}