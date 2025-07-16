import crypto from "crypto";
import pkg from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
const { sign } = pkg;

export interface BronJwtOptions {
  method: string;
  path: string;
  body?: string;
  kid: string;
  privateKey: string;
}

export function generateBronJwt({ method, path, body = "", kid, privateKey }: BronJwtOptions): string {
  const iat = Math.floor(Date.now() / 1000);
  const messageString = `${iat}${method.toUpperCase()}${path}${body}`;
  const hash = crypto.createHash("sha256").update(messageString).digest("hex");

  const header = { alg: "ES256", kid };
  const payload = { iat, message: hash };
  const options: SignOptions = { algorithm: "ES256", header };

  return sign(payload, privateKey, options);
}

// Helper to convert JWK (EC P-256) to PEM private key and extract kid
export function parseJwkEcPrivateKey(jwkString: string): { privateKey: string; kid: string } {
  const jwk = typeof jwkString === "string" ? JSON.parse(jwkString) : jwkString;
  if (jwk.kty !== "EC" || jwk.crv !== "P-256" || !jwk.d || !jwk.x || !jwk.y) {
    throw new Error("Invalid or unsupported JWK format");
  }
  return {
    privateKey: jwkToPem(jwk, { private: true }),
    kid: jwk.kid
  };
}
