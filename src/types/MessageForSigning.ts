import { HashFunction } from './HashFunction.js';
import { KeyType } from './KeyType.js';
import { SignatureScheme } from './SignatureScheme.js';
import { SignatureVariant } from './SignatureVariant.js';

export interface MessageForSigning {
  hashFunction?: HashFunction;
  keyType?: KeyType;
  message?: string;
  signatureScheme?: SignatureScheme;
  signatureVariant?: SignatureVariant;
}
