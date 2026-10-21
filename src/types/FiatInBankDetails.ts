import type { BankAddress } from "./BankAddress.js";
import type { BankChannelType } from "./BankChannelType.js";

export interface FiatInBankDetails {
  accountHolderName?: string;
  accountNumber?: string;
  bankAddress?: BankAddress;
  bankCode?: string;
  bankName?: string;
  channelType?: BankChannelType;
}
