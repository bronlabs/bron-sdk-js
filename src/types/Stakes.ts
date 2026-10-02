import type { Stake } from "./Stake.js";
import type { StakesEmbedded } from "./StakesEmbedded.js";

export interface Stakes {
  _embedded?: StakesEmbedded;
  stakes?: Stake[];
}
