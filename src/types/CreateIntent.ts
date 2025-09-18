export interface CreateIntent {
  accountId: string;
  fromAmount?: string;
  fromAssetId: string;
  intentId: string;
  toAmount?: string;
  toAssetId: string;
}
