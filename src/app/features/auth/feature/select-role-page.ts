import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { Role, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES } from '@core/auth/role';

/**
 * The "login" for the demo: there are no credentials, you just pick a role.
 * Reached whenever a guard finds no role selected; also serves as the
 * role-switch screen.
 */
@Component({
  selector: 'app-select-role-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select-role-page.html',
  styleUrl: './select-role-page.scss',
})
export class SelectRolePage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Bound from the `?redirectTo=` query param via withComponentInputBinding(). */
  readonly redirectTo = input('/dashboard');

  protected readonly roles = ROLES;
  protected readonly labels = ROLE_LABELS;
  protected readonly descriptions = ROLE_DESCRIPTIONS;
  protected readonly activeRole = this.auth.activeRole;

  protected choose(role: Role): void {
    this.auth.signInAs(role);
    void this.router.navigateByUrl(this.safeRedirect());
  }

  private safeRedirect(): string {
    const target = this.redirectTo();
    // Only follow app-internal, single-slash paths — never an absolute URL.
    return target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';
  }
}
