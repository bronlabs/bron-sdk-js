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
      };

      expect(() => parseJwkEcPrivateKey(JSON.stringify(incompleteJwk))).toThrow("Invalid or unsupported JWK format");
    });

    it("should throw error for invalid JSON", () => {
      expect(() => parseJwkEcPrivateKey("invalid json")).toThrow();
    });

    it("should throw error for unsupported curve", () => {
      const invalidCurveJwk = {
        "kty": "EC",
        "crv": "P-384",
        "x": "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
        "y": "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
        "d": "870MB6gfuTJ4H3UnuUpxs5SwSxH2yf5K0uR49f6OzcP",
        "kid": "test-key-id"
      };

      expect(() => parseJwkEcPrivateKey(JSON.stringify(invalidCurveJwk))).toThrow("Invalid or unsupported JWK format");
    });

    it("should throw error for missing private key component", () => {
      const noPrivateKeyJwk = {
        "kty": "EC",
        "crv": "P-256",
        "x": "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
        "y": "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
        "kid": "test-key-id"
      };

      expect(() => parseJwkEcPrivateKey(JSON.stringify(noPrivateKeyJwk))).toThrow("Invalid or unsupported JWK format");
    });

    it("should throw error for invalid base64 components", () => {
      const invalidBase64Jwk = {
        "kty": "EC",
        "crv": "P-256",
        "x": "invalid-base64!!!",
        "y": "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
        "d": "870MB6gfuTJ4H3UnuUpxs5SwSxH2yf5K0uR49f6OzcP",
        "kid": "test-key-id"
      };

      expect(() => parseJwkEcPrivateKey(JSON.stringify(invalidBase64Jwk))).toThrow();
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

    it("should handle missing method", () => {
      const jwt = generateBronJwt({
        path: "/api/v1/test",
        kid: "test-key-id",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      } as any);
      expect(jwt).toBeDefined();
    });

    it("should handle missing path", () => {
      const jwt = generateBronJwt({
        method: "GET",
        kid: "test-key-id",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      } as any);
      expect(jwt).toBeDefined();
    });

    it("should handle missing kid", () => {
      const jwt = generateBronJwt({
        method: "GET",
        path: "/api/v1/test",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      } as any);
      expect(jwt).toBeDefined();
    });

    it("should throw error for invalid private key", () => {
      expect(() => generateBronJwt({
        method: "GET",
        path: "/api/v1/test",
        kid: "test-key-id",
        privateKey: "invalid-private-key"
      })).toThrow();
    });

    it("should handle different HTTP methods", () => {
      const { privateKey } = parseJwkEcPrivateKey(mockJwkString);
      const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
      
      methods.forEach(method => {
        const jwt = generateBronJwt({
          method,
          path: "/api/v1/test",
          kid: "test-key-id",
          privateKey
        });
        expect(jwt).toBeDefined();
        expect(jwt.split(".")).toHaveLength(3);
      });
    });

    it("should handle special characters in path", () => {
      const jwt = generateBronJwt({
        method: "GET",
        path: "/api/v1/test/with%20spaces/and-dashes_underscores",
        kid: "test-key-id",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      });
      expect(jwt).toBeDefined();
    });

    it("should handle large body payload", () => {
      const largePayload = JSON.stringify({ data: "x".repeat(10000) });
      const jwt = generateBronJwt({
        method: "POST",
        path: "/api/v1/test",
        body: largePayload,
        kid: "test-key-id",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      });
      expect(jwt).toBeDefined();
    });

    it("should generate different JWT for identical requests due to signature randomness", () => {
      const { privateKey } = parseJwkEcPrivateKey(mockJwkString);
      const options = {
        method: "GET",
        path: "/api/v1/test",
        kid: "test-key-id",
        privateKey
      };
      
      vi.useFakeTimers();
      const jwt1 = generateBronJwt(options);
      const jwt2 = generateBronJwt(options);
      vi.useRealTimers();
      
      expect(jwt1).not.toBe(jwt2);
      expect(jwt1.split(".")[0]).toBe(jwt2.split(".")[0]);
      expect(jwt1.split(".")[1]).toBe(jwt2.split(".")[1]);
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

    it("should handle request errors", async () => {
      const originalFetch = global.fetch;
      
      global.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          status: 401,
          statusText: "Unauthorized",
          json: () => Promise.resolve({ error: "Invalid token" })
        } as Response);
      });

      try {
        await expect(httpClient.request({
          method: "GET",
          path: "/api/v1/workspaces"
        })).rejects.toThrow();
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should handle network errors", async () => {
      const originalFetch = global.fetch;
      
      global.fetch = vi.fn().mockImplementation(() => {
        return Promise.reject(new Error("Network error"));
      });

      try {
        await expect(httpClient.request({
          method: "GET",
          path: "/api/v1/workspaces"
        })).rejects.toThrow("Network error");
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should handle different HTTP methods", async () => {
      const originalFetch = global.fetch;
      let capturedMethod: string = "";
      
      global.fetch = vi.fn().mockImplementation((url, options) => {
        capturedMethod = options.method;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        } as Response);
      });

      const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
      
      try {
        for (const method of methods) {
          await httpClient.request({
            method,
            path: "/api/v1/test"
          });
          expect(capturedMethod).toBe(method);
        }
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should handle complex query parameters", async () => {
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
          path: "/api/v1/search",
          query: {
            q: "test query with spaces",
            limit: 50,
            categories: ["crypto", "stocks"],
            include_metadata: true
          }
        });

        expect(capturedUrl).toContain("q=test+query+with+spaces");
        expect(capturedUrl).toContain("limit=50");
        expect(capturedUrl).toContain("categories=crypto%2Cstocks");
        expect(capturedUrl).toContain("include_metadata=true");
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should handle empty query parameters", async () => {
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
          query: {}
        });

        expect(capturedUrl).toBe("https://api.bron.org/api/v1/workspaces");
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should handle concurrent requests", async () => {
      const originalFetch = global.fetch;
      let requestCount = 0;
      
      global.fetch = vi.fn().mockImplementation(() => {
        requestCount++;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: requestCount })
        } as Response);
      });

      try {
        const promises = Array.from({ length: 5 }, (_, i) => 
          httpClient.request({
            method: "GET",
            path: `/api/v1/workspaces/${i}`
          })
        );

        const results = await Promise.all(promises);
        expect(results).toHaveLength(5);
        expect(requestCount).toBe(5);
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should handle large response payloads", async () => {
      const originalFetch = global.fetch;
      const largeResponse = { data: "x".repeat(50000) };
      
      global.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(largeResponse)
        } as Response);
      });

      try {
        const result = await httpClient.request({
          method: "GET",
          path: "/api/v1/large-data"
        });
        
        expect(result).toEqual(largeResponse);
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

  describe("Integration Test", () => {
    it("should perform complete authentication flow", () => {
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
      
      const parts = jwt.split(".");
      expect(parts[0]).toBeDefined();
      expect(parts[1]).toBeDefined();
      expect(parts[2]).toBeDefined();
    });

    it("should handle end-to-end request with authentication", async () => {
      const originalFetch = global.fetch;
      let capturedHeaders: Record<string, string> = {};
      let capturedUrl: string = "";
      let capturedBody: string = "";
      
      global.fetch = vi.fn().mockImplementation((url, options) => {
        capturedUrl = url;
        capturedHeaders = options.headers;
        capturedBody = options.body;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ workspaces: [] })
        } as Response);
      });

      const testHttpClient = new HttpClient("https://api.bron.org", mockJwkString);

      try {
        const result = await testHttpClient.request({
          method: "POST",
          path: "/api/v1/workspaces",
          body: { name: "Test Workspace" },
          query: { expand: true }
        });

        expect(capturedUrl).toContain("/api/v1/workspaces");
        expect(capturedUrl).toContain("expand=true");
        expect(capturedHeaders).toHaveProperty("Authorization");
        expect(capturedHeaders.Authorization).toMatch(/^ApiKey /);
        expect(capturedHeaders["Content-Type"]).toBe("application/json");
        expect(JSON.parse(capturedBody)).toEqual({ name: "Test Workspace" });
        expect(result).toEqual({ workspaces: [] });
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("should handle multiple different key IDs", () => {
      const alternativeJwk = {
        ...mockJwk,
        kid: "alternative-key"
      };
      
      const { privateKey: key1, kid: kid1 } = parseJwkEcPrivateKey(mockJwkString);
      const { privateKey: key2, kid: kid2 } = parseJwkEcPrivateKey(JSON.stringify(alternativeJwk));
      
      const jwt1 = generateBronJwt({ method: "GET", path: "/test", kid: kid1, privateKey: key1 });
      const jwt2 = generateBronJwt({ method: "GET", path: "/test", kid: kid2, privateKey: key2 });
      
      expect(jwt1).not.toBe(jwt2);
      expect(kid1).toBe("test-key-id");
      expect(kid2).toBe("alternative-key");
    });

    it("should validate JWT header structure", () => {
      const jwt = generateBronJwt({
        method: "GET",
        path: "/api/v1/test",
        kid: "test-key-id",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      });
      
      const headerB64 = jwt.split(".")[0];
      const header = JSON.parse(Buffer.from(headerB64, "base64url").toString());
      
      expect(header).toHaveProperty("alg", "ES256");
      expect(header).toHaveProperty("typ", "JWT");
      expect(header).toHaveProperty("kid", "test-key-id");
    });

    it("should validate JWT payload structure", () => {
      const jwt = generateBronJwt({
        method: "POST",
        path: "/api/v1/test",
        body: JSON.stringify({ test: "data" }),
        kid: "test-key-id",
        privateKey: parseJwkEcPrivateKey(mockJwkString).privateKey
      });
      
      const payloadB64 = jwt.split(".")[1];
      const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
      
      expect(payload).toHaveProperty("method", "POST");
      expect(payload).toHaveProperty("path", "/api/v1/test");
      expect(payload).toHaveProperty("message");
      expect(payload).toHaveProperty("iat");
      expect(payload).toHaveProperty("exp");
      expect(typeof payload.iat).toBe("number");
      expect(typeof payload.exp).toBe("number");
      expect(payload.exp).toBeGreaterThan(payload.iat);
    });
  });
}); 