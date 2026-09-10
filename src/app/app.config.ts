import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Angular 21 is zoneless by default (no zone.js polyfill). Declared explicitly
    // so the change-detection strategy is visible and greppable in the codebase.
    provideZonelessChangeDetection(),
    // fetch backend: plays well with MSW's network-level interception and keeps
    // the door open for `httpResource`.
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
