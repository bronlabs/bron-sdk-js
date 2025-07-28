# Key Generation

This SDK includes utilities for generating ES256 key pairs for Bron API authentication.

## Quick Start

### Generate Keys via CLI

```bash
npm run generate-keys
```

This will generate a new ES256 key pair and display:
- Public JWK (send to Bron Labs)
- Private JWK (keep secure)
- Key ID
- Environment setup instructions

### Generate Keys Programmatically

```typescript
import { generateBronKeyPair } from './src/utils/keyGenerator.js';

const keyPair = await generateBronKeyPair();
console.log('Public JWK:', keyPair.publicJwk);
console.log('Private JWK:', keyPair.privateJwk);
console.log('Key ID:', keyPair.kid);
```

## API Reference

### `generateBronKeyPair()`

Generates a new ES256 key pair for Bron API authentication.

**Returns:** `Promise<GeneratedKeyPair>`

```typescript
interface GeneratedKeyPair {
  publicJwk: string;   // JSON string of public key
  privateJwk: string;  // JSON string of private key
  kid: string;         // Unique key identifier
}
```

**Example:**
```typescript
const keyPair = await generateBronKeyPair();
// Send keyPair.publicJwk to Bron Labs
// Use keyPair.privateJwk as BRON_API_KEY
```

### `validateBronJwk(jwkString: string)`

Validates if a JWK string is a valid ES256 key.

**Parameters:**
- `jwkString` - JWK string to validate

**Returns:** `boolean`

**Example:**
```typescript
const isValid = validateBronJwk(jwkString);
if (isValid) {
  console.log('Valid ES256 JWK');
}
```

### `extractKeyId(jwkString: string)`

Extracts the key ID from a JWK string.

**Parameters:**
- `jwkString` - JWK string

**Returns:** `string | null`

**Example:**
```typescript
const kid = extractKeyId(jwkString);
if (kid) {
  console.log('Key ID:', kid);
}
```

### `isPrivateKey(jwkString: string)`

Checks if a JWK is a private key (contains 'd' field).

**Parameters:**
- `jwkString` - JWK string to check

**Returns:** `boolean`

**Example:**
```typescript
if (isPrivateKey(jwkString)) {
  console.log('This is a private key - keep it safe!');
}
```

## CLI Usage

### Generate New Keys

```bash
node generate-keys.js
```

### Validate Existing JWK

```bash
node generate-keys.js --validate "your-jwk-string"
```

### Show Help

```bash
node generate-keys.js --help
```

## Key Format

The generated keys follow the ES256 (ECDSA with P-256 curve) specification:

### Public Key Structure
```json
{
  "kty": "EC",
  "crv": "P-256",
  "x": "base64url-encoded-x-coordinate",
  "y": "base64url-encoded-y-coordinate",
  "kid": "unique-key-identifier"
}
```

### Private Key Structure
```json
{
  "kty": "EC",
  "crv": "P-256",
  "x": "base64url-encoded-x-coordinate",
  "y": "base64url-encoded-y-coordinate",
  "d": "base64url-encoded-private-component",
  "kid": "unique-key-identifier"
}
```

## Security Best Practices

1. **Keep Private Keys Secure**
   - Never share your private JWK
   - Store it securely (environment variables, secure vaults)
   - Don't commit private keys to version control

2. **Key Rotation**
   - Generate new keys periodically
   - Update your API credentials with Bron Labs
   - Keep old keys for a transition period

3. **Environment Variables**
   ```bash
   export BRON_API_KEY='your-private-jwk'
   export BRON_WORKSPACE_ID="your-workspace-id"
   ```

4. **Validation**
   - Always validate JWKs before use
   - Check key format and structure
   - Verify key IDs match

## Testing

Run the key generator tests:

```bash
npm test test/keyGenerator.test.ts
```

## Dependencies

The key generator requires these packages:
- `jose` - For cryptographic operations
- `cuid` - For generating unique key IDs

These are automatically installed when you run `npm install`.

## Troubleshooting

### Common Issues

1. **"Cannot find module 'jose'"**
   - Run `npm install` to install dependencies

2. **"Invalid key format"**
   - Ensure you're using ES256 keys
   - Check that the JWK has all required fields

3. **"Key ID mismatch"**
   - Verify that public and private keys have the same `kid`
   - Regenerate keys if needed

### Getting Help

- Check the test files for usage examples
- Run `node generate-keys.js --help` for CLI options
- Review the authentication tests for integration examples 