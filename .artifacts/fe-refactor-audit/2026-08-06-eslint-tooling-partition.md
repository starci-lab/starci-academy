# ESLint strict burn-down — tooling partition report

**Date:** 2026-08-06  
**Partition:** tooling rules/tests (only)  
**Repo:** `D:\Repositories\starci-academy`  
**Commit/push:** none (per mission)

## Baseline (before this partition)

Product (`src` + `.storybook`): **6410** warnings, **0** errors across 1429 files.

| Count | Rule |
|------:|------|
| 1977 | starci-fe/require-frame-self-declare |
| 717 | starci-fe/no-raw-shape-at-sentence-tier |
| 703 | starci-fe/require-identity-root |
| 623 | starci-fe/no-cn-above-vocabulary |
| 555 | starci-fe/no-classname-at-sentence-tier |
| 549 | starci-fe/no-heroui-outside-vocabulary |
| 356 | starci-fe/page-folder-two-files-only |
| 296 | starci-fe/require-export-jsdoc |
| 144 | starci-fe/no-identity-wrapper-div |
| 92 | starci-fe/no-parallel-skeleton |
| 66 | starci-fe/no-helper-folder-in-components |
| 62 | starci-fe/no-inline-skeleton-branch |
| 53 | starci-fe/export-matches-folder |
| 40 | starci-fe/no-skeleton-twin-component |
| 40 | starci-fe/no-retired-async-content |
| 39 | starci-fe/handler-on-prefix |
| 29 | starci-fe/prefer-arrow-export |
| 26 | starci-fe/no-per-part-classname-prop |
| 16 | starci-fe/no-arbitrary-token |
| 8 | jsx-a11y/aria-role |
| 8 | starci-fe/no-hero-heading-class |
| 4 | starci-fe/no-hardcoded-user-text-in-vocabulary |
| 3 | starci-fe/no-anatomy-overlay |
| 2 | jsx-a11y/no-static-element-interactions |
| 1 | (parse/other) |
| 1 | jsx-a11y/click-events-have-key-events |

Tooling (`plugins/eslint` + `scripts`): **0** messages.  
Note: `.claude/scripts` does not exist in this repo (gates live in the backend).

## Gap proof (before adding rules)

| Proposed rule | Existing coverage? |
|---|---|
| `no-inline-parameter-type` | None. `props-and-types.md` §6 shows named `XxxProps` but no ESLint/audit enforced it on destructured params. |
| `no-emoji-in-source` | `explore/principles/no-emoji.md` only (UI prose). No ESLint rule. |
| `no-vietnamese-in-source-authoring` | Gate `check-no-vietnamese.mjs` scans Storybook + `src/components` only — not ESLint, not `plugins/eslint` / `scripts`. |

## Files changed

- `plugins/eslint/authoring.mjs` — three new rules + allowlists
- `plugins/eslint/authoring.test.mjs` — focused RuleTester + allowlist unit tests
- `plugins/eslint/index.mjs` — wire rules; English diagnostics/docs/comments
- `eslint.config.mjs` — wire as `warn` on product + tooling; English comments
- `.claude/fe/decision-ledger.json` — `eslint-authoring-rules-2026-08-06`
- Backend canon (source of truth): `enforce/authoring/INDEX.md`, `props-and-types.md`, `comments.md`

## After this partition — product warning totals

**6974** warnings (+564 from the three new rules), **0** errors.

### New rule debt (warn — not ratcheted)

| Debt | Rule |
|-----:|------|
| 139 | starci-fe/no-inline-parameter-type |
| 197 | starci-fe/no-emoji-in-source |
| 228 | starci-fe/no-vietnamese-in-source-authoring |

### Unchanged architectural / a11y debt (same counts as baseline)

All pre-existing starci-fe + jsx-a11y counts unchanged from the baseline table above.

## Holds

**27** approved teacher holds preserved (`npm run audit:fe` → `check-pattern-coverage`: 27 held, 0 failing).

## Semantic decisions

1. New rules start at **`warn`** (debt > 0). Ratchet to `error` only at measured zero.
2. Allowlists: `messages/{en,vi}.json`, `PlaygroundSessionProvider/content/**`, `*.test.*` / `*.spec.*` / fixtures; sanctions `Tiếng Việt` + `vn-ok:`.
3. `no-inline-parameter-type` only flags **destructured** params with inline `TSTypeLiteral` — `(props: { x: string })` stays allowed.
4. Plugin diagnostics and comments translated to English so tooling files pass `--max-warnings=0` under the new rules.
5. No product component burn in this partition; no visual changes; no teacher-hold edits; no commit/push.

## Verification

| Check | Result |
|---|---|
| `node --test plugins/eslint/authoring.test.mjs` | pass (5) |
| `npx eslint --max-warnings=0` on changed tooling files | pass |
| `npx tsc --noEmit` | pass |
| `node --test .storybook/test-runner/principle-style.test.mjs` | pass (7) |
| `npm run audit:fe` | pass (frames/atoms/composites/principles/pattern-coverage; 27 holds) |

## Stop

Partition **tooling rules/tests** complete. Next partitions (disjoint): atoms → composites → frames/layout → blocks → pages → Storybook-only — burn architectural warn debt in the prompt's strict rule order, then the three new authoring debts, then a11y.
