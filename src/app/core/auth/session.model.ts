import { Role } from './role';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

/** What `GET /api/session` returns: who the user is and which roles they may act as. */
export interface Session {
  user: SessionUser;
  availableRoles: Role[];
}
