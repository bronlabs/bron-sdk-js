import type { Stakes } from "../types/Stakes.js";
import type { StakesQuery } from "../types/StakesQuery.js";
import type { HttpClient } from "../utils/http.js";

export class StakeAPI {
  constructor(
    private http: HttpClient,
    private workspaceId?: string,
  ) {}

  async getStakes(query?: StakesQuery): Promise<Stakes> {
    return this.http.request<Stakes>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/stakes`,
      query,
    });
  }
}
