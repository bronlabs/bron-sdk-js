import type { MessageForSigning } from "./MessageForSigning.js";

export interface MessagesForSigning {
  messages?: MessageForSigning[];
  parallelSigning?: boolean;
  publicKey?: string;
  useBackupPrimitive?: boolean;
}
