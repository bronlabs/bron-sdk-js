import { Balances } from "../types/Balances.js";
import { BalancesQuery } from "../types/BalancesQuery.js";
import { Balance } from "../types/Balance.js";
import { HttpClient } from "../utils/http.js";

export class BalancesAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getBalances(workspaceId?: string): Promise<Balances> {
    return this.http.request<Balances>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/balances`
    });
  }

  async getBalanceById(balanceId: string, workspaceId?: string): Promise<Balance> {
    return this.http.request<Balance>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/balances/${balanceId}`
    });
  }
}