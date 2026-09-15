import { delay, http, HttpResponse, type RequestHandler } from 'msw';

import type { Session } from '@core/auth/session.model';
import { INVOICES_FIXTURE } from './data/invoices.fixture';
import { queryInvoices } from './invoices-query';

/**
 * The network contract for Invoice Desk.
 *
 * MSW intercepts at the network layer, so the same handlers back the dev server,
 * Jest unit tests and Cypress E2E runs. Handlers grow here as features land
 * (invoice detail, approvals routing, mutations).
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

  // Filtering, sorting and pagination happen here, server-side, against the
  // full fixture — the client only ever sees the page it asked for.
  http.get('/api/invoices', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    return HttpResponse.json(queryInvoices(INVOICES_FIXTURE, url.searchParams));
  }),

  // A dedicated summary endpoint: the dashboard needs counts across the whole
  // dataset, not just whatever page the list happens to be showing.
  http.get('/api/dashboard/summary', async () => {
    await delay(150);
    return HttpResponse.json({
      total: INVOICES_FIXTURE.length,
      pending: INVOICES_FIXTURE.filter((invoice) => invoice.status === 'pending_approval').length,
      approved: INVOICES_FIXTURE.filter((invoice) => invoice.status === 'approved').length,
    });
  }),
];
