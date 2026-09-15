import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, debounceTime, EMPTY, switchMap, tap } from 'rxjs';

import { InvoicesApiService } from './invoices-api.service';
import { InvoiceSummary } from './invoice-summary.model';
import {
  DEFAULT_INVOICES_QUERY,
  InvoiceSortField,
  InvoicesQuery,
  InvoiceStatusFilter,
  SortDirection,
} from './invoices-query.model';

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface InvoicesState {
  query: InvoicesQuery;
  items: InvoiceSummary[];
  total: number;
  status: LoadStatus;
  error: string | null;
}

const initialState: InvoicesState = {
  query: DEFAULT_INVOICES_QUERY,
  items: [],
  total: 0,
  status: 'idle',
  error: null,
};

/**
 * Holds one page of the invoice list plus the query that produced it.
 * Every filter/sort/page setter patches `query`; `loadInvoices` is wired to
 * that signal in `onInit`, so any change re-fetches automatically —
 * debounced, and switchMap-cancelled if a newer change arrives first.
 */
export const InvoicesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ status, items, total, query }) => ({
    isLoading: computed(() => status() === 'loading'),
    isEmpty: computed(() => status() === 'loaded' && items().length === 0),
    isError: computed(() => status() === 'error'),
    pageCount: computed(() => Math.max(1, Math.ceil(total() / query().pageSize))),
  })),

  withMethods((store, api = inject(InvoicesApiService)) => ({
    loadInvoices: rxMethod<InvoicesQuery>((query$) =>
      query$.pipe(
        debounceTime(250),
        tap(() => patchState(store, { status: 'loading', error: null })),
        switchMap((query) =>
          api.list(query).pipe(
            tap((response) =>
              patchState(store, {
                items: response.items,
                total: response.total,
                status: 'loaded',
              }),
            ),
            catchError(() => {
              patchState(store, {
                status: 'error',
                error: 'Could not load invoices. Please try again.',
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    setStatusFilter(status: InvoiceStatusFilter): void {
      patchState(store, (state) => ({ query: { ...state.query, status, page: 1 } }));
    },

    setSupplierFilter(supplier: string): void {
      patchState(store, (state) => ({ query: { ...state.query, supplier, page: 1 } }));
    },

    setDateRange(issuedFrom: string | null, issuedTo: string | null): void {
      patchState(store, (state) => ({
        query: { ...state.query, issuedFrom, issuedTo, page: 1 },
      }));
    },

    setSort(sortBy: InvoiceSortField): void {
      patchState(store, (state) => {
        const sortDir: SortDirection =
          state.query.sortBy === sortBy && state.query.sortDir === 'asc' ? 'desc' : 'asc';
        return { query: { ...state.query, sortBy, sortDir } };
      });
    },

    setPage(page: number): void {
      patchState(store, (state) => ({ query: { ...state.query, page } }));
    },

    /** Re-issues the current query — used by the "try again" control on error. */
    reload(): void {
      patchState(store, (state) => ({ query: { ...state.query } }));
    },
  })),

  withHooks({
    onInit(store) {
      store.loadInvoices(store.query);
    },
  }),
);
