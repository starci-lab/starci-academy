# ContentPage Box / layout CSS — final report — 2026-08-07

Inventory: `2026-08-07-contentpage-box-report.md`. Ledger: `contentpage-box-strict-2026-08-07`.

## Removed CSS decisions → owners

| Was | Where | Now |
|---|---|---|
| `Box` `relative w-full` | src full-width tab | `Container size="full" padding={1}` (drop vestigial `relative`) |
| `Box` `relative` + fade + `select-none` | src paper locked body | **`LockedContentMask`** (`isLocked`) |
| `Box` `@app-lg:hidden` | src practice nudge | **`HideAbove at="lg"`** |
| `MilestoneUpNextCard className="@app-lg:hidden"` | SB ContentPage | **`HideAbove at="lg"`** wrapping the card |
| `Box` `pb-6` (footer + ad) | src | **`PageEndPad`** (named trailing page-end air) |

## Retained (not layout CSS on Box)

| Item | Class | Why |
|---|---|---|
| Article host | `id="lesson-article"` + `data-ai-selectable` | Foreign attrs for rail scan + AI selection — no layout classes |
| Icon in connected half | `size-4 shrink-0` on tab icon | Atom chrome in `index.tsx`, not page layout |
| Story fixtures | `className="p-8"` / `@container` | Allowed; rule skips `*.stories.*` |

## Hard-cases / sibling debt

| Item | Ledger / note |
|---|---|
| None left on ContentPage product `Box` | Box import removed from both ContentPage trees |
| `ContentArticle` lock mask still raw | Out of ContentPage file scope — migrate later onto `LockedContentMask` |
| `audit:fe` ATOM-11 ButtonGroup twin drift | Pre-existing; unrelated |

## Storybook / src parity

| Concern | SB | src |
|---|---|---|
| Page measure | `Container size="md" padding={6}` | Multiple `Container size="md\|full"` measures (pre-existing shell shape) |
| Practice nudge hide | `HideAbove at="lg"` | `HideAbove at="lg"` |
| Lock fade / select-none | via `ContentArticle` (sibling) | `LockedContentMask` |
| Trailing pb-6 | owned by Container `padding={6}` | `PageEndPad` |

## ESLint

- Rule: `starci-fe/no-contentpage-box-classname` (error)
- Message uses singular `principle`
- Stories / non-ContentPage paths exempt
- Tests: `plugins/eslint/contentpage.test.mjs` — pass

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `node --test plugins/eslint/contentpage.test.mjs` | pass (2) |
| `node --test .storybook/test-runner/principle-style.test.mjs` | pass (7/7) |
| `npm run audit:fe` → pattern-coverage | pass (27 holds, 0 failing) |
| `npm run audit:fe` overall | fail — pre-existing ATOM-11 ButtonGroup SB/src twin drift |
| eslint new vocabulary + SB ContentPage + rule files `--max-warnings=0` | pass |
| eslint src ContentPage `--max-warnings=0` | fail — pre-existing `require-frame-self-declare` / `no-inline-skeleton-branch` (missing-both out of scope) |
| eslint `--quiet` (errors only) on ContentPage | pass |
| Focused scan: no `Box` / layout CSS in ContentPage product impls | pass (only `index.tsx` icon atom class remains) |

## New vocabulary (SB + src twins + stories)

- `frames/HideAbove`
- `frames/PageEndPad`
- `composites/layout/LockedContentMask`
