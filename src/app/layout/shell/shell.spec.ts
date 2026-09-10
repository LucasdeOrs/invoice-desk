import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { Role } from '@core/auth/role';
import { Shell } from './shell';

function fakeAuth(role: Role) {
  return {
    user: signal({ id: 'u-1', name: 'Alex Morgan', email: 'alex@example.com' }),
    activeRole: signal<Role | null>(role),
    availableRoles: signal<readonly Role[]>(['viewer', 'editor', 'approver']),
    signInAs: jest.fn(),
    signOut: jest.fn(),
  };
}

function renderShell(role: Role) {
  TestBed.configureTestingModule({
    imports: [Shell],
    providers: [provideRouter([]), { provide: AuthService, useValue: fakeAuth(role) }],
  });

  const fixture = TestBed.createComponent(Shell);
  fixture.detectChanges();
  return fixture;
}

function navLabels(fixture: ReturnType<typeof renderShell>): string[] {
  return Array.from(fixture.nativeElement.querySelectorAll<HTMLAnchorElement>('.nav__link')).map(
    (link) => link.textContent?.trim() ?? '',
  );
}

describe('Shell', () => {
  it('shows Dashboard and Invoices for every role', () => {
    expect(navLabels(renderShell('viewer'))).toEqual(['Dashboard', 'Invoices']);
  });

  it('reveals Approvals only for the approver role', () => {
    expect(navLabels(renderShell('approver'))).toContain('Approvals');
  });
});
