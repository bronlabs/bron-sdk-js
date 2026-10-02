import type { BankDetails } from "./BankDetails.js";
import type { RecordType } from "./RecordType.js";

export interface CreateAddressBookRecord {
  accountIds?: string[];
  address?: string;
  bankDetails?: BankDetails;
  externalId: string;
  imageId?: string;
  memo?: string;
  name: string;
  networkId?: string;
  recordType?: RecordType;
  tag?: string;
}
