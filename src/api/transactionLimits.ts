import { TransactionLimits } from "../types/TransactionLimits.js";
import { TransactionLimit } from "../types/TransactionLimit.js";
import { HttpClient } from "../utils/http.js";

export interface TransactionLimitsParams {
  statuses?: string[];
  fromAccountIds?: string[];
  toAddressBookRecordIds?: string[];
  toAccountIds?: string[];
  appliesToUserIds?: string[];
  appliesToGroupIds?: string[];
  limit?: string;
  offset?: string;
}

export interface TransactionLimitByIDParams {
  limitId: string;
}

export class TransactionLimitsAPI {
  constructor(private http: HttpClient, private workspaceId: string) {}

async getTransactionLimits(params?: TransactionLimitsParams): Promise<TransactionLimits> {
  return this.http.request<TransactionLimits>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/transaction-limits`,
    query: params
  });
}
async getTransactionLimitByID(params: TransactionLimitByIDParams): Promise<TransactionLimit> {
  return this.http.request<TransactionLimit>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/transaction-limits/  `,
    query: params
  });
}
}