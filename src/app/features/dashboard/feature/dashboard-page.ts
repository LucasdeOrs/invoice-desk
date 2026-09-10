import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthService } from '@core/auth/auth.service';
import { API_BASE_URL } from '@core/config/api.config';
import { InvoiceSummary } from '@features/invoices/data/invoice-summary.model';

interface InvoiceListResponse {
  items: InvoiceSummary[];
  total: number;
}

/**
 * Week 1 dashboard: proves both mock endpoints respond by greeting the user
 * from `/api/session` and summarising `/api/invoices`. Week 2 moves the reads
 * into the Signal Store.
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

  private readonly response = toSignal(
    this.http.get<InvoiceListResponse>(`${this.apiBaseUrl}/invoices`),
    { initialValue: null },
  );

  protected readonly loading = computed(() => this.response() === null);
  protected readonly total = computed(() => this.response()?.total ?? 0);
  protected readonly pending = computed(
    () =>
      this.response()?.items.filter((invoice) => invoice.status === 'pending_approval').length ?? 0,
  );
  protected readonly approved = computed(
    () => this.response()?.items.filter((invoice) => invoice.status === 'approved').length ?? 0,
  );
}
