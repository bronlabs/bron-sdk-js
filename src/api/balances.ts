import { BalancesResponse, Balance } from "../types/balances.js";
import { HttpClient } from "../utils/http.js";

export class BalancesAPI {
  constructor(
    private http: HttpClient,
    private workspaceId: string
  ) {}

  async getBalances(params: { accountIds?: string[] } = {}): Promise<BalancesResponse> {
    return this.http.request<BalancesResponse>({
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