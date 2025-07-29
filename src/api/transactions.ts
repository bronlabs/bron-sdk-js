import { Transactions } from "../types/Transactions.js";
import { TransactionsQuery } from "../types/TransactionsQuery.js";
import { CreateTransaction } from "../types/CreateTransaction.js";
import { CreateTransactions } from "../types/CreateTransactions.js";
import { Transaction } from "../types/Transaction.js";
import { CancelTransaction } from "../types/CancelTransaction.js";
import { HttpClient } from "../utils/http.js";

export class TransactionsAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getTransactions(query?: TransactionsQuery): Promise<Transactions> {
    return this.http.request<Transactions>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transactions`,
      query
    });
  }

  async createTransaction(body: CreateTransaction) {
    return this.http.request({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/`,
      body
    });
  }

  async createMultipleTransactions(body: CreateTransactions) {
    return this.http.request({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/bulk-create`,
      body
    });
  }

  async dryRunTransaction(body: CreateTransaction): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/dry-run`,
      body
    });
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}`
    });
  }

  async cancelTransaction(transactionId: string, body: CancelTransaction): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}/cancel`,
      body
    });
  }

  async createSigningRequest(transactionId: string): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}/create-signing-request`
    });
  }
}