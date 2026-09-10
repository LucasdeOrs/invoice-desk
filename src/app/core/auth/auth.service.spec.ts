import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { API_BASE_URL } from '@core/config/api.config';
import { AuthService } from './auth.service';
import { Session } from './session.model';

const STORAGE_KEY = 'invoice-desk.active-role';

const SESSION: Session = {
  user: { id: 'u-1', name: 'Alex Morgan', email: 'alex@example.com' },
  availableRoles: ['viewer', 'editor', 'approver'],
};

function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: '/api' },
    ],
  });

  const service = TestBed.inject(AuthService);
  const httpMock = TestBed.inject(HttpTestingController);
  return { service, httpMock };
}

describe('AuthService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts unauthenticated when nothing is stored', () => {
    const { service, httpMock } = setup();

    expect(service.activeRole()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);

    httpMock.expectOne('/api/session').flush(SESSION);
    httpMock.verify();
  });

  it('restores a valid stored role on start', () => {
    localStorage.setItem(STORAGE_KEY, 'approver');
    const { service, httpMock } = setup();

    expect(service.activeRole()).toBe('approver');
    expect(service.isAuthenticated()).toBe(true);

    httpMock.expectOne('/api/session').flush(SESSION);
  });

  it('ignores an unknown stored value', () => {
    localStorage.setItem(STORAGE_KEY, 'root');
    const { service, httpMock } = setup();

    expect(service.activeRole()).toBeNull();
    httpMock.expectOne('/api/session').flush(SESSION);
  });

  it('persists the role chosen with signInAs', () => {
    const { service, httpMock } = setup();
    httpMock.expectOne('/api/session').flush(SESSION);

    service.signInAs('editor');

    expect(service.activeRole()).toBe('editor');
    expect(service.isAuthenticated()).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('editor');
  });

  it('clears the role on signOut', () => {
    localStorage.setItem(STORAGE_KEY, 'editor');
    const { service, httpMock } = setup();
    httpMock.expectOne('/api/session').flush(SESSION);

    service.signOut();

    expect(service.activeRole()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('exposes the user and available roles from the session response', () => {
    const { service, httpMock } = setup();
    httpMock.expectOne('/api/session').flush(SESSION);

    expect(service.user()).toEqual(SESSION.user);
    expect(service.availableRoles()).toEqual(['viewer', 'editor', 'approver']);
  });
});
