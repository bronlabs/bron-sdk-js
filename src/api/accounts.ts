import type { Account } from "../types/Account.js";
import type { Accounts } from "../types/Accounts.js";
import type { AccountsQuery } from "../types/AccountsQuery.js";
import type { HttpClient } from "../utils/http.js";

export class AccountsAPI {
  constructor(
    private http: HttpClient,
    private workspaceId?: string,
  ) {}

  async getAccounts(query?: AccountsQuery): Promise<Accounts> {
    return this.http.request<Accounts>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/accounts`,
      query,
    });
  }

  async getAccountById(accountId: string): Promise<Account> {
    return this.http.request<Account>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/accounts/${accountId}`,
    });
  }
}
