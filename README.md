# Bron SDK

TypeScript SDK for the Bron API.

## Install

```bash
npm install @bronlabs/bron-sdk
```

## Usage Example

```sh
export BRON_API_KEY='{"kty":"EC","x":"VqW0Rzw4At***ADF2iFCzxc","y":"9AylQ7HHI0vRT0C***PqWuf2yT8","crv":"P-256","d":"DCQ0jrmYw8***9i64igNKuP0","kid":"cmdos3lj50000sayo6pl45zly"}'
export BRON_WORKSPACE_ID='htotobpkg7xqjfxenjid3n1o'
```

```typescript
import BronClient from '@bronlabs/bron-sdk';
import { randomUUID } from 'node:crypto';

const bronApi = new BronClient({
  apiKey: process.env.BRON_API_KEY, // Your private JWK
  workspaceId: process.env.BRON_WORKSPACE_ID
});

const account = await bronApi.accounts.getAccountById('iwlszmw78rpuhigqkpa9v1l6')
console.log('Account:', account.name);

const { balances } = await bronApi.balances.getBalances({
  accountIds: [account.accountId]
});

balances.forEach(balance => {
  console.log(`Balance ${balance.assetId} (${balance.symbol}):`, balance.totalBalance)
});

const tx = await bronApi.transactions.createTransaction({
  accountId: account.accountId,
  externalId: randomUUID(),
  transactionType: 'withdrawal',
  params: {
    amount: '73.042',
    assetId: '2',
    toAddress: '0x428CdE5631142916F295d7bb2DA9d1b5f49F0eF9'
  }
});

console.log(`Created transaction '${tx.transactionId}': send ${tx.params.amount}`);
``` 

## Generate API Keys (JWK)

You can generate keys to access the Bron API in JSON Web Key (JWK) format in the "Workspace -> API keys -> New API key" interface.
There you can use a JWK generated in the browser (we don't send the private key to the server),
or you can generate it yourself and send only the public part to the server (Input public key (JWK)
checkbox in the key creation form).

```bash
npm run generate-keys
```

This will output:

- Public JWK (send to Bron)
- Private JWK (keep safe)
