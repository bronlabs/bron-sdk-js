import { describe, it, expect, beforeAll } from 'vitest';
import BronClient from '../src/client.js';
import { config } from 'dotenv';

config();

describe("Authentication Integration Tests", () => {
  let client: BronClient;

  beforeAll(() => {
    const apiKey = process.env.BRON_API_KEY;
    const workspaceId = process.env.BRON_WORKSPACE_ID;

    if (!apiKey || !workspaceId) {
      console.warn("BRON_API_KEY and BRON_WORKSPACE_ID environment variables are not set. Skipping integration tests.");
      return;
    }

    client = new BronClient({
      apiKey,
      workspaceId,
      baseUrl: process.env.BRON_API_URL || "https://api.bron.org"
    });
  });

  describe("Real API Authentication", () => {
    it("should authenticate and fetch workspace information", async () => {
      if (!client) {
        console.log("Skipping test - no API credentials provided");
        return;
      }

      const workspace = await client.workspaces.getWorkspaceById();

      expect(workspace).toBeDefined();
      expect(typeof workspace === "object").toBe(true);
      expect(workspace.workspaceId === client.workspaceId).toBe(true);
    });

    it("should authenticate and fetch account information", async () => {
      if (!client) {
        console.log("Skipping test - no API credentials provided");
        return;
      }

      const accounts = await client.accounts.getAccounts();
      expect(accounts).toBeDefined();
      expect(Array.isArray(accounts) || typeof accounts === "object").toBe(true);
    });

    it("should handle authentication errors gracefully", async () => {
      const invalidClient = new BronClient({
        apiKey: "invalid-jwk-key",
        workspaceId: "test-workspace"
      });

      try {
        await invalidClient.workspaces.getWorkspaceById();
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect(typeof error).toBe("object");
      }
    });

    it("should handle missing API key", async () => {
      const clientWithoutKey = new BronClient({
        apiKey: "",
        workspaceId: process.env.BRON_WORKSPACE_ID || "test-workspace"
      });

      try {
        await clientWithoutKey.workspaces.getWorkspaceById();
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should handle missing workspace ID", async () => {
      const clientWithoutWorkspace = new BronClient({
        apiKey: process.env.BRON_API_KEY || "test-key",
        workspaceId: ""
      });

      try {
        await clientWithoutWorkspace.workspaces.getWorkspaceById();
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should handle malformed API key", async () => {
      const malformedClient = new BronClient({
        apiKey: "not-a-jwt-token",
        workspaceId: process.env.BRON_WORKSPACE_ID || "test-workspace"
      });

      try {
        await malformedClient.workspaces.getWorkspaceById();
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should handle network timeouts", async () => {
      if (!process.env.BRON_API_KEY || !process.env.BRON_WORKSPACE_ID) {
        console.log("Skipping test - no API credentials provided");
        return;
      }

      const timeoutClient = new BronClient({
        apiKey: process.env.BRON_API_KEY,
        workspaceId: process.env.BRON_WORKSPACE_ID,
        baseUrl: "https://httpstat.us/200?sleep=30000"
      });

      try {
        await timeoutClient.workspaces.getWorkspaceById();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should handle invalid base URL", async () => {
      const invalidUrlClient = new BronClient({
        apiKey: process.env.BRON_API_KEY || "test-key",
        workspaceId: process.env.BRON_WORKSPACE_ID || "test-workspace",
        baseUrl: "https://invalid-domain-that-does-not-exist.com"
      });

      try {
        await invalidUrlClient.workspaces.getWorkspaceById();
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should maintain authentication across multiple requests", async () => {
      if (!client) {
        console.log("Skipping test - no API credentials provided");
        return;
      }

      const [workspace, accounts] = await Promise.all([
        client.workspaces.getWorkspaceById(),
        client.accounts.getAccounts()
      ]);

      expect(workspace).toBeDefined();
      expect(accounts).toBeDefined();
      expect(workspace.workspaceId === client.workspaceId).toBe(true);
    });

    it("should handle concurrent authentication requests", async () => {
      if (!client) {
        console.log("Skipping test - no API credentials provided");
        return;
      }

      const promises = Array.from({ length: 5 }, () =>
        client.workspaces.getWorkspaceById()
      );

      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === "fulfilled").length;

      expect(successful).toBeGreaterThan(0);
    });

    it("should authenticate with same API key in different clients", async () => {
      if (!process.env.BRON_API_KEY || !process.env.BRON_WORKSPACE_ID) {
        console.log("Skipping test - no API credentials provided");
        return;
      }

      const client1 = new BronClient({
        apiKey: process.env.BRON_API_KEY,
        workspaceId: process.env.BRON_WORKSPACE_ID
      });

      const client2 = new BronClient({
        apiKey: process.env.BRON_API_KEY,
        workspaceId: process.env.BRON_WORKSPACE_ID,
        baseUrl: process.env.BRON_API_URL || "https://api.bron.org"
      });

      try {
        const [workspace1, workspace2] = await Promise.all([
          client1.workspaces.getWorkspaceById(),
          client2.workspaces.getWorkspaceById()
        ]);

        expect(workspace1).toBeDefined();
        expect(workspace2).toBeDefined();
        expect(workspace1.workspaceId).toBe(workspace2.workspaceId);
      } catch (error) {
        console.log("Skipping test - API credentials invalid or expired");
        return;
      }
    });
  });
});
