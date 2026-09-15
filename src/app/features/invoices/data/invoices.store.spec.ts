import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { API_BASE_URL } from '@core/config/api.config';
import { InvoiceListResponse } from './invoice-list-response.model';
import { InvoicesStore } from './invoices.store';

const PAGE: InvoiceListResponse = {
  items: [
    {
      id: '1',
      number: 'INV-1',
      supplier: 'Atlas',
      amount: 100,
      currency: 'EUR',
      status: 'approved',
      issuedOn: '2026-08-01',
    },
  ],
  total: 25,
  page: 1,
  pageSize: 10,
};

function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: '/api' },
    ],
  });
  const store = TestBed.inject(InvoicesStore);
  const httpMock = TestBed.inject(HttpTestingController);
  return { store, httpMock };
}

/** The store debounces query changes by 250ms before issuing a request. */
function flushDebounce(): void {
  jest.advanceTimersByTime(300);
}

describe('InvoicesStore', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    TestBed.inject(HttpTestingController).verify();
  });

  it('loads the default query on init, with no status param for "all"', () => {
    const { store, httpMock } = setup();
    flushDebounce();

    expect(store.isLoading()).toBe(true);

    const req = httpMock.expectOne((r) => r.url === '/api/invoices');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('sortBy')).toBe('issuedOn');
    expect(req.request.params.get('sortDir')).toBe('desc');
    expect(req.request.params.has('status')).toBe(false);

    req.flush(PAGE);

    expect(store.status()).toBe('loaded');
    expect(store.items()).toEqual(PAGE.items);
    expect(store.total()).toBe(25);
    expect(store.pageCount()).toBe(3);
    expect(store.isEmpty()).toBe(false);
  });

  it('resets to page 1 and re-queries when the status filter changes', () => {
    const { store, httpMock } = setup();
    flushDebounce();
    httpMock.expectOne(() => true).flush(PAGE);

    store.setPage(2);
    flushDebounce();
    httpMock.expectOne((r) => r.params.get('page') === '2').flush({ ...PAGE, page: 2 });

    store.setStatusFilter('approved');
    flushDebounce();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('status')).toBe('approved');
    expect(req.request.params.get('page')).toBe('1');
    req.flush(PAGE);
  });

  it('toggles sort direction on the same column and resets to asc on a new one', () => {
    const { store, httpMock } = setup();
    flushDebounce();
    httpMock.expectOne(() => true).flush(PAGE); // default: issuedOn desc

    store.setSort('issuedOn');
    flushDebounce();
    let req = httpMock.expectOne(() => true);
    expect(req.request.params.get('sortDir')).toBe('asc');
    req.flush(PAGE);

    store.setSort('amount');
    flushDebounce();
    req = httpMock.expectOne(() => true);
    expect(req.request.params.get('sortBy')).toBe('amount');
    expect(req.request.params.get('sortDir')).toBe('asc');
    req.flush(PAGE);
  });

  it('cancels an in-flight request when a newer query supersedes it (switchMap)', () => {
    const { store, httpMock } = setup();
    flushDebounce();
    httpMock.expectOne(() => true).flush(PAGE);

    store.setSupplierFilter('atlas');
    flushDebounce();
    const first = httpMock.expectOne(() => true); // left pending on purpose

    store.setSupplierFilter('atlas north');
    flushDebounce();
    const second = httpMock.expectOne(() => true);

    expect(first.cancelled).toBe(true);
    second.flush(PAGE);
  });

  it('surfaces a failed request as an error state, and reload() retries', () => {
    const { store, httpMock } = setup();
    flushDebounce();
    httpMock.expectOne(() => true).error(new ProgressEvent('network error'));

    expect(store.status()).toBe('error');
    expect(store.isError()).toBe(true);
    expect(store.error()).toBeTruthy();

    store.reload();
    flushDebounce();
    httpMock.expectOne(() => true).flush(PAGE);

    expect(store.status()).toBe('loaded');
    expect(store.error()).toBeNull();
  });

  it('marks the list empty once loaded with no rows', () => {
    const { store, httpMock } = setup();
    flushDebounce();
    httpMock.expectOne(() => true).flush({ items: [], total: 0, page: 1, pageSize: 10 });

    expect(store.isEmpty()).toBe(true);
  });
});
