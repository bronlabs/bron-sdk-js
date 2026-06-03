import { MessageForSigning } from './MessageForSigning.js';

export interface MessagesForSigning {
  messages?: MessageForSigning[];
  primitivesVersion?: string;
  publicKey?: string;
  useBackupPrimitive?: boolean;
}
