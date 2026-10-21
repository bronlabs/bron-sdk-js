import type { IntentsQuoteEmbedded } from "./IntentsQuoteEmbedded.js";

export interface IntentsQuote {
  _embedded?: IntentsQuoteEmbedded;
  fromAmount: string;
  fromAssetId: string;
  minPrice: string;
  minToAmount: string;
  oracleFeePercent: string;
  solverFeePercent: string;
  toAmount: string;
  toAssetId: string;
}
