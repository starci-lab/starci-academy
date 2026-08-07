# BATCH 30c — Touched-file zero-warning closure

Repo: `D:\Repositories\starci-academy`

Continue from the current uncommitted B30 + B30b working tree. Preserve the
verified semantic repairs in LeaderboardListCard and LabeledList. Do not reset,
checkout, discard, or overwrite correct work.

## Blocking fact

B30b verification reported:

```text
eslint --max-warnings=0 on all B30 changed files
FAIL: 0 errors, 72 warnings
```

Twenty findings are `starci-fe/no-raw-shape-at-sentence-tier` in product files
already touched by B30. Calling them pre-existing does not satisfy the
touched-file ratchet.

B30 cannot close or commit until every changed TS/TSX/MJS file passes ESLint
with zero warnings. For each file there are only two honest outcomes:

1. close all findings in that file using existing contracts; or
2. revert only the B30/B30b product change in that file when closure requires
   a forbidden/new contract, while preserving unrelated pre-B30 user work.

Do not hide, suppress, baseline, or relabel warnings as verification success.

## Read first

- current `git diff` and `git status`;
- `.artifacts/fe-refactor-audit/2026-08-09-b30-status.md`;
- all `2026-08-09-b30-worker-*.json` artifacts;
- the coordinator artifact containing the 72-warning histogram;
- `plugins/eslint/sentence-tier.test.mjs`;
- `.claude/fe/decision-ledger.json` entries referenced by B30.

Build an exact warning inventory with fields:

```text
file, line, ruleId, message, B30 ownership, classification, action
```

`B30 ownership` must distinguish a warning introduced by B30 from an older
warning in a file B30 touched. Both block the gate; the distinction only guides
whether to repair or retract the B30 edit.

## Partition

Use disjoint workers based on the actual warning inventory, not guessed paths:

1. `tier-card`
2. `list-row-readiness`
3. `leaderboard-labeled-list`
4. `navigation-flex-wrap-sidebar`
5. `pages-consumers-a`
6. `pages-consumers-b`
7. `authoring-jsdoc-imports`
8. `coordinator-lint-parity`

Every changed product file belongs to exactly one manifest. Workers may read
dependencies and twins but edit only their manifest. The coordinator owns
artifacts, ledger aggregation, overlap checks, and verified regression repair.

## Repair law

### Semantic layout

For `no-raw-shape-at-sentence-tier`, `no-classname-at-sentence-tier`, and
`no-cn-above-vocabulary`:

- relationships among children use an existing frame with exactly one honest
  `principle`;
- parent placement moves to the immediate parent using an existing owner;
- intrinsic leaf chrome stays inside a vocabulary component;
- do not replace a removed CSS door with raw private CSS;
- do not pass `gap`, `padding`, `align`, `justify`, `className`, or
  `classNames` beside a principle;
- do not invent tokens, principles, variants, slots, or generic wrappers.

Reuse one semantic render across conditional chrome branches where the child
relationship is unchanged, as B30b did for LeaderboardListCard.

### Vendor imports

For `no-heroui-outside-vocabulary`, use an existing StarCi atom/composite only
when behavior, DOM semantics, states, and API are already equivalent. Otherwise
retract the B30 edit for that file if necessary; do not invent a wrapper in this
batch.

### Identity and authoring

- add identity only to the proven exported semantic root;
- fix stale imports/types, JSDoc, English authoring, handler naming, and inline
  parameter types mechanically;
- no empty destructuring, empty interfaces, unused aliases, emoji replacement
  that changes product text, or unrelated rewriting.

### Holds

A ledger hold does not waive changed-file lint. If a touched file cannot become
zero-warning without changing a teacher hold, locked path, Nivo/Nivoexpert,
public behavior, skeleton/loading semantics, or introducing a new contract,
retract only this batch's change from that file. Record the retraction; do not
claim its door closed.

## Preserve

- LeaderboardListCard shared `StackV principle="sibling-stack"` unless a real
  regression is proven;
- LabeledList semantic Stack frames unless a real regression is proven;
- correct B30 semantic contracts (`isFeatured`, `density`, and proven parent
  placement);
- Storybook-first/src parity where twins exist;
- all teacher holds and locked/vendor boundaries.

## Forbidden

- no ESLint severity/config/allowlist changes;
- no `eslint-disable`, ignore comments, warning baselines, or generated
  suppressions;
- no fake principles or CSS-shaped APIs;
- no a11y, contrast, axe, ARIA, keyboard, skeleton/loading changes;
- no Nivo/Nivoexpert or locked-path edits;
- no core Button/Chip/Stack/Grid/Box API changes;
- no formatter, bulk line-ending conversion, unrelated cleanup;
- no commit, push, reset, checkout, branch, or git-history operation.

## Artifacts

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b30c-worker-<name>.json`

Required fields:

```text
manifest
warningsBefore
warningsAfter
introducedByB30
preExistingInTouchedFile
fixed
retractedB30Changes
holds
parity
verification
regressions
overlapCheck
```

Aggregate into:

- `.artifacts/fe-refactor-audit/2026-08-09-b30c-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b30c-status.md`

Update the B30 aggregate so it no longer claims completion while changed-set
lint fails. Report every file retracted and restore its door/hold status.

## Mandatory verification

Construct the changed-file set from both tracked diffs and untracked source or
tooling files, excluding `.artifacts/**`. Run ESLint in bounded PowerShell
chunks to avoid Windows command-line limits.

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

Completion requires all of the following:

- TypeScript passes;
- changed-set ESLint has exactly 0 errors and 0 warnings;
- all tests and audits pass, with documented teacher holds only;
- no overlapping worker edits;
- Storybook/src twins match;
- no false semantic closure remains in the B30 diff.

If zero-warning closure is impossible under this scope, stop with the exact
files and retractable B30 edits. Do not report B30c complete and do not commit.
