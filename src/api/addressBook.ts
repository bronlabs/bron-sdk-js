import { AddressBookRecords } from "../types/AddressBookRecords.js";
import { AddressBookRecordsQuery } from "../types/AddressBookRecordsQuery.js";
import { CreateAddressBookRecord } from "../types/CreateAddressBookRecord.js";
import { Unit } from "../types/Unit.js";
import { AddressBookRecord } from "../types/AddressBookRecord.js";
import { HttpClient } from "../utils/http.js";

export class AddressBookAPI {

  constructor(private http: HttpClient, private workspaceId?: string) {}

  async getAddressBookRecords(workspaceId?: string): Promise<AddressBookRecords> {
    return this.http.request<AddressBookRecords>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/address-book-records`
    });
  }

  async createAddressBookRecord(body: CreateAddressBookRecord, workspaceId?: string) {
    return this.http.request({
      method: "POST",
      path: `/workspaces/${workspaceId || this.workspaceId}/address-book-records`,
      body
    });
  }

  async deactivateAddressBookRecord(recordId: string, workspaceId?: string): Promise<Unit> {
    return this.http.request<Unit>({
      method: "DELETE",
      path: `/workspaces/${workspaceId || this.workspaceId}/address-book-records/${recordId}`
    });
  }

  async getAddressBookRecordById(recordId: string, workspaceId?: string): Promise<AddressBookRecord> {
    return this.http.request<AddressBookRecord>({
      method: "GET",
      path: `/workspaces/${workspaceId || this.workspaceId}/address-book-records/${recordId}`
    });
  }
}