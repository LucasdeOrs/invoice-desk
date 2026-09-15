import type { InvoiceListResponse } from '@features/invoices/data/invoice-list-response.model';
import type { InvoiceSummary } from '@features/invoices/data/invoice-summary.model';
import type {
  InvoiceSortField,
  InvoiceStatusFilter,
  SortDirection,
} from '@features/invoices/data/invoices-query.model';

/**
 * Applies status/supplier/date filtering, sorting and pagination to a set of
 * invoices — the logic behind `GET /api/invoices`.
 *
 * Kept as a plain function, separate from the MSW handler, so it can be unit
 * tested without going through a network layer at all.
 */
export function queryInvoices(
  source: readonly InvoiceSummary[],
  params: URLSearchParams,
): InvoiceListResponse {
  const page = Math.max(1, toInt(params.get('page'), 1));
  const pageSize = clamp(toInt(params.get('pageSize'), 10), 1, 100);
  const status = (params.get('status') ?? 'all') as InvoiceStatusFilter;
  const supplier = (params.get('supplier') ?? '').trim().toLowerCase();
  const issuedFrom = params.get('issuedFrom');
  const issuedTo = params.get('issuedTo');
  const sortBy = (params.get('sortBy') ?? 'issuedOn') as InvoiceSortField;
  const sortDir = (params.get('sortDir') ?? 'desc') as SortDirection;

  let rows = source.slice();

  if (status !== 'all') {
    rows = rows.filter((invoice) => invoice.status === status);
  }
  if (supplier) {
    rows = rows.filter((invoice) => invoice.supplier.toLowerCase().includes(supplier));
  }
  if (issuedFrom) {
    rows = rows.filter((invoice) => invoice.issuedOn >= issuedFrom);
  }
  if (issuedTo) {
    rows = rows.filter((invoice) => invoice.issuedOn <= issuedTo);
  }

  rows.sort((a, b) => sortInvoices(a, b, sortBy, sortDir));

  const total = rows.length;
  const start = (page - 1) * pageSize;

  return { items: rows.slice(start, start + pageSize), total, page, pageSize };
}

function sortInvoices(
  a: InvoiceSummary,
  b: InvoiceSummary,
  sortBy: InvoiceSortField,
  sortDir: SortDirection,
): number {
  const direction = sortDir === 'asc' ? 1 : -1;
  if (sortBy === 'amount') {
    return (a.amount - b.amount) * direction;
  }
  return a[sortBy].localeCompare(b[sortBy]) * direction;
}

function toInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return value !== null && Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
