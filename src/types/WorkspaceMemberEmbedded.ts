export interface WorkspaceMemberEmbedded {
  identities?: { createdAt: string; createdBy?: string; identityId: string; identityType: "email"; identityValue: string; lastUsedAt?: string; updatedAt?: string; userId: string }[];
  permissionGroups?: string[];
  profile?: { imageId?: string; name?: string; userId: string };
}
