import { InjectionToken } from '@angular/core';

/**
 * Base path every backend call is made relative to.
 *
 * Kept behind a token so tests can point it somewhere else and so there is a
 * single place to change when a real API is introduced. MSW intercepts these
 * requests in dev, in tests and in the deployed demo.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});
