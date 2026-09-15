/** Where an invoice sits in the draft → approval lifecycle. */
export const INVOICE_STATUSES = [
  'draft',
  'submitted',
  'pending_approval',
  'approved',
  'rejected',
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  pending_approval: 'Pending approval',
  approved: 'Approved',
  rejected: 'Rejected',
};

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

/**
 * The full invoice record. The list endpoint returns the lighter
 * {@link InvoiceSummary} shape — line items and audit metadata are fetched
 * with the invoice on its own when the detail view lands in week 3.
 */
export interface Invoice {
  id: string;
  number: string;
  supplier: string;
  currency: string;
  status: InvoiceStatus;
  /** ISO date the invoice was issued by the supplier. */
  issuedOn: string;
  /** ISO date payment is due. */
  dueOn: string;
  items: InvoiceLineItem[];
  /** Sum of items — validated against the line items in week 3. */
  amount: number;
  /** Amount band that decides how many approval levels are required. */
  approvalLevel: 1 | 2;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
