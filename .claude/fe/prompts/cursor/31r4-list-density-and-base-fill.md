# BATCH 31r4 — List density and base fill contracts

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`8ccf8641 refactor(fe): migrate initial IdentityTile consumers`

Read `.claude/fe/contracts/identity-tile.md` first. This batch closes two
approved finite contracts that blocked B31r3. Do not reconsider their names or
ownership.

## Contract A — ListRow density

`p-3` is intrinsic row density, owned by `ListRow`, not caller placement.

Approved API:

```ts
type ListRowDensity = "default" | "comfortable"
```

```text
default     → existing ListRow padding, unchanged
comfortable → exact p-3
```

Add the finite prop Storybook first, mirror src, migrate only consumers whose
current root padding is exactly `p-3`, and remove equivalent className usage.
Do not overload density with gap, alignment, color, width, or child placement.

For `ReadinessChecklist`, migrate the icon flow from rendered ReactNode to a
typed ComponentType through every owned boundary, including the relevant
PlaygroundSessionProvider value/type when required. Preserve dynamic icon
selection and do not create a new component identity on every render.

After its warnings reach zero, migrate its legacy block IconTile usage to:

```tsx
<IdentityTile icon={Icon} size="sm" ... />
```

If a provider API has external/locked consumers that prevent a compatible
ComponentType migration, hold ReadinessChecklist and retract only that target.

## Contract B — FillAvailable base mode

`min-w-0 flex-1` is parent-owned flex participation. Extend the existing frame:

```ts
type FillAvailableAt = "base" | "lg"
```

Approved mapping:

```text
base → min-w-0 flex-1
lg   → min-h-0 @app-lg:flex-1 (unchanged)
```

Each mode emits exactly one deterministic principle:

```text
base → data-principle="flex-fill-base"
lg   → data-principle="flex-fill"
```

Add `flex-fill-base` to the PrincipleToken registry, Storybook/src style maps,
patterns, backend spacing canon/registry, and principle tests. Do not change the
existing `flex-fill` mapping. Do not pass a separate caller principle,
className, gap, padding, align, or justify.

Storybook first, mirror src, update contract tests and frame parity. Existing
`at="lg"` consumers must remain byte/behavior equivalent.

For `CartLine`, place `FillAvailable at="base"` at the immediate parent-owned
flex seam, remove equivalent `min-w-0 flex-1` raw CSS/passthrough, burn all
remaining warnings in the target file using existing contracts, then migrate
legacy IconTile to IdentityTile when behavior is exact.

## Partition

Use six disjoint workers:

1. `listrow-storybook-contract`
2. `listrow-src-contract`
3. `readiness-componenttype-migration`
4. `fillavailable-twins-contract`
5. `cartline-base-fill-migration`
6. `coordinator-gates`

No file may appear in two edit manifests. Workers may read outside manifests
but edit only assigned files. Coordinator alone writes ledger/artifacts.

## Touched-file ratchet

Every retained changed TS/TSX/MJS file must have exactly zero errors and zero
warnings. Atomicity is per contract family:

- ListRow + ReadinessChecklist may land independently of FillAvailable +
  CartLine.
- If a target requires a new contract beyond the two approved above, retract
  that target and record the exact blocker.
- Do not retract the existing IdentityTile atom or prior migrations.

## Forbidden

- no PremiumPaywall or EnrollGate edits;
- no pages, LeaderboardListCard, TopLearners, CommunityTab, Nivo/Nivoexpert, or
  locked paths except a read-only consumer scan;
- no other ListRow density values;
- no change to FillAvailable `lg` mapping;
- no new principle/token/variant/slot beyond the approved `flex-fill-base`
  structural token and finite props;
- no public className/classNames or CSS-shaped API;
- no raw wrapper replacing removed CSS;
- no ReactNode fallback after ComponentType migration;
- no a11y/ARIA/keyboard/contrast or unrelated skeleton/loading changes;
- no ESLint disable/config/severity/allowlist changes;
- no formatter, line-ending churn, or unrelated cleanup;
- no commit, push, reset, checkout, branch, or history operation.

## Artifacts

Write:

- `.artifacts/fe-refactor-audit/2026-08-09-b31r4-inventory.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31r4-worker-<name>.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31r4-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31r4-status.md`

Report warnings before/after, exact consumer values, API before/after,
Storybook/src parity, legacy IconTile imports before/after, holds, overlap, and
gate results.

## Verification

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all changed TS/TSX/MJS files in bounded chunks>
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/sentence-tier.test.mjs
node --test plugins/eslint/frame-items.test.mjs
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npm run audit:fe
git diff --check
```

Do not commit.
