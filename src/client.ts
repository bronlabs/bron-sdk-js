import { BalancesAPI } from "./api/balances.js";
import { WorkspaceAPI } from "./api/workspace.js";
import { AddressBookAPI } from "./api/addressBook.js";
import { AssetsAPI } from "./api/assets.js";
import { AccountsAPI } from "./api/accounts.js";
import { AddressesAPI } from "./api/addresses.js";
import { HttpClient } from "./utils/http.js";
import { TransactionLimitsAPI } from "./api/transactionLimits.js";
import { TransactionsAPI } from "./api/transactions.js";

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
}
