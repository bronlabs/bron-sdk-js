export interface CreateTransaction {
  accountId: string;
  expiresAt?: string;
  externalId: string;
  params?: any;
  transactionType: "deposit" | "withdrawal" | "multi-withdrawal" | "negative-deposit" | "auto-withdrawal" | "allowance" | "raw-transaction" | "address-activation" | "address-creation" | "swap-lifi" | "intents";
}
