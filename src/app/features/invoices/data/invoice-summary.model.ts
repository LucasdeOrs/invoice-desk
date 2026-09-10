/**
 * Minimal read-only shape used by week 1's dashboard and invoice list.
 *
 * The full domain model — Invoice with line items, ApprovalStep, AuditEntry —
 * lands in week 2 together with the Signal Store.
 */
export type InvoiceStatus = 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected';

export interface InvoiceSummary {
  id: string;
  number: string;
  supplier: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  /** ISO date, e.g. 2026-08-14 */
  issuedOn: string;
}
