import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

/** Service-worker-based mock used by the dev server and Cypress. */
export const worker = setupWorker(...handlers);
