import { HttpClient } from "../utils/http.js";
import {
  GetTransactionsParams,
  GetTransactionsResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
  CreateMultipleTransactionsRequest,
  CreateMultipleTransactionsResponse,
} from "../types/transactions.js";
import { v4 as uuidv4 } from "uuid";

export class TransactionsAPI {
  private client: HttpClient;
  private workspaceId: string;

  constructor(client: HttpClient, workspaceId: string) {
    this.client = client;
    this.workspaceId = workspaceId;
  }

  async getTransactions(params?: GetTransactionsParams): Promise<GetTransactionsResponse> {
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
    return this.client.request<GetTransactionsResponse>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transactions`,
      query: Object.keys(query).length ? query : undefined,
    });
  }

  async createTransaction(body: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    // Auto-generate externalId if not provided
    if (!body.externalId) {
      body.externalId = uuidv4();
    }
    return this.client.request<CreateTransactionResponse>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/`,
      body,
    });
  }

  async createMultipleTransactions(
    body: CreateMultipleTransactionsRequest
  ): Promise<CreateMultipleTransactionsResponse> {
    // Auto-generate externalId for any transaction missing it
    for (const tx of body.transactions) {
      if (!tx.externalId) {
        tx.externalId = uuidv4();
      }
    }
    return this.client.request<CreateMultipleTransactionsResponse>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/bulk-create`,
      body,
    });
  }
} 