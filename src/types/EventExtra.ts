import { EventAllowance } from './EventAllowance.js';
import { EventInput } from './EventInput.js';
import { EventOutput } from './EventOutput.js';
import { StakeRewardInfo } from './StakeRewardInfo.js';
import { SigningMessage } from './SigningMessage.js';
import { EventStakeInfo } from './EventStakeInfo.js';

export interface EventExtra {
  allowance?: EventAllowance[];
  in?: EventInput[];
  out?: EventOutput[];
  rewardInfo?: StakeRewardInfo;
  signingMessage?: SigningMessage;
  stakeInfo?: EventStakeInfo[];
  transactionFailed?: boolean;
}
