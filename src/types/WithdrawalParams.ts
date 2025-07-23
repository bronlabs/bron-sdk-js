export interface WithdrawalParams {
  amount: string;
  assetId?: string;
  feeLevel?: "low" | "medium" | "high";
  includeFee?: boolean;
  memo?: string;
  networkFees?: { feePerByte?: string; gasLimit?: string; gasPriceGwei?: string; maxFeePerGas?: string; maxPriorityFeePerGas?: string };
  networkId?: string;
  symbol?: string;
  toAccountId?: string;
  toAddress?: string;
  toAddressBookRecordId?: string;
}
