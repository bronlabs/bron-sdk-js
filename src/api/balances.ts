import type { Balance } from "../types/Balance.js";
import type { Balances } from "../types/Balances.js";
import type { BalancesQuery } from "../types/BalancesQuery.js";
import type { HttpClient } from "../utils/http.js";

export class BalancesAPI {
  constructor(
    private http: HttpClient,
    private workspaceId?: string,
  ) {}

  async getBalances(query?: BalancesQuery): Promise<Balances> {
    return this.http.request<Balances>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/balances`,
      query,
    });
  }

  async getBalanceById(balanceId: string): Promise<Balance> {
    return this.http.request<Balance>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/balances/${balanceId}`,
    });
  }
}
