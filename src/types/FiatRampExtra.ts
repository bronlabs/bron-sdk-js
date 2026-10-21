import type { FiatInBankDetails } from "./FiatInBankDetails.js";
import type { FiatInReceived } from "./FiatInReceived.js";

export interface FiatRampExtra {
  amount?: string;
  bankDetails?: FiatInBankDetails;
  fiatAmount?: string;
  fiatInReceived?: FiatInReceived;
  platformFee?: string;
  provider?: string;
  providerFee?: string;
  rate?: string;
}
