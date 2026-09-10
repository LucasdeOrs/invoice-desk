import { http, HttpResponse, type RequestHandler } from 'msw';

import type { Session } from '@core/auth/session.model';
import { INVOICES_FIXTURE } from './data/invoices.fixture';

/**
 * The network contract for Invoice Desk.
 *
 * MSW intercepts at the network layer, so the same handlers back the dev server,
 * Jest unit tests and Cypress E2E runs. Handlers grow here as features land
 * (invoice detail, approvals routing, mutations). Week 1 serves fixed data.
 */

const SESSION: Session = {
  user: {
    id: 'usr-001',
    name: 'Alex Morgan',
    email: 'alex.morgan@invoicedesk.example',
  },
  availableRoles: ['viewer', 'editor', 'approver'],
};

export const handlers: RequestHandler[] = [
  http.get('/api/session', () => HttpResponse.json(SESSION)),

  http.get('/api/invoices', () =>
    HttpResponse.json({
      items: INVOICES_FIXTURE,
      total: INVOICES_FIXTURE.length,
    }),
  ),
];
