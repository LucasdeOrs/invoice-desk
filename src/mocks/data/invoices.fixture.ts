import type { InvoiceSummary } from '@features/invoices/data/invoice-summary.model';
import type { InvoiceStatus } from '@features/invoices/data/invoice.model';

/**
 * A deterministically generated set of invoices for the mock API.
 *
 * Real enough to make server-side filtering, sorting and pagination visible —
 * a handful of hand-typed rows would just page through everything at once.
 * Seeded so the dataset is identical on every run (dev, tests, CI, the demo).
 */

const SUPPLIERS = [
  'Atlas Office Supplies',
  'Northwind Logistics',
  'Brightline Software',
  'Cedar & Co. Consulting',
  'Meridian Facilities',
  'Harbor Print & Design',
  'Quillon Legal Services',
  'Fernbank Catering',
  'Solace IT Solutions',
  'Ironwood Freight',
];

const STATUS_WEIGHTS: readonly (readonly [InvoiceStatus, number])[] = [
  ['draft', 1],
  ['submitted', 2],
  ['pending_approval', 3],
  ['approved', 5],
  ['rejected', 1],
];

/** Small seeded PRNG (mulberry32) — no dependency, good enough for fixture data. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted<T>(random: () => number, weighted: readonly (readonly [T, number])[]): T {
  const total = weighted.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = random() * total;
  for (const [value, weight] of weighted) {
    roll -= weight;
    if (roll <= 0) {
      return value;
    }
  }
  return weighted[weighted.length - 1][0];
}

function generateInvoices(count: number): InvoiceSummary[] {
  const random = mulberry32(20260501);
  const baseDate = Date.UTC(2026, 4, 1); // 2026-05-01
  const spanDays = 140;

  return Array.from({ length: count }, (_, index) => {
    const supplier = SUPPLIERS[Math.floor(random() * SUPPLIERS.length)];
    const status = pickWeighted(random, STATUS_WEIGHTS);
    const amount = Math.round((80 + random() * 19_920) * 100) / 100;
    const dayOffset = Math.floor(random() * spanDays);
    const issuedOn = new Date(baseDate + dayOffset * 86_400_000).toISOString().slice(0, 10);

    return {
      id: `inv-${1001 + index}`,
      number: `INV-${1001 + index}`,
      supplier,
      amount,
      currency: 'EUR',
      status,
      issuedOn,
    };
  });
}

export const INVOICES_FIXTURE: InvoiceSummary[] = generateInvoices(64);
