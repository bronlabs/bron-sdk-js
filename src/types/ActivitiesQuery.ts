export interface ActivitiesQuery {
  accountIds?: string[];
  offset?: string;
  limit?: string;
  search?: string;
  userIds?: string[];
  activityTypes?: string[];
  excludedActivityTypes?: string[];
}
