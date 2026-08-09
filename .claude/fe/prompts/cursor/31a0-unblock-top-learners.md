# BATCH 31a0 — Unblock TopLearners promotion prerequisites

Repo: `D:\Repositories\starci-academy`

Checkpoint: `18f84f5b refactor(fe): enforce semantic closure ratchet`

B31a and its promotion attempt are blocked. Do not run B31 or move
`TopLearners` in this batch. Resolve only the two proven prerequisites below,
then leave a clean checkpoint for a later B31a retry.

## Blockers to resolve

### A. CommunityTab page-folder blocker

The only live import edge that prevents a zero-warning TopLearners promotion is
`CommunityTab/index.tsx`, which carries `page-folder-two-files-only`.

Inventory the full `CommunityTab` family and its consumers. Move it to its real
home under an existing category (likely `blocks/**` if it is a reusable
sentence, otherwise the exact existing home proven by the source), update every
import, and remove the old path. Preserve behavior and public named exports.

Do not silence or defer `page-folder-two-files-only`. Do not create a
compatibility forwarding file at the old page path. If CommunityTab is truly a
page-specific screen rather than reusable UI, record the evidence and produce
an exact filing proposal; do not force it into blocks.

### B. IconTile skeleton vocabulary blocker

TopLearners' co-located skeleton uses raw `Skeleton className="size-12 …
rounded-xl"` plus sibling bars. A generic `Skeleton` CSS door is not an honest
contract for IconTile chrome.

Inspect `IconTile` in both trees and all consumers. If it already has the
correct typed `isSkeleton` contract, migrate the TopLearners skeleton to
`IconTile isSkeleton` and preserve exact dimensions/counts. If it does not,
add the smallest semantic `isSkeleton` behavior to `IconTile` itself, Storybook
first then mirror src. The skeleton shape must remain owned by IconTile.

Do not add `className`, `classNames`, height/width strings, a generic skeleton
slot, or a free-form variant to IconTile. Do not redesign unrelated skeletons.

## Partition

Use four disjoint workers:

1. `communitytab-inventory-and-filing`
   - CommunityTab tree, consumers, destination classification, and move if
     proven.
2. `icontile-skeleton-contract`
   - IconTile twins and only the proven TopLearners skeleton edge.
3. `consumer-rewire`
   - imports/barrels/stories required by the two changes, only in manifest.
4. `coordinator-gates`
   - manifests, overlap, parity, ledger, reports, bounded lint and regression
     repair.

No file may appear in two edit manifests. Storybook first, then mirror src.
The coordinator writes the ledger and aggregate status once.

## Strict ownership rules

- Parent owns placement; component owns intrinsic appearance and its own
  skeleton geometry.
- Use existing frames/principles only.
- No fake principle/token/variant/slot.
- No raw replacement wrapper after removing a CSS door.
- No CSS props beside a principle-owned frame.
- No `className`/`classNames` public props on house components.
- No runtime house namespaces.
- No unrelated page-folder cleanup.
- No a11y, contrast, ARIA, keyboard, loading semantics, Nivo/Nivoexpert,
  locked paths, teacher holds, or LeaderboardListCard internals.

## Touched-file ratchet

Every changed TS/TSX/MJS file must pass:

```text
0 ESLint errors
0 ESLint warnings
```

Warnings described as pre-existing still block a touched file. If either
prerequisite cannot close without a forbidden contract or broader migration,
retract product edits and report the exact blocker. Do not weaken ESLint,
add a baseline, or use eslint-disable.

## Required evidence

Before edits, create:

`.artifacts/fe-refactor-audit/2026-08-09-b31a0-inventory.json`

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b31a0-worker-<name>.json`

Aggregate into:

- `.artifacts/fe-refactor-audit/2026-08-09-b31a0-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31a0-status.md`

Reports must include:

```text
manifest
consumerEvidence
destinationDecision
warningsBefore
warningsAfter
changed
retracted
holds
publicDoors
skeletonParity
storybookParity
verification
regressions
overlapCheck
```

## Verification

Build the changed-file set from tracked diffs plus untracked TS/TSX/MJS files,
excluding `.artifacts/**`; run ESLint in bounded PowerShell chunks.

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

Do not commit. Completion means both blockers are resolved, all twins/imports
are aligned, changed-set lint is zero-warning, and no unrelated files changed.
Otherwise report blocked and retract the partial product work.
