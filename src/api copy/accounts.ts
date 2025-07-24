import { Account } from "../types/Account.js";
import { Accounts } from "../types/Accounts.js";
import { HttpClient } from "../utils/http.js";

export interface GetAccountsParams {
  accountTypes?: string[];
  excludedAccountTypes?: string[];
  statuses?: string[];
  accountIds?: string[];
  isDefiVault?: boolean;
  offset?: string;
  limit?: string;
  isTestnet?: boolean;
}

function toQuery(params: Record<string, any>): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query[key] = Array.isArray(value) ? value : String(value);
    }
  }
  return query;
}

export class AccountsAPI {
  constructor(private http: HttpClient, private workspaceId: string) {}

  async getAccounts(params: GetAccountsParams = {}): Promise<Accounts> {
    return this.http.request<Accounts>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/accounts`,
      query: toQuery(params)
    });
  }

  async getAccountById(accountId: string): Promise<Account> {
    return this.http.request<Account>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/accounts/${accountId}`
    });
  }
} 