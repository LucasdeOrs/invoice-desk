export type ApprovalStepStatus = 'pending' | 'approved' | 'rejected';

/**
 * One level of an invoice's approval routing. An invoice with `approvalLevel: 2`
 * (see {@link Invoice}) has two of these in sequence. Wired up in week 3
 * alongside the amount-based routing rule and the state machine.
 */
export interface ApprovalStep {
  id: string;
  invoiceId: string;
  level: 1 | 2;
  status: ApprovalStepStatus;
  approverName?: string;
  actedAt?: string;
  comment?: string;
}
