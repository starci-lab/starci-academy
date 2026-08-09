# BATCH 31r-contract — Canonical IconTile composite contract

Repo: `D:\Repositories\starci-academy`

Checkpoint: `18f84f5b refactor(fe): enforce semantic closure ratchet`

The previous tier inventory proved that two public `IconTile` implementations
have incompatible chrome:

```text
atoms/display/IconTile       — leaf filing, smaller/round chrome, isSkeleton
blocks/identity/IconTile     — duplicate identity implementation, 48px/rounded-xl, no isSkeleton
```

The component receives an icon/image and decides its placement inside a tile,
so the canonical tier is a composite. Do not perform a mechanical move until
the contract below is resolved.

## Objective

Create one canonical house `IconTile` composite under:

```text
composites/identity/IconTile
```

Then migrate every proven consumer in both source trees, remove both duplicate
implementations, and leave zero imports/exports from the retired paths.

Do not put it under `composites/lists`: the component owns identity/display
chrome, not a list relationship.

## Phase 1 — Inventory only

Before editing, scan both implementations, all barrels, stories, metadata,
Nivo/Nivoexpert consumers, and every in-repo import. Use AST-aware scans and
record the exact visual expectation of each consumer:

```text
consumer
old import path
size prop
actual rendered box expectation
radius expectation
tone/src/alt behavior
skeleton behavior
locked/vendor/page status
storybook twin/story
```

Create:

`.artifacts/fe-refactor-audit/2026-08-09-b31r-contract-inventory.json`

Do not edit a consumer until its size/radius expectation is recorded. If the
two trees disagree, Storybook is the blueprint and src must mirror it unless a
documented vendor/locked hold applies.

## Canonical contract

Use one finite semantic size axis. No CSS strings, width/height props, or
className aliases:

```ts
type IconTileSize = "sm" | "md" | "lg"
```

The target map is:

```text
sm → 40px + rounded-full
md → 48px + rounded-xl
lg → 64px + rounded-2xl
```

These values are a proposed canonical map and must be checked against the
consumer inventory before application. If an existing consumer proves a
different meaning, do not silently remap it: record the exact contract
conflict and hold that consumer for a separate approved decision.

In particular, `size="sm"` must not mean both 40px/circle and 48px/rounded-xl.
Consumers with the latter expectation must use `size="md"` after migration.

The composite owns:

- tile chrome and tone;
- icon placement and icon sizing;
- finite size mapping;
- image fallback and broken-image fallback behavior;
- `isSkeleton` geometry for each size;
- decorative/alt behavior exactly as currently intended.

Use the narrowest typed icon contract already supported by all consumers. Do
not convert `ReactNode` to `ComponentType` if doing so changes icon behavior or
breaks existing icon factories; record that as an API decision instead.

## Skeleton contract

`IconTile` itself accepts `isSkeleton?: boolean` and renders its own shimmer
with the exact box/radius for the selected size. Consumers must never draw its
shape with:

```tsx
<Skeleton className="size-12 rounded-xl ..." />
```

TopLearners may later use:

```tsx
<IconTile isSkeleton size="md" icon={...} />
```

Do not edit TopLearners in this batch except where a direct import/type update
is required by the canonical move. Do not perform the broader TopLearners
promotion, CommunityTab inline, or LeaderboardListCard closure here.

## Implementation order

1. Storybook canonical composite first.
2. Mirror the implementation to src.
3. Update barrels and direct imports.
4. Migrate consumers to the single size map.
5. Delete both old `atoms/display/IconTile` and `blocks/identity/IconTile`
   implementations and their barrels only after zero-consumer proof.
6. Update stories/metadata to the composite tier.
7. Run a final AST scan for old paths and duplicate public exports.

No compatibility forwarding files are allowed. Preserve named exports and
avoid runtime namespace objects.

## Partition

Use six disjoint workers:

1. `icontile-contract-inventory`
   - read-only classification and size/radius evidence.
2. `storybook-canonical`
   - canonical Storybook composite and stories.
3. `src-canonical`
   - mirror canonical composite in src.
4. `consumer-migration-a`
   - consumers under blocks/composites and unlocked pages.
5. `consumer-migration-b`
   - remaining unlocked consumers, barrels, metadata, and direct stories.
6. `coordinator-gates`
   - manifests, overlap, parity, ledger, deletion proof, bounded lint/tests.

No file may occur in two edit manifests. Workers may read outside their
manifest but may edit only their manifest. The coordinator writes the ledger
and aggregate report once.

## Tier and CSS law

- Composite because it arranges caller-provided icon/image content.
- Parent owns placement outside the tile.
- No public `className` or `classNames` on the house composite.
- No raw layout wrapper replacing a removed CSS door.
- No `gap`, `padding`, `align`, or `justify` public escape hatch.
- No new generic slot or free-form CSS prop.
- No fake principle or arbitrary token.
- Existing image, tone, and skeleton behavior must remain intact.

## Touched-file ratchet

Every changed TS/TSX/MJS file must pass ESLint with exactly zero errors and
zero warnings. If a consumer is locked, Nivo/Nivoexpert, teacher-held,
skeleton-dependent, or requires an API contract outside this batch:

- hold it with exact evidence;
- do not delete the old implementation while it still has a live consumer;
- do not add a compatibility alias;
- do not claim the canonical move complete.

If atomic deletion is impossible, retract partial product edits and report the
blocker.

## Forbidden

- no `TopLearners` promotion or `CommunityTab` inline;
- no `LeaderboardListCard` internals or public door closure;
- no page-folder migration;
- no a11y, contrast, ARIA, keyboard, or loading behavior changes;
- no Nivo/Nivoexpert or locked-path edits;
- no core Button/Chip/Stack/Grid/Box API changes;
- no ESLint severity/config/allowlist changes or disable comments;
- no formatter, line-ending churn, stale imports, empty interfaces,
  empty destructuring, or unrelated cleanup;
- no commit, push, reset, checkout, branch, or git-history operation.

## Artifacts

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b31r-contract-worker-<name>.json`

Aggregate into:

- `.artifacts/fe-refactor-audit/2026-08-09-b31r-contract-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31r-contract-status.md`

Required fields:

```text
manifest
sizeEvidence
radiusEvidence
consumerCountBefore
consumerCountAfter
oldPathsBefore
oldPathsAfter
canonicalPath
canonicalTier
skeletonContract
changed
held
retracted
storybookParity
verification
regressions
overlapCheck
```

## Verification

Build the changed-file set from tracked diffs plus untracked TS/TSX/MJS files,
excluding `.artifacts/**`, and run ESLint in bounded PowerShell chunks.

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

Completion requires one canonical composite, no duplicate public IconTile,
zero old-path imports, exact size-map migration, Storybook/src parity, and
zero-warning changed files. Otherwise report blocked and retract partial edits.
