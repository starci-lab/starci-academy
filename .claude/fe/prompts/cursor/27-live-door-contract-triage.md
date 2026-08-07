# BATCH 27 — Live CSS-door contract triage

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`a7b574c2 refactor(fe): burn parallel dead CSS doors`

BATCH 26 reduced the CSS-door inventory from 2,194 to 1,671 hits. It removed
proven-dead passthroughs across 266 files. The remaining findings are expected
to be mostly live APIs, real placement decisions, vendor boundaries, locked
paths, and ambiguous consumers. This batch must distinguish those categories
before proposing any new contract.

## Objective

Re-scan the remaining `starci-fe/no-public-classname-prop` findings and produce
a trustworthy contract map. Apply code only for:

- a dead door with zero repository consumers;
- a no-op or duplicate class value;
- an exact parent-placement move using an existing principle;
- mechanical imports/types/exports required by those proven changes.

For live or ambiguous doors, write a concrete proposal with evidence but do
not invent a variant, slot, token, or public API in this batch.

Scope:

- `src/components/**`;
- `.storybook/components/**`.

Storybook is the contract source. Keep src twins aligned when code is applied.

## Classification

Every finding must receive exactly one classification:

`dead-safe | safe-noop | parent-placement | live-api | semantic-contract |
vendor-boundary | locked | teacher-hold | ambiguous`

Required evidence for `live-api` and `semantic-contract`:

- all in-repo consumers;
- whether the prop affects intrinsic appearance, parent placement, or a
  foreign mount;
- the smallest future semantic API that could replace it;
- why that API must not be invented in B27.

## Hard boundaries

Do not edit:

- Button, Chip, Stack, Grid, Box, SurfaceCard, or other live APIs without a
  proven dead consumer set;
- HeroUI/vendor boundaries or foreign mounts;
- DrawerShell/Nivoexpert LessonEditorPanel;
- ShowcaseMockup/LearnLoopScroll;
- MiniCart, CvPreview, PDFView, and approved B19–B26 contracts;
- `ComponentType` skeleton slots or loading semantics;
- Nivo/Nivoexpert, locked paths, teacher holds, or ambiguous identity roots.

Do not work on a11y, contrast, axe, ARIA, keyboard behavior, raw-shape debt,
page-folder moves, or pattern-coverage holds.

Do not change lint severity or vendor allowlists. Do not add eslint-disable.

## Coordinator and parallel workers

The coordinator must:

1. run a fresh inventory;
2. assign each file to one worker only;
3. keep Storybook/src twins under one owner;
4. forbid workers from editing the decision ledger;
5. aggregate proposals and update the ledger only once after reconciliation.

Use ten disjoint workers:

1. `blocks-auth-commerce`
2. `blocks-community-feed`
3. `blocks-cv-grading`
4. `blocks-learn-practice`
5. `blocks-layout-navigation-media`
6. `blocks-profile-stats-marketing`
7. `layouts-and-overlays`
8. `pages-dashboard-learning`
9. `pages-profile-admin-other`
10. `storybook-only-and-residual`

The manifest must contain exact files, not only directory globs. A worker may
edit only its manifest. Workers must read the full file and twin before any
edit. No formatter, line-ending rewrite, or unrelated cleanup is allowed.

When removing a dead `WithClassNames` door, also remove its unused import,
empty destructuring, and stale public type cleanly. Never leave `{}` parameter
patterns, unused imports, `Record<string, never>` accidentally joined to a
following comment, or unrelated formatting churn.

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b27-worker-<name>.json`

Required fields: `manifest`, `changed`, `applied`, `classification`, `holds`,
`consumerEvidence`, `proposals`, `parity`, `verification`, `regressions`, and
`overlapCheck`.

Aggregate into:

`.artifacts/fe-refactor-audit/2026-08-09-b27-status.json`
`.artifacts/fe-refactor-audit/2026-08-09-b27-status.md`

Report before/after counts by classification, exact files changed, all live
API proposals, all holds, Storybook/src parity, overlap status, and regressions.
Do not count proposals or classifications as fixes.

## Verification

Each worker must run ESLint on its changed files in bounded chunks. The
coordinator must run:

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <changed files, bounded Windows chunks>
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npm run audit:fe
```

Do not commit, reset, checkout, push, create branches, or modify git history.
