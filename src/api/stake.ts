import { Stakes } from "../types/Stakes.js";
import { StakesQuery } from "../types/StakesQuery.js";
import { HttpClient } from "../utils/http.js";

export class StakeAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getStakes(query?: StakesQuery): Promise<Stakes> {
    return this.http.request<Stakes>({
      method: "GET",
      path: `/stakes/`,
      query
    });
  }
}