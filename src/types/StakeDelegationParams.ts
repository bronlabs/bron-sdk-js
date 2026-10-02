import type { StakeResource } from "./StakeResource.js";

export interface StakeDelegationParams {
  amount?: string;
  assetId: string;
  poolId?: string;
  resource?: StakeResource;
}
