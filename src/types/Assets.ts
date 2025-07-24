export interface Assets {
  assets?: { assetId: string; assetType?: "blockchain" | "exchange" | "fiat"; contractInformation?: { contractAddress?: string }; decimals?: string; networkId?: string; symbolId?: string; verified?: boolean }[];
}
