import { MessageForSigning } from './MessageForSigning.js';

export interface MessagesForSigning {
  messages?: MessageForSigning[];
  publicKey?: string;
  useBackupPrimitive?: boolean;
}
