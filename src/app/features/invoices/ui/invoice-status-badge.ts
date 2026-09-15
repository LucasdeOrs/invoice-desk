import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { INVOICE_STATUS_LABELS, InvoiceStatus } from '../data/invoice.model';

@Component({
  selector: 'app-invoice-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="classes()">{{ label() }}</span>`,
  styles: `
    :host {
      display: inline-block;
    }
    span {
      display: inline-flex;
      align-items: center;
      padding: 2px var(--space-2);
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .badge--draft {
      color: var(--color-text-muted);
      background: var(--color-bg);
      border: 1px solid var(--color-border);
    }
    .badge--submitted {
      color: var(--color-primary);
      background: var(--color-primary-weak);
    }
    .badge--pending_approval {
      color: var(--color-warning);
      background: color-mix(in srgb, var(--color-warning) 14%, transparent);
    }
    .badge--approved {
      color: var(--color-success);
      background: color-mix(in srgb, var(--color-success) 14%, transparent);
    }
    .badge--rejected {
      color: var(--color-danger);
      background: color-mix(in srgb, var(--color-danger) 14%, transparent);
    }
  `,
})
export class InvoiceStatusBadge {
  readonly status = input.required<InvoiceStatus>();

  protected readonly label = computed(() => INVOICE_STATUS_LABELS[this.status()]);
  protected readonly classes = computed(() => `badge badge--${this.status()}`);
}
