import { generateKeyPairSync } from 'crypto';
import cuid from 'cuid';

const { publicKey, privateKey } = generateKeyPairSync('ec' as any, {
  namedCurve: 'prime256v1',
  publicKeyEncoding: { type: 'spki', format: 'jwk' },
  privateKeyEncoding: { type: 'pkcs8', format: 'jwk' }
}) as { publicKey: any; privateKey: any };

const kid = cuid();
publicKey.kid = kid;
privateKey.kid = kid;

console.log('\n-------------------------------------\n');

console.log('✅ Public JWK (send to Bron):\n');
console.log(JSON.stringify(publicKey, null, 2));

console.log('\n-------------------------------------\n');

console.log('🔒 Private JWK (keep safe):\n');
console.log(JSON.stringify(privateKey));

console.log('\n-------------------------------------\n');
