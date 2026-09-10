import type { RequestHandler } from 'msw';

/**
 * The network contract for Invoice Desk.
 *
 * MSW intercepts at the network layer, so the same handlers back the dev server,
 * Jest unit tests and Cypress E2E runs. Handlers are added here as features land
 * (invoice list, invoice detail, approvals routing, auth/roles).
 */
export const handlers: RequestHandler[] = [];
