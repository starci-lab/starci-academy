# BATCH 31r3 — Unlock and migrate block IdentityTile consumers

Repo: `D:\Repositories\starci-academy`

Precondition: commit the B31r2 `IdentityTile` atom + approved contract first.
Read the current HEAD and record it. If B31r2 is still uncommitted, stop; do not
mix this wave with its implementation diff.

Read and obey:

`.claude/fe/contracts/identity-tile.md`

## Objective

Vertically close the six lowest-debt legacy block consumers, then migrate each
from:

```text
@/components/blocks/identity/IconTile
```

to:

```text
@/components/atoms/display/IdentityTile
```

Target files:

1. `src/components/blocks/marketing/PitchCard/index.tsx`
2. `src/components/blocks/feedback/ReadinessChecklist/index.tsx`
3. `src/components/blocks/commerce/CartLine/index.tsx`
4. `src/components/blocks/learn/lesson/PremiumPaywall/index.tsx`
5. `src/components/blocks/cards/PlaygroundCard/component.tsx`
6. `src/components/blocks/learn/EnrollGate/index.tsx`

Do not optimize only for import count. A target remains changed only when its
entire file reaches zero ESLint warnings and its `IdentityTile` migration is
behaviorally exact.

## Read first

For each target read:

- the full file;
- its Storybook twin/story and src counterpart;
- every direct local helper imported by the target;
- its focused ESLint output, by rule and line;
- its current legacy IconTile props and rendered chrome;
- the approved IdentityTile contract;
- direct consumers if public API changes would otherwise leak upward.

Create an exact before inventory under:

`.artifacts/fe-refactor-audit/2026-08-09-b31r3-inventory.json`

## Migration law

Legacy identity tiles use the same finite visual map:

```text
sm = 48px + rounded-xl
md = 64px + rounded-2xl
lg = 80px + rounded-2xl
```

Preserve the same `size`, `tone`, `src`, and `alt`. Convert icon JSX to the
typed component reference:

```tsx
// before
<IconTile icon={<RocketIcon aria-hidden />} size="sm" />

// after
<IdentityTile icon={RocketIcon} size="sm" />
```

If the old icon expression is dynamic, conditional, preconfigured, or depends
on render-local props, create a stable named ComponentType adapter only when it
preserves behavior and does not remount each render. Do not use `as` casts to
force incompatible icon values.

Use `IdentityTile isSkeleton` for an existing raw mirror of the same tile only
when shimmer dimensions and loading behavior remain exact. Do not redesign
other skeletons.

## Warning closure law

Burn every warning in a target file using existing contracts only. Common
expected categories include:

- sentence-tier raw layout → existing frame + honest singular principle;
- HeroUI import → existing house vocabulary only when behavior is identical;
- identity root → stamp the proven exported semantic root, no wrapper div;
- public CSS door / cn → move placement to parent or existing semantic prop;
- JSDoc/authoring/import debt → mechanical English/type/import cleanup;
- skeleton CSS → migrate only shapes already owned by IdentityTile or another
  existing typed leaf.

Do not invent principles, tokens, semantic variants, slots, or generic
wrappers. If one warning requires a new contract, retract this batch's changes
for that file and record it as held.

## Storybook parity

When a target has a Storybook twin, edit Storybook first and mirror src.
Storybook/src contracts and rendered behavior must stay aligned. If a twin is
already drifted and cannot reach zero warnings in scope, hold that target rather
than editing only one tree.

## Disjoint workers

Use seven edit manifests plus one coordinator:

1. `pitch-card`
2. `readiness-checklist`
3. `cart-line`
4. `premium-paywall`
5. `playground-card`
6. `enroll-gate`
7. `storybook-twins` — only twin/story files not owned above
8. `coordinator` — inventory, overlap, parity, ledger, reports, bounded lint,
   tests, and verified regression repair

No file may occur in two edit manifests. Workers may read outside their
manifest but edit only their assigned files. Coordinator alone writes the
ledger and aggregate artifacts.

## Atomicity per target

Atomicity is per component family, not the whole wave:

- A clean target may land even if another target is held.
- A held target must have all B31r3 edits retracted.
- Do not retract the already-landed IdentityTile atom.
- Do not edit or delete the legacy block implementation in this wave.

## Forbidden

- no pages, layouts, overlays, LeaderboardListCard, TopLearners, CommunityTab,
  Nivo/Nivoexpert, or locked paths;
- no edits to IdentityTile/IconTile size maps or public contracts;
- no className/classNames/width/height/radius/shape API;
- no ReactNode regression for `IdentityTile.icon`;
- no raw wrapper replacing a removed CSS door;
- no fake principle/token/variant/slot;
- no a11y, contrast, ARIA, keyboard, or unrelated loading changes;
- no core Button/Chip/Stack/Grid/Box API changes;
- no ESLint disable/config/severity/allowlist changes;
- no formatter, line-ending churn, stale imports, empty interfaces, or
  unrelated cleanup;
- no commit, push, reset, checkout, branch, or git-history operation.

## Artifacts

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b31r3-worker-<name>.json`

Aggregate:

- `.artifacts/fe-refactor-audit/2026-08-09-b31r3-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31r3-status.md`

Required fields:

```text
manifest
warningsBefore
warningsAfter
legacyImportBefore
legacyImportAfter
iconExpressionBefore
iconComponentAfter
changed
held
retracted
storybookParity
verification
regressions
overlapCheck
```

Report the repo-wide legacy import count before/after, but do not claim legacy
block deletion in this wave.

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

Completion requires zero-warning retained targets, exact IconTile-to-
IdentityTile behavior, no overlapping edits, Storybook/src parity, and honest
holds for every retracted target. Do not commit.
