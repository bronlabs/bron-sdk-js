export interface AssetByIDQuery {
  assetIds?: string[];
  networkIds?: string[];
  symbolIds?: string[];
  contractAddress?: string;
  contractIssuer?: string;
  assetType?: string;
  used?: boolean;
  search?: string;
  limit?: string;
  offset?: string;
}
