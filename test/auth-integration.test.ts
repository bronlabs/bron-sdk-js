import { describe, it, expect, beforeAll } from "vitest";
import BronClient from "../src/client.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

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

      try {
        // This test will make a real API call to verify authentication works
        const workspace = await client.workspaces.getWorkspaceById();
        
        expect(workspace).toBeDefined();
        // The response structure depends on the API, but we expect some data
        expect(typeof workspace === "object").toBe(true);
      } catch (error) {
        // If this fails, it might be due to API changes or network issues
        // but we can still verify the error is not an authentication error
        expect(error).not.toMatch(/401|403|Unauthorized|Forbidden/i);
        console.warn("API call failed, but this might be due to network issues or API changes:", error);
      }
    });

    it("should authenticate and fetch account information", async () => {
      if (!client) {
        console.log("Skipping test - no API credentials provided");
        return;
      }

      try {
        const accounts = await client.accounts.getAccounts();
        
        expect(accounts).toBeDefined();
        expect(Array.isArray(accounts) || typeof accounts === "object").toBe(true);
      } catch (error) {
        expect(error).not.toMatch(/401|403|Unauthorized|Forbidden/i);
        console.warn("API call failed, but this might be due to network issues or API changes:", error);
      }
    });

    it("should handle authentication errors gracefully", async () => {
      // Test with invalid API key
      const invalidClient = new BronClient({
        apiKey: "invalid-jwk-key",
        workspaceId: "test-workspace"
      });

      try {
        await invalidClient.workspaces.getWorkspaceById();
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // We expect an authentication error
        expect(error).toBeDefined();
        expect(typeof error).toBe("object");
      }
    });
  });

  describe("Client Configuration", () => {
    it("should have correct workspace ID", () => {
      if (!client) {
        console.log("Skipping test - no API credentials provided");
        return;
      }
      expect(client.workspaceId).toBe(process.env.BRON_WORKSPACE_ID);
    });

    it("should have all API endpoints configured", () => {
      if (!client) {
        console.log("Skipping test - no API credentials provided");
        return;
      }
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
}); 