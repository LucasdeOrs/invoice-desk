import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { API_BASE_URL } from '@core/config/api.config';
import { InvoicesPage } from './invoices-page';

const LIST = {
  items: [
    {
      id: '1',
      number: 'INV-1',
      supplier: 'Atlas',
      amount: 100,
      currency: 'EUR',
      status: 'pending_approval',
      issuedOn: '2026-08-01',
    },
    {
      id: '2',
      number: 'INV-2',
      supplier: 'Northwind',
      amount: 200,
      currency: 'EUR',
      status: 'approved',
      issuedOn: '2026-08-02',
    },
  ],
  total: 2,
};

function render() {
  TestBed.configureTestingModule({
    imports: [InvoicesPage],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: '/api' },
    ],
  });

  const fixture = TestBed.createComponent(InvoicesPage);
  TestBed.inject(HttpTestingController).expectOne('/api/invoices').flush(LIST);
  fixture.detectChanges();
  return fixture;
}

describe('InvoicesPage', () => {
  it('renders one row per invoice from the mock endpoint', () => {
    const rows = render().nativeElement.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
  });

  it('shows a human-readable status label', () => {
    expect(render().nativeElement.textContent).toContain('Pending approval');
  });
});
