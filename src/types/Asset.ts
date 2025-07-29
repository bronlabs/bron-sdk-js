import { AssetType } from './AssetType.js';
import { SmartContractInformation } from './SmartContractInformation.js';

export interface Asset {
  assetId: string;
  assetType?: AssetType;
  contractInformation?: SmartContractInformation;
  decimals?: string;
  networkId?: string;
  symbolId?: string;
  verified?: boolean;
}
