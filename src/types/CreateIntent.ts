export interface CreateIntent {
  accountId: string;
  fromAmount?: string;
  fromAssetId: string;
  fromTokenId?: string;
  intentId: string;
  toAmount?: string;
  toAssetId: string;
  toTokenId?: string;
}
