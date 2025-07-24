import { Assets } from "../types/Assets.js";
import { Networks } from "../types/Networks.js";
import { SymbolMarketPrices } from "../types/SymbolMarketPrices.js";
import { Symbols } from "../types/Symbols.js";
import { HttpClient } from "../utils/http.js";

export interface AssetsParams {
  assetIds?: string[];
  networkIds?: string[];
  symbolIds?: string[];
  assetType?: string;
  limit?: string;
  offset?: string;
}

export interface NetworksParams {
  networkIds?: string[];
}

export interface PricesParams {
  baseSymbolIds?: string[];
}

export interface SymbolsParams {
  symbolIds?: string[];
  assetIds?: string[];
  limit?: string;
  offset?: string;
}

export class AssetsAPI {
  constructor(private http: HttpClient, private workspaceId: string) {}

async getAssets(params?: AssetsParams): Promise<Assets> {
  return this.http.request<Assets>({
    method: "GET",
    path: `/dictionary/assets`,
    query: params
  });
}
async getNetworks(params?: NetworksParams): Promise<Networks> {
  return this.http.request<Networks>({
    method: "GET",
    path: `/dictionary/networks`,
    query: params
  });
}
async getPrices(params?: PricesParams): Promise<SymbolMarketPrices> {
  return this.http.request<SymbolMarketPrices>({
    method: "GET",
    path: `/dictionary/symbol-market-prices`,
    query: params
  });
}
async getSymbols(params?: SymbolsParams): Promise<Symbols> {
  return this.http.request<Symbols>({
    method: "GET",
    path: `/dictionary/symbols`,
    query: params
  });
}
}