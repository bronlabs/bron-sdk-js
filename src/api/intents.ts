import { Intent } from "../types/Intent.js";
import { CreateIntent } from "../types/CreateIntent.js";
import { IntentsQuote } from "../types/IntentsQuote.js";
import { RequestIndicativeSwapQuoteQuery } from "../types/RequestIndicativeSwapQuoteQuery.js";
import { HttpClient } from "../utils/http.js";

export class IntentsAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async createIntentRequest(body: CreateIntent): Promise<Intent> {
    return this.http.request<Intent>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/intents`,
      body
    });
  }

  async requestIndicativeSwapQuote(query?: RequestIndicativeSwapQuoteQuery): Promise<IntentsQuote> {
    return this.http.request<IntentsQuote>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/intents/quote`,
      query
    });
  }

  async getIntentRequestById(intentId: string): Promise<Intent> {
    return this.http.request<Intent>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/intents/${intentId}`
    });
  }
}