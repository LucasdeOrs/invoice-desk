import { Routes } from '@angular/router';

import { roleGuard } from '@core/guards/role.guard';

export const INVOICE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./invoices-page').then((m) => m.InvoicesPage),
  },
  {
    path: 'new',
    title: 'New invoice · Invoice Desk',
    canActivate: [roleGuard('editor', 'approver')],
    loadComponent: () => import('./invoice-new-page').then((m) => m.InvoiceNewPage),
  },
];
