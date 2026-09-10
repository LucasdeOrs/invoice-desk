# Invoice Desk

[![CI](https://github.com/LucasdeOrs/invoice-desk/actions/workflows/ci.yml/badge.svg)](https://github.com/LucasdeOrs/invoice-desk/actions/workflows/ci.yml)

A supplier‑invoice approval workspace. Invoices arrive from vendors, get registered
with an attachment, are categorised, routed for approval by amount, and approved or
rejected with a full audit trail of who did what.

Built as a focused portfolio project to demonstrate **modern corporate Angular** in a
single dense codebase — the kind of financial/document workflow system I build
professionally, exploring patterns I don't reach for day to day.

> **Status:** bootstrapping. The toolchain is in place; features are being built next.

---

## Why this domain

| The domain needs…                       | …which forces a demonstration of             |
| --------------------------------------- | -------------------------------------------- |
| Large invoice list with filter and sort | Performance, pagination, `OnPush`, `trackBy` |
| Attachment upload and preview           | File handling, real‑world UX                 |
| Approval by amount band                 | State machine, business rules                |
| Roles (viewer, editor, approver)        | Route guards, access control, conditional UI |
| Change history                          | Data modelling, a well‑structured store      |
| Registration form with rules            | Typed reactive forms, async validators       |

Small and deep beats large and shallow: a few impeccable screens over many half‑built ones.

## Technical decisions

| Decision         | Choice                                          | Why                                                                         | Cost accepted                                          |
| ---------------- | ----------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------ |
| Angular version  | **21**                                          | The version I use professionally; very few candidates are on it             | Library ecosystem still catching up                    |
| Components       | Standalone, no NgModules                        | Official framework direction                                                | None material                                          |
| Change detection | **Zoneless** (`provideZonelessChangeDetection`) | No Zone.js, fewer wasted CD cycles, where the framework is heading          | Total discipline with Signals; some old libs may break |
| State            | NgRx Signal Store (`@ngrx/signals`)             | Less boilerplate than classic NgRx, integrates with Signals                 | Tooling/devtools less mature than classic NgRx         |
| Forms            | Typed Reactive Forms                            | End‑to‑end type safety                                                      | More verbose than template‑driven                      |
| API              | MSW (Mock Service Worker)                       | Intercepts at the network layer — works in dev, tests and the deployed demo | Slightly heavier setup than `json-server`              |
| Unit tests       | Jest (+ `jest-preset-angular`)                  | Mature, well‑known                                                          | Replaces Angular 21's built‑in Vitest runner           |
| E2E              | Cypress                                         | Used professionally; reinforces the résumé                                  | —                                                      |
| CI               | GitHub Actions                                  | Standard, README badge                                                      | —                                                      |
| Deploy           | Vercel / Netlify                                | Demo runs with no backend thanks to MSW                                     | —                                                      |

**On zoneless:** Angular 21 is zoneless by default (no `zone.js` polyfill). It's declared
explicitly in [`src/app/app.config.ts`](src/app/app.config.ts) so the change‑detection
strategy is visible in the code rather than implicit.

## Architecture

`data` / `feature` / `ui` per feature (the Nx convention):

```
src/app/
  core/        auth, http interceptors, guards, injection tokens
  shared/      dumb reusable ui, pipes, directives, test helpers
  layout/      shell: header, sidebar, container
  features/
    dashboard/ feature/
    invoices/  data/ (store, api, models, mappers)  feature/ (smart, routed)  ui/ (dumb)
    approvals/ data/  feature/  ui/
```

**The rule:** components in `ui/` never inject a store or an API service. They take
data via `input()` and emit via `output()`. Components in `feature/` wire the store to
the UI. That separation is what makes `ui/` testable without mocks and reusable across
features.

Path aliases: `@core/*`, `@shared/*`, `@layout/*`, `@features/*`.

## Getting started

Requires Node ≥ 20.19.

```bash
npm install
npm start            # dev server at http://localhost:4200 (MSW mocks active)

npm test             # Jest unit tests
npm run test:watch
npm run test:cov     # with coverage

npm run e2e:open     # Cypress interactive (needs the dev server running)
npm run e2e          # Cypress headless

npm run lint         # ESLint (flat config, angular-eslint)
npm run format       # Prettier write

npm run build        # production build to dist/
```

A pre‑commit hook (Husky + lint‑staged) runs ESLint and Prettier on staged files.

## Roadmap

- [ ] App shell + layout, routing skeleton
- [ ] Simulated auth with roles + route guards
- [ ] Invoice list: store, filter, sort, pagination
- [ ] Invoice registration form (typed reactive forms, async validator)
- [ ] Attachment upload + preview
- [ ] Approval routing by amount band + state machine
- [ ] Change history / audit trail
- [ ] Deploy to Vercel/Netlify

## License

MIT
