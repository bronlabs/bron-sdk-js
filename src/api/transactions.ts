import { Transactions } from "../types/Transactions.js";
import { TransactionsQuery } from "../types/TransactionsQuery.js";
import { CreateTransaction } from "../types/CreateTransaction.js";
import { CreateTransactions } from "../types/CreateTransactions.js";
import { Transaction } from "../types/Transaction.js";
import { CancelTransaction } from "../types/CancelTransaction.js";
import { HttpClient } from "../utils/http.js";

export class TransactionsAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getTransactions(workspaceId?: string): Promise<Transactions> {
    return this.http.request<Transactions>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/transactions`
    });
  }

  async createTransaction(body: CreateTransaction, workspaceId?: string) {
    return this.http.request({
      method: "POST",
      path: `/workspaces/${workspaceId || this.workspaceId}/transactions/`,
      body
    });
  }

  async createMultipleTransactions(body: CreateTransactions, workspaceId?: string) {
    return this.http.request({
      method: "POST",
      path: `/workspaces/${workspaceId || this.workspaceId}/transactions/bulk-create`,
      body
    });
  }

  async dryRunTransaction(body: CreateTransaction, workspaceId?: string): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${workspaceId || this.workspaceId}/transactions/dry-run`,
      body
    });
  }

  async getTransactionById(transactionId: string, workspaceId?: string): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/transactions/${transactionId}`
    });
  }

  async cancelTransaction(body: CancelTransaction, transactionId: string, workspaceId?: string): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${workspaceId || this.workspaceId}/transactions/${transactionId}/cancel`,
      body
    });
  }

  async createSigningRequest(transactionId: string, workspaceId?: string): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${workspaceId || this.workspaceId}/transactions/${transactionId}/create-signing-request`
    });
  }
}