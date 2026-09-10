import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

import { API_BASE_URL } from '@core/config/api.config';
import { InvoiceStatus, InvoiceSummary } from '../data/invoice-summary.model';

interface InvoiceListResponse {
  items: InvoiceSummary[];
  total: number;
}

/**
 * Week 1 invoice list: a read-only preview straight from the mock API, so the
 * navigation and the second endpoint are demonstrably working. The sortable,
 * filterable, server-paginated table is week 2's job.
 */
@Component({
  selector: 'app-invoices-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './invoices-page.html',
  styleUrl: './invoices-page.scss',
})
export class InvoicesPage {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private readonly response = toSignal(
    this.http.get<InvoiceListResponse>(`${this.apiBaseUrl}/invoices`),
    { initialValue: null },
  );

  protected readonly loading = computed(() => this.response() === null);
  protected readonly invoices = computed<readonly InvoiceSummary[]>(
    () => this.response()?.items ?? [],
  );

  protected readonly statusLabels: Record<InvoiceStatus, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    pending_approval: 'Pending approval',
    approved: 'Approved',
    rejected: 'Rejected',
  };
}
