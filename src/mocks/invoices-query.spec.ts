import type { InvoiceSummary } from '@features/invoices/data/invoice-summary.model';
import { queryInvoices } from './invoices-query';

const ROWS: InvoiceSummary[] = [
  {
    id: '1',
    number: 'INV-1',
    supplier: 'Atlas',
    amount: 300,
    currency: 'EUR',
    status: 'approved',
    issuedOn: '2026-08-01',
  },
  {
    id: '2',
    number: 'INV-2',
    supplier: 'Northwind',
    amount: 100,
    currency: 'EUR',
    status: 'pending_approval',
    issuedOn: '2026-08-03',
  },
  {
    id: '3',
    number: 'INV-3',
    supplier: 'Atlas Office',
    amount: 200,
    currency: 'EUR',
    status: 'pending_approval',
    issuedOn: '2026-07-20',
  },
  {
    id: '4',
    number: 'INV-4',
    supplier: 'Cedar Co',
    amount: 50,
    currency: 'EUR',
    status: 'rejected',
    issuedOn: '2026-08-10',
  },
];

describe('queryInvoices', () => {
  it('defaults to page 1, 10 per page, sorted by issuedOn desc', () => {
    const result = queryInvoices(ROWS, new URLSearchParams());

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.total).toBe(4);
    expect(result.items.map((i) => i.id)).toEqual(['4', '2', '1', '3']);
  });

  it('filters by status', () => {
    const result = queryInvoices(ROWS, new URLSearchParams({ status: 'pending_approval' }));

    expect(result.total).toBe(2);
    expect(result.items.map((i) => i.id).sort()).toEqual(['2', '3']);
  });

  it('filters by supplier, case-insensitively, as a substring match', () => {
    const result = queryInvoices(ROWS, new URLSearchParams({ supplier: 'atlas' }));

    expect(result.items.map((i) => i.id).sort()).toEqual(['1', '3']);
  });

  it('filters by an issued date range', () => {
    const result = queryInvoices(
      ROWS,
      new URLSearchParams({ issuedFrom: '2026-08-01', issuedTo: '2026-08-05' }),
    );

    expect(result.items.map((i) => i.id).sort()).toEqual(['1', '2']);
  });

  it('sorts by amount ascending', () => {
    const result = queryInvoices(ROWS, new URLSearchParams({ sortBy: 'amount', sortDir: 'asc' }));

    expect(result.items.map((i) => i.amount)).toEqual([50, 100, 200, 300]);
  });

  it('sorts by a text field descending', () => {
    const result = queryInvoices(
      ROWS,
      new URLSearchParams({ sortBy: 'supplier', sortDir: 'desc' }),
    );

    expect(result.items.map((i) => i.supplier)).toEqual([
      'Northwind',
      'Cedar Co',
      'Atlas Office',
      'Atlas',
    ]);
  });

  it('paginates, reporting the total of the filtered set rather than the page', () => {
    const page1 = queryInvoices(ROWS, new URLSearchParams({ pageSize: '2', page: '1' }));
    const page2 = queryInvoices(ROWS, new URLSearchParams({ pageSize: '2', page: '2' }));

    expect(page1.items).toHaveLength(2);
    expect(page2.items).toHaveLength(2);
    expect(page1.total).toBe(4);
    expect(page2.total).toBe(4);
    expect(page1.items.map((i) => i.id)).not.toEqual(page2.items.map((i) => i.id));
  });
});
