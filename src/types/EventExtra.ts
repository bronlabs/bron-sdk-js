import type { EventAllowance } from "./EventAllowance.js";
import type { EventInput } from "./EventInput.js";
import type { EventOutput } from "./EventOutput.js";
import type { EventStakeInfo } from "./EventStakeInfo.js";
import type { SigningMessage } from "./SigningMessage.js";
import type { StakeRewardInfo } from "./StakeRewardInfo.js";

export interface EventExtra {
  allowance?: EventAllowance[];
  in?: EventInput[];
  out?: EventOutput[];
  rewardInfo?: StakeRewardInfo;
  signingMessage?: SigningMessage;
  stakeInfo?: EventStakeInfo[];
  transactionFailed?: boolean;
  walletStateInit?: string;
}
