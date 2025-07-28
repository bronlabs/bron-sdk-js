# Bron SDK

TypeScript SDK for the Bron API with comprehensive authentication and key generation capabilities.

## Features

- 🔐 **Authentication**: JWT-based authentication with ES256 keys
- 🔑 **Key Generation**: Built-in tools for generating ES256 key pairs
- 🧪 **Testing**: Comprehensive test suite for authentication
- 📚 **Documentation**: Complete API documentation and examples

## Quick Start

### Installation

```bash
npm install @bronlabs/bron-sdk
```

### Generate API Keys

```bash
npm run generate-keys
```

This generates a new ES256 key pair and displays:
- Public JWK (send to Bron Labs)
- Private JWK (keep secure)
- Environment setup instructions

### Basic Usage

```typescript
import BronClient from '@bronlabs/bron-sdk';

const client = new BronClient({
  apiKey: process.env.BRON_API_KEY, // Your private JWK
  workspaceId: process.env.BRON_WORKSPACE_ID
});

// Use the client
const workspaces = await client.workspaces.getWorkspaceById();
const accounts = await client.accounts.getAccounts();
```

## Key Generation

### CLI Tool

```bash
# Generate new keys
npm run generate-keys

# Validate existing JWK
node generate-keys.js --validate "your-jwk-string"
```

### Programmatic Usage

```typescript
import { generateBronKeyPair } from '@bronlabs/bron-sdk/utils/keyGenerator';

const keyPair = await generateBronKeyPair();
console.log('Public JWK:', keyPair.publicJwk);
console.log('Private JWK:', keyPair.privateJwk);
console.log('Key ID:', keyPair.kid);
```

## Testing

### Run All Tests

```bash
npm test
```

### Authentication Tests

```bash
# Unit tests (no credentials needed)
npm test test/auth.test.ts

# Integration tests (requires API credentials)
BRON_API_KEY="your-jwk" BRON_WORKSPACE_ID="your-workspace" npm test test/auth-integration.test.ts
```

### Key Generator Tests

```bash
npm test test/keyGenerator.test.ts
```

## Documentation

- [Authentication Tests](./AUTHENTICATION_TESTS.md) - Comprehensive authentication testing guide
- [Key Generation](./KEY_GENERATION.md) - Complete key generation documentation

## API Reference

### BronClient

```typescript
new BronClient({
  apiKey: string;        // Your private JWK
  workspaceId: string;   // Your workspace ID
  baseUrl?: string;      // Optional, defaults to https://api.bron.org
})
```

### Available APIs

- `client.workspaces` - Workspace management
- `client.accounts` - Account operations
- `client.balances` - Balance queries
- `client.assets` - Asset information
- `client.addresses` - Address management
- `client.addressBook` - Address book operations
- `client.transactions` - Transaction operations
- `client.transactionLimits` - Transaction limit management

## Security

- 🔒 Private keys are never transmitted
- 🔐 All requests are signed with ES256 JWT
- 🛡️ Comprehensive validation of JWK format
- 🔑 Secure key generation with unique IDs

## Development

### Build

```bash
npm run build
```

### Generate API Code

```bash
npm run generate
```

### Lint

```bash
npm run lint
```

## Environment Variables

```bash
export BRON_API_KEY="your-private-jwk"
export BRON_WORKSPACE_ID="your-workspace-id"
export BRON_API_URL="https://api.bron.org"  # optional
```

## Support

For API access and support, contact Bron Labs. 