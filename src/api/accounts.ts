import { Accounts } from "../types/Accounts.js";
import { AccountsQuery } from "../types/AccountsQuery.js";
import { Account } from "../types/Account.js";
import { HttpClient } from "../utils/http.js";

export class AccountsAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getAccounts(query?: AccountsQuery): Promise<Accounts> {
    return this.http.request<Accounts>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/accounts`,
      query
    });
  }

  async getAccountById(accountId: string): Promise<Account> {
    return this.http.request<Account>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/accounts/${accountId}`
    });
  }
}