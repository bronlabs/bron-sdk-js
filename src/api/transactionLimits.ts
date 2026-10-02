import type { LimitApproverCandidates } from "../types/LimitApproverCandidates.js";
import type { LimitApproverCandidatesQuery } from "../types/LimitApproverCandidatesQuery.js";
import type { TransactionLimit } from "../types/TransactionLimit.js";
import type { TransactionLimits } from "../types/TransactionLimits.js";
import type { TransactionLimitsQuery } from "../types/TransactionLimitsQuery.js";
import type { HttpClient } from "../utils/http.js";

export class TransactionLimitsAPI {
  constructor(
    private http: HttpClient,
    private workspaceId?: string,
  ) {}

  async getTransactionLimits(query?: TransactionLimitsQuery): Promise<TransactionLimits> {
    return this.http.request<TransactionLimits>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transaction-limits`,
      query,
    });
  }

  async getLimitApproverCandidates(query?: LimitApproverCandidatesQuery): Promise<LimitApproverCandidates> {
    return this.http.request<LimitApproverCandidates>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transaction-limits/approver-candidates`,
      query,
    });
  }

  async getTransactionLimitById(limitId: string): Promise<TransactionLimit> {
    return this.http.request<TransactionLimit>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transaction-limits/${limitId}`,
    });
  }
}
