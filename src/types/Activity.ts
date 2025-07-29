import { ActivityType } from './ActivityType.js';

export interface Activity {
  accountId?: string;
  activityId: string;
  activityType: ActivityType;
  createdAt: string;
  description?: string;
  title: string;
  userId?: string;
  workspaceId?: string;
}
