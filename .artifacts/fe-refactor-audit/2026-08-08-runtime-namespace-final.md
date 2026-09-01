# Runtime namespaces — final — 2026-08-08

Inventory: `2026-08-08-runtime-namespace-report.md`. Ledger: `no-runtime-namespace-2026-08-08`.

## Counts

| Metric | Before | After |
|---|---|---|
| House `export const X = {…}` namespaces | **16** | **0** |
| House consumers needing import rewrite | 0 | 0 |
| Teacher holds | 27 | 27 (unchanged) |

## Files changed

**Definitions (namespace object removed):**
- SB + src: ButtonGroup, Modal, Drawer, Select, ListBox, AlertDialog, Table, Page (16 files)

**Rules:**
- `plugins/eslint/namespaces.mjs` — any-member usage ban; vendor `import *` destructure allowlist
- `plugins/eslint/namespaces.test.mjs`
- `plugins/eslint/index.mjs` — `export-matches-folder` accepts `Folder` or `Folder*` family

**Docs/ledger:** Page export comments, decision ledger, artifacts

## What stayed (allowed)

- HeroUI `Modal.*` / `Select.*` / `Drawer.*` / `Table.*` / `ListBox.*` / `ButtonGroup.*` / `AlertDialog.*` where imported from `@heroui/react`
- Story anatomy metadata strings naming HeroUI parts
- Direct named exports (`ModalRoot`, `PageHeader`, …)

## Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | pass |
| namespaces / authoring / contentpage tests | pass (8) |
| principle-style | pass (7/7) |
| `npm run audit:fe` | **every job exited 0** (ATOM-11 ok; 27 holds / 0 failing) |
| eslint `--quiet` on changed defs + rules | pass |
| eslint `--max-warnings=0` on changed defs | fail — pre-existing `require-export-jsdoc` / Page missing-both / emoji (out of scope) |
| Final scan: house namespace exports | **0** |

## Hard cases / holds

None new. Vendor compound APIs remain at HeroUI call sites by design.
