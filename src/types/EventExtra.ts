import { EventAllowance } from './EventAllowance.js';
import { EventInput } from './EventInput.js';
import { EventOutput } from './EventOutput.js';
import { RewardInfo } from './RewardInfo.js';
import { StakeInfo } from './StakeInfo.js';

export interface EventExtra {
  allowance?: EventAllowance[];
  in?: EventInput[];
  out?: EventOutput[];
  rewardInfo?: RewardInfo;
  stakeInfo?: StakeInfo[];
  transactionFailed?: boolean;
}
