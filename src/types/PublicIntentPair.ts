import { IntentPairAsset } from './IntentPairAsset.js';

export interface PublicIntentPair {
  assetA: IntentPairAsset;
  assetB: IntentPairAsset;
  isBidirectional: boolean;
}
