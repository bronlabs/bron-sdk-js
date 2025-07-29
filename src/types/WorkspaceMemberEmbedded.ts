import { Identity } from './Identity.js';
import { UserProfile } from './UserProfile.js';

export interface WorkspaceMemberEmbedded {
  identities?: Identity[];
  permissionGroups?: string[];
  profile?: UserProfile;
}
