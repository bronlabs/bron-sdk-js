import { Accounts } from "../types/Accounts.js";
import { Account } from "../types/Account.js";
import { HttpClient } from "../utils/http.js";

export interface AccountsParams {
  accountTypes?: string[];
  excludedAccountTypes?: string[];
  statuses?: string[];
  accountIds?: string[];
  isDefiVault?: boolean;
  offset?: string;
  limit?: string;
  isTestnet?: boolean;
}

export interface AccountByIDParams {
  accountId: string;
}

export class AccountsAPI {
  constructor(private http: HttpClient, private workspaceId: string) {}

async getAccounts(params?: AccountsParams): Promise<Accounts> {
  return this.http.request<Accounts>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/accounts`,
    query: params
  });
}
async retrieveAccountByID(params: AccountByIDParams): Promise<Account> {
  return this.http.request<Account>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/accounts/  `,
    query: params
  });
}
}