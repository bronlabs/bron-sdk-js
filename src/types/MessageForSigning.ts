import type { HashFunction } from "./HashFunction.js";
import type { KeyType } from "./KeyType.js";
import type { SignatureScheme } from "./SignatureScheme.js";
import type { SignatureVariant } from "./SignatureVariant.js";

export interface MessageForSigning {
  hashFunction?: HashFunction;
  keyType?: KeyType;
  message?: string;
  signatureScheme?: SignatureScheme;
  signatureVariant?: SignatureVariant;
}
