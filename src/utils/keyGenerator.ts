import { generateKeyPair, exportJWK } from 'jose';
import cuid from 'cuid';

export interface GeneratedKeyPair {
  publicJwk: string;
  privateJwk: string;
  kid: string;
}

/**
 * Generates a new ES256 key pair for Bron API authentication
 * 
 * @returns Promise<GeneratedKeyPair> - Object containing public and private JWKs with key ID
 * 
 * @example
 * ```typescript
 * import { generateBronKeyPair } from './utils/keyGenerator.js';
 * 
 * const keyPair = await generateBronKeyPair();
 * console.log('Public JWK (send to Bron):', keyPair.publicJwk);
 * console.log('Private JWK (keep safe):', keyPair.privateJwk);
 * console.log('Key ID:', keyPair.kid);
 * ```
 */
export async function generateBronKeyPair(): Promise<GeneratedKeyPair> {
  try {
    // Generate ES256 key pair
    const { publicKey, privateKey } = await generateKeyPair('ES256');
    
    // Export to JWK format
    const publicJwk = await exportJWK(publicKey);
    const privateJwk = await exportJWK(privateKey);
    
    // Generate unique key ID
    const kid = cuid();
    
    // Add key ID to both JWKs
    publicJwk.kid = kid;
    privateJwk.kid = kid;
    
    return {
      publicJwk: JSON.stringify(publicJwk, null, 2),
      privateJwk: JSON.stringify(privateJwk),
      kid
    };
  } catch (error) {
    throw new Error(`Failed to generate key pair: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validates if a JWK string is a valid ES256 key
 * 
 * @param jwkString - JWK string to validate
 * @returns boolean - True if valid ES256 JWK
 * 
 * @example
 * ```typescript
 * import { validateBronJwk } from './utils/keyGenerator.js';
 * 
 * const isValid = validateBronJwk(jwkString);
 * if (isValid) {
 *   console.log('Valid ES256 JWK');
 * }
 * ```
 */
export function validateBronJwk(jwkString: string): boolean {
  try {
    const jwk = JSON.parse(jwkString);
    
    // Check required fields for ES256
    return (
      jwk.kty === 'EC' &&
      jwk.crv === 'P-256' &&
      typeof jwk.x === 'string' &&
      typeof jwk.y === 'string' &&
      typeof jwk.kid === 'string' &&
      // Private key should have 'd' field
      (jwk.d ? typeof jwk.d === 'string' : true)
    );
  } catch {
    return false;
  }
}

/**
 * Extracts key ID from a JWK string
 * 
 * @param jwkString - JWK string
 * @returns string | null - Key ID or null if not found
 * 
 * @example
 * ```typescript
 * import { extractKeyId } from './utils/keyGenerator.js';
 * 
 * const kid = extractKeyId(jwkString);
 * if (kid) {
 *   console.log('Key ID:', kid);
 * }
 * ```
 */
export function extractKeyId(jwkString: string): string | null {
  try {
    const jwk = JSON.parse(jwkString);
    return jwk.kid || null;
  } catch {
    return null;
  }
}

/**
 * Checks if a JWK is a private key (contains 'd' field)
 * 
 * @param jwkString - JWK string to check
 * @returns boolean - True if private key
 * 
 * @example
 * ```typescript
 * import { isPrivateKey } from './utils/keyGenerator.js';
 * 
 * if (isPrivateKey(jwkString)) {
 *   console.log('This is a private key - keep it safe!');
 * }
 * ```
 */
export function isPrivateKey(jwkString: string): boolean {
  try {
    const jwk = JSON.parse(jwkString);
    return typeof jwk.d === 'string';
  } catch {
    return false;
  }
} 