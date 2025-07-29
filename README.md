# Bron SDK

TypeScript SDK for the Bron API.

## Install

```bash
npm install @bronlabs/bron-sdk
```

## Generate API Keys

```bash
npm run generate-keys
```

This will output:
- Public JWK (send to Bron)
- Private JWK (keep safe)

To validate a JWK:
```bash
npm run generate-keys -- --validate '{"kty":"EC",...}'
```

## Usage Example

```typescript
import BronClient from '@bronlabs/bron-sdk';

const client = new BronClient({
  apiKey: process.env.BRON_API_KEY, // Your private JWK
  workspaceId: process.env.BRON_WORKSPACE_ID
});

const workspace = await client.workspaces.getWorkspaceById();
console.log('Workspace:', workspace.name);
``` 
