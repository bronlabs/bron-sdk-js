import { describe, it, expect, vi } from "vitest";
import BronClient from "./client.js";

describe("BronClient", () => {
  it("should create client with API endpoints", () => {
    const client = new BronClient("test-jwk", "workspace-123");
    
    expect(client.workspaceId).toBe("workspace-123");
    expect(client.balances).toBeDefined();
    expect(client.workspace).toBeDefined();
    expect(client.addressBook).toBeDefined();
    expect(client.assets).toBeDefined();
    expect(client.accounts).toBeDefined();
    expect(client.addresses).toBeDefined();
    expect(client.transactionLimits).toBeDefined();
    expect(client.transactions).toBeDefined();
  });
});