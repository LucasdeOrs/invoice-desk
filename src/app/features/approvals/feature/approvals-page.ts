import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Placeholder for weeks 3–4. Route is guarded to the approver role. */
@Component({
  selector: 'app-approvals-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head"><h1>Approvals</h1></header>
    <p class="muted">
      Approval routing by amount band, the draft → submitted → pending → approved / rejected state
      machine, and the audit trail arrive in weeks 3–4.
    </p>
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
export class ApprovalsPage {}
