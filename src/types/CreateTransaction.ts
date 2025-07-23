export interface CreateTransaction {
  accountId: string;
  externalId: string;
  params?: any;
  transactionType: "deposit" | "withdrawal" | "multi-withdrawal" | "negative-deposit" | "auto-withdrawal" | "allowance" | "raw-transaction" | "swap-lifi" | "intents";
}
