import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';

/**
 * Blocks the protected area until the user has chosen a role. Sends them to the
 * role picker, remembering where they were headed so we can return them there.
 */
export const authGuard: CanActivateFn & CanActivateChildFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/select-role'], {
    queryParams: { redirectTo: state.url },
  });
};
