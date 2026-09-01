# Pattern seam partition agent — shared contract

Repo: `D:\Repositories\starci-academy`
Baseline coverage: ~1305 holes (post CartPage / CourseCatalog / AcademySettingsForm).
Canon principles: `.storybook/test-runner/patterns.mjs` (do not invent tokens).
Ledger: `.claude/fe/decision-ledger.json` (append teacher holds only).

## Your job

Migrate ONLY the directories listed in your partition. Do not touch other directories or completed work:
- `src/components/pages/CourseCatalogPage`
- `src/components/pages/CartPage`
- `.storybook/components/nivoexpert/pages/AcademySettingsForm`

## Before editing each directory

Print a table:

| file | line | frame | gap/padding | class | intended action |

Refresh exact holes with the gate logic (frames with layout decision and no single `principle`, plus raw spacing classNames under design-system path prefix — note `src/components/page` also matches `pages/` via prefix).

## Classification

1. **redundant-wrapper** — remove only if no layout/seam/behavior/identity.
2. **real-seam-no-owner** — add exactly one valid `principle` matching the gap/padding step.
3. **padding-plus-gap** — split into nested one-responsibility frames.
4. **raw-vendor-foreign** — convert hand-rolled `flex`+`gap-*`/`p-*` to house frames with one principle when that is the honest owner; preserve only genuine foreign mounts (document). Do not stamp a principle on a raw div just to silence the gate.
5. **intentional-no-seam** — remove unnecessary frame or ledger it.

Gap step → tokens (must match):
- 1: `name-handle`
- 2: `icon-text` | `separator-dot` | `title-subtitle`
- 3: `flex-action` | `identity` | `value-row` | `chip-row` | `sibling-stack`
- 4: `label-field` | `content-row` | `card-caption`
- 5: `group-boundary`
- 6: `block-boundary`
- 7: `layout-split`
- 8: `marketing-beat` (landing only)

Padding: `cell-pad` | `card-padding` | `page-pad` | `control-pad` | `row-pad` | `pill-pad`
Margin: `push-end` | `pin-bottom` | `center-measure`

If no token fits while preserving visual gap: append a teacher-hold object to `.claude/fe/decision-ledger.json` and continue.

## Ordering

Storybook twin first, then mirror src. Source-only: src only; note no twin.

## Forbidden

- atom/composite/frame API changes
- ESLint / backend gates / canon
- `principle={[...]}` / multi-token / fake data-principle
- public atom className
- eslint-disable to hide debt
- editing outside your directory list
- commit / push

## Preserve

visual spacing, skeletons, ComponentTypeWithSkeleton, controlled forms, Box escape hatches

## Verify (partition-local)

```
npx tsc --noEmit
node D:/Repositories/starci-academy-backend/.claude/scripts/gates/check-pattern-coverage.mjs --report
```

Confirm your directories no longer appear (or only teacher-held leftovers you documented).

## Return to coordinator

- files changed
- seams resolved count
- teacher holds added (ids)
- regressions / stopped work
- before/after hole count for your dirs
