# BATCH 10 — Parallel deferred FE debt burn

Repo:

`D:\Repositories\starci-academy`

Checkpoint:

`27127bb5 refactor(fe): burn parallel architectural debt`

The previous nine-worker batch completed with no overlapping edits. TSC,
changed-file ESLint, plugin tests, principle tests, and `audit:fe` passed. The
remaining work is deferred architectural debt, not a reason to weaken the
contract.

## Objective

Burn safe debt from the fresh inventory, especially:

- `no-raw-shape-at-sentence-tier`;
- `no-classname-at-sentence-tier` and `no-per-part-classname-prop`;
- `no-heroui-outside-vocabulary`;
- `require-identity-root`;
- `require-frame-self-declare`;
- `require-export-jsdoc`;
- `page-folder-two-files-only`;
- `no-helper-folder-in-components` and safe export structure;
- inline skeleton and parallel skeleton warnings.

Do not blindly fix every warning. Classify first and preserve the existing FE
contract:

- exactly one singular `principle` on a frame;
- no plural principles API;
- no runtime house namespaces;
- direct named exports only;
- Storybook first, then its `src` twin;
- no public CSS layout props on strict frames;
- no fake principle tokens;
- HeroUI/vendor APIs remain valid vendor boundaries.

## Non-goals and hard holds

Do not touch:

- a11y, contrast, axe, ARIA, or keyboard warnings;
- teacher-held files or the 27 documented pattern holds;
- Nivo/Nivoexpert and locked product paths;
- missing-both or ambiguous principle cases;
- behavior changes, API redesigns, or broad page-folder moves;
- `eslint-disable` added only to make a gate green;
- any git commit, reset, checkout, push, or branch operation.

## Coordinator workflow

### Phase 0 — Fresh inventory, no edits

Read the current contract, canon, ESLint config, decision ledger, and the last
parallel-burn report. Run a fresh rule inventory and write:

- `.artifacts/fe-refactor-audit/2026-08-08-deferred-burn-inventory.json`
- `.artifacts/fe-refactor-audit/2026-08-08-deferred-burn-inventory.md`

Each finding must have one classification:

`safe-mechanical | safe-structural | semantic-hold | vendor-hold |
teacher-hold | locked-path | ambiguous`

Partition by disjoint directory ownership, not by rule. A file must be owned
by one worker only. Pair Storybook and src twins in the same ownership unit.

### Phase 1 — Dispatch these workers

Dispatch only non-empty partitions from the fresh manifest:

1. `atoms-display-forms`: atoms under display, forms, buttons, chips, data,
   feedback, navigation, overlay, and their Storybook twins.
2. `composites-frames`: composites, frames, spacing resolvers, and their twins.
3. `blocks-layout`: layout, navigation, skeleton, and shared presentation
   blocks, excluding locked paths.
4. `blocks-domain`: learn, commerce, dashboard, profile, CV, and marketing
   blocks, excluding Nivo/Nivoexpert and locked paths.
5. `pages-learning-commerce`: learning, flashcards, practice, course, and
   commerce pages.
6. `pages-profile-dashboard`: profile, dashboard, community, league, and
   other ordinary product pages.
7. `app-modules-utils`: app routes, module types, API types, hooks, and pure
   utilities; only documentation/export/authoring debt is allowed here.
8. `storybook-only`: Storybook-only files with no src twin.

Each worker receives an exact file manifest and writes only:

`.artifacts/fe-refactor-audit/2026-08-08-deferred-worker-<name>.json`

Required status keys: `changed`, `skipped`, `holds`, `verification`,
`regressions`.

### Worker rules

1. Read the whole target file and its twin before editing.
2. Make the smallest coherent patch; do not format unrelated lines.
3. For raw shape/classname warnings, move ownership to an existing named
   frame/composite or an existing honest principle. Do not create a token just
   for one warning.
4. For `no-heroui-outside-vocabulary`, keep genuine HeroUI vendor usage at the
   documented boundary. Replace only accidental product layout wrappers.
5. For identity warnings, add identity only when the component is a real
   declared root. Do not stamp identity on arbitrary inner divs.
6. For JSDoc, document the public contract in English. Do not add meaningless
   comments just to satisfy a count.
7. For page-folder warnings, make only mechanical moves with all importers
   proven. If a move changes ownership or public API, record a hold.
8. For skeleton rules, preserve loading behavior; never duplicate an existing
   skeleton branch or invent parallel skeleton trees.
9. Preserve vendor aliases such as `HeroModal.Header` and `HeroUI.*`.
10. Run focused tsc/ESLint on the worker manifest before reporting complete.

### Phase 2 — Coordinator aggregation

After every worker reports:

1. Assert that manifests and changed-file lists are disjoint.
2. Check Storybook/src twin parity.
3. Read every worker status and aggregate:
   - `.artifacts/fe-refactor-audit/2026-08-08-deferred-burn-status.json`
   - `.artifacts/fe-refactor-audit/2026-08-08-deferred-burn-status.md`
4. Re-run the inventory and separate resolved findings from valid holds.
5. Repair regressions only in the owning partition. Do not expand scope.

## Verification

Run after aggregation:

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all changed files>
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
npm run audit:fe
```

`audit:fe` may report the documented teacher holds. Do not alter them merely
to achieve zero findings. Report all remaining rule counts and exact paths.

## Completion report

Report worker count, disjointness, files changed, before/after counts by rule,
holds preserved, twin parity, verification results, and the next partition.
Do not commit or push. The coordinator must finish with a clean working tree
except for intentionally generated `.artifacts/` reports.
