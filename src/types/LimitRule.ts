export interface LimitRule {
  approve?: { authorisedApproversUserIds?: string[]; numberOfApprovals: string };
  securityDelay?: { durationHours: string };
  skipApproval?: boolean;
}
