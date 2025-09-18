import { WithdrawalParams } from './WithdrawalParams.js';
import { ActivateParams } from './ActivateParams.js';
import { AddressActivationParams } from './AddressActivationParams.js';
import { AddressCreationParams } from './AddressCreationParams.js';
import { AllowanceParams } from './AllowanceParams.js';
import { IntentsParams } from './IntentsParams.js';
import { SetupParams } from './SetupParams.js';
import { StakeClaimParams } from './StakeClaimParams.js';
import { StakeDelegationParams } from './StakeDelegationParams.js';
import { StakeUnDelegationParams } from './StakeUnDelegationParams.js';
import { SwapParams } from './SwapParams.js';
import { TransactionType } from './TransactionType.js';

export interface CreateTransaction {
  accountId: string;
  description?: string;
  expiresAt?: string;
  externalId: string;
  params?: any;
  transactionType: TransactionType;
}
