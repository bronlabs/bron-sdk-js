import type { SlippageReason } from "./SlippageReason.js";
import type { StockSession } from "./StockSession.js";

export interface IntentsQuoteEmbedded {
  slippageBps?: string;
  slippageReason?: SlippageReason;
  stockSession?: StockSession;
}
