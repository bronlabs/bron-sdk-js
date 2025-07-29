import { NetworkTag } from './NetworkTag.js';

export interface Network {
  addressExplorerUrl?: string;
  confirmations?: string;
  explorerUrl?: string;
  isTestnet?: boolean;
  name?: string;
  networkId?: string;
  tags?: NetworkTag[];
}
