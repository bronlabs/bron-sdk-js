import type { CreateIntent } from "../types/CreateIntent.js";
import type { IndicativeQuoteForAnIntentSwapPairQuery } from "../types/IndicativeQuoteForAnIntentSwapPairQuery.js";
import type { Intent } from "../types/Intent.js";
import type { IntentsQuote } from "../types/IntentsQuote.js";
import type { PublicIntentPairs } from "../types/PublicIntentPairs.js";
import type { HttpClient } from "../utils/http.js";

export class IntentsAPI {
  constructor(
    private http: HttpClient,
    private workspaceId?: string,
  ) {}

  async getIntentSwapPairs(): Promise<PublicIntentPairs> {
    return this.http.request<PublicIntentPairs>({
      method: "GET",
      path: `/dictionary/intent-pairs`,
    });
  }

  async getIndicativeQuoteForAnIntentSwapPair(
    fromAssetId: string,
    toAssetId: string,
    query?: IndicativeQuoteForAnIntentSwapPairQuery,
  ): Promise<IntentsQuote> {
    return this.http.request<IntentsQuote>({
      method: "GET",
      path: `/dictionary/intent-pairs/${fromAssetId}/${toAssetId}/quote`,
      query,
    });
  }

  async createIntentRequest(body: CreateIntent): Promise<Intent> {
    return this.http.request<Intent>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/intents`,
      body,
    });
  }

  async getIntentRequestById(intentId: string): Promise<Intent> {
    return this.http.request<Intent>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/intents/${intentId}`,
    });
  }
}
