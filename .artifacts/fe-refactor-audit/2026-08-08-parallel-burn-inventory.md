# Parallel FE architectural burn — inventory 2026-08-08

Checkpoint: `04bf3f14`. Fresh ESLint JSON: `2026-08-08-parallel-burn-eslint-raw.json`.

## Totals

| Metric | Count |
|---|---:|
| starci-fe messages | 5406 |
| a11y (untouched) | 11 |
| messages on locked/nivo paths | 458 |

## By rule

| Rule | Count |
|---|---:|
| `starci-fe/require-frame-self-declare` | 829 |
| `starci-fe/no-raw-shape-at-sentence-tier` | 714 |
| `starci-fe/require-identity-root` | 647 |
| `starci-fe/no-cn-above-vocabulary` | 621 |
| `starci-fe/no-classname-at-sentence-tier` | 555 |
| `starci-fe/no-heroui-outside-vocabulary` | 524 |
| `starci-fe/page-folder-two-files-only` | 354 |
| `starci-fe/require-export-jsdoc` | 298 |
| `starci-fe/no-emoji-in-source` | 189 |
| `starci-fe/no-vietnamese-in-source-authoring` | 146 |
| `starci-fe/no-inline-parameter-type` | 138 |
| `starci-fe/no-parallel-skeleton` | 68 |
| `starci-fe/no-helper-folder-in-components` | 63 |
| `starci-fe/no-inline-skeleton-branch` | 52 |
| `starci-fe/no-retired-async-content` | 40 |
| `starci-fe/handler-on-prefix` | 39 |
| `starci-fe/no-skeleton-twin-component` | 39 |
| `starci-fe/prefer-arrow-export` | 29 |
| `starci-fe/no-per-part-classname-prop` | 26 |
| `starci-fe/no-arbitrary-token` | 16 |
| `starci-fe/no-hero-heading-class` | 8 |
| `starci-fe/no-runtime-namespace` | 5 |
| `starci-fe/no-hardcoded-user-text-in-vocabulary` | 4 |
| `starci-fe/export-matches-folder` | 1 |
| `starci-fe/no-identity-wrapper-div` | 1 |

## Holds (recorded before dispatch)

- 27 pattern-coverage teacher holds (audit:fe)
- Locked paths: BlockAnatomy, MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene, nivo/nivoexpert, Mia-Mia, src/resources
- missing-both require-frame-self-declare — no invented tokens
- page-folder-two-files-only / most helper-folder — non-mechanical
- no-retired-async-content API mismatch
- ragsourcegraph-data-tier-div-2026-08-07
- HeroUI vendor namespaces remain allowed
- a11y out of scope

## Partitions (disjoint file ownership)

### `blocks-domain`

- files: **384** · messages: **1764** · safe-candidate msgs: **455**
- top rules: `no-raw-shape-at-sentence-tier(383)`, `require-identity-root(299)`, `no-cn-above-vocabulary(273)`, `no-classname-at-sentence-tier(209)`, `require-frame-self-declare(201)`, `no-heroui-outside-vocabulary(198)`, `no-emoji-in-source(88)`, `handler-on-prefix(18)`

### `pages-core`

- files: **271** · messages: **636** · safe-candidate msgs: **316**
- top rules: `require-export-jsdoc(107)`, `no-vietnamese-in-source-authoring(103)`, `page-folder-two-files-only(62)`, `no-heroui-outside-vocabulary(53)`, `require-identity-root(49)`, `require-frame-self-declare(49)`, `no-classname-at-sentence-tier(43)`, `no-cn-above-vocabulary(34)`

### `blocks-layout`

- files: **262** · messages: **1101** · safe-candidate msgs: **227**
- top rules: `no-cn-above-vocabulary(179)`, `require-identity-root(169)`, `no-classname-at-sentence-tier(166)`, `no-raw-shape-at-sentence-tier(155)`, `no-heroui-outside-vocabulary(154)`, `require-frame-self-declare(137)`, `page-folder-two-files-only(56)`, `no-inline-parameter-type(26)`

### `atoms`

- files: **76** · messages: **177** · safe-candidate msgs: **172**
- top rules: `require-export-jsdoc(168)`, `no-hardcoded-user-text-in-vocabulary(3)`, `handler-on-prefix(2)`, `no-emoji-in-source(2)`, `no-per-part-classname-prop(2)`

### `pages-special`

- files: **269** · messages: **1091** · safe-candidate msgs: **162**
- top rules: `require-frame-self-declare(245)`, `page-folder-two-files-only(209)`, `no-classname-at-sentence-tier(116)`, `require-identity-root(108)`, `no-heroui-outside-vocabulary(98)`, `no-raw-shape-at-sentence-tier(86)`, `no-cn-above-vocabulary(84)`, `no-parallel-skeleton(29)`

### `HOLD-LOCKED`

- files: **73** · messages: **458** · safe-candidate msgs: **113**
- top rules: `require-frame-self-declare(156)`, `no-raw-shape-at-sentence-tier(57)`, `no-inline-parameter-type(55)`, `no-cn-above-vocabulary(51)`, `page-folder-two-files-only(27)`, `require-identity-root(22)`, `no-heroui-outside-vocabulary(21)`, `no-classname-at-sentence-tier(21)`

### `composites`

- files: **54** · messages: **115** · safe-candidate msgs: **60**
- top rules: `no-emoji-in-source(47)`, `require-frame-self-declare(41)`, `no-per-part-classname-prop(13)`, `no-runtime-namespace(4)`, `no-inline-skeleton-branch(3)`, `handler-on-prefix(2)`, `require-export-jsdoc(2)`, `prefer-arrow-export(2)`

### `storybook-only`

- files: **7** · messages: **23** · safe-candidate msgs: **23**
- top rules: `no-vietnamese-in-source-authoring(16)`, `no-emoji-in-source(3)`, `require-export-jsdoc(2)`, `no-inline-parameter-type(2)`

### `frames`

- files: **7** · messages: **15** · safe-candidate msgs: **15**
- top rules: `no-emoji-in-source(9)`, `prefer-arrow-export(6)`

### `exports-structure`

- files: **26** · messages: **26** · safe-candidate msgs: **1**
- top rules: `no-helper-folder-in-components(25)`, `export-matches-folder(1)`
