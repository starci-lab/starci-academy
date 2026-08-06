# BATCH 12 — Consumer/API reconciliation

Repo:

`D:\Repositories\starci-academy`

Checkpoint:

`db1f7a11 refactor(fe): burn safe mass architectural debt`

The previous safe mass-burn completed with 0 overlaps and 0 Storybook/src twin
soft-mismatches. It reduced `starci-fe` from 4767 to 4690. Remaining holds are
mostly consumer/API mismatches, non-identical twins, ChipBase, handleSide,
missing-both principles, page-folder structure, and unclear roots.

## Objective

Resolve only the remaining cases where the intended contract is already proven
by existing exports, consumers, Storybook twins, or the decision ledger.

Allowed:

1. Rewrite consumers from a deprecated or wrong import to an existing direct
   named export when all in-repo consumers are verified.
2. Align Storybook/src twin consumers when the public API is already identical.
3. Remove stale compatibility imports or barrels after proving they have no
   remaining consumer.
4. Resolve identity-root warnings when the root component is unambiguous and
   the identity shape already exists in the canon.
5. Resolve HeroUI-to-atom boundaries only when an existing StarCi atom exposes
   the same behavior and props.
6. Close redundant per-part `className`/`classNames` warnings only when the
   prop is not part of a documented public/vendor boundary.

## Mandatory holds

Do not redesign or infer contracts for:

- `ChipBase` API;
- `handleSide` or any layout/vendor boundary prop;
- non-identical Storybook/src APIs;
- missing-both or ambiguous principles;
- page-folder moves;
- parallel skeleton behavior;
- Nivo/Nivoexpert and locked paths;
- teacher-held findings;
- a11y, contrast, axe, ARIA, or keyboard behavior;
- any case requiring a new principle token;
- any case requiring a public API rename without a complete migration proof.

Never add a fake principle, generic `className` escape, or `eslint-disable` to
make a warning disappear. Do not commit, reset, checkout, push, or alter
branches.

## Workflow

### Phase 0 — Inventory, no edits

Read the current FE contract, canon, ESLint config, decision ledger, and the
latest safe-mass report. Run a fresh inventory and classify every remaining
finding as:

`consumer-safe | twin-safe | export-safe | identity-safe | vendor-hold |
api-hold | teacher-hold | ambiguous`

Create disjoint manifests. A file and its Storybook twin belong to one owner.

### Phase 1 — Parallel workers

Use at most these disjoint workers, omitting empty partitions:

1. `atoms-composites-consumers`
2. `blocks-consumer-migrations`
3. `pages-consumer-migrations`
4. `storybook-src-parity`
5. `exports-and-barrels`
6. `identity-safe-roots`
7. `heroui-boundaries`

No worker may edit outside its manifest or overlap another worker. Each worker
writes:

`.artifacts/fe-refactor-audit/2026-08-08-reconcile-worker-<name>.json`

with `changed`, `skipped`, `holds`, `verification`, and `regressions`.

### Worker contract

- Read the complete source file, its twin, and all relevant importers before
  editing.
- Preserve direct named exports and the singular `principle` contract.
- Verify every consumer before deleting or renaming an export.
- Keep HeroUI/vendor compound APIs untouched.
- Prefer a hold over a guessed API decision.
- Run focused TypeScript and ESLint checks on the manifest.

### Phase 2 — Aggregate

The coordinator must verify:

1. zero overlapping edits;
2. Storybook/src parity;
3. no new runtime namespaces;
4. no new plural principle APIs;
5. no teacher-hold edits;
6. no behavior regressions.

Write:

- `.artifacts/fe-refactor-audit/2026-08-08-reconcile-status.json`
- `.artifacts/fe-refactor-audit/2026-08-08-reconcile-status.md`

## Verification

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <changed files>
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
npm run audit:fe
```

Report resolved consumer/API cases separately from holds. Do not claim
ambiguous or API-held findings as fixed. Do not commit.
