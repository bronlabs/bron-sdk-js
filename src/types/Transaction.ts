import { AccountType } from './AccountType.js';
import { TransactionEmbedded } from './TransactionEmbedded.js';
import { TransactionExtra } from './TransactionExtra.js';
import { WithdrawalParams } from './WithdrawalParams.js';
import { SwapParams } from './SwapParams.js';
import { ActivateParams } from './ActivateParams.js';
import { AddressActivationParams } from './AddressActivationParams.js';
import { AddressCreationParams } from './AddressCreationParams.js';
import { AllowanceParams } from './AllowanceParams.js';
import { DepositParams } from './DepositParams.js';
import { IntentsParams } from './IntentsParams.js';
import { RawTransactionParams } from './RawTransactionParams.js';
import { SetupParams } from './SetupParams.js';
import { StakeClaimParams } from './StakeClaimParams.js';
import { StakeDelegationParams } from './StakeDelegationParams.js';
import { StakeUnDelegationParams } from './StakeUnDelegationParams.js';
import { TransactionStatus } from './TransactionStatus.js';
import { TransactionType } from './TransactionType.js';

export interface Transaction {
  accountId: string;
  accountType: AccountType;
  createdAt: string;
  createdBy?: string;
  embedded?: TransactionEmbedded;
  expiresAt?: string;
  externalId: string;
  extra?: TransactionExtra;
  params?: any;
  status: TransactionStatus;
  terminatedAt?: string;
  transactionId: string;
  transactionType: TransactionType;
  updatedAt?: string;
  workspaceId: string;
}
