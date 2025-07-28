import { describe, it, expect } from "vitest";

import BronClient from "../src/client.js";

describe("BronClient", () => {
  it("should create client with API endpoints", () => {
    const client = new BronClient({ apiKey: "test-jwk", workspaceId: "workspace-123" });

    expect(client.workspaceId).toBe("workspace-123");
    expect(client.balances).toBeDefined();
    expect(client.workspaces).toBeDefined();
    expect(client.addressBook).toBeDefined();
    expect(client.assets).toBeDefined();
    expect(client.accounts).toBeDefined();
    expect(client.addresses).toBeDefined();
    expect(client.transactionLimits).toBeDefined();
    expect(client.transactions).toBeDefined();
  });
});
