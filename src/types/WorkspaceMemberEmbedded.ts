import type { Identity } from "./Identity.js";
import type { UserProfile } from "./UserProfile.js";

export interface WorkspaceMemberEmbedded {
  identities?: Identity[];
  permissionGroups?: string[];
  profile?: UserProfile;
}
