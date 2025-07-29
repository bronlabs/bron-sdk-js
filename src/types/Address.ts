import { AccountType } from './AccountType.js';
import { ActivatedAsset } from './ActivatedAsset.js';
import { AddressStatus } from './AddressStatus.js';

export interface Address {
  acceptsAllAssets: boolean;
  accountId?: string;
  accountType: AccountType;
  activatedAssets?: ActivatedAsset[];
  address?: string;
  addressId: string;
  createdAt: string;
  createdBy: string;
  externalId: string;
  memo?: string;
  metadata?: Record<string, any>;
  networkId: string;
  requiresAssetsActivation: boolean;
  status: AddressStatus;
  updatedAt: string;
  updatedBy: string;
  workspaceId?: string;
}
