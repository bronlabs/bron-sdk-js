import { AddressBookRecords } from "../types/AddressBookRecords.js";
import { CreateAddressBookRecord } from "../types/CreateAddressBookRecord.js";
import { Unit } from "../types/Unit.js";
import { AddressBookRecord } from "../types/AddressBookRecord.js";
import { HttpClient } from "../utils/http.js";
export interface AddressBookRecordsParams {
  recordIds?: string[];
  networkIds?: string[];
  addresses?: string[];
  memo?: string;
  limit?: string;
  offset?: string;
  statuses?: string[];
  workspaceId: string;
}

export interface AddressBookRecordParams {
  workspaceId: string;
  recordId: string;
}

export interface AddressBookRecordByIDParams {
  workspaceId: string;
  recordId: string;
}

export class AddressBookAPI {
  constructor(private http: HttpClient, private workspaceId?: string) {}
  async getAddressBookRecords(params: AddressBookRecordsParams): Promise<AddressBookRecords> {
    return this.http.request<AddressBookRecords>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/address-book-records`,
    query: params
  });
  }

  async createAddressBookRecord(params: CreateAddressBookRecord) {
    return this.http.request({
    method: "POST",
    path: `/workspaces/${this.workspaceId}/address-book-records`,
    body: params
  });
  }

  async deactivateAddressBookRecord(params: AddressBookRecordParams): Promise<Unit> {
    return this.http.request<Unit>({
    method: "DELETE",
    path: `/workspaces/${this.workspaceId}/address-book-records/${params.recordId}`,
    query: params
  });
  }

  async getAddressBookRecordByID(params: AddressBookRecordByIDParams): Promise<AddressBookRecord> {
    return this.http.request<AddressBookRecord>({
    method: "GET",
    path: `/workspaces/${this.workspaceId}/address-book-records/${params.recordId}`,
    query: params
  });
  }
}