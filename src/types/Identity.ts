export interface Identity {
  createdAt: string;
  createdBy?: string;
  identityId: string;
  identityType: "email";
  identityValue: string;
  lastUsedAt?: string;
  updatedAt?: string;
  userId: string;
}
