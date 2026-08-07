import { StakeResource } from './StakeResource.js';

export interface StakeUnDelegationParams {
  amount?: string;
  assetId: string;
  resource?: StakeResource;
  stakeId?: string;
}
