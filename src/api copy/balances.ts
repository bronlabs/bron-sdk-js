import { Balance } from "../types/Balance.js";
import { Balances } from "../types/Balances.js";
import { HttpClient } from "../utils/http.js";

export class BalancesAPI {
  constructor(
    private http: HttpClient,
    private workspaceId: string
  ) {}

  async getBalances(params: { accountIds?: string[] } = {}): Promise<Balances> {
    return this.http.request<Balances>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/balances`,
      query: params.accountIds ? { accountIds: params.accountIds } : undefined
    });
  }

  async getBalanceById(balanceId: string): Promise<Balance> {
    return this.http.request<Balance>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/balances/${balanceId}`
    });
  }
} 