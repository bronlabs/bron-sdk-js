import type { Pool } from "./Pool.js";
import type { Warning } from "./Warning.js";

export interface StakeInfo {
  bondingAmount?: string;
  bondingEndAt?: string;
  claimableRewardsAmount?: string;
  originPool?: Pool;
  readyToClaimStakeAt?: string;
  readyToIncrement?: boolean;
  readyToRedelegate?: boolean;
  readyToUnstake?: boolean;
  readyToUnstakeAt?: string;
  rewardsRequireClaim?: boolean;
  unbondingAmount?: string;
  unbondingEndAt?: string;
  warning?: Warning;
}
