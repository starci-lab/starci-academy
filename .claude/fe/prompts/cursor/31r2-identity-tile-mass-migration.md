# BATCH 31r2 — IdentityTile mass migration

Repo: `D:\Repositories\starci-academy`

Read and obey the approved contract first:

`.claude/fe/contracts/identity-tile.md`

The contract is fixed. Cursor performs inventory and mechanical migration; it
does not reconsider tier, size maps, naming, or skeleton ownership.

## Objective

1. Create Storybook `atoms/display/IdentityTile` from the legacy block visual
   behavior, using the approved typed API.
2. Mirror it to src.
3. Keep `atoms/display/IconTile` unchanged.
4. Migrate every unlocked zero-warning legacy block consumer to
   `IdentityTile`.
5. Leave blocked consumers on the legacy block with explicit ledger holds.
6. Delete the legacy block only if the final import count is zero.

## Immutable maps

```text
IconTile:
sm 40 circle
md 64 circle
lg 80 circle

IdentityTile:
sm 48 rounded-xl
md 64 rounded-2xl
lg 80 rounded-2xl
```

No silent size remapping across component names.

## API migration

`IdentityTile.icon` is a typed `ComponentType`, not JSX/ReactNode.

```tsx
// before
<IconTile icon={<BookOpenIcon aria-hidden />} size="sm" />

// after
<IdentityTile icon={BookOpenIcon} size="sm" />
```

If a consumer builds a dynamic icon component, name/cache the component rather
than passing an already-rendered node. Preserve icon provider props and visual
weight. Do not create inline component identities inside render loops when that
would remount state.

Skeleton consumers use:

```tsx
<IdentityTile isSkeleton size="sm" />
```

Remove equivalent raw Skeleton tile markup only in migrated files.

## Parallel workers

Use eight disjoint manifests:

1. `identity-tile-storybook`
2. `identity-tile-src`
3. `blocks-consumers`
4. `profile-pages-consumers`
5. `learning-pages-consumers`
6. `commerce-dashboard-consumers`
7. `remaining-unlocked-consumers`
8. `coordinator-gates`

No file may appear in two edit manifests. Storybook first, then src. The
coordinator alone writes ledger/status artifacts.

## Ratchet

Every retained changed TS/TSX/MJS file must have zero ESLint errors and zero
warnings. A pre-existing warning still blocks the touched file.

For Nivo/Nivoexpert, locked paths, page-folder debt, skeleton redesign, or files
that cannot reach zero warnings:

- do not edit;
- record exact consumer/import evidence;
- keep the legacy block import;
- do not add a compatibility forwarder;
- do not claim deletion or completion.

Incremental coexistence is explicitly approved by the contract. Do not retract
the new atom merely because held consumers keep the legacy block alive.

## Forbidden

- no composite `IdentityTile`;
- no edits to the circular `IconTile` size map/API;
- no className/classNames/width/height/radius/shape props;
- no generic skeleton slot or raw replacement wrapper;
- no new principle/token/variant;
- no TopLearners promotion, CommunityTab inline, or LeaderboardListCard closure;
- no page-folder, Nivo/Nivoexpert, locked, a11y, ARIA, keyboard, or unrelated
  loading changes;
- no ESLint disable/config/severity/allowlist changes;
- no formatting or line-ending churn;
- no commit, push, reset, checkout, branch, or history operation.

## Artifacts

Write:

- `.artifacts/fe-refactor-audit/2026-08-09-b31r2-inventory.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31r2-worker-<name>.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31r2-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31r2-status.md`

Report before/after import counts, migrated consumers, held consumers, raw
skeleton removals, legacy deletion status, twin parity, overlap, and exact gate
results.

## Verification

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all changed TS/TSX/MJS files in bounded chunks>
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

Do not commit.
