import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from '@core/auth/auth.service';
import { API_BASE_URL } from '@core/config/api.config';
import { DashboardPage } from './dashboard-page';

const LIST = {
  items: [
    {
      id: '1',
      number: 'INV-1',
      supplier: 'A',
      amount: 1,
      currency: 'EUR',
      status: 'pending_approval',
      issuedOn: '2026-08-01',
    },
    {
      id: '2',
      number: 'INV-2',
      supplier: 'B',
      amount: 2,
      currency: 'EUR',
      status: 'approved',
      issuedOn: '2026-08-02',
    },
    {
      id: '3',
      number: 'INV-3',
      supplier: 'C',
      amount: 3,
      currency: 'EUR',
      status: 'pending_approval',
      issuedOn: '2026-08-03',
    },
  ],
  total: 3,
};

function render() {
  TestBed.configureTestingModule({
    imports: [DashboardPage],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: '/api' },
      {
        provide: AuthService,
        useValue: { user: signal({ id: 'u', name: 'Alex Morgan', email: 'a@e.com' }) },
      },
    ],
  });

  const fixture = TestBed.createComponent(DashboardPage);
  TestBed.inject(HttpTestingController).expectOne('/api/invoices').flush(LIST);
  fixture.detectChanges();
  return fixture;
}

describe('DashboardPage', () => {
  it('summarises invoice counts from the mock endpoint', () => {
    const values = Array.from(
      render().nativeElement.querySelectorAll<HTMLElement>('.stat__value'),
    ).map((el) => el.textContent?.trim());

    expect(values).toEqual(['3', '2', '1']); // total, pending, approved
  });

  it('greets the signed-in user', () => {
    expect(render().nativeElement.textContent).toContain('Alex Morgan');
  });
});
