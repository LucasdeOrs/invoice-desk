import { Invoice } from './invoice.model';

/** The row shape returned by the invoice list endpoint — no line items. */
export type InvoiceSummary = Pick<
  Invoice,
  'id' | 'number' | 'supplier' | 'amount' | 'currency' | 'status' | 'issuedOn'
>;
