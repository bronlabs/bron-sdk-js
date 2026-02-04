import { describe, it, expect, vi, beforeEach } from "vitest";
import BronClient from "../src/client.js";

const mockJwk = JSON.stringify({
  kty: "EC",
  crv: "P-256",
  x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
  y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
  d: "870MB6gfuTJ4H3UnuUpxs5SwSxH2yf5K0uR49f6OzcP",
  kid: "test-key-id"
});

describe("BronClient", () => {
  let client: BronClient;

  beforeEach(() => {
    client = new BronClient({
      apiKey: mockJwk,
      workspaceId: "test-workspace-id"
    });
  });

  describe("initialization", () => {
    it("should create client with required parameters", () => {
      expect(client).toBeDefined();
      expect(client.workspaceId).toBe("test-workspace-id");
    });

    it("should use default base URL", () => {
      const defaultClient = new BronClient({
        apiKey: mockJwk,
        workspaceId: "ws-123"
      });
      expect(defaultClient).toBeDefined();
    });

    it("should accept custom base URL", () => {
      const customClient = new BronClient({
        apiKey: mockJwk,
        workspaceId: "ws-123",
        baseUrl: "https://custom-api.example.com"
      });
      expect(customClient).toBeDefined();
    });

    it("should initialize all API modules", () => {
      expect(client.accounts).toBeDefined();
      expect(client.balances).toBeDefined();
      expect(client.transactions).toBeDefined();
      expect(client.workspaces).toBeDefined();
      expect(client.addressBook).toBeDefined();
      expect(client.assets).toBeDefined();
      expect(client.addresses).toBeDefined();
      expect(client.transactionLimits).toBeDefined();
      expect(client.intents).toBeDefined();
      expect(client.stakes).toBeDefined();
    });
  });

  describe("accounts API", () => {
    it("should call getAccounts with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ accounts: [] })
      } as Response);

      await client.accounts.getAccounts();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/accounts"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getAccounts with query parameters", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ accounts: [] })
      } as Response);

      await client.accounts.getAccounts({ limit: 10, offset: 5 });

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringMatching(/limit=10.*offset=5|offset=5.*limit=10/),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getAccountById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ accountId: "acc-123" })
      } as Response);

      await client.accounts.getAccountById("acc-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/accounts/acc-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });
  });

  describe("balances API", () => {
    it("should call getBalances with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ balances: [] })
      } as Response);

      await client.balances.getBalances();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/balances"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getBalanceById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ balanceId: "bal-123" })
      } as Response);

      await client.balances.getBalanceById("bal-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/balances/bal-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });
  });

  describe("transactions API", () => {
    it("should call getTransactions with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactions: [] })
      } as Response);

      await client.transactions.getTransactions();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/transactions"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call createTransaction with POST method and body", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactionId: "tx-123" })
      } as Response);

      const transactionData = {
        accountId: "acc-123",
        assetId: "asset-123",
        amount: "100"
      };

      await client.transactions.createTransaction(transactionData as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/transactions"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("acc-123")
        })
      );

      fetchSpy.mockRestore();
    });

    it("should call dryRunTransaction with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ valid: true })
      } as Response);

      await client.transactions.dryRunTransaction({ accountId: "acc-123" } as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/dry-run"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call approveTransaction with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactionId: "tx-123" })
      } as Response);

      await client.transactions.approveTransaction("tx-123", {} as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-123/approve"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call cancelTransaction with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactionId: "tx-123" })
      } as Response);

      await client.transactions.cancelTransaction("tx-123", {} as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-123/cancel"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getTransactionEvents with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ events: [] })
      } as Response);

      await client.transactions.getTransactionEvents("tx-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-123/events"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call createMultipleTransactions with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactions: [] })
      } as Response);

      await client.transactions.createMultipleTransactions({ transactions: [] } as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/bulk-create"),
        expect.objectContaining({ method: "POST" })
      );

      fetchSpy.mockRestore();
    });

    it("should call getTransactionById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactionId: "tx-123" })
      } as Response);

      await client.transactions.getTransactionById("tx-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call declineTransaction with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactionId: "tx-123" })
      } as Response);

      await client.transactions.declineTransaction("tx-123", {} as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-123/decline"),
        expect.objectContaining({ method: "POST" })
      );

      fetchSpy.mockRestore();
    });

    it("should call acceptDepositOffer with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactionId: "tx-123" })
      } as Response);

      await client.transactions.acceptDepositOffer("tx-123", {} as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-123/accept-deposit-offer"),
        expect.objectContaining({ method: "POST" })
      );

      fetchSpy.mockRestore();
    });

    it("should call rejectOutgoingOffer with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactionId: "tx-123" })
      } as Response);

      await client.transactions.rejectOutgoingOffer("tx-123", {} as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-123/reject-outgoing-offer"),
        expect.objectContaining({ method: "POST" })
      );

      fetchSpy.mockRestore();
    });

    it("should call createSigningRequest with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ transactionId: "tx-123" })
      } as Response);

      await client.transactions.createSigningRequest("tx-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-123/create-signing-request"),
        expect.objectContaining({ method: "POST" })
      );

      fetchSpy.mockRestore();
    });
  });

  describe("assets API", () => {
    it("should call getAssets with dictionary path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ assets: [] })
      } as Response);

      await client.assets.getAssets();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/dictionary/assets"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getNetworks with dictionary path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ networks: [] })
      } as Response);

      await client.assets.getNetworks();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/dictionary/networks"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getAssetPrices with dictionary path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ prices: {} })
      } as Response);

      await client.assets.getAssetPrices();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/dictionary/asset-market-prices"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getAssetById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ assetId: "asset-123" })
      } as Response);

      await client.assets.getAssetById("asset-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/dictionary/assets/asset-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getNetworkById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ networkId: "net-123" })
      } as Response);

      await client.assets.getNetworkById("net-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/dictionary/networks/net-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getPrices with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ prices: [] })
      } as Response);

      await client.assets.getPrices();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/dictionary/symbol-market-prices"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getSymbols with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ symbols: [] })
      } as Response);

      await client.assets.getSymbols();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/dictionary/symbols"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getSymbolById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ symbolId: "sym-123" })
      } as Response);

      await client.assets.getSymbolById("sym-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/dictionary/symbols/sym-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });
  });

  describe("workspaces API", () => {
    it("should call getWorkspaceById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ workspaceId: "test-workspace-id" })
      } as Response);

      await client.workspaces.getWorkspaceById();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getWorkspaceById with custom workspace id", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ workspaceId: "other-workspace" })
      } as Response);

      await client.workspaces.getWorkspaceById("other-workspace");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/other-workspace"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getActivities with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ activities: [] })
      } as Response);

      await client.workspaces.getActivities();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/activities"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getWorkspaceMembers with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ members: [] })
      } as Response);

      await client.workspaces.getWorkspaceMembers();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/members"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });
  });

  describe("addressBook API", () => {
    it("should call getAddressBookRecords with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ records: [] })
      } as Response);

      await client.addressBook.getAddressBookRecords();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/address-book-records"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call createAddressBookRecord with POST method", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ recordId: "rec-123" })
      } as Response);

      await client.addressBook.createAddressBookRecord({
        address: "0x123",
        name: "Test"
      } as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/address-book-records"),
        expect.objectContaining({ method: "POST" })
      );

      fetchSpy.mockRestore();
    });

    it("should call deactivateAddressBookRecord with DELETE method", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      } as Response);

      await client.addressBook.deactivateAddressBookRecord("rec-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/address-book-records/rec-123"),
        expect.objectContaining({ method: "DELETE" })
      );

      fetchSpy.mockRestore();
    });

    it("should call getAddressBookRecordById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ recordId: "rec-123" })
      } as Response);

      await client.addressBook.getAddressBookRecordById("rec-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/address-book-records/rec-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });
  });

  describe("addresses API", () => {
    it("should call getDepositAddresses with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ addresses: [] })
      } as Response);

      await client.addresses.getDepositAddresses();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/addresses"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getDepositAddresses with query parameters", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ addresses: [] })
      } as Response);

      await client.addresses.getDepositAddresses({ accountId: "acc-123" });

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("accountId=acc-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });
  });

  describe("transactionLimits API", () => {
    it("should call getTransactionLimits with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ limits: [] })
      } as Response);

      await client.transactionLimits.getTransactionLimits();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/transaction-limits"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getTransactionLimitById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ limitId: "lim-123" })
      } as Response);

      await client.transactionLimits.getTransactionLimitById("lim-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/transaction-limits/lim-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });
  });

  describe("intents API", () => {
    it("should call createIntentRequest with POST method and body", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ intentId: "int-123" })
      } as Response);

      await client.intents.createIntentRequest({ type: "swap" } as any);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/intents"),
        expect.objectContaining({
          method: "POST"
        })
      );

      fetchSpy.mockRestore();
    });

    it("should call getIntentRequestById with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ intentId: "int-123" })
      } as Response);

      await client.intents.getIntentRequestById("int-123");

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/intents/int-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });
  });

  describe("stakes API", () => {
    it("should call getStakes with correct path", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ stakes: [] })
      } as Response);

      await client.stakes.getStakes();

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/workspaces/test-workspace-id/stakes"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });

    it("should call getStakes with query parameters", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ stakes: [] })
      } as Response);

      await client.stakes.getStakes({ accountId: "acc-123" });

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("accountId=acc-123"),
        expect.any(Object)
      );

      fetchSpy.mockRestore();
    });
  });

  describe("error handling", () => {
    it("should throw error for HTTP errors", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve("Not Found")
      } as Response);

      await expect(client.accounts.getAccounts()).rejects.toThrow("HTTP 404");

      fetchSpy.mockRestore();
    });

    it("should throw error for network failures", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      await expect(client.accounts.getAccounts()).rejects.toThrow("Network error");

      fetchSpy.mockRestore();
    });
  });
});
