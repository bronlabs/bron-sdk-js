import { v4 as uuidv4 } from "uuid";

import { HttpClient } from "../utils/http.js";
import { GetTransactionsParams, GetTransactionsResponse, CreateTransactionRequest, Transaction } from "../types/transactions.js";


export class TransactionsAPI {
  private client: HttpClient;
  private readonly workspaceId: string;

  constructor(client: HttpClient, workspaceId: string) {
    this.client = client;
    this.workspaceId = workspaceId;
  }

  async getTransactions(params?: GetTransactionsParams): Promise<GetTransactionsResponse> {
    return this.client.request<GetTransactionsResponse>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transactions`,
      query: params
    });
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    return this.client.request<Transaction>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}`
    });
  }

  async createTransaction(body: CreateTransactionRequest): Promise<Transaction> {
    return this.client.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions`,
      body
    });
  }
}
