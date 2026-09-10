export interface NavItem {
  label: string;
  path: string;
  /** Hidden for the current role, but kept in the list so the shape is stable. */
  hidden?: boolean;
}
