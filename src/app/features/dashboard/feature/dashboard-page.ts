import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthService } from '@core/auth/auth.service';
import { API_BASE_URL } from '@core/config/api.config';

interface DashboardSummary {
  total: number;
  pending: number;
  approved: number;
}

/**
 * Greets the user from `/api/session` and shows counts from
 * `/api/dashboard/summary` — a dedicated endpoint, not a client-side count
 * over the (now paginated) invoice list.
 */
@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly auth = inject(AuthService);

  protected readonly userName = computed(() => this.auth.user()?.name ?? null);

  private readonly summary = toSignal(
    this.http.get<DashboardSummary>(`${this.apiBaseUrl}/dashboard/summary`),
    { initialValue: null },
  );

  protected readonly loading = computed(() => this.summary() === null);
  protected readonly total = computed(() => this.summary()?.total ?? 0);
  protected readonly pending = computed(() => this.summary()?.pending ?? 0);
  protected readonly approved = computed(() => this.summary()?.approved ?? 0);
}
