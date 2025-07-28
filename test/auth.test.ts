import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateBronJwt, parseJwkEcPrivateKey, type BronJwtOptions } from "../src/utils/auth.js";
import { HttpClient } from "../src/utils/http.js";

// Mock JWK for testing (EC P-256 private key)
const mockJwk = {
  "kty": "EC",
  "crv": "P-256",
  "x": "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
  "y": "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
  "d": "870MB6gfuTJ4H3UnuUpxs5SwSxH2yf5K0uR49f6OzcP",
  "kid": "test-key-id"
};

const mockJwkString = JSON.stringify(mockJwk);

describe("Authentication", () => {
  describe("JWK Parsing", () => {
    it("should parse valid EC P-256 JWK", () => {
      const result = parseJwkEcPrivateKey(mockJwkString);
      
      expect(result).toHaveProperty("privateKey");
      expect(result).toHaveProperty("kid");
      expect(result.kid).toBe("test-key-id");
      expect(result.privateKey).toContain("-----BEGIN PRIVATE KEY-----");
      expect(result.privateKey).toContain("-----END PRIVATE KEY-----");
    });

    it("should throw error for invalid JWK format", () => {
      const invalidJwk = {
        "kty": "RSA", // Wrong key type
        "crv": "P-256",
        "x": "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
        "y": "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
        "d": "870MB6gfuTJ4H3UnuUpxs5SwSxH2yf5K0uR49f6OzcP",
        "kid": "test-key-id"
      };

      expect(() => parseJwkEcPrivateKey(JSON.stringify(invalidJwk))).toThrow("Invalid or unsupported JWK format");
    });

    it("should throw error for missing required fields", () => {
      const incompleteJwk = {
        "kty": "EC",
        "crv": "P-256",
        "x": "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
        // Missing y, d, and kid
      };

      expect(() => parseJwkEcPrivateKey(JSON.stringify(incompleteJwk))).toThrow("Invalid or unsupported JWK format");
    });
  });

  describe("JWT Generation", () => {
    it("should generate valid JWT with all required fields", () => {
      const options: BronJwtOptions = {
        method: "GET",
        path: "/api/v1/workspaces",
        kid: "test-key-id",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      };

      const jwt = generateBronJwt(options);
      
      expect(jwt).toBeDefined();
      expect(typeof jwt).toBe("string");
      expect(jwt.split(".")).toHaveLength(3); // JWT has 3 parts: header.payload.signature
    });

    it("should generate different JWTs for different requests", () => {
      const { privateKey } = parseJwkEcPrivateKey(mockJwkString);
      
      const jwt1 = generateBronJwt({
        method: "GET",
        path: "/api/v1/workspaces",
        kid: "test-key-id",
        privateKey
      });

      const jwt2 = generateBronJwt({
        method: "POST",
        path: "/api/v1/transactions",
        body: JSON.stringify({ amount: "100" }),
        kid: "test-key-id",
        privateKey
      });

      expect(jwt1).not.toBe(jwt2);
    });

    it("should handle empty body correctly", () => {
      const options: BronJwtOptions = {
        method: "GET",
        path: "/api/v1/workspaces",
        body: "",
        kid: "test-key-id",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      };

      const jwt = generateBronJwt(options);
      expect(jwt).toBeDefined();
    });

    it("should handle JSON body correctly", () => {
      const body = JSON.stringify({ test: "data" });
      const options: BronJwtOptions = {
        method: "POST",
        path: "/api/v1/test",
        body,
        kid: "test-key-id",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      };

      const jwt = generateBronJwt(options);
      expect(jwt).toBeDefined();
    });
  });

  describe("HttpClient Authentication", () => {
    let httpClient: HttpClient;

    beforeEach(() => {
      httpClient = new HttpClient("https://api.bron.org", mockJwkString);
    });

    it("should create HttpClient with JWK", () => {
      expect(httpClient).toBeDefined();
    });

    it("should generate Authorization header with JWT", async () => {
      // Mock fetch to capture the request
      const originalFetch = global.fetch;
      let capturedHeaders: Record<string, string> = {};
      
      global.fetch = vi.fn().mockImplementation((url, options) => {
        capturedHeaders = options.headers;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        } as Response);
      });

      try {
        await httpClient.request({
          method: "GET",
          path: "/api/v1/workspaces"
        });

        expect(capturedHeaders).toHaveProperty("Authorization");
        expect(capturedHeaders.Authorization).toMatch(/^ApiKey /);
        expect(capturedHeaders.Authorization.split(" ")[1]).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should include Content-Type header for requests with body", async () => {
      const originalFetch = global.fetch;
      let capturedHeaders: Record<string, string> = {};
      
      global.fetch = vi.fn().mockImplementation((url, options) => {
        capturedHeaders = options.headers;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        } as Response);
      });

      try {
        await httpClient.request({
          method: "POST",
          path: "/api/v1/test",
          body: { test: "data" }
        });

        expect(capturedHeaders).toHaveProperty("Content-Type");
        expect(capturedHeaders["Content-Type"]).toBe("application/json");
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should handle query parameters correctly", async () => {
      const originalFetch = global.fetch;
      let capturedUrl: string = "";
      
      global.fetch = vi.fn().mockImplementation((url, options) => {
        capturedUrl = url;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        } as Response);
      });

      try {
        await httpClient.request({
          method: "GET",
          path: "/api/v1/workspaces",
          query: { limit: 10, offset: 0 }
        });

        expect(capturedUrl).toContain("limit=10");
        expect(capturedUrl).toContain("offset=0");
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should handle array query parameters correctly", async () => {
      const originalFetch = global.fetch;
      let capturedUrl: string = "";
      
      global.fetch = vi.fn().mockImplementation((url, options) => {
        capturedUrl = url;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        } as Response);
      });

      try {
        await httpClient.request({
          method: "GET",
          path: "/api/v1/assets",
          query: { symbols: ["BTC", "ETH"] }
        });

        expect(capturedUrl).toContain("symbols=BTC%2CETH");
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

  describe("Integration Test", () => {
    it("should perform complete authentication flow", () => {
      // Test the complete flow from JWK to JWT generation
      const { privateKey, kid } = parseJwkEcPrivateKey(mockJwkString);
      
      expect(privateKey).toBeDefined();
      expect(kid).toBe("test-key-id");
      
      const jwt = generateBronJwt({
        method: "GET",
        path: "/api/v1/workspaces",
        kid,
        privateKey
      });
      
      expect(jwt).toBeDefined();
      expect(jwt.split(".")).toHaveLength(3);
      
      // Verify JWT structure (basic validation)
      const parts = jwt.split(".");
      expect(parts[0]).toBeDefined(); // Header
      expect(parts[1]).toBeDefined(); // Payload
      expect(parts[2]).toBeDefined(); // Signature
    });
  });
}); 