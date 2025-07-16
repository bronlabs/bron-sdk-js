import { AssetsResponse, NetworksResponse, SymbolsResponse, PricesResponse } from "../types/assets.js";
import { HttpClient } from "../utils/http.js";

export interface GetAssetsParams {
  assetIds?: string[];
  networkIds?: string[];
  symbolIds?: string[];
  assetType?: string;
  limit?: string;
  offset?: string;
}

export interface GetNetworksParams {
  networkIds?: string[];
}

export interface GetSymbolsParams {
  symbolIds?: string[];
  assetIds?: string[];
  limit?: string;
  offset?: string;
}

export interface GetPricesParams {
  baseSymbolIds?: string[];
}

function toQuery(params: Record<string, any>): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query[key] = Array.isArray(value) ? value : String(value);
    }
  }
  return query;
}

export class AssetsAPI {
  constructor(private http: HttpClient) {}

  async getAssets(params: GetAssetsParams = {}): Promise<AssetsResponse> {
    return this.http.request<AssetsResponse>({
      method: "GET",
      path: "/dictionary/assets",
      query: toQuery(params)
    });
  }

  async getNetworks(params: GetNetworksParams = {}): Promise<NetworksResponse> {
    return this.http.request<NetworksResponse>({
      method: "GET",
      path: "/dictionary/networks",
      query: toQuery(params)
    });
  }

  async getSymbols(params: GetSymbolsParams = {}): Promise<SymbolsResponse> {
    return this.http.request<SymbolsResponse>({
      method: "GET",
      path: "/dictionary/symbols",
      query: toQuery(params)
    });
  }

  async getPrices(params: GetPricesParams = {}): Promise<PricesResponse> {
    return this.http.request<PricesResponse>({
      method: "GET",
      path: "/dictionary/symbol-market-prices",
      query: toQuery(params)
    });
  }
} 