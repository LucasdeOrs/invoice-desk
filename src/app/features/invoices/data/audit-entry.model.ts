import { Role } from '@core/auth/role';

export type AuditAction = 'created' | 'edited' | 'submitted' | 'approved' | 'rejected';

/**
 * One row of an invoice's change history. Surfaced on the invoice detail view
 * (week 3) and the audit trail (week 4); modelled now alongside the rest of
 * the domain.
 */
export interface AuditEntry {
  id: string;
  invoiceId: string;
  action: AuditAction;
  actorName: string;
  actorRole: Role;
  occurredAt: string;
  comment?: string;
}
