import type { StakeInfo } from "./StakeInfo.js";
import type { StakeStatus } from "./StakeStatus.js";
import type { Warning } from "./Warning.js";

export interface Stake {
  accountId?: string;
  amount?: string;
  assetId?: string;
  networkId?: string;
  poolId?: string;
  stakeId?: string;
  stakeInfo?: StakeInfo;
  status?: StakeStatus;
  updatedAt?: string;
  warning?: Warning;
  workspaceId?: string;
}
