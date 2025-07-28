import { Workspace } from "../types/Workspace.js";
import { WorkspaceByIDQuery } from "../types/WorkspaceByIDQuery.js";
import { Activities } from "../types/Activities.js";
import { ActivitiesQuery } from "../types/ActivitiesQuery.js";
import { WorkspaceMembers } from "../types/WorkspaceMembers.js";
import { WorkspaceMembersQuery } from "../types/WorkspaceMembersQuery.js";
import { HttpClient } from "../utils/http.js";

export class WorkspacesAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getWorkspaceById(workspaceId?: string): Promise<Workspace> {
    return this.http.request<Workspace>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}`
    });
  }

  async getActivities(workspaceId?: string): Promise<Activities> {
    return this.http.request<Activities>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/activities`
    });
  }

  async getWorkspaceMembers(workspaceId?: string): Promise<WorkspaceMembers> {
    return this.http.request<WorkspaceMembers>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/members`
    });
  }
}