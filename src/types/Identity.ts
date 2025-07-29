import { IdentityType } from './IdentityType.js';

export interface Identity {
  createdAt: string;
  createdBy?: string;
  identityId: string;
  identityType: IdentityType;
  identityValue: string;
  lastUsedAt?: string;
  updatedAt?: string;
  userId: string;
}
