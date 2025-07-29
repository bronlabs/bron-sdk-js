import { WorkspaceMemberEmbedded } from './WorkspaceMemberEmbedded.js';
import { MemberStatus } from './MemberStatus.js';

export interface WorkspaceMember {
  _embedded?: WorkspaceMemberEmbedded;
  createdAt: string;
  deactivatedAt?: string;
  status: MemberStatus;
  updatedAt?: string;
  userId: string;
  workspaceId: string;
}
