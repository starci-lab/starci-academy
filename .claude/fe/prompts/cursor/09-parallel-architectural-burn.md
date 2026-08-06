# BATCH 09 — Parallel FE architectural ESLint burn

You are the master coordinator for the next FE architecture cleanup in:

`D:\Repositories\starci-academy`

The previous checkpoint is:

`04bf3f14 refactor(fe): close content page and runtime namespace contracts`

The house runtime namespace migration is complete: there are zero internal
`export const Component = { ... }` compatibility objects. HeroUI/vendor
compound APIs remain valid and must not be migrated.

## Objective

Burn the remaining safe, actionable FE architectural ESLint debt in parallel,
using disjoint file partitions and a coordinator workflow. Preserve the strict
architecture:

- one singular `principle="token"` per frame;
- no `principles`, `data-principles`, or plural diagnostics;
- direct named exports only; no new runtime namespaces;
- Storybook first, then mirror the same decision into `src`;
- frames own layout CSS through semantic principles or named frame/composite
  components;
- atoms do not expose public `className` / `classNames` unless an explicit
  vendor-boundary or foreign-mount exception is documented;
- HeroUI/vendor namespaces and vendor escape hatches remain allowed;
- no a11y, contrast, axe, aria, or keyboard work in this batch;
- do not invent a principle token for an unmatched or ambiguous seam;
- do not touch teacher holds, locked paths, Nivo/Nivoexpert paths, or
  missing-both-principle cases without an explicit ledger decision.

## Mandatory workflow

### Phase 0 — Coordinator inventory, no edits

1. Read the current FE contract, ESLint config, decision ledger, canon, and
   the latest audit reports.
2. Run a fresh inventory. Do not rely on stale warning counts.
3. Produce:
   - `.artifacts/fe-refactor-audit/2026-08-08-parallel-burn-inventory.json`
   - `.artifacts/fe-refactor-audit/2026-08-08-parallel-burn-inventory.md`
4. Partition by disjoint directory ownership. A file may belong to exactly one
   worker. Never give two workers the same directory or twin pair.
5. Record every hold before dispatching workers.

### Phase 1 — Dispatch disjoint workers

Dispatch at most one worker per partition. Use these partitions when the fresh
inventory contains work for them; omit empty partitions:

1. `tooling-docs`: JSDoc/export documentation and English authoring rules.
2. `atoms`: atom tier rules, atom barrels, atom Storybook/src twins.
3. `composites`: composite tier rules, composite barrels, twin parity.
4. `frames`: frame self-declaration, identity, principle-only CSS contracts.
5. `blocks-layout`: block layout and form blocks, excluding locked paths.
6. `blocks-domain`: domain blocks, excluding Nivo/Nivoexpert and teacher holds.
7. `pages-core`: ordinary page directories and page-level structural debt.
8. `pages-special`: profile, learning, commerce, practice, dashboard, and
   other page groups not owned by `pages-core`.
9. `storybook-only`: Storybook-only components with no src twin.
10. `exports-structure`: safe export-matches-folder and helper-folder cases.

Each worker must receive an explicit manifest of files/directories. Workers
must not scan-and-edit outside that manifest. Each worker writes only its own
status file:

`.artifacts/fe-refactor-audit/2026-08-08-worker-<partition>.json`

The status must contain `changed`, `skipped`, `holds`, `verification`, and
`regressions` arrays.

### Worker contract

Before editing:

1. Read the relevant source and Storybook twin.
2. Classify each warning as safe mechanical, semantic migration, teacher hold,
   vendor boundary, or ambiguous.
3. Edit only safe mechanical cases and clearly evidenced semantic cases.

While editing:

- keep Storybook and src decisions paired;
- preserve behavior and public direct named exports;
- use named types instead of inline parameter annotations;
- use JSDoc that explains the public contract in English;
- remove dead compatibility aliases only when all in-repo consumers are proven
  migrated;
- keep vendor imports such as `@heroui/react` untouched;
- never add `eslint-disable` without a precise reason and ledger entry;
- never add a fake principle, arbitrary spacing token, or generic `className`
  escape to silence a warning.

Every worker must stop and record a hold for:

- missing-both or ambiguous layout principles;
- asymmetric responsive spacing with no canonical token;
- vendor APIs or vendor namespaces;
- files listed as locked or teacher-held;
- changes that require a page-folder move across unrelated ownership;
- any behavior change or API compatibility decision.

### Phase 2 — Coordinator aggregation

After all workers finish:

1. Verify no two workers changed the same file.
2. Read every worker status file and aggregate into:
   - `.artifacts/fe-refactor-audit/2026-08-08-parallel-burn-status.json`
   - `.artifacts/fe-refactor-audit/2026-08-08-parallel-burn-status.md`
3. Check Storybook/src twin parity for every paired change.
4. Re-run the fresh inventory and compare resolved, skipped, and held cases.
5. Revert or repair regressions before reporting completion. Do not commit.

## Verification gates

Run all applicable checks after aggregation:

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <changed files only>
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
npm run audit:fe
```

If `audit:fe` reports only pre-existing teacher holds, record them exactly and
leave them unchanged. A global `--max-warnings=0` failure caused by untouched
legacy JSDoc/Page debt is not a reason to edit unrelated files; report the
exact rule and paths instead.

## Forbidden actions

- no git commit, reset, checkout, push, or branch manipulation;
- no a11y/contrast/axe remediation;
- no mass rewrite of locked paths;
- no edits to Nivo/Nivoexpert or teacher-held files;
- no runtime namespace recreation;
- no plural `principles` API revival;
- no broad formatting-only rewrite;
- no invented tokens or fake `eslint-disable` exemptions;
- no modifications outside the coordinator manifest.

## Final report

Report:

- worker count and exact partition manifests;
- warnings/debt before and after by rule;
- resolved files;
- skipped files and why;
- teacher holds preserved;
- Storybook/src parity result;
- every verification result;
- regressions and follow-up prompts.

Do not claim the batch is complete until all workers have reported and the
coordinator has run the aggregate verification suite.
