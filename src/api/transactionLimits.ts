import { TransactionLimits } from "../types/TransactionLimits.js";
import { TransactionLimitsQuery } from "../types/TransactionLimitsQuery.js";
import { TransactionLimit } from "../types/TransactionLimit.js";
import { HttpClient } from "../utils/http.js";

export class TransactionLimitsAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getTransactionLimits(workspaceId?: string): Promise<TransactionLimits> {
    return this.http.request<TransactionLimits>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/transaction-limits`
    });
  }

  async getTransactionLimitById(limitId: string, workspaceId?: string): Promise<TransactionLimit> {
    return this.http.request<TransactionLimit>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/transaction-limits/${limitId}`
    });
  }
}