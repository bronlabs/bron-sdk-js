import { Assets } from "../types/Assets.js";
import { Networks } from "../types/Networks.js";
import { Symbols } from "../types/Symbols.js";
import { SymbolMarketPrices } from "../types/SymbolMarketPrices.js";
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

  async getAssets(params: GetAssetsParams = {}): Promise<Assets> {
    return this.http.request<Assets>({
      method: "GET",
      path: "/dictionary/assets",
      query: toQuery(params)
    });
  }

  async getNetworks(params: GetNetworksParams = {}): Promise<Networks> {
    return this.http.request<Networks>({
      method: "GET",
      path: "/dictionary/networks",
      query: toQuery(params)
    });
  }

  async getSymbols(params: GetSymbolsParams = {}): Promise<Symbols> {
    return this.http.request<Symbols>({
      method: "GET",
      path: "/dictionary/symbols",
      query: toQuery(params)
    });
  }

  async getPrices(params: GetPricesParams = {}): Promise<SymbolMarketPrices> {
    return this.http.request<SymbolMarketPrices>({
      method: "GET",
      path: "/dictionary/symbol-market-prices",
      query: toQuery(params)
    });
  }
} 