import { AddressActivationParams } from './AddressActivationParams.js';
import { AddressCreationParams } from './AddressCreationParams.js';
import { AllowanceParams } from './AllowanceParams.js';
import { BridgeParams } from './BridgeParams.js';
import { DefiMessageParams } from './DefiMessageParams.js';
import { DefiParams } from './DefiParams.js';
import { DepositParams } from './DepositParams.js';
import { FiatInParams } from './FiatInParams.js';
import { FiatOutParams } from './FiatOutParams.js';
import { IntentsParams } from './IntentsParams.js';
import { LoyaltyParams } from './LoyaltyParams.js';
import { NFTAllowanceParams } from './NFTAllowanceParams.js';
import { NFTWithdrawalParams } from './NFTWithdrawalParams.js';
import { StakeClaimParams } from './StakeClaimParams.js';
import { StakeDelegationParams } from './StakeDelegationParams.js';
import { StakeUnDelegationParams } from './StakeUnDelegationParams.js';
import { StakeWithdrawalParams } from './StakeWithdrawalParams.js';
import { SwapParams } from './SwapParams.js';
import { WithdrawalParams } from './WithdrawalParams.js';
import { TransactionType } from './TransactionType.js';

export interface CreateTransaction {
  accountId: string;
  description?: string;
  expiresAt?: string;
  externalId: string;
  params?: any;
  transactionType: TransactionType;
}
