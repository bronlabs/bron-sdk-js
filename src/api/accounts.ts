import { Accounts } from "../types/Accounts.js";
import { AccountsQuery } from "../types/AccountsQuery.js";
import { Account } from "../types/Account.js";
import { HttpClient } from "../utils/http.js";

export class AccountsAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getAccounts(workspaceId?: string): Promise<Accounts> {
    return this.http.request<Accounts>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/accounts`
    });
  }

  async retrieveAccountById(accountId: string, workspaceId?: string): Promise<Account> {
    return this.http.request<Account>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/accounts/${accountId}`
    });
  }
}