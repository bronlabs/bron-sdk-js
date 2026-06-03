import { CantonLedgerQueryResult } from "../types/CantonLedgerQueryResult.js";
import { CantonLedgerQuery } from "../types/CantonLedgerQuery.js";
import { HttpClient } from "../utils/http.js";

export class CantonAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async cantonLedgerAPIPassthrough(body: CantonLedgerQuery): Promise<CantonLedgerQueryResult> {
    return this.http.request<CantonLedgerQueryResult>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/canton/ledger-query`,
      body
    });
  }
}