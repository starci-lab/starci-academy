# BATCH — ESLint strict burn-down, partitioned and ledger-backed

Repository:

`D:\Repositories\starci-academy`

## Context

The FE principle-only contract is green:

- singular `principle="token"` only;
- no runtime namespaces;
- strict Stack, Grid, Form, FormActions, ButtonGroup, and SurfaceCardPressableGroup layout contracts;
- atoms do not expose public `className` / `classNames`;
- `tsc`, tier audits, principle tests, pattern coverage, and `npm run audit:fe` pass;
- 27 approved teacher holds remain unchanged.

The ESLint baseline has three scopes:

- product: `src/**` and `.storybook/**`;
- tooling: `plugins/eslint/**`, `scripts/**`, and `.claude/scripts/**`;
- generated evidence: `.artifacts/**`, ignored by product lint.

Do not commit or push.

## Mission

Burn down ESLint warning debt and ratchet rules to strict errors without changing visual behavior or inventing architecture.

## Required workflow

1. Read first:

   - `eslint.config.mjs`;
   - `plugins/eslint/index.mjs`;
   - `.claude/fe/README.md`;
   - `.claude/fe/decision-ledger.json`;
   - active canon under `.claude/canon/fe/**` and `.claude/fe/**`;
   - the relevant audit runner for each rule.

2. Run a fresh baseline:

   ```text
   npx eslint src .storybook --format json
   npx eslint plugins/eslint scripts .claude/scripts --format json
   ```

3. Partition work by disjoint domain:

   - atoms;
   - composites;
   - frames/layout;
   - blocks;
   - pages;
   - Storybook-only extras;
   - tooling rules/tests.

   Never let two workers edit the same file. Storybook is the blueprint; mirror a source twin only where one exists.

4. Each worker must report files changed, violations before/after, holds preserved, semantic decisions, and verification results.

## Strict rule order

### Tier and composition contract

- `require-frame-self-declare`;
- `require-identity-root`;
- `no-identity-wrapper-div`;
- `page-folder-two-files-only`;
- `no-helper-folder-in-components`;
- `export-matches-folder`.

### Principle-only architecture

- `no-classname-at-sentence-tier`;
- `no-per-part-classname-prop`;
- `no-public-frame-css-props`;
- singular `principle` / `data-principle` only;
- no runtime namespace objects;
- no raw spacing or alignment decisions where a semantic principle owns the seam.

### Rendering and skeleton contract

- `no-raw-shape-at-sentence-tier`;
- `no-parallel-skeleton`;
- `no-skeleton-twin-component`;
- `no-inline-skeleton-branch`;
- `no-retired-async-content`.

### Vocabulary and authoring rules

- `no-heroui-outside-vocabulary`;
- `no-cn-above-vocabulary`;
- `no-arbitrary-token`;
- `require-export-jsdoc`;
- `prefer-arrow-export`;
- `handler-on-prefix`.

Keep JSX a11y rules separate from architectural rules. Burn them only after the component contract is stable.

## New strict authoring rules

Before adding a rule, prove that no existing ESLint rule or audit already covers it. Add focused rule tests.

1. `no-inline-parameter-type`

   Reject inline parameter destructuring types such as:

   ```ts
   ({ value }: { value: string }) => ...
   ```

   Require a named `type` or `interface` in the module. Do not reject normal destructuring without an inline type.

2. `no-emoji-in-source`

   Reject emoji in identifiers, comments, JSDoc, diagnostics, and non-content source strings. Keep an explicit allowlist for translation/content dictionaries and test fixtures.

3. `no-vietnamese-in-source-authoring`

   Reject Vietnamese prose in comments, JSDoc, identifiers, diagnostics, and rule messages. Do not reject user-facing localized copy in approved translation/content modules.

4. Keep messages and JSDoc in English. Do not add file-wide disables. A narrow documented exception must be recorded in the ledger.

## Ratchet policy

- Existing debt may remain `warn` during a burn batch.
- New violations in changed files must fail `--max-warnings=0`.
- When a rule reaches zero measured debt, change it from `warn` to `error` in `eslint.config.mjs`.
- Add a regression fixture/test for every ratcheted rule.
- Never lower an existing strict rule to make a batch pass.
- Teacher holds remain holds unless explicitly resolved in the ledger.

## Forbidden changes

- no mass mechanical edits without inspecting the owning tier;
- no fake principle tokens;
- no new public CSS escape hatch;
- no `className`/`classNames` added to atoms or sentence-tier components;
- no changes to the 27 approved teacher holds;
- no generated artifact edits;
- no commit or push.

## Verification for every batch

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all changed product files>
npx eslint --max-warnings=0 <all changed tooling files>
node --test .storybook/test-runner/principle-style.test.mjs
npm run audit:fe
```

Also run focused plugin rule tests whenever `plugins/eslint/index.mjs` changes.

At the end, report the exact remaining warning count by rule and update:

- `.claude/fe/decision-ledger.json`;
- the relevant canon/enforcement document;
- a dated artifact report under `.artifacts/fe-refactor-audit/`.

Stop after the assigned partition. Do not commit or push.
