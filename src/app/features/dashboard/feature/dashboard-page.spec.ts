import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from '@core/auth/auth.service';
import { API_BASE_URL } from '@core/config/api.config';
import { DashboardPage } from './dashboard-page';

const SUMMARY = { total: 64, pending: 18, approved: 30 };

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
  TestBed.inject(HttpTestingController).expectOne('/api/dashboard/summary').flush(SUMMARY);
  fixture.detectChanges();
  return fixture;
}

describe('DashboardPage', () => {
  it('shows the counts from the summary endpoint', () => {
    const values = Array.from(
      render().nativeElement.querySelectorAll<HTMLElement>('.stat__value'),
    ).map((el) => el.textContent?.trim());

    expect(values).toEqual(['64', '18', '30']);
  });

  it('greets the signed-in user', () => {
    expect(render().nativeElement.textContent).toContain('Alex Morgan');
  });
});
