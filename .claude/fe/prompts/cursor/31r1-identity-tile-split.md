# BATCH 31r1 — Execute the approved IconTile / IdentityTile split

Repo: `D:\Repositories\starci-academy`

Checkpoint: `18f84f5b refactor(fe): enforce semantic closure ratchet`

The architecture decision is immutable for this batch. Do not reinterpret it.

## Approved contract

`IconTile` remains the leaf glyph tile:

```text
atoms/display/IconTile
sm → 40px + rounded-full
md → 64px + rounded-full
lg → 80px + rounded-full
```

The old block implementation becomes the canonical identity composite:

```text
composites/identity/IdentityTile
sm → 48px + rounded-xl
md → 64px + rounded-2xl
lg → 80px + rounded-2xl
```

Do not put `IdentityTile` under `composites/lists`. Never silently remap an
`IconTile` consumer to `IdentityTile` or vice versa.

`IdentityTile` owns icon/image placement, tone, image fallback, broken-image
fallback, intrinsic tile chrome, and `isSkeleton` geometry. Consumers own only
outer placement. No raw Skeleton CSS or CSS props may be passed to the tile.

Keep the narrowest compatible existing icon API. Do not change `ReactNode` to
`ComponentType` unless every consumer is proven behaviorally identical.

## Execution

1. Read both current implementations in Storybook and src.
2. Create Storybook `IdentityTile` from the old block identity implementation.
3. Mirror it exactly to src.
4. Update barrels, named exports, stories, metadata, and imports.
5. Classify consumers:
   - glyph-only badge/medal/avatar → atom `IconTile`;
   - entity/course/project/logo identity or image fallback → `IdentityTile`.
6. Migrate only unlocked zero-warning consumers.
7. Delete `blocks/identity/IconTile` only after zero live imports.
8. Keep `atoms/display/IconTile`; do not delete it.

Do not edit TopLearners internals, CommunityTab, or LeaderboardListCard in this
batch. Their later migration may import `IdentityTile`, but their contracts are
not closed here.

Storybook first, then mirror src. Every changed Storybook contract must match
src exactly.

## Ratchet and holds

Every changed TS/TSX/MJS file must pass ESLint with exactly zero errors and zero
warnings. For Nivo/Nivoexpert, locked, page-folder, or skeleton-blocked
consumers:

- hold with exact evidence;
- keep the old implementation while it has a live consumer;
- do not add a compatibility forwarder;
- do not use eslint-disable or change lint config;
- do not claim the old block path deleted.

If atomic deletion is impossible, retract partial product edits and report
blocked.

## Forbidden

- no new size map, variant, principle, token, CSS slot, or generic skeleton slot;
- no public className/classNames/width/height CSS API;
- no raw wrapper replacing a removed CSS door;
- no page-folder migration, a11y/contrast/ARIA/keyboard/loading redesign;
- no Nivo/Nivoexpert, locked-path, or core Button/Chip/Stack/Grid/Box changes;
- no formatter, line-ending churn, stale imports, empty interfaces, or
  unrelated cleanup;
- no commit, push, reset, checkout, branch, or git-history operation.

## Disjoint workers

1. `identity-tile-storybook` — canonical Storybook composite.
2. `identity-tile-src` — src mirror and exports.
3. `glyph-consumers` — unlocked atom-semantic consumers.
4. `identity-consumers-a` — unlocked identity consumers.
5. `identity-consumers-b` — remaining unlocked identity consumers and stories.
6. `coordinator` — scan, manifests, overlap, ledger, parity, deletion proof,
   bounded lint, tests, and regression repair.

No file may occur in two manifests. Coordinator alone writes the ledger.

## Artifacts

Write:

`.artifacts/fe-refactor-audit/2026-08-09-b31r1-inventory.json`

`.artifacts/fe-refactor-audit/2026-08-09-b31r1-worker-<name>.json`

`.artifacts/fe-refactor-audit/2026-08-09-b31r1-status.{json,md}`

Reports must include consumer classification, size evidence, old-path imports
before/after, holds, Storybook/src parity, warning counts, and regressions.

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

Completion requires one canonical `IdentityTile`, one unchanged atom
`IconTile`, zero imports from the retired block path, exact separate size
contracts, Storybook/src parity, and zero-warning changed files. Otherwise
report blocked and retract partial edits.
