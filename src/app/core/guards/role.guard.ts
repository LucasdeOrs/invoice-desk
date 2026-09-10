import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { Role } from '@core/auth/role';

/**
 * Restricts a route to the given roles.
 *
 * - no role chosen yet  → send to the role picker
 * - role chosen but not allowed → send to the forbidden page
 */
export function roleGuard(...allowedRoles: readonly Role[]): CanActivateFn {
  return (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const role = auth.activeRole();

    if (role === null) {
      return router.createUrlTree(['/select-role'], {
        queryParams: { redirectTo: state.url },
      });
    }

    return allowedRoles.includes(role) ? true : router.createUrlTree(['/forbidden']);
  };
}
