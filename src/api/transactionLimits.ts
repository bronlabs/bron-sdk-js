import { TransactionLimits } from "../types/TransactionLimits.js";
import { TransactionLimitsQuery } from "../types/TransactionLimitsQuery.js";
import { TransactionLimit } from "../types/TransactionLimit.js";
import { HttpClient } from "../utils/http.js";

export class TransactionLimitsAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getTransactionLimits(query?: TransactionLimitsQuery): Promise<TransactionLimits> {
    return this.http.request<TransactionLimits>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transaction-limits`,
      query
    });
  }

  async getTransactionLimitById(limitId: string): Promise<TransactionLimit> {
    return this.http.request<TransactionLimit>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transaction-limits/${limitId}`
    });
  }
}