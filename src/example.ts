import dotenv from "dotenv";
import BronClient from "./client.js";
import { v4 as uuidv4 } from "uuid";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";

dotenv.config();

async function main() {
  const apiKeyJwk = process.env.API_KEY;
  const workspaceId = process.env.WORKSPACE_ID || "";
  if (!apiKeyJwk) {
    throw new Error("API_KEY is not set in .env");
  }

  const client = new BronClient(apiKeyJwk, workspaceId);


  // Получить информацию о workspace
//   const workspace = await client.workspace.getWorkspaces();
//   console.log("Workspace info:", workspace);

//   // Получить адресную книгу
//   const addressBook = await client.addressBook.getRecords();
//   console.log("Address book records:", addressBook);

//   // Получить запись адресной книги по ID (пример: Metamask)
//   const recordId = "xf6xnvwuljkwln18bjzxyy4h";
//   const addressBookRecord = await client.addressBook.getRecordById(recordId);
//   console.log(`Address book record (${recordId}):`, addressBookRecord);

  // Пример удаления записи адресной книги по ID (не работает с текущим API-ключом, оставлено как пример)
  // const deleteResult = await client.addressBook.deleteRecordById(recordId);
  // console.log(`Deleted address book record (${recordId}):`, deleteResult);

  // Пример создания новой записи Duck NFT (закомментировано, чтобы не создавать дубликаты)
  // const duckData = {
  //   accountIds: [],
  //   address: "0x72E0332873E840154B56bCEbFAeeADb4EE19F69f",
  //   externalId: "ubze5blklkcjtq2hlb63em8n",
  //   memo: undefined,
  //   name: "Duck NFT",
  //   networkId: "ETH"
  // };
  // try {
  //   const created = await client.addressBook.createRecord(duckData);
  //   console.log("Created Duck NFT:", created);
  // } catch (err) {
  //   const error = err as Error;
  //   if (error.message.includes("already exists")) {
  //     console.log("Duck NFT address already exists in address book.");
  //   } else {
  //     throw err;
  //   }
  // }

  // Примеры использования Assets API
//   const assets = await client.assets.getAssets();
//   console.log(JSON.stringify(assets, null, 2));
//   console.log("Assets:", assets);

//   const networks = await client.assets.getNetworks();
//   console.log("Networks:", networks);

//   const symbols = await client.assets.getSymbols();
//   console.log("Symbols:", symbols);

//   const prices = await client.assets.getPrices();
//   console.log("Prices:", prices);

//   Примеры использования Accounts API
//   const accounts = await client.accounts.getAccounts();
//   console.log("Accounts:", accounts);

//   if (accounts.accounts && accounts.accounts.length > 0) {
//     const firstAccountId = accounts.accounts[0].accountId;
//     const account = await client.accounts.getAccountById(firstAccountId);
//     console.log(`First account by ID (${firstAccountId}):`, account);
//   }

  // Получить все балансы
//   const balances = await client.balances.getBalances();
//   console.log("All balances:", balances);

  // Пример получения депозитных адресов
//   const depositAddresses = await client.addresses.getDepositAddresses({
    // addressIds: ["rfztxmbbmn43qnnggsy569n6"],
    // networkId: "BTC",
    // statuses: ["new"],
    // limit: "10",
//   });
//   console.log("Deposit addresses:", depositAddresses);

  // Пример получения лимитов на транзакции
//   const txLimits = await client.transactionLimits.getTransactionLimits({
    // statuses: ["new"],
    // limit: "10",
//   });
//   console.log("Transaction limits:", txLimits);

  // Пример получения лимита по ID
  // const limitId = "m11gwfggyjcqyhwhjllzs8qq";
  // const txLimit = await client.transactionLimits.getTransactionLimitById(limitId);
  // console.log("Transaction limit by ID:", txLimit);

// Пример получения транзакций
// const txs = await client.transactions.getTransactions({
//   // limit: "10",
//   // transactionTypes: ["deposit"],
// });
// console.log("Transactions:", txs);

// Example: create two withdrawals in one call
const txs = [
  {
    accountId: "nlvl2t3azfeszd04jsar4fa8",
    params: {
      amount: "0.0001",
      assetId: "10002",
      networkId: "ETH",
      symbol: "ETH",
      toAddress: "0x39695a3B42aae1Fb89De54A0cef03fbC30Aa9B80"
    },
    transactionType: "withdrawal"
  },
  {
    accountId: "nlvl2t3azfeszd04jsar4fa8",
    params: {
      amount: "0.0002",
      assetId: "10002",
      networkId: "ETH",
      symbol: "ETH",
      toAddress: "0x8B64d51f745A750115c96a582822938f9b125Ec1"
    },
    transactionType: "withdrawal"
  }
];

const bulkResult = await client.createMultipleTransactions({ transactions: txs });
console.log("Bulk transaction result:", bulkResult);

// const rl = readline.createInterface({ input, output });

// const senderAccountId = (await rl.question("Enter your sender accountId: ")).trim();
// const receiverAddress = (await rl.question("Enter receiver address: ")).trim();
// const amount = (await rl.question("Enter amount to send (e.g. 0.001): ")).trim();
// const networkId = (await rl.question("Enter networkId (e.g. ETH): ")).trim();
// const symbol = (await rl.question("Enter asset symbol (e.g. ETH, USDT): ")).trim();
// const assetId = (await rl.question("Enter assetId: ")).trim();

// try {
//   const withdrawalTx = await client.transactions.createTransaction({
//     accountId: senderAccountId,
//     externalId: uuidv4(),
//     params: {
//       amount,
//       assetId,
//       networkId,
//       symbol: symbol.toUpperCase(),
//       toAddress: receiverAddress
//     },
//     transactionType: "withdrawal"
//   });
//   console.log("Created withdrawal transaction:", withdrawalTx);
// } catch (err) {
//   console.error("Error creating withdrawal transaction:", err);
// }

// await rl.close();

}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
