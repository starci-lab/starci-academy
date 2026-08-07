# BATCH 25 — Call-site CSS-door closure

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`a7052eee refactor(fe): type skeleton control slots`

BATCH 24 removed proven-dead public CSS doors and BATCH 24 follow-up made
`FieldFrame.skeletonControl` a typed `ComponentType` slot. The remaining
`no-public-classname-prop` findings are mostly live APIs, real placement
decisions, vendor boundaries, or unresolved consumers. This batch closes only
call-site cases that have repository-wide proof.

## Objective

Reduce remaining `className` / `classNames` usage on house components without
changing live public APIs or inventing new layout vocabulary.

Scope both trees:

- `src/components/**`;
- `.storybook/components/**`.

Storybook is the contract source. Mirror every approved change into the src
twin when a twin exists.

## Allowed changes

After a fresh inventory, apply only one of these proven cases:

1. Delete a no-op, empty, duplicate, or unreachable className/classNames value
   at a house-component call site.
2. Move a genuine parent-placement decision to the owning parent only when an
   existing principle has exactly the same meaning and spacing. Preserve the
   rendered DOM and responsive behavior.
3. Remove a redundant class passed through a wrapper when the wrapper does not
   consume it and no consumer depends on the prop.
4. Make mechanical import/type/export fixes caused by the above.

For every applied case, record the exact consumer search, the owning frame,
the existing principle used (if any), and the Storybook/src parity result.

## Mandatory holds

Leave unchanged:

- live public APIs on Button, Chip, Stack, Grid, Box, SurfaceCard, and other
  components with verified consumers;
- Button/Chip/Stack/Grid call-site CSS unless the parent-placement proof is
  exact and behavior-neutral;
- vendor-boundary usage, HeroUI usage, and foreign mount points;
- DrawerShell/Nivoexpert LessonEditorPanel;
- ShowcaseMockup and locked LearnLoopScroll;
- MiniCart, CvPreview, PDFView, and all approved B19–B24 contracts;
- skeleton/loading behavior and all `ComponentType` skeleton slots;
- Nivo/Nivoexpert, locked paths, teacher holds, ambiguous identity roots;
- any case requiring a new principle, token, variant, slot, public API rename,
  Box escape hatch, CSS wrapper, or eslint-disable.

Do not work on a11y, contrast, axe, ARIA, keyboard behavior, raw-shape debt,
page-folder moves, or pattern-coverage holds.

## Required workflow

Before editing:

1. Run a fresh `starci-fe/no-public-classname-prop` inventory.
2. Reclassify every candidate as:

   `safe-noop | parent-placement | live-prop | vendor-boundary | locked |
   teacher-hold | ambiguous`

3. Create disjoint manifests. No file may belong to two workers.
4. Confirm that a proposed deletion has zero in-repo consumers before editing
   a prop declaration or passthrough.

Use these disjoint workers:

1. `atoms` — `.storybook/components/atoms/**` and `src/components/atoms/**`
2. `composites` — `.storybook/components/composites/**` and
   `src/components/composites/**`
3. `frames` — `.storybook/components/frames/**` and `src/components/frames/**`
4. `blocks` — `.storybook/components/blocks/**` and `src/components/blocks/**`
5. `pages-learning-commerce` — eligible learning and commerce pages only
6. `pages-profile-dashboard` — eligible profile and dashboard pages only
7. `pages-other` — remaining eligible page trees, excluding all locked paths
8. `storybook-only` — eligible Storybook components without an src twin

Workers must read the complete file and twin before editing. They may edit only
their manifest. A live, vendor, or ambiguous finding must be held rather than
rewritten mechanically.

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b25-worker-<name>.json`

Required fields: `manifest`, `changed`, `applied`, `skipped`, `holds`,
`evidence`, `principles`, `parity`, `verification`, and `regressions`.

Aggregate into:

`.artifacts/fe-refactor-audit/2026-08-09-b25-status.json`
`.artifacts/fe-refactor-audit/2026-08-09-b25-status.md`

Report before/after counts by rule and classification, exact files changed,
all preserved holds, Storybook/src parity, and regressions. Do not count a
proposal, inventory, or documentation-only handoff as a fix.

## Verification after aggregation

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <changed files>
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npm run audit:fe
```

Do not commit, reset, checkout, push, create branches, or modify git history.
