import { Assets } from "../types/Assets.js";
import { AssetsQuery } from "../types/AssetsQuery.js";
import { Asset } from "../types/Asset.js";
import { Networks } from "../types/Networks.js";
import { NetworksQuery } from "../types/NetworksQuery.js";
import { Network } from "../types/Network.js";
import { SymbolMarketPrices } from "../types/SymbolMarketPrices.js";
import { PricesQuery } from "../types/PricesQuery.js";
import { Symbols } from "../types/Symbols.js";
import { SymbolsQuery } from "../types/SymbolsQuery.js";
import { Symbol } from "../types/Symbol.js";
import { HttpClient } from "../utils/http.js";

export class AssetsAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getAssets(query?: AssetsQuery): Promise<Assets> {
    return this.http.request<Assets>({
      method: "GET",
      path: `/dictionary/assets`,
      query
    });
  }

  async getAssetById(assetId: string): Promise<Asset> {
    return this.http.request<Asset>({
      method: "GET",
      path: `/dictionary/assets/${assetId}`
    });
  }

  async getNetworks(query?: NetworksQuery): Promise<Networks> {
    return this.http.request<Networks>({
      method: "GET",
      path: `/dictionary/networks`,
      query
    });
  }

  async getNetworkById(networkId: string): Promise<Network> {
    return this.http.request<Network>({
      method: "GET",
      path: `/dictionary/networks/${networkId}`
    });
  }

  async getPrices(query?: PricesQuery): Promise<SymbolMarketPrices> {
    return this.http.request<SymbolMarketPrices>({
      method: "GET",
      path: `/dictionary/symbol-market-prices`,
      query
    });
  }

  async getSymbols(query?: SymbolsQuery): Promise<Symbols> {
    return this.http.request<Symbols>({
      method: "GET",
      path: `/dictionary/symbols`,
      query
    });
  }

  async getSymbolById(symbolId: string): Promise<Symbol> {
    return this.http.request<Symbol>({
      method: "GET",
      path: `/dictionary/symbols/${symbolId}`
    });
  }
}