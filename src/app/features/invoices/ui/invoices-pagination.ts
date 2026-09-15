import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-invoices-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pagination">
      <span class="pagination__summary"
        >{{ total() }} invoice{{ total() === 1 ? '' : 's' }} · page {{ page() }} of
        {{ pageCount() }}</span
      >
      <div class="pagination__controls">
        <button type="button" [disabled]="page() <= 1" (click)="pageChange.emit(page() - 1)">
          Previous
        </button>
        <button
          type="button"
          [disabled]="page() >= pageCount()"
          (click)="pageChange.emit(page() + 1)"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin-top: var(--space-4);
    }
    .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
    }
    .pagination__summary {
      color: var(--color-text-muted);
      font-size: 0.875rem;
    }
    .pagination__controls {
      display: flex;
      gap: var(--space-2);
    }
    button {
      font: inherit;
      padding: var(--space-1) var(--space-3);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: inherit;
      cursor: pointer;
    }
    button:hover:not(:disabled) {
      background: var(--color-bg);
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class InvoicesPagination {
  readonly page = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly total = input.required<number>();

  readonly pageChange = output<number>();
}
