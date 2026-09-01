# ContentArticle LockedContentMask migration — final — 2026-08-07

Inventory: `2026-08-07-contentarticle-box-report.md`. Ledger: `contentarticle-locked-mask-2026-08-07`.

## Classifications → outcome

| ID | Class | Outcome |
|---|---|---|
| CA-1–4 | shared-owner | Reused `LockedContentMask` (SB + src) |
| CA-5 | hard-case | Bare `<div>` around `SurfaceCard` left (no layout CSS) |
| CA-6 | semantic | Unchanged |
| CA-7 | story fixture | Allowed |
| CA-8–11 | n/a | No HideAbove / PageEndPad / Box / article host attrs |

## Owners

- **Reused:** `LockedContentMask`
- **Created:** none
- **Not needed:** `HideAbove`, `PageEndPad`

## Files changed

- `.storybook/components/starci/blocks/learn/ContentArticle/ContentArticle.tsx`
- `src/components/blocks/learn/ContentArticle/index.tsx`
- `plugins/eslint/contentpage.mjs` + `contentpage.test.mjs` (paths + messages)
- LockedContentMask comment (SB + src)
- `.storybook/components/atoms/buttons/ButtonGroup/ButtonGroup.tsx` (ATOM-11 twin — disjoint)
- artifacts + ledger

## Storybook / src parity

Both ContentArticle trees: `LockedContentMask` wraps `MarkdownContent`; paywall sibling unchanged; `cn` / raw fade removed.

## ESLint

`starci-fe/no-contentpage-box-classname` now covers ContentPage **and** ContentArticle product paths; stories exempt; singular `principle` in message.

## ATOM-11

Confirmed drift: src-only `export const ButtonGroup = { Root, Separator }` from the earlier export-matches burn. Mirrored into SB ButtonGroup. Outside ContentArticle files; does not alter this migration.

## Teacher holds

27 preserved; pattern-coverage 0 failing.

## Hard cases

- Bare outer `<div>` on ContentArticle (CA-5) — no layout CSS; leave.
- EnrollGate still duplicates the fade string — sibling follow-up.

## Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | pass |
| contentpage rule tests | pass |
| principle-style | pass (7/7) |
| eslint `--max-warnings=0` SB ContentArticle + owners + rule | pass |
| eslint `--quiet` ContentArticle (errors) | pass |
| eslint `--max-warnings=0` src ContentArticle | fail — pre-existing identity-root + StackV missing-both (out of scope) |
| Focused scan: no Box / select-none / gradient / `@app-lg` / `pb-6` in ContentArticle impls | pass |
| `audit:fe` pattern-coverage | 27 holds / 0 failing |
| `audit:fe` ATOM-11 | fixed by SB ButtonGroup namespace mirror |
