import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { Role } from '@core/auth/role';
import { SelectRolePage } from './select-role-page';

describe('SelectRolePage', () => {
  const signInAs = jest.fn();

  function render() {
    TestBed.configureTestingModule({
      imports: [SelectRolePage],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { activeRole: signal<Role | null>(null), signInAs },
        },
      ],
    });

    const fixture = TestBed.createComponent(SelectRolePage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigate = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    return { fixture, navigate };
  }

  const roleButtons = (fixture: { nativeElement: HTMLElement }) =>
    Array.from(fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.role'));

  beforeEach(() => signInAs.mockClear());

  it('lists the three roles', () => {
    const { fixture } = render();
    const names = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>('.role__name'),
    ).map((el) => el.textContent?.trim());
    expect(names).toEqual(['Viewer', 'Editor', 'Approver']);
  });

  it('signs in with the chosen role and follows the redirect target', () => {
    const { fixture, navigate } = render();
    fixture.componentRef.setInput('redirectTo', '/invoices');

    roleButtons(fixture)[1].click();

    expect(signInAs).toHaveBeenCalledWith('editor');
    expect(navigate).toHaveBeenCalledWith('/invoices');
  });

  it('falls back to the dashboard for an off-site redirect target', () => {
    const { fixture, navigate } = render();
    fixture.componentRef.setInput('redirectTo', '//evil.example');

    roleButtons(fixture)[0].click();

    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });
});
