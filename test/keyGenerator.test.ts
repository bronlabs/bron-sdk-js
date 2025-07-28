import { describe, it, expect } from "vitest";
import { 
  generateBronKeyPair, 
  validateBronJwk, 
  extractKeyId, 
  isPrivateKey,
  type GeneratedKeyPair 
} from "../src/utils/keyGenerator.js";

describe("Key Generator", () => {
  describe("generateBronKeyPair", () => {
    it("should generate valid ES256 key pair", async () => {
      const keyPair = await generateBronKeyPair();
      
      expect(keyPair).toHaveProperty("publicJwk");
      expect(keyPair).toHaveProperty("privateJwk");
      expect(keyPair).toHaveProperty("kid");
      expect(typeof keyPair.kid).toBe("string");
      expect(keyPair.kid.length).toBeGreaterThan(0);
    });

    it("should generate different key pairs each time", async () => {
      const keyPair1 = await generateBronKeyPair();
      const keyPair2 = await generateBronKeyPair();
      
      expect(keyPair1.kid).not.toBe(keyPair2.kid);
      expect(keyPair1.publicJwk).not.toBe(keyPair2.publicJwk);
      expect(keyPair1.privateJwk).not.toBe(keyPair2.privateJwk);
    });

    it("should generate valid JWK format", async () => {
      const keyPair = await generateBronKeyPair();
      
      // Parse JWKs to check structure
      const publicJwk = JSON.parse(keyPair.publicJwk);
      const privateJwk = JSON.parse(keyPair.privateJwk);
      
      // Check public key structure
      expect(publicJwk.kty).toBe("EC");
      expect(publicJwk.crv).toBe("P-256");
      expect(publicJwk.kid).toBe(keyPair.kid);
      expect(publicJwk.x).toBeDefined();
      expect(publicJwk.y).toBeDefined();
      expect(publicJwk.d).toBeUndefined(); // Public key shouldn't have private component
      
      // Check private key structure
      expect(privateJwk.kty).toBe("EC");
      expect(privateJwk.crv).toBe("P-256");
      expect(privateJwk.kid).toBe(keyPair.kid);
      expect(privateJwk.x).toBeDefined();
      expect(privateJwk.y).toBeDefined();
      expect(privateJwk.d).toBeDefined(); // Private key should have private component
    });
  });

  describe("validateBronJwk", () => {
    it("should validate generated public JWK", async () => {
      const keyPair = await generateBronKeyPair();
      expect(validateBronJwk(keyPair.publicJwk)).toBe(true);
    });

    it("should validate generated private JWK", async () => {
      const keyPair = await generateBronKeyPair();
      expect(validateBronJwk(keyPair.privateJwk)).toBe(true);
    });

    it("should reject invalid JWK format", () => {
      expect(validateBronJwk("invalid json")).toBe(false);
      expect(validateBronJwk("{}")).toBe(false);
    });

    it("should reject wrong key type", () => {
      const invalidJwk = {
        kty: "RSA",
        crv: "P-256",
        x: "test",
        y: "test",
        kid: "test"
      };
      expect(validateBronJwk(JSON.stringify(invalidJwk))).toBe(false);
    });

    it("should reject wrong curve", () => {
      const invalidJwk = {
        kty: "EC",
        crv: "P-384",
        x: "test",
        y: "test",
        kid: "test"
      };
      expect(validateBronJwk(JSON.stringify(invalidJwk))).toBe(false);
    });

    it("should reject missing required fields", () => {
      const invalidJwk = {
        kty: "EC",
        crv: "P-256",
        x: "test"
        // Missing y and kid
      };
      expect(validateBronJwk(JSON.stringify(invalidJwk))).toBe(false);
    });
  });

  describe("extractKeyId", () => {
    it("should extract key ID from generated JWK", async () => {
      const keyPair = await generateBronKeyPair();
      expect(extractKeyId(keyPair.publicJwk)).toBe(keyPair.kid);
      expect(extractKeyId(keyPair.privateJwk)).toBe(keyPair.kid);
    });

    it("should return null for invalid JSON", () => {
      expect(extractKeyId("invalid json")).toBe(null);
    });

    it("should return null for JWK without kid", () => {
      const jwkWithoutKid = {
        kty: "EC",
        crv: "P-256",
        x: "test",
        y: "test"
      };
      expect(extractKeyId(JSON.stringify(jwkWithoutKid))).toBe(null);
    });
  });

  describe("isPrivateKey", () => {
    it("should identify private key correctly", async () => {
      const keyPair = await generateBronKeyPair();
      expect(isPrivateKey(keyPair.privateJwk)).toBe(true);
      expect(isPrivateKey(keyPair.publicJwk)).toBe(false);
    });

    it("should return false for invalid JSON", () => {
      expect(isPrivateKey("invalid json")).toBe(false);
    });

    it("should return false for public key without 'd' field", () => {
      const publicJwk = {
        kty: "EC",
        crv: "P-256",
        x: "test",
        y: "test",
        kid: "test"
      };
      expect(isPrivateKey(JSON.stringify(publicJwk))).toBe(false);
    });
  });

  describe("Integration", () => {
    it("should generate and validate complete key pair", async () => {
      const keyPair = await generateBronKeyPair();
      
      // Validate both keys
      expect(validateBronJwk(keyPair.publicJwk)).toBe(true);
      expect(validateBronJwk(keyPair.privateJwk)).toBe(true);
      
      // Check key IDs match
      expect(extractKeyId(keyPair.publicJwk)).toBe(keyPair.kid);
      expect(extractKeyId(keyPair.privateJwk)).toBe(keyPair.kid);
      
      // Check private key identification
      expect(isPrivateKey(keyPair.privateJwk)).toBe(true);
      expect(isPrivateKey(keyPair.publicJwk)).toBe(false);
      
      // Verify JWK structure
      const publicJwk = JSON.parse(keyPair.publicJwk);
      const privateJwk = JSON.parse(keyPair.privateJwk);
      
      expect(publicJwk.kty).toBe("EC");
      expect(publicJwk.crv).toBe("P-256");
      expect(privateJwk.kty).toBe("EC");
      expect(privateJwk.crv).toBe("P-256");
      expect(publicJwk.kid).toBe(privateJwk.kid);
    });
  });
}); 