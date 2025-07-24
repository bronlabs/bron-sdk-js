import { Workspace } from "../types/Workspace.js";
import { HttpClient } from "../utils/http.js";

export class WorkspaceAPI {
  constructor(private http: HttpClient) {}

  async getWorkspace(workspaceId: string): Promise<Workspace> {
    return this.http.request<Workspace>({
      method: "GET",
      path: `/workspaces/${workspaceId}`
    });
  }
} 