import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Role, ROLE_LABELS } from '@core/auth/role';
import { SessionUser } from '@core/auth/session.model';

/**
 * Presentational: the top bar. Shows the brand, the "acting as" role switcher
 * and the current user; emits intent for the shell to act on.
 */
@Component({
  selector: 'app-shell-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell-header.html',
  styleUrl: './shell-header.scss',
})
export class ShellHeader {
  readonly user = input<SessionUser | null>(null);
  readonly activeRole = input<Role | null>(null);
  readonly availableRoles = input<readonly Role[]>([]);

  readonly toggleSidebar = output<void>();
  readonly roleChange = output<Role>();
  readonly signOut = output<void>();

  protected readonly roleLabels = ROLE_LABELS;

  protected onRoleSelected(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value !== '') {
      this.roleChange.emit(value as Role);
    }
  }
}
