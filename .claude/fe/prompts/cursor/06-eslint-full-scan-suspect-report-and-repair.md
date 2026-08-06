# BATCH — Full ESLint scan, suspected-case report, then complete repair

Repository:

`D:\Repositories\starci-academy`

Do not commit or push.

## Mission

Scan the entire FE/tooling codebase, report suspicious or overlapping findings, then repair every confirmed violation. Do not mass-edit before classifying the findings.

The target is not merely a zero exit code. The target is a strict, explainable ESLint contract with no hidden false-positive suppression.

## Current context

- Principle-only contract is canonical: exactly one singular `principle="token"`.
- Stack, Grid, Form, FormActions, ButtonGroup, and SurfaceCardPressableGroup have strict layout decisions where applicable.
- Atoms and sentence-tier components do not expose public `className` / `classNames` escape hatches.
- Storybook is the blueprint; mirror equivalent `src` twins.
- 27 approved teacher holds remain untouched unless the ledger explicitly resolves one.
- Tooling partition added these rules as `warn` with tests:
  - `no-inline-parameter-type`;
  - `no-emoji-in-source`;
  - `no-vietnamese-in-source-authoring`.
- Existing report has approximately 6.9k product warnings. Counts are not unique defects; one file can trigger multiple rules.

## Mandatory phase 1 — scan only

Do not edit source during this phase.

Run:

```text
npx eslint src .storybook --format json
npx eslint plugins/eslint scripts .claude/scripts --format json
npx tsc --noEmit
```

Build a report at:

`.artifacts/fe-refactor-audit/2026-08-07-eslint-suspect-report.md`

For each finding classify it as exactly one of:

1. `confirmed` — the rule is correct and the code must change;
2. `overlap` — multiple rules describe one root cause; fix once and list all affected rules;
3. `scope-bug` — the rule scans the wrong tier/file kind; fix the rule scope or allowlist;
4. `content-allowlist` — legitimate product copy, locale data, fixture, or example; extend the narrow allowlist;
5. `teacher-hold` — preserve and reference the ledger entry;
6. `contract-gap` — the code and enforcement registry disagree; update the registry/canon before callers;
7. `runtime-a11y` — requires Storybook axe/browser verification rather than static ESLint.

The report must include:

- file and line;
- all rules reported there;
- suspected root cause;
- classification;
- proposed fix;
- whether visual behavior may change.

## Known high-risk areas to inspect manually

Do not assume these are ordinary product violations:

- `.storybook/utils/BlockAnatomy/BlockAnatomy.tsx` — tooling/anatomy inspector, very high warning density;
- `src/components/pages/MockInterviewPage/MockInterviewSession/index.tsx`;
- `src/components/pages/FlashcardsPage/QuizSession/index.tsx`;
- `src/components/pages/LandingPage/LearnLoopScroll/index.tsx`;
- `src/components/blocks/learn/ContentAiChat/index.tsx`;
- `src/components/blocks/marketing/ArchitectureScene/index.tsx`;
- `.storybook/main.ts`, `.storybook/preview.tsx`, `.storybook/test-runner.ts`;
- `src/resources/**`, `src/modules/api/**`, and translation/content resources;
- Nivo, Nivoexpert, and Mia-Mia custom-CSS trees.

## Rule interaction checks

Before fixing, verify these known overlaps:

### Frame contract

For `<Grid principle="content-row" gap={4}>`:

- remove `gap` because the principle resolver owns it;
- add a meaningful English `explain` if the frame is in `require-frame-self-declare` scope;
- do not create a second principle;
- do not silence either rule.

Confirm that `FormActions`, `ButtonGroup`, and `SurfaceCardPressableGroup` are consistently classified in both `no-public-frame-css-props` and `require-frame-self-declare`. If they are not all frames, document the intentional identity-only contract in canon and ledger.

### Sentence-tier layout

For `<div className={cn("flex gap-4")}>`:

- `no-raw-shape-at-sentence-tier` and `no-cn-above-vocabulary` may be two diagnostics for one root cause;
- replace the host layout with an existing frame/composite;
- do not perform two independent cosmetic edits.

### ClassName rules

- exact `className` / `classNames` declaration is a sentence-tier contract violation;
- `titleClassName`, `bodyClassName`, and similar per-part props are a separate internal escape-hatch violation;
- usage-site CSS props on strict frames are a third, separate contract.

Fix the API at its owner, not by adding call-site disables.

### Skeleton rules

- inline `isSkeleton ? <A /> : <B />` is an inline branch;
- `skeleton={<A />}` or relative `FooSkeleton` import is a parallel tree;
- `FooSkeleton` folder/file is a twin-component violation.

Use one `isSkeleton` contract on the real component, except for the documented skeleton primitive tier.

### Authoring rules

`no-inline-parameter-type` should only reject an inline object type on a destructured parameter:

```ts
({ value }: { value: string }) => value
```

Replace it with a named local type/interface. Do not change untyped destructuring or non-destructured named parameters.

`no-emoji-in-source` and `no-vietnamese-in-source-authoring` must distinguish authoring from content:

- comments, JSDoc, identifiers, ESLint diagnostics, and rule messages must be English and emoji-free;
- locale files, approved translation resources, content dictionaries, fixtures, and test data may contain localized text or intentional emoji;
- expand only narrow, path-based allowlists;
- do not rewrite legitimate user-facing Vietnamese copy into English merely to satisfy lint;
- do not use broad `eslint-disable` comments.

If the current AST visitors report every string literal in an approved content module, fix the rule scope instead of changing the content.

### A11y

Static `jsx-a11y` rules and runtime axe findings are separate:

- fix valid `aria-role`, static interaction, keyboard, label, and semantic-element findings in source;
- do not claim contrast is fixed from ESLint;
- run Storybook axe with `parameters.a11y.test = "error"` in light and dark themes;
- classify `color-contrast`, `non-text-contrast`, focus-visible, and target-size issues as runtime a11y findings;
- fix contrast through semantic color tokens, never arbitrary hex classes;
- add or repair the CI command that actually runs Storybook a11y if the current `audit:fe` does not run it.

## Mandatory phase 2 — repair

After the suspect report is written, repair all `confirmed`, `overlap`, and `contract-gap` findings in disjoint partitions:

1. atoms;
2. composites;
3. frames/layout;
4. blocks;
5. pages;
6. Storybook-only/tooling;
7. static a11y;
8. runtime Storybook axe.

Use subagents only on disjoint directories. No two agents may edit the same file. Storybook first, then source twins.

For each partition:

- run the focused ESLint rule set before and after;
- preserve teacher holds;
- update `.claude/fe/decision-ledger.json` for every hold or contract decision;
- update canon only when the contract itself changes;
- do not add fake principles;
- do not change spacing or colors without checking visual behavior.

## Ratchet policy

- Keep a rule as `warn` while confirmed debt remains.
- New violations in changed files must fail `--max-warnings=0`.
- Ratchet to `error` only when measured debt is zero and regression tests exist.
- Do not lower an existing `error` rule.

## Verification

Run exact checks after every partition and at the end:

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all changed product files>
npx eslint --max-warnings=0 <all changed tooling files>
node --test .storybook/test-runner/principle-style.test.mjs
npm run audit:fe
```

Run focused plugin tests whenever `plugins/eslint/index.mjs` or `plugins/eslint/authoring.mjs` changes.

Run the real Storybook accessibility suite and report separately:

```text
npm run storybook
npm run test-storybook
```

If the second command is not a complete a11y gate, add a dedicated `test:a11y` script using the repository's installed Storybook/test-runner capability and document it. Do not call the a11y gate complete based only on ESLint.

## Final report

Report:

- suspicious cases found and their classifications;
- confirmed violations repaired;
- scope/allowlist changes;
- teacher holds preserved;
- remaining warning counts by rule;
- static a11y results;
- runtime axe results, especially contrast;
- exact verification output;
- files changed.

Do not commit or push.
