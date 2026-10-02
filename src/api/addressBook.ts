import type { AddressBookRecord } from "../types/AddressBookRecord.js";
import type { AddressBookRecords } from "../types/AddressBookRecords.js";
import type { AddressBookRecordsQuery } from "../types/AddressBookRecordsQuery.js";
import type { CreateAddressBookRecord } from "../types/CreateAddressBookRecord.js";
import type { Unit } from "../types/Unit.js";
import type { HttpClient } from "../utils/http.js";

export class AddressBookAPI {
  constructor(
    private http: HttpClient,
    private workspaceId?: string,
  ) {}

  async getAddressBookRecords(query?: AddressBookRecordsQuery): Promise<AddressBookRecords> {
    return this.http.request<AddressBookRecords>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/address-book-records`,
      query,
    });
  }

  async createAddressBookRecord(body: CreateAddressBookRecord): Promise<AddressBookRecord> {
    return this.http.request<AddressBookRecord>({
      method: "POST",
      path: `/workspaces/${this.workspaceId}/address-book-records`,
      body,
    });
  }

  async deactivateAddressBookRecord(recordId: string): Promise<Unit> {
    return this.http.request<Unit>({
      method: "DELETE",
      path: `/workspaces/${this.workspaceId}/address-book-records/${recordId}`,
    });
  }

  async getAddressBookRecordById(recordId: string): Promise<AddressBookRecord> {
    return this.http.request<AddressBookRecord>({
      method: "GET",
      path: `/workspaces/${this.workspaceId}/address-book-records/${recordId}`,
    });
  }
}
