# BATCH 31r — Non-atom tier placement and contract correction

Repo: `D:\Repositories\starci-academy`

Checkpoint: `18f84f5b refactor(fe): enforce semantic closure ratchet`

This is a tier-correction batch. Do not continue TopLearners promotion until
the affected component's tier and contract are honest.

## Objective

Audit house components filed under `atoms/**` that are actually composites or
frames because they receive and arrange caller-owned children. Move each proven
misfiled component to the correct existing tier and update all consumers,
barrels, stories, identity metadata, and Storybook/src twins.

Start with `IconTile`, then expand only to files proven by the inventory. Do not
mass-move every atom based on naming or visual appearance.

## Tier law

An atom is a leaf/value renderer with no caller-owned child it places.

A component is a composite when it:

- receives a `ReactNode`/child and positions it;
- receives an icon component/node and decides its placement inside chrome;
- composes multiple visual parts or fallback branches;
- owns a relationship between a value and its surrounding shape.

A frame owns reusable layout relationships and semantic principles.

A block owns domain/sentence meaning or connected product behavior.

Do not classify by the component's visual size. Classify by ownership and what
it composes.

## IconTile decision

`IconTile` is a composite under this law because it receives `icon`, places it
inside a tile, owns tone/size/chrome, and may switch to an image fallback. The
existing atom filing and the duplicate block filing must be reconciled.

Inventory both:

```text
src/components/atoms/display/IconTile
.storybook/components/atoms/display/IconTile
src/components/blocks/identity/IconTile
```

Choose one canonical composite destination using existing repository layout
conventions, preferably a shared identity composite home. Do not keep two
house components with the same public name.

Preserve the existing finite `tone` and `size` contract, image fallback,
failure handling, and `isSkeleton` behavior. If the atom already has the exact
`size="sm"` chrome needed by TopLearners, move that behavior with the
component; do not invent another size token.

The corrected composite may accept a typed icon component rather than an
unconstrained `ReactNode` only if every consumer can migrate without changing
behavior. Do not make a speculative public API rewrite. If the current icon
API is intentionally required, document why it remains and keep the contract
typed as narrowly as the existing code permits.

The composite owns its intrinsic tile/skeleton chrome. Consumers must not draw
the IconTile skeleton with raw `Skeleton className` markup.

## Inventory before edits

Create:

`.artifacts/fe-refactor-audit/2026-08-09-b31r-inventory.json`

Scan both trees and record for every candidate:

```text
path
exportedNames
callerOwnedChildren
ReactNode/ComponentType inputs
child placement decisions
fallback branches
domain meaning
current tier
proposed tier
direct consumers
barrels
storybook twin
identity metadata
skeleton contract
public CSS doors
locked/vendor/teacher status
```

Only candidates with clear evidence may be moved. All ambiguous candidates are
holds with an exact reason.

## Partition

Use six disjoint workers:

1. `icon-tile-twins`
   - IconTile source/Storybook implementations and exact consumers.
2. `identity-display-candidates`
   - display/identity atoms that compose caller-owned children.
3. `navigation-overlay-candidates`
   - only candidates in these shelves with AST evidence.
4. `form-feedback-candidates`
   - only candidates in these shelves with AST evidence.
5. `consumer-barrels-stories`
   - imports, exports, stories, metadata required by proven moves.
6. `coordinator-tier-gates`
   - inventory, manifests, parity, ledger, bounded lint, tests, and regression
     repair inside owned files.

No file may appear in two edit manifests. Storybook first, then mirror src.
The coordinator writes the ledger and aggregate status.

## Filing rules

- Move the whole component family atomically, including twins and tests/stories
  that belong to it.
- Update every import and barrel. Old paths must have zero imports and no
  compatibility forwarder.
- Preserve direct named exports; no runtime house namespaces.
- Re-stamp identity according to the new tier only on the real root.
- Do not create new generic folders merely to make a move appear tidy.
- Do not move page-specific blocks or domain components into composites.
- Keep vendor boundaries explicit and untouched.

## CSS and skeleton contract

After re-tiering, close only contracts owned by the moved component:

- no public `className`/`classNames` unless it is a documented vendor mount;
- no raw Skeleton CSS for the moved component's intrinsic shape;
- parent placement remains with the parent;
- child relationship uses an existing frame/principle where applicable;
- no CSS props beside a principle-owned frame;
- no replacement raw wrapper after deleting a door.

Do not redesign unrelated skeletons, add generic skeleton slots, add arbitrary
CSS values, or invent a new principle/token/variant in this batch.

## Touched-file ratchet

Every changed TS/TSX/MJS file must pass ESLint with:

```text
0 errors
0 warnings
```

If a candidate requires page-folder promotion, a new vocabulary contract,
skeleton redesign, locked-path edit, Nivo/Nivoexpert edit, or another batch's
contract, hold it and do not partially move it.

## Forbidden

- no TopLearners/LeaderboardListCard internals in this batch;
- no CommunityTab inline in this batch;
- no a11y, contrast, ARIA, keyboard, loading semantics, or visual redesign;
- no core Button/Chip/Stack/Grid/Box API changes;
- no ESLint severity/config/allowlist changes or disable comments;
- no page-folder cleanup except a mechanically required import if the moved
  component already has a valid destination;
- no formatter, line-ending churn, empty interfaces/destructuring, stale
  imports, or unrelated authoring cleanup;
- no commit, push, reset, checkout, branch, or git-history operation.

## Artifacts

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b31r-worker-<name>.json`

Aggregate into:

- `.artifacts/fe-refactor-audit/2026-08-09-b31r-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31r-status.md`

Required report fields:

```text
manifest
candidateEvidence
beforeTier
afterTier
destination
consumersBefore
consumersAfter
publicDoorsBefore
publicDoorsAfter
skeletonBefore
skeletonAfter
storybookParity
changed
held
retracted
verification
regressions
overlapCheck
```

Report separately:

- proven moves;
- ambiguous candidates;
- old paths deleted;
- compatibility paths forbidden/absent;
- IconTile final canonical path and API;
- all consumer migration results;
- remaining blockers for TopLearners.

## Verification

Build changed files from tracked diffs plus untracked TS/TSX/MJS files,
excluding `.artifacts/**`, and lint in bounded PowerShell chunks.

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

Completion requires zero-warning changed files, Storybook/src parity, zero
imports from retired paths, no duplicate public IconTile, and no unrecorded
ambiguous moves. Otherwise retract partial product edits and report blocked.
