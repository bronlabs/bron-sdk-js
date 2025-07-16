import { BalancesAPI } from "./api/balances.js";
import { WorkspaceAPI } from "./api/workspace.js";
import { AddressBookAPI } from "./api/addressBook.js";
import { AssetsAPI } from "./api/assets.js";
import { AccountsAPI } from "./api/accounts.js";
import { AddressesAPI } from "./api/addresses.js";
import { HttpClient } from "./utils/http.js";
import { TransactionLimitsAPI } from "./api/transactionLimits.js";
import { TransactionsAPI } from "./api/transactions.js";
import { v4 as uuidv4 } from "uuid";

export default class BronClient {
  public balances: BalancesAPI;
  public workspace: WorkspaceAPI;
  public addressBook: AddressBookAPI;
  public assets: AssetsAPI;
  public accounts: AccountsAPI;
  public addresses: AddressesAPI;
  public transactionLimits: TransactionLimitsAPI;
  public transactions: TransactionsAPI;

  constructor(
    apiKeyJwk: string,
    public workspaceId: string,
    baseUrl = "https://api.bron.org"
  ) {
    const http = new HttpClient(baseUrl, apiKeyJwk);
    this.balances = new BalancesAPI(http, workspaceId);
    this.workspace = new WorkspaceAPI(http);
    this.addressBook = new AddressBookAPI(http, workspaceId);
    this.assets = new AssetsAPI(http);
    this.accounts = new AccountsAPI(http, workspaceId);
    this.addresses = new AddressesAPI(http, workspaceId);
    this.transactionLimits = new TransactionLimitsAPI(http, workspaceId);
    this.transactions = new TransactionsAPI(http, workspaceId);
  }

  /**
   * Convenience method to transfer assets by address and symbol/network.
   */
  async transfer({
    senderAddress,
    receiverAddress,
    amount,
    symbol,
    networkId
  }: {
    senderAddress: string;
    receiverAddress: string;
    amount: string;
    symbol: string;
    networkId: string;
  }) {
    // 1. Find sender accountId
    const accounts = await this.accounts.getAccounts();
    const sender = accounts.accounts.find(
      (acc) =>
        acc.extra &&
        acc.extra.networkId === networkId &&
        acc.extra.address &&
        acc.extra.address.toLowerCase() === senderAddress.toLowerCase()
    );
    if (!sender) throw new Error("Sender account not found for address: " + senderAddress);

    // 2. Find assetId
    const assets = await this.assets.getAssets();
    const asset = assets.assets.find(
      (a) => a.networkId === networkId && a.symbolId.toUpperCase() === symbol.toUpperCase()
    );
    if (!asset) throw new Error(`AssetId not found for symbol ${symbol} on network ${networkId}`);

    // 3. Create withdrawal transaction
    return this.transactions.createTransaction({
      accountId: sender.accountId,
      externalId: uuidv4(),
      params: {
        amount,
        assetId: asset.assetId,
        networkId,
        symbol: symbol.toUpperCase(),
        toAddress: receiverAddress
      },
      transactionType: "withdrawal"
    });
  }

  public async createMultipleTransactions(
    body: import("./types/transactions.js").CreateMultipleTransactionsRequest
  ) {
    return this.transactions.createMultipleTransactions(body);
  }
}
