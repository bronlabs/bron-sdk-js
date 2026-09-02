import { MessageForSigning } from './MessageForSigning.js';

export interface MessagesForSigning {
  messages?: MessageForSigning[];
  parallelSigning?: boolean;
  primitivesVersion?: string;
  publicKey?: string;
  useBackupPrimitive?: boolean;
}
