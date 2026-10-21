import type { BankDetails } from "./BankDetails.js";
import type { RecordType } from "./RecordType.js";

export interface CreateAddressBookRecord {
  accountIds?: string[];
  address?: string;
  bankDetails?: BankDetails;
  email?: string;
  externalId: string;
  imageId?: string;
  isFavorite?: boolean;
  labels?: string[];
  memo?: string;
  name: string;
  networkId?: string;
  recordType?: RecordType;
  tag?: string;
}
