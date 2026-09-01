# FE ESLint ruleset audit - freeze review

Date: 2026-08-10
Checkpoint: `9e86cbdf`
Status: **rules scanned; ruleset is not ready to freeze yet**

## Inventory

- Registered StarCi rules: **37**
- Dedicated rule-test coverage: **10/37**
- StarCi product findings: approximately **7.3k**
- Full product ESLint: **7,347 messages / 1,358 files / 0 errors**
- Error-level StarCi rules: **7**
- Warning-level StarCi rules: **30**
- All existing plugin tests: **15/15 pass**
- Tooling ESLint: pass

| Rule | Severity | Findings |
|---|---:|---:|
| no-host-element-at-sentence-tier | warn | 1744 |
| no-public-classname-prop | warn | 1494 |
| no-raw-shape-at-sentence-tier | warn | 835 |
| require-frame-self-declare | warn | 762 |
| require-identity-root | warn | 592 |
| no-heroui-outside-vocabulary | warn | 448 |
| no-cn-above-vocabulary | warn | 377 |
| page-folder-two-files-only | warn | 354 |
| no-classname-at-sentence-tier | warn | 216 |
| no-frame-fragment-item | warn | 96 |
| no-parallel-skeleton | warn | 68 |
| no-helper-folder-in-components | warn | 63 |
| no-inline-parameter-type | warn | 63 |
| no-inline-skeleton-branch | warn | 47 |
| no-emoji-in-source | warn | 41 |
| no-retired-async-content | warn | 40 |
| no-skeleton-twin-component | warn | 39 |
| no-arbitrary-token | warn | 16 |
| no-per-part-classname-prop | warn | 9 |
| no-hero-heading-class | warn | 8 |
| handler-on-prefix | warn | 5 |
| no-hardcoded-user-text-in-vocabulary | warn | 4 |
| require-export-jsdoc | warn | 4 |
| no-css-door-type-laundering | warn | 2 |
| no-vietnamese-in-source-authoring | warn | 2 |
| no-identity-wrapper-div | warn | 1 |
| explain-justifies-token-choice | error | 0 |
| export-matches-folder | warn | 0 |
| no-adjacent-chip | error | 0 |
| no-anatomy-overlay | warn | 0 |
| no-contentpage-box-classname | error | 0 |
| no-fractional-spacing | error | 0 |
| no-modal-title-classname | error | 0 |
| no-public-frame-css-props | error | 0 |
| no-runtime-namespace | warn | 0 |
| prefer-arrow-export | warn | 0 |
| presentational-purity | error | 0 |

## Confirmed design problems

### 1. Metrics double-count root causes

A raw sentence-tier node can trigger host, raw-shape, sentence-classname, cn,
identity and frame-self-declare simultaneously. Message totals are valid lint
telemetry but invalid migration workload estimates.

Required metric: dedupe by AST node and migration owner. Keep raw counts only
as secondary telemetry.

### 2. The strict CSS contract is internally inconsistent

`no-public-classname-prop` says house CSS doors are forbidden. Existing
atom/frame audit diagnostics still describe constrained `classNames` as valid.
The lint/audit canon must choose one rule. The current teacher decision is:
house components expose no public CSS doors; vendor-boundary implementation
may use private CSS.

### 3. Frame strictness is only a pilot

`no-public-frame-css-props` enforces Stack only inside
`AcademySettingsForm`; Grid/Form are checked only when a principle already
exists. It therefore reports zero while thousands of equivalent decisions
remain outside its pilot scope.

Before freezing, expand this rule deliberately across all strict frame
consumers and add regression tests. Do not infer that count zero means global
compliance.

### 4. Identity rules overlap but are not equivalent

`require-identity-root` checks component root ownership.
`require-frame-self-declare` checks frame instances for principle + explain.
One component may trigger both. Keep both laws, but dedupe them into one
ownership migration cluster in reporting.

### 5. Sentence rules overlap intentionally

Host, raw-shape, sentence className, cn and fragment rules defend different
escape routes. They may remain separate gates, but migration inventory must
cluster findings on the same JSX subtree.

### 6. Scope differs between src and Storybook

Several monolithic rules inspect only `src/components`; newer rules inspect
both trees; Nivo exceptions are rule-specific. "Storybook first, src mirror"
cannot be guaranteed until every architectural rule has an explicit,
tested tree-scope policy.

### 7. Test coverage is insufficient

Only 10 of 37 custom rules have dedicated regression coverage. Most untested
rules live in the large `plugins/eslint/index.mjs` monolith.

Every frozen rule needs at least:

- one valid case;
- one direct invalid case;
- Windows and POSIX path case when path-scoped;
- Storybook and src scope case;
- alias/spread/dynamic syntax cases where applicable;
- explicit vendor/locked exception case.

### 8. CSS-door laundering remains narrow

The rule catches direct literal utility keys and hard-coded Navbar/Footer
inheritance/spreads. It does not fully trace aliases, nested utility types,
mapped/conditional types, or aliased house components. Its current finding
count of two is not evidence that laundering is nearly gone.

### 9. Rule diagnostics conflict with policy

`no-arbitrary-token` tells callers to use `eslint-disable` for exceptions,
while the final campaign forbids disables. Diagnostics must direct legitimate
exceptions to a finite vocabulary contract or ledger-reviewed vendor boundary.

### 10. A11y must be separated from actionable architecture

The configured jsx-a11y warnings are useful telemetry, but the teacher has
explicitly excluded a11y/contrast/keyboard work. Put them in an
`a11y-observed` bucket and exclude them from actionable-zero. Do not silently
disable them and do not mix them into authoring debt.

## Freeze decision

Do **not** add more product-facing architectural rules after this audit.
First perform one tooling closure:

1. align atom/frame audit text with the no-public-CSS-door decision;
2. expand and test no-public-frame-css-props beyond its pilot;
3. define identical Storybook/src scope policy for architectural rules;
4. add tests for all 27 untested custom rules;
5. update misleading diagnostics;
6. create one AST-cluster inventory so overlaps count once;
7. classify a11y as observed/non-actionable;
8. generate an `unclassified` bucket and require it to equal zero.

After those items, freeze rule names, semantics, severity and scope for the
entire migration campaign. No new rule may move the finish line.

## Completion metrics after freeze

Track all four values:

```text
raw_messages
unique_ast_clusters
actionable_clusters
held_clusters
```

Definition of done:

```text
eslint_errors = 0
actionable_clusters = 0
unclassified = 0
remaining = explicit teacher / locked / vendor / a11y-observed holds only
```

Raw message count is not the definition of done.
