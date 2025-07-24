import { HttpClient } from "../utils/http.js";
import { TransactionLimits } from "../types/transactionLimits.js";
import { TransactionLimit } from "../types/TransactionLimit.js";

type GetTransactionLimitsParams = {
  statuses?: string[];
  fromAccountIds?: string[];
  toAddressBookRecordIds?: string[];
  toAccountIds?: string[];
  appliesToUserIds?: string[];
  appliesToGroupIds?: string[];
  limit?: string;
  offset?: string;
};

export class TransactionLimitsAPI {
  private client: HttpClient;
  private workspaceId: string;

  constructor(client: HttpClient, workspaceId: string) {
    this.client = client;
    this.workspaceId = workspaceId;
  }

  async getTransactionLimits(params?: GetTransactionLimitsParams): Promise<TransactionLimits> {
    return this.client.request<TransactionLimits>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transaction-limits`,
      query: params,
    });
  }

  async getTransactionLimitById(limitId: string): Promise<TransactionLimit> {
    return this.client.request<TransactionLimit>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transaction-limits/${limitId}`,
    });
  }
} 