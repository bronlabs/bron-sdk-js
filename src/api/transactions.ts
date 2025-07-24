import { v4 as uuidv4 } from "uuid";

import { HttpClient } from "../utils/http.js";
import { Transactions } from "../types/transactions.js";
import { Transaction } from "../types/Transaction.js";

type GetTransactionsParams = {
  statuses?: string[];
  fromAccountIds?: string[];
  toAccountIds?: string[];
  limit?: string;
  offset?: string;
};

type CreateTransactionRequest = {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  assetId: string;
  memo?: string;
};

export class TransactionsAPI {
  private client: HttpClient;
  private readonly workspaceId: string;

  constructor(client: HttpClient, workspaceId: string) {
    this.client = client;
    this.workspaceId = workspaceId;
  }

  async getTransactions(params?: GetTransactionsParams): Promise<Transactions> {
    return this.client.request<Transactions>({
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
