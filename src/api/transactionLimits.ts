import { HttpClient } from "../utils/http.js";
import {
  GetTransactionLimitsParams,
  GetTransactionLimitsResponse,
  TransactionLimit,
} from "../types/transactionLimits.js";

export class TransactionLimitsAPI {
  private client: HttpClient;
  private workspaceId: string;

  constructor(client: HttpClient, workspaceId: string) {
    this.client = client;
    this.workspaceId = workspaceId;
  }

  async getTransactionLimits(params?: GetTransactionLimitsParams): Promise<GetTransactionLimitsResponse> {
    const query: Record<string, string> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          if (value.length) query[key] = value.join(",");
        } else if (value !== undefined) {
          query[key] = String(value);
        }
      }
    }
    return this.client.request<GetTransactionLimitsResponse>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transaction-limits`,
      query: Object.keys(query).length ? query : undefined,
    });
  }

  async getTransactionLimitById(limitId: string): Promise<TransactionLimit> {
    return this.client.request<TransactionLimit>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transaction-limits/${limitId}`,
    });
  }
} 