import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';
import { Shell } from '@layout/shell/shell';

export const routes: Routes = [
  {
    path: 'select-role',
    title: 'Choose a role · Invoice Desk',
    loadComponent: () =>
      import('@features/auth/feature/select-role-page').then((m) => m.SelectRolePage),
  },
  {
    path: '',
    component: Shell,
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard · Invoice Desk',
        loadComponent: () =>
          import('@features/dashboard/feature/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: 'invoices',
        title: 'Invoices · Invoice Desk',
        loadChildren: () =>
          import('@features/invoices/feature/invoice.routes').then((m) => m.INVOICE_ROUTES),
      },
      {
        path: 'approvals',
        title: 'Approvals · Invoice Desk',
        canActivate: [roleGuard('approver')],
        loadComponent: () =>
          import('@features/approvals/feature/approvals-page').then((m) => m.ApprovalsPage),
      },
    ],
  },
  {
    path: 'forbidden',
    title: 'Access denied · Invoice Desk',
    loadComponent: () => import('@shared/ui/forbidden/forbidden').then((m) => m.Forbidden),
  },
  {
    path: '**',
    title: 'Page not found · Invoice Desk',
    loadComponent: () => import('@shared/ui/not-found/not-found').then((m) => m.NotFound),
  },
];
