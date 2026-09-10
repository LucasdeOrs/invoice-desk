/** The three access levels a user can act as. */
export const ROLES = ['viewer', 'editor', 'approver'] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: string | null): value is Role {
  return value !== null && (ROLES as readonly string[]).includes(value);
}

export const ROLE_LABELS: Record<Role, string> = {
  viewer: 'Viewer',
  editor: 'Editor',
  approver: 'Approver',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  viewer: 'Read-only access to invoices and approvals.',
  editor: 'Create and edit invoices, and submit them for approval.',
  approver: 'Review submitted invoices and approve or reject them.',
};
