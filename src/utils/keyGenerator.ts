import { generateKeyPair, exportJWK } from 'jose';
import cuid from 'cuid';

export interface GeneratedKeyPair {
  publicJwk: string;
  privateJwk: string;
  kid: string;
}

export async function generateBronKeyPair(): Promise<GeneratedKeyPair> {
  const { publicKey, privateKey } = await generateKeyPair('ES256');
  const publicJwk = await exportJWK(publicKey);
  const privateJwk = await exportJWK(privateKey);
  const kid = cuid();
  publicJwk.kid = kid;
  privateJwk.kid = kid;
  return {
    publicJwk: JSON.stringify(publicJwk, null, 2),
    privateJwk: JSON.stringify(privateJwk),
    kid
  };
}

export function validateBronJwk(jwkString: string): boolean {
  try {
    const jwk = JSON.parse(jwkString);
    return (
      jwk.kty === 'EC' &&
      jwk.crv === 'P-256' &&
      typeof jwk.x === 'string' &&
      typeof jwk.y === 'string' &&
      typeof jwk.kid === 'string' &&
      (jwk.d ? typeof jwk.d === 'string' : true)
    );
  } catch {
    return false;
  }
}

export function extractKeyId(jwkString: string): string | null {
  try {
    const jwk = JSON.parse(jwkString);
    return jwk.kid || null;
  } catch {
    return null;
  }
}

export function isPrivateKey(jwkString: string): boolean {
  try {
    const jwk = JSON.parse(jwkString);
    return typeof jwk.d === 'string';
  } catch {
    return false;
  }
}

// Minimal CLI logic
if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    if (args[0] === '--validate' && args[1]) {
      const jwk = args[1];
      console.log('Valid ES256 JWK:', validateBronJwk(jwk));
      console.log('Key ID:', extractKeyId(jwk));
      console.log('Is private key:', isPrivateKey(jwk));
      process.exit(0);
    }
    // Default: generate keys
    const keyPair = await generateBronKeyPair();
    console.log('Public JWK (send to Bron):');
    console.log(keyPair.publicJwk);
    console.log();
    console.log('Private JWK (keep safe):');
    console.log(keyPair.privateJwk);
  })();
} 
