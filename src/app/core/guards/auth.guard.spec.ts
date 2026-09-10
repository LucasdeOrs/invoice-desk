import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { API_BASE_URL } from '@core/config/api.config';
import { Session } from '@core/auth/session.model';
import { authGuard } from './auth.guard';

const SESSION: Session = {
  user: { id: 'u-1', name: 'Alex Morgan', email: 'alex@example.com' },
  availableRoles: ['viewer', 'editor', 'approver'],
};

const routeStub = {} as ActivatedRouteSnapshot;
const stateStub = { url: '/invoices' } as RouterStateSnapshot;

function runGuard() {
  return TestBed.runInInjectionContext(() => authGuard(routeStub, stateStub));
}

describe('authGuard', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: '/api' },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => localStorage.clear());

  it('redirects to the role picker when no role is chosen, keeping the target url', () => {
    const result = runGuard();
    httpMock.expectOne('/api/session').flush(SESSION);

    const router = TestBed.inject(Router);
    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/select-role?redirectTo=%2Finvoices');
  });

  it('allows activation once a role is chosen', () => {
    localStorage.setItem('invoice-desk.active-role', 'viewer');

    const result = runGuard();
    httpMock.expectOne('/api/session').flush(SESSION);

    expect(result).toBe(true);
  });
});
