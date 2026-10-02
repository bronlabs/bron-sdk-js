import type { AccountHolderType } from "./AccountHolderType.js";
import type { BankAccountType } from "./BankAccountType.js";
import type { BankAddress } from "./BankAddress.js";
import type { BankChannelType } from "./BankChannelType.js";

export interface BankDetails {
  accountHolderType: AccountHolderType;
  accountNumber: string;
  accountType?: BankAccountType;
  bankAddress?: BankAddress;
  bankCode?: string;
  businessName?: string;
  businessRegistrationNumber?: string;
  channelType: BankChannelType;
  correspondentBankCode?: string;
  country: string;
  fiatCurrency: string;
  firstName?: string;
  issuer: string;
  lastName?: string;
  paymentPurpose?: string;
  reference?: string;
  registeredAddress?: string;
}
