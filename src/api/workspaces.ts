import { Workspace } from "../types/Workspace.js";
import { Activities } from "../types/Activities.js";
import { WorkspaceMembers } from "../types/WorkspaceMembers.js";
import { HttpClient } from "../utils/http.js";
export interface WorkspaceByIDParams {
  workspaceIds?: string[];
  limit?: string;
  offset?: string;
  workspaceId: string;
}

export interface ActivitiesParams {
  accountIds?: string[];
  offset?: string;
  limit?: string;
  search?: string;
  userIds?: string[];
  activityTypes?: string[];
  excludedActivityTypes?: string[];
  workspaceId: string;
}

export interface WorkspaceMembersParams {
  includePermissionGroups?: boolean;
  includeUsersProfiles?: boolean;
  includeEmails?: boolean;
  workspaceId: string;
}

export class WorkspacesAPI {
  constructor(private http: HttpClient, private workspaceId?: string) {}
  async getWorkspaceByID(params: WorkspaceByIDParams): Promise<Workspace> {
    return this.http.request<Workspace>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}`,
    query: params
  });
  }

  async getActivities(params: ActivitiesParams): Promise<Activities> {
    return this.http.request<Activities>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/activities`,
    query: params
  });
  }

  async getWorkspaceMembers(params: WorkspaceMembersParams): Promise<WorkspaceMembers> {
    return this.http.request<WorkspaceMembers>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/members`,
    query: params
  });
  }
}