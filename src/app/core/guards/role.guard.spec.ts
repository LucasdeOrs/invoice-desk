import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { API_BASE_URL } from '@core/config/api.config';
import { Session } from '@core/auth/session.model';
import { Role } from '@core/auth/role';
import { roleGuard } from './role.guard';

const SESSION: Session = {
  user: { id: 'u-1', name: 'Alex Morgan', email: 'alex@example.com' },
  availableRoles: ['viewer', 'editor', 'approver'],
};

const routeStub = {} as ActivatedRouteSnapshot;
const stateStub = { url: '/approvals' } as RouterStateSnapshot;

function runGuard(allowed: Role[]) {
  return TestBed.runInInjectionContext(() => roleGuard(...allowed)(routeStub, stateStub));
}

describe('roleGuard', () => {
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

  it('allows activation when the active role is in the allowed list', () => {
    localStorage.setItem('invoice-desk.active-role', 'approver');

    const result = runGuard(['approver']);
    httpMock.expectOne('/api/session').flush(SESSION);

    expect(result).toBe(true);
  });

  it('sends an authenticated user without the role to the forbidden page', () => {
    localStorage.setItem('invoice-desk.active-role', 'viewer');

    const result = runGuard(['approver']);
    httpMock.expectOne('/api/session').flush(SESSION);

    const router = TestBed.inject(Router);
    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/forbidden');
  });

  it('sends a user with no role to the role picker', () => {
    const result = runGuard(['approver']);
    httpMock.expectOne('/api/session').flush(SESSION);

    const router = TestBed.inject(Router);
    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/select-role?redirectTo=%2Fapprovals');
  });
});
