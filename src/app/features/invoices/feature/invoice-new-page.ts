import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Placeholder for the week 3 typed reactive form. Route is already role-guarded. */
@Component({
  selector: 'app-invoice-new-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header class="page-head"><h1>New invoice</h1></header>
    <p class="muted">
      The typed reactive form — line items, custom and async validators, and attachment upload — is
      built in week 3.
    </p>
    <p><a routerLink="/invoices">Back to invoices</a></p>
  `,
  styles: `
    :host {
      display: block;
    }
    .page-head h1 {
      margin: 0 0 var(--space-4);
      font-size: 1.5rem;
    }
    .muted {
      color: var(--color-text-muted);
    }
  `,
})
export class InvoiceNewPage {}
