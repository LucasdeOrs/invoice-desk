import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/** Node request-interception server used by Jest unit/integration tests. */
export const server = setupServer(...handlers);
