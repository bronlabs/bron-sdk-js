export interface AssetsQuery {
  assetIds?: string[];
  networkIds?: string[];
  symbolIds?: string[];
  contractAddress?: string;
  contractIssuer?: string;
  assetType?: string;
  limit?: string;
  offset?: string;
}
