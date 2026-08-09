# BATCH 31 — Leaderboard vertical closure

Repo: `D:\Repositories\starci-academy`

Start only after the B30c checkpoint is committed. Read the current HEAD and
record it in the report. If B30c is still uncommitted, stop and report that
precondition; do not mix B31 with the B30c working tree.

## Objective

Close one complete vertical slice instead of burning CSS doors horizontally:

```text
LeaderboardListCard -> TopLearners -> direct page owner
```

The slice is complete only when every changed TS/TSX/MJS file has zero ESLint
warnings and the public `LeaderboardListCard.className` door is honestly gone.

Do not optimize for hit-count reduction. Optimize for one coherent component
family reaching a strict, reusable contract with no hidden raw CSS.

## Read first

- `src/components/blocks/dashboard/LeaderboardListCard/index.tsx`;
- every direct `LeaderboardListCard` consumer;
- `src/components/pages/DashboardPage/TopLearners/**`;
- `src/components/pages/DashboardPage/LeagueCard/**`;
- the direct page/layout owners of those consumers;
- Storybook twins/stories if they exist;
- relevant frames/composites used by the current implementation;
- `plugins/eslint/sentence-tier.test.mjs`;
- `.claude/fe/decision-ledger.json`;
- B30/B30b/B30c status reports for the failed and retracted attempt.

Run an AST-aware consumer scan. Nested `className` values on UserCell, Link,
Typography, icons, rows, or trailing controls are not automatically
`LeaderboardListCard` root consumers.

## Phase 1 — Exact inventory, no edits

Create:

`.artifacts/fe-refactor-audit/2026-08-09-b31-inventory.json`

For every file in the proposed manifest record:

```text
eslint findings by rule and line
public CSS-door declarations
open-tag consumers and exact values
raw host layout and its semantic relationship
HeroUI imports and existing StarCi equivalents
identity root
skeleton/loading ownership
Storybook/src twin status
page-folder structural findings
locked/vendor/teacher-hold dependencies
```

Classify every layout payload as:

- intrinsic leaf chrome;
- child relationship owned by the component;
- placement owned by the immediate parent;
- vendor boundary;
- unresolved contract.

Do not edit until the coordinator has a complete manifest and confirms files
do not overlap with locked/Nivo/teacher-held paths.

## Phase 2 — Contract design

### LeaderboardListCard root

`bare` controls card chrome only:

- `bare=true`: no `LabeledCard` chrome;
- `bare=false`: the same semantic content is wrapped by `LabeledCard`.

The relationship among standing, optional podium/top slot, ranked list, and
pinned row is owned by `LeaderboardListCard`, not the page. Reuse one shared
semantic render across both branches.

Use the existing:

```tsx
<StackV principle="sibling-stack" items={contentItems} />
```

Do not pass `gap`; the principle owns spacing. Do not replace it with a raw
`div` or a private `flex flex-col gap-3` payload.

Root width, margin, grid placement, and responsive behavior belong to the
immediate consumer/parent. Migrate exact placement before deleting the public
door.

### Internal rows

Do not mechanically convert every host element into `Box`. For each row:

- use an existing list/identity/action composite when it already expresses the
  complete behavior;
- use `StackH`/`StackV` only with an honest existing principle;
- intrinsic medal slots, tabular numeric treatment, verdict bands, and link
  behavior must remain visually and semantically identical;
- Typography appearance may use its closed semantic props, never public
  placement classNames;
- placement such as shrink, width, flex participation, or alignment must move
  to the owning frame/parent through an existing contract.

If an exact relationship has no honest existing principle or component,
record a concrete missing-contract proposal and stop that subpart. Do not
invent a token in this batch.

### HeroUI

Remove sentence-tier HeroUI imports only when an existing StarCi vocabulary
component is behaviorally identical. Preserve Link navigation semantics and
Typography output. If no equivalent exists, produce an exact vocabulary gap;
do not wrap HeroUI locally or weaken lint.

### Identity

Stamp identity only on the proven exported semantic root. Do not add identity
wrapper divs. Conditional `bare` and card branches must retain one coherent
component identity strategy.

### Skeleton/loading

Read skeleton consumers for parity, but do not redesign loading behavior in
B31. If changed-file zero-warning requires parallel-skeleton work, classify it
as a blocker and keep the affected consumer outside the edit manifest. Never
silently alter shimmer shape or loading conditions.

## Phase 3 — Apply vertically

Use four disjoint workers:

1. `leaderboard-contract`
   - LeaderboardListCard only and its direct Storybook twin if present.
2. `top-learners-consumer`
   - TopLearners chain and its immediate parent placement.
3. `league-card-consumers`
   - LeagueCard consumers, read first; edit only files capable of zero-warning
     closure without skeleton/loading changes.
4. `coordinator-gates`
   - inventory, manifests, overlap/parity, ledger, reports, bounded lint, and
     regression repair.

No file may occur in multiple manifests. Workers may read outside their
manifest but may not edit outside it.

Storybook first when a twin exists, then mirror src. Preserve public data
types, row ordering, links, callbacks, labels, verdict behavior, podium logic,
self-row behavior, and visual dimensions.

Delete `LeaderboardListCard.className` and associated `WithClassNames`/`cn`
only after the final AST consumer scan returns zero open-tag consumers and the
equivalent CSS payload no longer survives privately.

## Touched-file ratchet

Before changing a file, run focused ESLint and record its warnings. A file may
remain in the final diff only if it reaches:

```text
0 errors
0 warnings
```

If a file cannot reach zero warnings without a new contract, locked path,
teacher hold, Nivo/Nivoexpert, a11y, skeleton/loading redesign, or unrelated
page-folder migration:

- do not edit that file; or
- retract only B31 edits from it while preserving pre-existing user work.

Do not call pre-existing warnings acceptable. Do not claim a partial door
closure.

## Required lint regression

Extend the sentence-tier regression coverage only if B31 exposes a distinct
AST pattern not already covered. Do not create duplicate rules for diagnostics
already caught by `no-raw-shape-at-sentence-tier`.

The following must remain invalid:

```tsx
<div className="flex flex-col gap-3">...</div>
```

The following is the intended relationship owner:

```tsx
<StackV principle="sibling-stack" items={items} />
```

## Forbidden

- no new principle, spacing token, generic variant, CSS slot, or class alias;
- no public `className`, `classNames`, per-part CSS prop, or raw token API;
- no private raw CSS replacement for a removed door;
- no `gap`, `padding`, `align`, `justify`, `className`, or `classNames` beside
  a principle-owned frame;
- no Box escape-hatch proliferation;
- no core Button/Chip/Stack/Grid/Box API edits;
- no Nivo/Nivoexpert, locked-path, teacher-hold, a11y/ARIA/keyboard/contrast,
  skeleton/loading, page-folder, or unrelated cleanup;
- no ESLint severity/config/allowlist changes or disable comments;
- no formatter, line-ending churn, empty interfaces, empty destructuring,
  stale imports, or obsolete types;
- no commit, push, reset, checkout, branch, or git-history operation.

## Artifacts

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b31-worker-<name>.json`

Required fields:

```text
manifest
warningsBefore
warningsAfter
openTagConsumersBefore
openTagConsumersAfter
layoutOwnership
changed
skipped
holds
publicDoorsRemoved
rawPayloadResiduals
parity
verification
regressions
overlapCheck
```

Aggregate into:

- `.artifacts/fe-refactor-audit/2026-08-09-b31-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31-status.md`

Report exact files retained in the diff, exact files retracted, before/after
warning counts, public doors actually removed, residual holds, semantic owner
for every moved payload, Storybook/src parity, and behavior checks. Proposals
are not fixes.

## Mandatory verification

Build the changed-file set from tracked diffs plus untracked TS/TSX/MJS files,
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

Completion requires:

- the final changed set has zero ESLint warnings;
- `LeaderboardListCard.className` has zero declarations and consumers;
- no equivalent raw root payload remains;
- the shared bare/card semantic content is not duplicated;
- tests, TypeScript, and audits pass;
- no overlap, parity drift, or behavior regression.

If any condition fails, report B31 blocked/partial and leave the door open. Do
not report completion and do not commit.
