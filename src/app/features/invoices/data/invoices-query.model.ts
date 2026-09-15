import { InvoiceStatus } from './invoice.model';

export type InvoiceSortField = 'number' | 'supplier' | 'amount' | 'issuedOn';
export type SortDirection = 'asc' | 'desc';

/** 'all' means no status filter is applied. */
export type InvoiceStatusFilter = InvoiceStatus | 'all';

/**
 * Everything the server needs to return one page of the invoice list.
 * Owned by the store; sent to the API as query params on every change.
 */
export interface InvoicesQuery {
  page: number;
  pageSize: number;
  status: InvoiceStatusFilter;
  supplier: string;
  issuedFrom: string | null;
  issuedTo: string | null;
  sortBy: InvoiceSortField;
  sortDir: SortDirection;
}

export const DEFAULT_INVOICES_QUERY: InvoicesQuery = {
  page: 1,
  pageSize: 10,
  status: 'all',
  supplier: '',
  issuedFrom: null,
  issuedTo: null,
  sortBy: 'issuedOn',
  sortDir: 'desc',
};
