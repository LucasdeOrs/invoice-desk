import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavItem } from './nav-item';

/**
 * Presentational: the primary navigation. On narrow screens it becomes an
 * off-canvas drawer, driven by `open`; tapping a link asks the shell to close it.
 */
@Component({
  selector: 'app-shell-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-open]': 'open()' },
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './shell-sidebar.html',
  styleUrl: './shell-sidebar.scss',
})
export class ShellSidebar {
  readonly items = input<readonly NavItem[]>([]);
  readonly open = input(false);
  readonly navigated = output<void>();
}
