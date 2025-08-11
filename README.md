# Bron SDK

TypeScript SDK for the Bron API.

## Features

- **Complete API Coverage**: All Bron API endpoints are supported
- **JWT Authentication**: Automatic JWT generation for API requests
- **Key Generation**: Built-in JWK key pair generation
- **Type Safety**: Full TypeScript support with type definitions
- **Code Generation**: Automatic code generation from OpenAPI spec
- **Testing**: Comprehensive test suite

## Install

```bash
npm install @bronlabs/bron-sdk
```

## Generate API Keys

```bash
npm run generate-keys
```

This will output:
- **Public JWK** (send to Bron)
- **Private JWK** (keep safe)

## Usage Example

```sh
export BRON_API_KEY='{"kty":"EC","x":"VqW0Rzw4At***ADF2iFCzxc","y":"9AylQ7HHI0vRT0C***PqWuf2yT8","crv":"P-256","d":"DCQ0jrmYw8***9i64igNKuP0","kid":"cmdos3lj50000sayo6pl45zly"}'
export BRON_WORKSPACE_ID='htotobpkg7xqjfxenjid3n1o'
```

```typescript
import BronClient from '@bronlabs/bron-sdk';
import { randomUUID } from 'node:crypto';

const client = new BronClient({
  apiKey: process.env.BRON_API_KEY, // Your private JWK
  workspaceId: process.env.BRON_WORKSPACE_ID
});

// Get workspace
const workspace = await client.workspaces.getWorkspaceById();
console.log('Workspace:', workspace.name);

// Get accounts
const { accounts } = await client.accounts.getAccounts();

// Get balances for first account
if (accounts.length > 0) {
  const account = accounts[0];
  const { balances } = await client.balances.getBalances({
    accountIds: [account.accountId]
  });

  balances.forEach(balance => {
    console.log(`Balance ${balance.assetId} (${balance.symbol}):`, balance.totalBalance)
  });

  // Create transaction
  const tx = await client.transactions.createTransaction({
    accountId: account.accountId,
    externalId: randomUUID(),
    transactionType: 'withdrawal',
    params: {
      amount: '0.001',
      assetId: '2',
      symbol: 'ETH',
      networkId: 'ETH',
      toAddress: '0x428CdE5631142916F295d7bb2DA9d1b5f49F0eF9'
    }
  });

  console.log(`Created transaction '${tx.transactionId}': send ${tx.params.amount}`);
}
```

## Configuration

The SDK supports the following configuration options:

- `apiKey`: Your private JWK (required)
- `workspaceId`: Your workspace ID (required)
- `baseUrl`: API base URL (defaults to https://api.bron.org)

## Authentication

The SDK automatically handles JWT generation for API requests. You only need to provide your private JWK as the API key.

## Error Handling

All API methods return promises that should be handled:

```typescript
try {
  const accounts = await client.accounts.getAccounts();
  console.log('Accounts:', accounts);
} catch (error) {
  console.error('API error:', error);
}
```

## License

MIT License - see LICENSE file for details. 
