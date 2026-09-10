import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { Role } from '@core/auth/role';
import { NavItem } from './nav-item';
import { ShellHeader } from './shell-header';
import { ShellSidebar } from './shell-sidebar';

/**
 * The application frame: header on top, navigation on the left, routed content
 * on the right. Owns the small amount of layout state (is the mobile drawer
 * open) and forwards role changes / sign-out to the auth service.
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ShellHeader, ShellSidebar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;
  protected readonly activeRole = this.auth.activeRole;
  protected readonly availableRoles = this.auth.availableRoles;

  protected readonly sidebarOpen = signal(false);

  protected readonly navItems = computed<NavItem[]>(() => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Invoices', path: '/invoices' },
    { label: 'Approvals', path: '/approvals', hidden: this.activeRole() !== 'approver' },
  ]);

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected changeRole(role: Role): void {
    this.auth.signInAs(role);
  }

  protected signOut(): void {
    this.auth.signOut();
    void this.router.navigate(['/select-role']);
  }
}
