export interface WorkspaceMember {
  _embedded?: { identities?: { createdAt: string; createdBy?: string; identityId: string; identityType: "email"; identityValue: string; lastUsedAt?: string; updatedAt?: string; userId: string }[]; permissionGroups?: string[]; profile?: { imageId?: string; name?: string; userId: string } };
  createdAt: string;
  deactivatedAt?: string;
  status: "new" | "active" | "rejected" | "deactivated";
  updatedAt?: string;
  userId: string;
  workspaceId: string;
}
