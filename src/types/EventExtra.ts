import { EventAllowance } from './EventAllowance.js';
import { EventInput } from './EventInput.js';
import { EventOutput } from './EventOutput.js';
import { RewardInfo } from './RewardInfo.js';
import { SigningMessage } from './SigningMessage.js';
import { StakeInfo } from './StakeInfo.js';

export interface EventExtra {
  allowance?: EventAllowance[];
  in?: EventInput[];
  out?: EventOutput[];
  rewardInfo?: RewardInfo;
  signingMessage?: SigningMessage;
  stakeInfo?: StakeInfo[];
  transactionFailed?: boolean;
}
