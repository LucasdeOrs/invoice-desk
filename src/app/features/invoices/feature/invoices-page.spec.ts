import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { InvoiceSummary } from '../data/invoice-summary.model';
import { DEFAULT_INVOICES_QUERY, InvoicesQuery } from '../data/invoices-query.model';
import { InvoicesStore } from '../data/invoices.store';
import { InvoicesPage } from './invoices-page';

const ROW: InvoiceSummary = {
  id: '1',
  number: 'INV-1',
  supplier: 'Atlas',
  amount: 100,
  currency: 'EUR',
  status: 'approved',
  issuedOn: '2026-08-01',
};

interface FakeStoreOptions {
  total: number;
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
  error: string | null;
  items: InvoiceSummary[];
  query: InvoicesQuery;
  pageCount: number;
}

function fakeStore(overrides: Partial<FakeStoreOptions> = {}) {
  return {
    total: signal(overrides.total ?? 0),
    isLoading: signal(overrides.isLoading ?? false),
    isEmpty: signal(overrides.isEmpty ?? false),
    isError: signal(overrides.isError ?? false),
    error: signal(overrides.error ?? null),
    items: signal(overrides.items ?? []),
    query: signal(overrides.query ?? DEFAULT_INVOICES_QUERY),
    pageCount: signal(overrides.pageCount ?? 1),
    setStatusFilter: jest.fn(),
    setSupplierFilter: jest.fn(),
    setDateRange: jest.fn(),
    setSort: jest.fn(),
    setPage: jest.fn(),
    reload: jest.fn(),
  };
}

function render(store: ReturnType<typeof fakeStore>) {
  TestBed.configureTestingModule({
    imports: [InvoicesPage],
    providers: [{ provide: InvoicesStore, useValue: store }],
  });
  const fixture = TestBed.createComponent(InvoicesPage);
  fixture.detectChanges();
  return fixture;
}

describe('InvoicesPage', () => {
  it('shows the loading state before the first page arrives', () => {
    const fixture = render(fakeStore({ isLoading: true, items: [] }));
    expect(fixture.nativeElement.querySelector('.state--loading')).not.toBeNull();
  });

  it('shows the empty state when nothing matches the filters', () => {
    const fixture = render(fakeStore({ isEmpty: true }));
    expect(fixture.nativeElement.querySelector('.state--empty')).not.toBeNull();
  });

  it('shows the error state and retries through the store', () => {
    const store = fakeStore({ isError: true, error: 'Could not load invoices. Please try again.' });
    const fixture = render(store);

    const errorBlock = fixture.nativeElement.querySelector<HTMLElement>('.state--error');
    expect(errorBlock?.textContent).toContain('Could not load invoices');

    errorBlock?.querySelector<HTMLButtonElement>('button')?.click();
    expect(store.reload).toHaveBeenCalled();
  });

  it('renders the table and pagination once loaded with rows', () => {
    const fixture = render(fakeStore({ items: [ROW], total: 1, pageCount: 1 }));

    expect(fixture.nativeElement.textContent).toContain('Atlas');
    expect(fixture.nativeElement.querySelector('app-invoices-pagination')).not.toBeNull();
  });

  it('delegates a column click to the store as a sort change', () => {
    const store = fakeStore({ items: [ROW], total: 1 });
    const fixture = render(store);

    const headers = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>('thead button'),
    );
    headers.find((button) => button.textContent?.includes('Supplier'))?.click();

    expect(store.setSort).toHaveBeenCalledWith('supplier');
  });

  it('delegates the status filter to the store', () => {
    const store = fakeStore();
    const fixture = render(store);

    const select = fixture.nativeElement.querySelector<HTMLSelectElement>(
      'app-invoices-filter-bar select',
    );
    if (select) {
      select.value = 'approved';
      select.dispatchEvent(new Event('change'));
    }

    expect(store.setStatusFilter).toHaveBeenCalledWith('approved');
  });

  it('delegates pagination to the store', () => {
    const store = fakeStore({
      items: [ROW],
      total: 30,
      pageCount: 3,
      query: { ...DEFAULT_INVOICES_QUERY, page: 2 },
    });
    const fixture = render(store);

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>('app-invoices-pagination button'),
    );
    buttons.find((button) => button.textContent?.includes('Next'))?.click();

    expect(store.setPage).toHaveBeenCalledWith(3);
  });
});
