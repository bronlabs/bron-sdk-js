import { describe, it, expect, beforeAll } from "vitest";
import BronClient from "../src/client.js";
import { config } from "dotenv";

config();

const hasCredentials = !!(process.env.BRON_API_KEY && process.env.BRON_WORKSPACE_ID);
let apiAvailable = false;
let client: BronClient | null = null;

async function checkApiAvailability(): Promise<boolean> {
  if (!hasCredentials) return false;

  try {
    const testClient = new BronClient({
      apiKey: process.env.BRON_API_KEY!,
      workspaceId: process.env.BRON_WORKSPACE_ID!,
      baseUrl: process.env.BRON_API_URL || "https://api.bron.org"
    });

    await testClient.workspaces.getWorkspaceById();
    return true;
  } catch {
    return false;
  }
}

function skipIfNoApi(): boolean {
  if (!apiAvailable) {
    console.log("Skipping - API not available");
    return true;
  }
  return false;
}

describe("Authentication Integration Tests", () => {
  beforeAll(async () => {
    if (!hasCredentials) {
      console.warn("BRON_API_KEY and BRON_WORKSPACE_ID environment variables are not set.");
      return;
    }

    apiAvailable = await checkApiAvailability();

    if (!apiAvailable) {
      console.warn("API is not available or credentials are invalid. Skipping API-dependent integration tests.");
      return;
    }

    client = new BronClient({
      apiKey: process.env.BRON_API_KEY!,
      workspaceId: process.env.BRON_WORKSPACE_ID!,
      baseUrl: process.env.BRON_API_URL || "https://api.bron.org"
    });
  }, 30000);

  describe("Real API Authentication", () => {
    it("should authenticate and fetch workspace information", async () => {
      if (skipIfNoApi()) return;

      const workspace = await client!.workspaces.getWorkspaceById();

      expect(workspace).toBeDefined();
      expect(typeof workspace === "object").toBe(true);
      expect(workspace.workspaceId === client!.workspaceId).toBe(true);
    }, 15000);

    it("should authenticate and fetch account information", async () => {
      if (skipIfNoApi()) return;

      const accounts = await client!.accounts.getAccounts();
      expect(accounts).toBeDefined();
      expect(Array.isArray(accounts) || typeof accounts === "object").toBe(true);
    }, 15000);

    it("should handle authentication errors gracefully", async () => {
      const invalidClient = new BronClient({
        apiKey: "invalid-jwk-key",
        workspaceId: "test-workspace"
      });

      await expect(invalidClient.workspaces.getWorkspaceById()).rejects.toThrow();
    });

    it("should handle missing API key", async () => {
      const clientWithoutKey = new BronClient({
        apiKey: "",
        workspaceId: process.env.BRON_WORKSPACE_ID || "test-workspace"
      });

      await expect(clientWithoutKey.workspaces.getWorkspaceById()).rejects.toThrow();
    });

    it("should handle missing workspace ID", async () => {
      const mockJwk = JSON.stringify({
        kty: "EC",
        crv: "P-256",
        x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
        y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
        d: "870MB6gfuTJ4H3UnuUpxs5SwSxH2yf5K0uR49f6OzcP",
        kid: "test-key-id"
      });

      const clientWithoutWorkspace = new BronClient({
        apiKey: mockJwk,
        workspaceId: ""
      });

      await expect(clientWithoutWorkspace.workspaces.getWorkspaceById()).rejects.toThrow();
    }, 15000);

    it("should handle malformed API key", async () => {
      const malformedClient = new BronClient({
        apiKey: "not-a-jwt-token",
        workspaceId: process.env.BRON_WORKSPACE_ID || "test-workspace"
      });

      await expect(malformedClient.workspaces.getWorkspaceById()).rejects.toThrow();
    });

    it("should handle invalid base URL", async () => {
      const mockJwk = JSON.stringify({
        kty: "EC",
        crv: "P-256",
        x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
        y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
        d: "870MB6gfuTJ4H3UnuUpxs5SwSxH2yf5K0uR49f6OzcP",
        kid: "test-key-id"
      });

      const invalidUrlClient = new BronClient({
        apiKey: mockJwk,
        workspaceId: "test-workspace",
        baseUrl: "https://invalid-domain-that-does-not-exist-12345.com"
      });

      await expect(invalidUrlClient.workspaces.getWorkspaceById()).rejects.toThrow();
    }, 15000);

    it("should maintain authentication across multiple requests", async () => {
      if (skipIfNoApi()) return;

      const [workspace, accounts] = await Promise.all([
        client!.workspaces.getWorkspaceById(),
        client!.accounts.getAccounts()
      ]);

      expect(workspace).toBeDefined();
      expect(accounts).toBeDefined();
      expect(workspace.workspaceId === client!.workspaceId).toBe(true);
    }, 30000);

    it("should handle concurrent authentication requests", async () => {
      if (skipIfNoApi()) return;

      const promises = Array.from({ length: 5 }, () =>
        client!.workspaces.getWorkspaceById()
      );

      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === "fulfilled").length;

      expect(successful).toBeGreaterThan(0);
    }, 30000);

    it("should authenticate with same API key in different clients", async () => {
      if (skipIfNoApi()) return;

      const baseUrl = process.env.BRON_API_URL || "https://api.bron.org";

      const client1 = new BronClient({
        apiKey: process.env.BRON_API_KEY!,
        workspaceId: process.env.BRON_WORKSPACE_ID!,
        baseUrl
      });

      const client2 = new BronClient({
        apiKey: process.env.BRON_API_KEY!,
        workspaceId: process.env.BRON_WORKSPACE_ID!,
        baseUrl
      });

      const [workspace1, workspace2] = await Promise.all([
        client1.workspaces.getWorkspaceById(),
        client2.workspaces.getWorkspaceById()
      ]);

      expect(workspace1).toBeDefined();
      expect(workspace2).toBeDefined();
      expect(workspace1.workspaceId).toBe(workspace2.workspaceId);
    }, 30000);
  });
});
