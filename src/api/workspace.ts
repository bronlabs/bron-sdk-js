import { Workspace, Workspaces } from "../types/workspace.js";
import { HttpClient } from "../utils/http.js";

export class WorkspaceAPI {
  constructor(private http: HttpClient) {}

  async getWorkspaces(): Promise<Workspaces> {
    return this.http.request<Workspaces>({
      method: "GET",
      path: `/workspaces`
    });
  }

  async getWorkspace(workspaceId: string): Promise<Workspace> {
    return this.http.request<Workspace>({
      method: "GET",
      path: `/workspaces/${workspaceId}`
    });
  }
} 