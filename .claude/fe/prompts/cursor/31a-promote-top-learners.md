# BATCH 31a — Promote TopLearners to its real component home

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`18f84f5b refactor(fe): enforce semantic closure ratchet`

B31 Phase 1 proved that the Leaderboard vertical slice cannot close while
`TopLearners/**` remains nested inside `pages/DashboardPage/**` and carries
`page-folder-two-files-only`. This prerequisite batch resolves that structural
blocker only.

Do not resume LeaderboardListCard internals in this batch.

## Objective

Move the reusable TopLearners component/container family from:

```text
src/components/pages/DashboardPage/TopLearners/**
```

to its real sentence-tier home:

```text
src/components/blocks/dashboard/TopLearners/**
```

Update every in-repo import and make every retained changed TS/TSX file reach:

```text
0 ESLint errors
0 ESLint warnings
```

The move is complete only when the old page subfolder is gone, all consumers
resolve through the new block path, behavior is unchanged, and no compatibility
barrel or forwarding file remains at the old path.

## Read first

- B31 inventory/status artifacts;
- every file under the current `TopLearners/**` folder;
- all imports and JSX consumers of `TopLearners`, its component, props, and
  skeleton;
- `src/components/pages/DashboardPage/component.tsx` and
  `src/components/pages/DashboardPage/index.tsx`;
- sibling dashboard block conventions under `src/components/blocks/dashboard`;
- Storybook tree for an existing TopLearners twin/story;
- `.claude/fe/decision-ledger.json`;
- rules and tests for `page-folder-two-files-only`, public CSS doors,
  sentence-tier raw layout, and skeleton contracts.

Use AST-aware import/consumer scans. Record whether each file is:

- presentational shape;
- connected data/wiring;
- skeleton implementation;
- type/helper;
- story/twin.

Do not assume moving every old file unchanged is architecturally valid.

## Filing law

`pages/DashboardPage/` keeps only its page shape and wiring halves. A reusable
dashboard sentence belongs under `blocks/dashboard/TopLearners`.

Within the new block folder:

- preserve direct named exports;
- no runtime namespace object;
- no compatibility export from the retired page path;
- no new barrel above the component family;
- keep files/folders only when each has a real responsibility;
- do not merge connected wiring into a presentational file merely to reduce
  file count;
- move fetch/state wiring to an existing appropriate hook/container home if
  block presentational-purity requires it.

If the current `index.tsx` performs page-owned data fetching and cannot live in
a block under existing canon, split ownership honestly using an existing
pattern. Do not weaken `presentational-purity` and do not invent a generic
folder.

## CSS-door and placement closure

The B31 inventory found these TopLearners debts:

- `WithClassNames` / public `className` declarations;
- dead `className` passthrough to `LeaderboardListCard`;
- placement passed through Stack/Skeleton class props;
- page-folder warnings.

Resolve only the TopLearners-owned cases:

- remove the dead root `className` API after a whole-repo AST scan proves zero
  real consumers;
- remove the dead `LeaderboardListCard className` passthrough;
- move parent placement to the immediate owning frame using an existing
  contract;
- use existing semantic skeleton sizing props/contracts where exact;
- retain intrinsic shimmer appearance only at the vocabulary owner;
- do not replace removed props with raw wrapper CSS;
- do not pass `gap`, `padding`, `align`, `justify`, `className`, or
  `classNames` beside a principle-owned frame.

Do not edit `LeaderboardListCard/index.tsx` in B31a. Its public door remains
open until B31b/resumed B31 can close the whole component. Removing the
TopLearners passthrough is consumer preparation, not a claim that the
Leaderboard door is closed.

## Skeleton boundary

Preserve loading conditions, shimmer count, dimensions, DOM order, and loaded
content behavior. This batch may migrate a CSS placement prop only when an
existing typed skeleton/frame contract preserves the exact shape.

If zero-warning requires redesigning a parallel skeleton tree or changing
loading semantics, stop and report the exact blocker. Do not perform that
redesign in B31a and do not leave the file changed.

## Storybook

If a TopLearners twin exists, Storybook is the blueprint: move/fix it first,
then mirror src. If no twin exists, record `none` with scan evidence; do not
invent a fake twin merely for parity counts.

## Workers

Use four disjoint workers:

1. `filing-inventory`
   - classify files, imports, consumers, destination shape; no product edits.
2. `storybook-top-learners`
   - existing Storybook twin/story only; hold with evidence if absent.
3. `src-top-learners-promotion`
   - exact source move, imports, TopLearners-owned warning closure.
4. `coordinator-gates`
   - manifests, overlap, parity, ledger, bounded lint, reports, regression
     repair within already owned files.

No file may appear in multiple edit manifests. Workers may read dependencies
but may edit only their manifest. The coordinator is the only ledger writer.

## Touched-file ratchet

Run focused ESLint before editing every proposed file. A file may remain in the
final diff only when it reaches zero warnings.

If a Dashboard page owner cannot reach zero warnings because of unrelated
page-folder peers, skeleton debt, or another forbidden contract:

- prefer an import-only update when that file itself becomes zero-warning;
- otherwise stop with the exact structural blocker;
- do not add a compatibility file at the old path;
- do not call pre-existing warnings acceptable;
- do not partially move the family.

Atomicity requirement: either the TopLearners family and all imports move
cleanly, or product edits are retracted and B31a is reported blocked.

## Forbidden

- no edits to `LeaderboardListCard/index.tsx` internals or its public API;
- no LeagueCard/CommunityTab refactor beyond a mechanically required import;
- no new principle, spacing token, semantic variant, slot, or CSS-shaped API;
- no public `className`, `classNames`, per-part CSS prop, raw token prop, or
  compatibility alias;
- no raw private CSS replacement for a removed door;
- no Box escape-hatch proliferation;
- no core Button/Chip/Stack/Grid/Box API changes;
- no Nivo/Nivoexpert, locked path, teacher hold, a11y/ARIA/keyboard/contrast,
  loading behavior, or unrelated page-folder cleanup;
- no ESLint config/severity/allowlist changes or disable comments;
- no formatter, line-ending churn, empty interface/destructure, stale import,
  obsolete type, or unrelated authoring cleanup;
- no commit, push, reset, checkout, branch, or git-history operation.

## Artifacts

Write:

- `.artifacts/fe-refactor-audit/2026-08-09-b31a-inventory.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31a-worker-<name>.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31a-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31a-status.md`

Each worker report must include:

```text
manifest
classification
importsBefore
importsAfter
warningsBefore
warningsAfter
changed
moved
deleted
skipped
holds
publicDoorsRemoved
rawPayloadResiduals
skeletonParity
storybookParity
verification
regressions
overlapCheck
```

The aggregate must state clearly that `LeaderboardListCard.className` remains
open in this prerequisite batch.

## Mandatory verification

Build the changed-file set from tracked diffs and untracked TS/TSX/MJS files,
excluding `.artifacts/**`. Run ESLint in bounded PowerShell chunks.

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <every changed TS/TSX/MJS file, bounded chunks>
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/sentence-tier.test.mjs
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npm run audit:fe
git diff --check
```

Also prove:

```text
old TopLearners path: absent
imports from old path: 0
compatibility exports at old path: 0
new family open-tag consumers: enumerated
changed-set warnings: 0
overlapping edits: 0
```

Do not commit. If any atomic completion condition fails, retract B31a product
edits and report the exact blocker.
