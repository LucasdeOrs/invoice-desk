import { InvoiceSummary } from './invoice-summary.model';

/** What `GET /api/invoices` returns: one page, plus enough to page further. */
export interface InvoiceListResponse {
  items: InvoiceSummary[];
  total: number;
  page: number;
  pageSize: number;
}
