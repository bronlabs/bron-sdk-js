import { StakesEmbedded } from './StakesEmbedded.js';
import { Stake } from './Stake.js';

export interface Stakes {
  _embedded?: StakesEmbedded;
  stakes?: Stake[];
}
