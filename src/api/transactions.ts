import type { ApproveTransaction } from "../types/ApproveTransaction.js";
import type { CancelTransaction } from "../types/CancelTransaction.js";
import type { CreateSigningRequest } from "../types/CreateSigningRequest.js";
import type { CreateTransaction } from "../types/CreateTransaction.js";
import type { CreateTransactions } from "../types/CreateTransactions.js";
import type { DryRunTransaction } from "../types/DryRunTransaction.js";
import type { OfferActions } from "../types/OfferActions.js";
import type { Transaction } from "../types/Transaction.js";
import type { TransactionEvents } from "../types/TransactionEvents.js";
import type { Transactions } from "../types/Transactions.js";
import type { TransactionsQuery } from "../types/TransactionsQuery.js";
import type { HttpClient } from "../utils/http.js";

export class TransactionsAPI {
  constructor(
    private http: HttpClient,
    private workspaceId?: string,
  ) {}

  async getTransactions(query?: TransactionsQuery): Promise<Transactions> {
    return this.http.request<Transactions>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transactions`,
      query,
    });
  }

  async createTransaction(body: CreateTransaction): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions`,
      body,
    });
  }

  async createMultipleTransactions(body: CreateTransactions): Promise<Transactions> {
    return this.http.request<Transactions>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/bulk-create`,
      body,
    });
  }

  async dryRunTransaction(body: CreateTransaction): Promise<DryRunTransaction> {
    return this.http.request<DryRunTransaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/dry-run`,
      body,
    });
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}`,
    });
  }

  async acceptDepositOffer(transactionId: string, body: OfferActions): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}/accept-deposit-offer`,
      body,
    });
  }

  async approveTransaction(transactionId: string, body: ApproveTransaction): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}/approve`,
      body,
    });
  }

  async cancelTransaction(transactionId: string, body: CancelTransaction): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}/cancel`,
      body,
    });
  }

  async createSigningRequest(transactionId: string, body: CreateSigningRequest): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}/create-signing-request`,
      body,
    });
  }

  async declineTransaction(transactionId: string, body: CancelTransaction): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}/decline`,
      body,
    });
  }

  async getTransactionEvents(transactionId: string): Promise<TransactionEvents> {
    return this.http.request<TransactionEvents>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}/events`,
    });
  }

  async rejectOutgoingOffer(transactionId: string, body: OfferActions): Promise<Transaction> {
    return this.http.request<Transaction>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/transactions/${transactionId}/reject-outgoing-offer`,
      body,
    });
  }
}
