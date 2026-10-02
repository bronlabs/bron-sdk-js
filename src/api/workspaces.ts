import type { Activities } from "../types/Activities.js";
import type { ActivitiesQuery } from "../types/ActivitiesQuery.js";
import type { Workspace } from "../types/Workspace.js";
import type { WorkspaceMembers } from "../types/WorkspaceMembers.js";
import type { WorkspaceMembersQuery } from "../types/WorkspaceMembersQuery.js";
import type { HttpClient } from "../utils/http.js";

export class WorkspacesAPI {
  constructor(
    private http: HttpClient,
    private workspaceId?: string,
  ) {}

  async getWorkspaceById(workspaceId?: string): Promise<Workspace> {
    return this.http.request<Workspace>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}`,
    });
  }

  async getActivities(query?: ActivitiesQuery): Promise<Activities> {
    return this.http.request<Activities>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/activities`,
      query,
    });
  }

  async getWorkspaceMembers(query?: WorkspaceMembersQuery): Promise<WorkspaceMembers> {
    return this.http.request<WorkspaceMembers>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/members`,
      query,
    });
  }
}
