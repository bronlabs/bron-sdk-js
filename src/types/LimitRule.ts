export interface LimitRule {
  approve?: { authorisedApproversUserIds?: string[]; numberOfApprovals: string };
  skipApproval?: boolean;
}
