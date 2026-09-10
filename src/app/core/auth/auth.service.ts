import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

import { API_BASE_URL } from '@core/config/api.config';
import { isRole, Role } from './role';
import { Session } from './session.model';

const ACTIVE_ROLE_STORAGE_KEY = 'invoice-desk.active-role';

/**
 * Simulated auth for the portfolio demo.
 *
 * There is no real login: `GET /api/session` tells us who the user is and which
 * roles they may act as, and the user picks one of those roles to "wear". That
 * choice is the thing route guards check, and it is persisted to localStorage so
 * a refresh keeps you where you were.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private readonly activeRoleState = signal<Role | null>(readStoredRole());

  /** The role the user is currently acting as, or `null` when none has been chosen. */
  readonly activeRole = this.activeRoleState.asReadonly();

  /** A role is selected, so the protected area may be entered. */
  readonly isAuthenticated = computed(() => this.activeRoleState() !== null);

  private readonly session = toSignal(this.http.get<Session>(`${this.apiBaseUrl}/session`), {
    initialValue: null,
  });

  /** Current user profile, or `null` until the session request resolves. */
  readonly user = computed(() => this.session()?.user ?? null);

  /** Roles this user is allowed to switch between. */
  readonly availableRoles = computed<readonly Role[]>(() => this.session()?.availableRoles ?? []);

  signInAs(role: Role): void {
    this.activeRoleState.set(role);
    writeStoredRole(role);
  }

  signOut(): void {
    this.activeRoleState.set(null);
    writeStoredRole(null);
  }
}

function readStoredRole(): Role | null {
  try {
    const stored = localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY);
    return isRole(stored) ? stored : null;
  } catch {
    // localStorage can throw when storage is disabled (private mode, blocked cookies).
    return null;
  }
}

function writeStoredRole(role: Role | null): void {
  try {
    if (role === null) {
      localStorage.removeItem(ACTIVE_ROLE_STORAGE_KEY);
    } else {
      localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role);
    }
  } catch {
    // If we cannot persist, the app still works for this session — the choice
    // just will not survive a refresh.
  }
}
