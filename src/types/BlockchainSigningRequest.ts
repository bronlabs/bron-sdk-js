import { TransactionType } from './TransactionType.js';

export interface BlockchainSigningRequest {
  assetId?: string;
  networkId?: string;
  publicKey?: string;
  sponsored?: boolean;
  transactionType?: TransactionType;
}
