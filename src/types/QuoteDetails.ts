export interface QuoteDetails {
  approvalAddress?: string;
  expiresAt?: string;
  fromAmount?: string;
  fromAmountUSD?: string;
  isCrossChain?: boolean;
  networkFee?: string;
  networkFeeAssetId?: string;
  networkFeeUSD?: string;
  processingTime?: string;
  provider?: string;
  quoteId?: string;
  serviceFeeUSD?: string;
  slippage?: string;
  toAmount?: string;
  toAmountMin?: string;
  toAmountUSD?: string;
}
