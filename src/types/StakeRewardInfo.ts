import type { RewardSource } from "./RewardSource.js";

export interface StakeRewardInfo {
  increaseOperableBalance?: boolean;
  poolIds?: string[];
  rewardSource?: RewardSource;
  rewardWithoutTransaction?: boolean;
  stakeId?: string;
}
