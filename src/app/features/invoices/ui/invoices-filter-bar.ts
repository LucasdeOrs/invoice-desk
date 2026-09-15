import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { INVOICE_STATUS_LABELS, INVOICE_STATUSES } from '../data/invoice.model';
import { InvoiceStatusFilter } from '../data/invoices-query.model';

export interface DateRange {
  issuedFrom: string | null;
  issuedTo: string | null;
}

/** Presentational: status / supplier / issued-date filters. No debouncing here — the store debounces the resulting request. */
@Component({
  selector: 'app-invoices-filter-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoices-filter-bar.html',
  styleUrl: './invoices-filter-bar.scss',
})
export class InvoicesFilterBar {
  readonly status = input<InvoiceStatusFilter>('all');
  readonly supplier = input('');
  readonly issuedFrom = input<string | null>(null);
  readonly issuedTo = input<string | null>(null);

  readonly statusChange = output<InvoiceStatusFilter>();
  readonly supplierChange = output<string>();
  readonly dateRangeChange = output<DateRange>();
  readonly clear = output<void>();

  protected readonly statuses = INVOICE_STATUSES;
  protected readonly statusLabels = INVOICE_STATUS_LABELS;

  protected onStatusChange(event: Event): void {
    this.statusChange.emit((event.target as HTMLSelectElement).value as InvoiceStatusFilter);
  }

  protected onSupplierInput(event: Event): void {
    this.supplierChange.emit((event.target as HTMLInputElement).value);
  }

  protected onFromChange(event: Event): void {
    this.dateRangeChange.emit({
      issuedFrom: (event.target as HTMLInputElement).value || null,
      issuedTo: this.issuedTo(),
    });
  }

  protected onToChange(event: Event): void {
    this.dateRangeChange.emit({
      issuedFrom: this.issuedFrom(),
      issuedTo: (event.target as HTMLInputElement).value || null,
    });
  }
}
