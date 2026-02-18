import { BalancesAPI } from "./api/balances.js";
import { WorkspacesAPI } from "./api/workspaces.js";
import { AddressBookAPI } from "./api/addressBook.js";
import { AssetsAPI } from "./api/assets.js";
import { AccountsAPI } from "./api/accounts.js";
import { AddressesAPI } from "./api/addresses.js";
import { HttpClient, type FetchFunction } from "./utils/http.js";
import { TransactionLimitsAPI } from "./api/transactionLimits.js";
import { TransactionsAPI } from "./api/transactions.js";
import { IntentsAPI } from "./api/intents.js";
import { StakeAPI } from "./api/stake.js";

export default class BronClient {
  public workspaceId: string;

  public balances: BalancesAPI;
  public workspaces: WorkspacesAPI;
  public addressBook: AddressBookAPI;
  public assets: AssetsAPI;
  public accounts: AccountsAPI;
  public addresses: AddressesAPI;
  public transactionLimits: TransactionLimitsAPI;
  public transactions: TransactionsAPI;
  public intents: IntentsAPI;
  public stakes: StakeAPI;

  constructor({
    apiKey,
    workspaceId,
    baseUrl = 'https://api.bron.org',
    fetchFn
  }: {
    apiKey: string;
    workspaceId: string;
    baseUrl?: string;
    fetchFn?: FetchFunction;
  }) {
    const http = new HttpClient(baseUrl, apiKey, fetchFn);
    this.workspaceId = workspaceId;

    this.balances = new BalancesAPI(http, workspaceId);
    this.workspaces = new WorkspacesAPI(http, workspaceId);
    this.addressBook = new AddressBookAPI(http, workspaceId);
    this.assets = new AssetsAPI(http);
    this.accounts = new AccountsAPI(http, workspaceId);
    this.addresses = new AddressesAPI(http, workspaceId);
    this.transactionLimits = new TransactionLimitsAPI(http, workspaceId);
    this.transactions = new TransactionsAPI(http, workspaceId);
    this.intents = new IntentsAPI(http, workspaceId);
    this.stakes = new StakeAPI(http, workspaceId);
  }
}
