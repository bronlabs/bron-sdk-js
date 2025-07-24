import { Balances } from "../types/Balances.js";
import { Balance } from "../types/Balance.js";
import { HttpClient } from "../utils/http.js";
export interface BalancesParams {
  accountIds?: string[];
  balanceIds?: string[];
  assetIds?: string[];
  networkId?: string;
  accountTypes?: string[];
  excludedAccountTypes?: string[];
  nonEmpty?: boolean;
  limit?: string;
  offset?: string;
  workspaceId: string;
}

export interface BalanceByIDParams {
  workspaceId: string;
  balanceId: string;
}

export class BalancesAPI {
  constructor(private http: HttpClient, private workspaceId?: string) {}
  async getBalances(params: BalancesParams): Promise<Balances> {
    return this.http.request<Balances>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/balances`,
    query: params
  });
  }

  async getBalanceByID(params: BalanceByIDParams): Promise<Balance> {
    return this.http.request<Balance>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/balances/${params.balanceId}`,
    query: params
  });
  }
}