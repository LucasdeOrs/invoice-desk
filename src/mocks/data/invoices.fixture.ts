import type { InvoiceSummary } from '@features/invoices/data/invoice-summary.model';

/**
 * Fixed set of invoices served by the mock API in week 1.
 *
 * Week 2 replaces this with a generated dataset behind server-side pagination,
 * filtering and sorting.
 */
export const INVOICES_FIXTURE: InvoiceSummary[] = [
  {
    id: 'inv-1001',
    number: 'INV-1001',
    supplier: 'Atlas Office Supplies',
    amount: 1284.5,
    currency: 'EUR',
    status: 'pending_approval',
    issuedOn: '2026-08-14',
  },
  {
    id: 'inv-1002',
    number: 'INV-1002',
    supplier: 'Northwind Logistics',
    amount: 8710.0,
    currency: 'EUR',
    status: 'pending_approval',
    issuedOn: '2026-08-19',
  },
  {
    id: 'inv-1003',
    number: 'INV-1003',
    supplier: 'Brightline Software',
    amount: 4200.0,
    currency: 'EUR',
    status: 'approved',
    issuedOn: '2026-07-30',
  },
  {
    id: 'inv-1004',
    number: 'INV-1004',
    supplier: 'Cedar & Co. Consulting',
    amount: 15750.75,
    currency: 'EUR',
    status: 'submitted',
    issuedOn: '2026-08-22',
  },
  {
    id: 'inv-1005',
    number: 'INV-1005',
    supplier: 'Atlas Office Supplies',
    amount: 342.9,
    currency: 'EUR',
    status: 'approved',
    issuedOn: '2026-08-02',
  },
  {
    id: 'inv-1006',
    number: 'INV-1006',
    supplier: 'Meridian Facilities',
    amount: 990.0,
    currency: 'EUR',
    status: 'rejected',
    issuedOn: '2026-07-25',
  },
  {
    id: 'inv-1007',
    number: 'INV-1007',
    supplier: 'Northwind Logistics',
    amount: 2560.4,
    currency: 'EUR',
    status: 'draft',
    issuedOn: '2026-08-27',
  },
];
