# StarCi FE ESLint ruleset audit

Status: **audited; topology freeze prerequisite**
Checkpoint measured: `9e86cbdf`
Registered custom rules: **38**
Dedicated rule coverage: **11/38**
Product inventory: **7,347 messages / 1,358 files / 0 errors**

The detailed generated evidence remains in:
`.artifacts/fe-refactor-audit/2026-08-10-eslint-ruleset-freeze-audit.md`.

## Rule families

### Token and invariant gates

- no-fractional-spacing
- no-adjacent-chip
- no-modal-title-classname
- no-hero-heading-class
- no-arbitrary-token
- explain-justifies-token-choice
- no-public-frame-css-props

### Authoring and naming

- prefer-arrow-export
- require-export-jsdoc
- handler-on-prefix
- export-matches-folder
- no-inline-parameter-type
- no-emoji-in-source
- no-vietnamese-in-source-authoring
- no-runtime-namespace

### Tier and ownership

- no-heroui-outside-vocabulary
- presentational-purity
- require-identity-root
- no-identity-wrapper-div
- require-frame-self-declare
- page-folder-two-files-only
- no-helper-folder-in-components
- no-hardcoded-user-text-in-vocabulary

### Sentence-shape gates

- no-classname-at-sentence-tier
- no-cn-above-vocabulary
- no-raw-shape-at-sentence-tier
- no-host-element-at-sentence-tier
- no-frame-fragment-item
- no-contentpage-box-classname

### CSS contract gates

- no-public-classname-prop
- no-per-part-classname-prop
- no-css-door-type-laundering

### Lifecycle gates

- no-retired-async-content
- no-parallel-skeleton
- no-inline-skeleton-branch
- no-skeleton-twin-component

### Inspection retirement

- no-anatomy-overlay

## Findings

### Rules are not workload units

Several rules intentionally report the same JSX subtree from different
boundaries. Migration reporting must dedupe by AST node and semantic owner.
Raw message totals remain telemetry only.

### CSS policy was inconsistent

The approved topology forbids public CSS doors on house components. Any audit
or diagnostic that describes atom/frame `classNames` as valid is stale and
must be aligned before the ruleset is frozen.

### Frame enforcement is incomplete

`no-public-frame-css-props` currently contains pilot scope. A zero count does
not prove global frame compliance. Expand it only after adding tests and
measuring impact; then freeze its semantics for the migration.

### Tree scope is inconsistent

Older rules often inspect src only; newer rules inspect Storybook and src.
Every architectural rule needs an explicit tested scope policy:

- Storybook blueprint;
- src mirror;
- vendor/Nivo/locked exclusions;
- Windows and POSIX path handling.

### Test coverage is insufficient

Only ten rules have dedicated regression tests. Before severity ratchets, every
rule needs valid/invalid cases and path/syntax/exception coverage.

### Laundering analysis is partial

The current rule catches direct utility keys and selected component inheritance.
Alias, mapped, conditional and indirect spread cases are not fully traced.
Finding count is not proof of completeness.

### A11y is observed, not actionable

jsx-a11y warnings stay visible but are excluded from architecture actionable
zero under the teacher decision. Do not disable them and do not silently fix
behavior in an architectural migration.

## Frozen migration metrics

Track:

```text
raw_messages
unique_ast_clusters
actionable_clusters
held_clusters
unclassified
```

Definition of architectural completion:

```text
eslint_errors = 0
actionable_clusters = 0
unclassified = 0
remaining = explicit teacher / locked / vendor / a11y-observed holds
```

## Freeze procedure

Before mass migration:

1. align audit text with the topology;
2. add coverage for untested rules;
3. make Storybook/src scope explicit;
4. remove diagnostics that recommend eslint-disable;
5. build AST-cluster inventory;
6. classify all remaining messages;
7. freeze names, semantics, scope and severity;
8. add no new architectural rule until actionable zero.

## Current measured leaders

```text
1744 no-host-element-at-sentence-tier
1494 no-public-classname-prop
835  no-raw-shape-at-sentence-tier
762  require-frame-self-declare
592  require-identity-root
448  no-heroui-outside-vocabulary
377  no-cn-above-vocabulary
354  page-folder-two-files-only
216  no-classname-at-sentence-tier
96   no-frame-fragment-item
```

These numbers overlap and must not be summed as independent edits.
