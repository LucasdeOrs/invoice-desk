import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { InvoiceSortField, InvoiceStatusFilter } from '../data/invoices-query.model';
import { InvoicesStore } from '../data/invoices.store';
import { DateRange, InvoicesFilterBar } from '../ui/invoices-filter-bar';
import { InvoicesPagination } from '../ui/invoices-pagination';
import { InvoicesTable } from '../ui/invoices-table';

/**
 * The invoice list: filter bar + table + pagination, all driven by
 * InvoicesStore. Loading, empty and error are distinct, explicit branches —
 * none of them is "the table, but weird".
 */
@Component({
  selector: 'app-invoices-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InvoicesFilterBar, InvoicesTable, InvoicesPagination],
  templateUrl: './invoices-page.html',
  styleUrl: './invoices-page.scss',
})
export class InvoicesPage {
  protected readonly store = inject(InvoicesStore);

  protected onStatusChange(status: InvoiceStatusFilter): void {
    this.store.setStatusFilter(status);
  }

  protected onSupplierChange(supplier: string): void {
    this.store.setSupplierFilter(supplier);
  }

  protected onDateRangeChange(range: DateRange): void {
    this.store.setDateRange(range.issuedFrom, range.issuedTo);
  }

  protected onClearFilters(): void {
    this.store.setStatusFilter('all');
    this.store.setSupplierFilter('');
    this.store.setDateRange(null, null);
  }

  protected onSort(field: InvoiceSortField): void {
    this.store.setSort(field);
  }

  protected onPageChange(page: number): void {
    this.store.setPage(page);
  }
}
