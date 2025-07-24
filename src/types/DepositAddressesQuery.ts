export interface DepositAddressesQuery {
  addressIds?: string[];
  externalId?: string;
  accountTypes?: string[];
  networkId?: string;
  address?: string;
  statuses?: string[];
  sortDirection?: string;
  limit?: string;
  offset?: string;
}
