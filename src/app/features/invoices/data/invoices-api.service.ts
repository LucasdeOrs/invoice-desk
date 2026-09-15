import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '@core/config/api.config';
import { InvoiceListResponse } from './invoice-list-response.model';
import { InvoicesQuery } from './invoices-query.model';

/** Talks to `GET /api/invoices`. Keeps HTTP concerns out of the store. */
@Injectable({ providedIn: 'root' })
export class InvoicesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(query: InvoicesQuery): Observable<InvoiceListResponse> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('pageSize', query.pageSize)
      .set('sortBy', query.sortBy)
      .set('sortDir', query.sortDir);

    if (query.status !== 'all') {
      params = params.set('status', query.status);
    }
    if (query.supplier) {
      params = params.set('supplier', query.supplier);
    }
    if (query.issuedFrom) {
      params = params.set('issuedFrom', query.issuedFrom);
    }
    if (query.issuedTo) {
      params = params.set('issuedTo', query.issuedTo);
    }

    return this.http.get<InvoiceListResponse>(`${this.apiBaseUrl}/invoices`, { params });
  }
}
