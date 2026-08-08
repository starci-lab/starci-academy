# BATCH 31f — Typed frame item mass closure

Repo: `D:\Repositories\starci-academy`

Read first:

- `.claude/fe/contracts/frame-items.md`
- `plugins/eslint/frame-items.mjs`
- `plugins/eslint/frame-items.test.mjs`

Baseline: approximately 344 `starci-fe/no-frame-fragment-item` findings across
Storybook and src. Refresh the inventory before editing.

## Objective

Remove fragment laundering from typed frame `items` contracts. Each item must
build exactly one semantic item. Storybook first, then mirror src.

## Classification

For every finding classify:

1. `peer-items` — fragment children are peers in the current frame; split them
   into separate item factories.
2. `nested-relationship` — children form one real subgroup; use an existing
   nested frame with one honest principle.
3. `conditional-peers` — build/spread conditional item factories instead of a
   conditional multi-child fragment.
4. `single-rendered-child` — static analysis counted expressions but runtime
   guarantees one child; rewrite explicitly without fragment only when behavior
   is provably identical.
5. `hold` — no honest existing frame/principle or locked/teacher/Nivo scope.

Do not convert to a div, Box, arbitrary wrapper, helper component, or component
factory whose only purpose is hiding the same siblings.

## Partition

Create exact non-overlapping manifests from the refreshed inventory:

1. Storybook composites cards/layout/data
2. Storybook blocks learn A
3. Storybook blocks learn B
4. Storybook blocks non-learn
5. src composites
6. src blocks learn A
7. src blocks learn B
8. src blocks commerce/dashboard/navigation
9. src blocks profile/remaining
10. src pages learning
11. src pages remaining
12. coordinator parity/gates

No file may appear in two edit manifests. Workers may read twins/dependencies
but edit only their manifest. Coordinator alone writes ledger/artifacts.

## Strict rules

- Preserve item order, keys, conditions, skeleton count, event behavior, and DOM
  semantics.
- Reuse existing principles only; one principle per nested frame.
- No `gap`, `padding`, `align`, `justify`, className, or classNames beside a
  principle-owned frame.
- No fake `explain`; explanation must describe the actual relationship.
- No new principle/token/variant/slot in this mass batch.
- No a11y, Nivo/Nivoexpert, locked path, teacher hold, or unrelated cleanup.
- No lint disable/config/severity/allowlist changes.
- No formatter or line-ending churn.
- No commit, reset, checkout, push, branch, or history operation.

## Touched-file ratchet

Every retained changed TS/TSX/MJS file must reach zero ESLint errors and zero
warnings. Atomicity is per file/twin family. If unrelated debt cannot be closed
with existing contracts, retract that family and record a hold.

## Artifacts

Write:

- `.artifacts/fe-refactor-audit/2026-08-09-b31f-inventory.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31f-worker-<name>.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31f-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31f-status.md`

Report before/after findings, classification counts, changed/held files,
Storybook/src parity, DOM/condition preservation, overlap, and gate results.

## Verification

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all changed TS/TSX/MJS files in bounded chunks>
node --test plugins/eslint/frame-items.test.mjs
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

Do not claim held findings fixed. Do not commit.
