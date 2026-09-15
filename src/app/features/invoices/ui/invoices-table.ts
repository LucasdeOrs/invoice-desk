import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { InvoiceSummary } from '../data/invoice-summary.model';
import { InvoiceSortField, SortDirection } from '../data/invoices-query.model';
import { InvoiceStatusBadge } from './invoice-status-badge';

/** Presentational: renders the rows it's given and asks to sort by a column — it never fetches. */
@Component({
  selector: 'app-invoices-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, InvoiceStatusBadge],
  templateUrl: './invoices-table.html',
  styleUrl: './invoices-table.scss',
})
export class InvoicesTable {
  readonly invoices = input<readonly InvoiceSummary[]>([]);
  readonly sortBy = input.required<InvoiceSortField>();
  readonly sortDir = input.required<SortDirection>();

  readonly sort = output<InvoiceSortField>();

  protected ariaSort(field: InvoiceSortField): 'ascending' | 'descending' | 'none' {
    if (this.sortBy() !== field) {
      return 'none';
    }
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }

  protected indicator(field: InvoiceSortField): string {
    if (this.sortBy() !== field) {
      return '';
    }
    return this.sortDir() === 'asc' ? ' ▲' : ' ▼';
  }
}
