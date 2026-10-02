import type { MemberStatus } from "./MemberStatus.js";
import type { WorkspaceMemberEmbedded } from "./WorkspaceMemberEmbedded.js";

export interface WorkspaceMember {
  _embedded?: WorkspaceMemberEmbedded;
  createdAt: string;
  deactivatedAt?: string;
  status: MemberStatus;
  updatedAt?: string;
  userId: string;
  workspaceId: string;
}
