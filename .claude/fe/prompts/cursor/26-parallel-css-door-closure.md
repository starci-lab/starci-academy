# BATCH 26 — Parallel CSS-door closure

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`a5453824 refactor(fe): close safe typography CSS doors`

BATCH 25 closed 22 proven-safe call-site doors. Remaining findings are mostly
live APIs, real placement, vendor boundaries, locked paths, or ambiguous
consumers. This batch uses parallel workers for speed, but only the
coordinator may assign manifests and aggregate results.

## Objective

Burn only the remaining `no-public-classname-prop` findings that are proven
safe after a fresh consumer search:

- safe no-op className/classNames values;
- dead passthroughs with zero consumers;
- duplicate or unreachable CSS values;
- exact parent-placement moves using an existing principle and unchanged DOM;
- mechanical import/type/export cleanup required by those changes.

Scope:

- `src/components/**`;
- `.storybook/components/**`.

Storybook is the contract source. Mirror approved changes into the src twin.
The coordinator must prove that each Storybook/src pair has one owner.

## Hard boundaries

Do not touch:

- live APIs on Button, Chip, Stack, Grid, Box, SurfaceCard, or any component
  with a real consumer;
- non-duplicate Typography/Skeleton placement;
- vendor and foreign-mount boundaries, including HeroUI and Box;
- DrawerShell/Nivoexpert LessonEditorPanel;
- ShowcaseMockup/LearnLoopScroll;
- MiniCart, CvPreview, PDFView, and approved B19–B25 contracts;
- `ComponentType` skeleton slots or any loading semantics;
- Nivo/Nivoexpert, teacher holds, locked paths, ambiguous identity roots;
- any case requiring a new token, principle, variant, slot, public API rename,
  Box escape hatch, CSS wrapper, or eslint-disable.

Do not work on a11y, contrast, axe, ARIA, keyboard behavior, raw-shape debt,
page-folder moves, or pattern-coverage holds.

No worker may edit `.claude/fe/decision-ledger.json`. Only the coordinator may
write a ledger entry after aggregation, and only for an already-proven
decision. Workers write artifacts only.

## Coordinator protocol

Before dispatch:

1. Run a fresh `starci-fe/no-public-classname-prop` inventory.
2. Reclassify every finding as:

   `safe-noop | dead-passthrough | parent-placement | live-api |
   vendor-boundary | locked | teacher-hold | ambiguous`

3. Generate a concrete file manifest for each worker. A file may occur in one
   manifest only. A Storybook/src twin pair must have one owner.
4. Dispatch all workers in parallel only after the manifests are disjoint.
5. Reconcile worker reports, repair only verified regressions centrally, then
   run the full verification suite.

## Parallel partitions

Use twelve disjoint partitions. The listed paths are ownership boundaries; the
coordinator must further split them into exact file manifests:

1. `atoms-display-media` — atoms display, media, and feedback
2. `atoms-forms` — atoms forms and private form helpers
3. `composites-form` — composites form and `_field`
4. `composites-buttons-feedback` — buttons, feedback, and dialogs
5. `composites-layout-navigation` — layout and navigation
6. `composites-lists-stats-text-viewers` — lists, stats, text, viewers, and
   remaining composites
7. `frames` — all eligible frames
8. `blocks-cards-commerce` — cards, commerce, and related blocks
9. `blocks-learn-practice` — learn, practice, flashcards, and related blocks
10. `blocks-domain-profile` — domain, profile, consultant, identity, and
    remaining eligible blocks
11. `pages-and-overlays` — eligible pages and overlays, excluding locked paths
12. `storybook-only` — only `.storybook/components/**` files without an src
    twin that are not already owned by partitions 1–11

Workers must read the complete file and its twin before editing. They may edit
only their manifest. If a candidate is live, vendor, locked, teacher-held, or
ambiguous, they must hold it instead of making a speculative change.

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b26-worker-<name>.json`

Required fields: `manifest`, `changed`, `applied`, `skipped`, `holds`,
`evidence`, `principles`, `parity`, `verification`, `regressions`, and
`overlapCheck`.

The coordinator aggregates:

`.artifacts/fe-refactor-audit/2026-08-09-b26-status.json`
`.artifacts/fe-refactor-audit/2026-08-09-b26-status.md`

Report before/after counts by rule and classification, exact files changed,
the number of workers, overlap result, Storybook/src parity, every preserved
hold, and regressions. A proposal, inventory, or handoff is not a fix.

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
