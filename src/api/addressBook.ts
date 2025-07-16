import { AddressBookRecordsResponse, AddressBookRecord } from "../types/addressBook.js";
import { HttpClient } from "../utils/http.js";

export interface GetAddressBookRecordsParams {
  recordIds?: string[];
  networkIds?: string[];
  addresses?: string[];
  memo?: string;
  limit?: string;
  offset?: string;
  statuses?: string[];
}

export interface CreateAddressBookRecordRequest {
  accountIds: string[];
  address: string;
  externalId: string;
  memo?: string;
  name: string;
  networkId: string;
}

function toQuery(params: GetAddressBookRecordsParams): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query[key] = Array.isArray(value) ? value : String(value);
    }
  }
  return query;
}

export class AddressBookAPI {
  constructor(
    private http: HttpClient,
    private workspaceId: string
  ) {}

  async getRecords(params: GetAddressBookRecordsParams = {}): Promise<AddressBookRecordsResponse> {
    return this.http.request<AddressBookRecordsResponse>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/address-book-records`,
      query: toQuery(params)
    });
  }

  async getRecordById(recordId: string): Promise<AddressBookRecord> {
    return this.http.request<AddressBookRecord>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/address-book-records/${recordId}`
    });
  }

  async deleteRecordById(recordId: string): Promise<{}> {
    return this.http.request<{}>({
      method: "DELETE",
      path: `/workspaces/${this.workspaceId}/address-book-records/${recordId}`
    });
  }

  async createRecord(data: CreateAddressBookRecordRequest): Promise<AddressBookRecord> {
    return this.http.request<AddressBookRecord>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/address-book-records`,
      body: data
    });
  }
} 