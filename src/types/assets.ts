export interface Asset {
  assetId: string;
  assetType: string;
  contractInformation?: {
    contractAddress?: string;
    [key: string]: any;
  };
  decimals?: string;
  networkId: string;
  symbolId: string;
  verified?: boolean;
}

export interface AssetsResponse {
  assets: Asset[];
}

export interface Network {
  addressExplorerUrl?: string;
  confirmations?: string;
  explorerUrl?: string;
  isTestnet?: boolean;
  name: string;
  networkId: string;
}

export interface NetworksResponse {
  networks: Network[];
}

export interface Symbol {
  name: string;
  symbol: string;
  symbolId: string;
}

export interface SymbolsResponse {
  symbols: Symbol[];
}

export interface Price {
  baseSymbolId: string;
  price: string;
  quoteSymbolId: string;
}

export interface PricesResponse {
  prices: Price[];
} 