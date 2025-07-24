import { Transactions } from "../types/Transactions.js";
import { CreateTransaction } from "../types/CreateTransaction.js";
import { CreateTransactions } from "../types/CreateTransactions.js";
import { Transaction } from "../types/Transaction.js";
import { CancelTransaction } from "../types/CancelTransaction.js";
import { HttpClient } from "../utils/http.js";
export interface TransactionsParams {
  transactionIds?: string[];
  transactionTypes?: string[];
  accountTypes?: string[];
  accountIds?: string[];
  transactionStatuses?: string[];
  transactionStatusNotIn?: string[];
  blockchainTxId?: string;
  toAccountId?: string;
  toAddress?: string;
  isTerminated?: boolean;
  terminatedAtFrom?: string;
  terminatedAtTo?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  sortDirection?: string;
  limit?: string;
  offset?: string;
  workspaceId: string;
}

export interface TransactionByIDParams {
  workspaceId: string;
  transactionId: string;
}

export interface SigningRequestParams {
  workspaceId: string;
  transactionId: string;
}

export class TransactionsAPI {
  constructor(private http: HttpClient, private workspaceId?: string) {}
  async getTransactions(params: TransactionsParams): Promise<Transactions> {
    return this.http.request<Transactions>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/transactions`,
    query: params
  });
  }

  async createTransaction(params: CreateTransaction) {
    return this.http.request({
    method: "POST",
    path: `/workspaces/${this.workspaceId}/transactions/`,
    body: params
  });
  }

  async createMultipleTransactions(params: CreateTransactions) {
    return this.http.request({
    method: "POST",
    path: `/workspaces/${this.workspaceId}/transactions/bulk-create`,
    body: params
  });
  }

  async dryRunTransaction(params: CreateTransaction): Promise<Transaction> {
    return this.http.request<Transaction>({
    method: "POST",
    path: `/workspaces/${this.workspaceId}/transactions/dry-run`,
    body: params
  });
  }

  async getTransactionByID(params: TransactionByIDParams): Promise<Transaction> {
    return this.http.request<Transaction>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/transactions/${params.transactionId}`,
    query: params
  });
  }

  async cancelTransaction(params: CancelTransaction): Promise<Transaction> {
    return this.http.request<Transaction>({
    method: "POST",
    path: `/workspaces/${this.workspaceId}/transactions/${params.transactionId}/cancel`,
    body: params
  });
  }

  async createSigningRequest(params: SigningRequestParams): Promise<Transaction> {
    return this.http.request<Transaction>({
    method: "POST",
    path: `/workspaces/${this.workspaceId}/transactions/${params.transactionId}/create-signing-request`,
    body: params
  });
  }
}