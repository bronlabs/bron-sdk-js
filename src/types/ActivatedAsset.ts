import type { AddressStatus } from "./AddressStatus.js";

export interface ActivatedAsset {
  activationId?: string;
  address?: string;
  assetId?: string;
  status?: AddressStatus;
}
