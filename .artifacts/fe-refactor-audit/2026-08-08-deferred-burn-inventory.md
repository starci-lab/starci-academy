# Deferred FE debt burn — inventory 2026-08-08

Checkpoint: `27127bb5`. HEAD: `d1d71459`. Fresh ESLint JSON: `2026-08-08-deferred-burn-eslint-raw.json`.

## Totals

| Metric | Count |
|---|---:|
| starci-fe messages | 4881 |
| a11y (untouched) | 11 |
| messages on locked paths | 333 |

### By classification

| Classification | Count |
|---|---:|
| `safe-structural` | 3021 |
| `ambiguous` | 709 |
| `semantic-hold` | 581 |
| `locked-path` | 333 |
| `safe-mechanical` | 237 |

## By rule

| Rule | Count |
|---|---:|
| `starci-fe/require-frame-self-declare` | 829 |
| `starci-fe/no-raw-shape-at-sentence-tier` | 714 |
| `starci-fe/require-identity-root` | 646 |
| `starci-fe/no-cn-above-vocabulary` | 621 |
| `starci-fe/no-classname-at-sentence-tier` | 555 |
| `starci-fe/no-heroui-outside-vocabulary` | 524 |
| `starci-fe/page-folder-two-files-only` | 354 |
| `starci-fe/no-vietnamese-in-source-authoring` | 87 |
| `starci-fe/no-inline-parameter-type` | 82 |
| `starci-fe/require-export-jsdoc` | 74 |
| `starci-fe/no-parallel-skeleton` | 68 |
| `starci-fe/no-helper-folder-in-components` | 63 |
| `starci-fe/no-emoji-in-source` | 62 |
| `starci-fe/no-inline-skeleton-branch` | 50 |
| `starci-fe/no-retired-async-content` | 40 |
| `starci-fe/no-skeleton-twin-component` | 39 |
| `starci-fe/no-per-part-classname-prop` | 26 |
| `starci-fe/no-arbitrary-token` | 16 |
| `starci-fe/handler-on-prefix` | 14 |
| `starci-fe/no-hero-heading-class` | 8 |
| `starci-fe/no-hardcoded-user-text-in-vocabulary` | 4 |
| `starci-fe/prefer-arrow-export` | 3 |
| `starci-fe/no-runtime-namespace` | 1 |
| `starci-fe/no-identity-wrapper-div` | 1 |

## Holds (recorded before dispatch)

- 27 pattern-coverage teacher holds (audit:fe)
- Locked paths: BlockAnatomy, MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene, nivo/nivoexpert, Mia-Mia, src/resources
- missing-both require-frame-self-declare → ambiguous (no invented tokens)
- page-folder-two-files-only / helper-folder → semantic-hold unless mechanical + importer-proven
- parallel/twin skeleton → semantic-hold by default
- no-retired-async-content API mismatch → semantic-hold
- HeroUI vendor compounds at atom vocabulary → vendor-hold
- ragsourcegraph-data-tier-div-2026-08-07
- a11y out of scope

## Partitions (disjoint file ownership)

### `blocks-domain`

- files: **348** · messages: **1581** · candidate files: **313**
- top rules: `no-raw-shape-at-sentence-tier(367)`, `require-identity-root(267)`, `no-cn-above-vocabulary(236)`, `require-frame-self-declare(209)`, `no-classname-at-sentence-tier(187)`, `no-heroui-outside-vocabulary(173)`, `no-emoji-in-source(45)`, `no-parallel-skeleton(18)`
- by class: `safe-structural(1252)`, `ambiguous(209)`, `safe-mechanical(69)`, `semantic-hold(51)`

### `pages-profile-dashboard`

- files: **276** · messages: **1188** · candidate files: **182**
- top rules: `require-frame-self-declare(230)`, `page-folder-two-files-only(205)`, `require-identity-root(135)`, `no-heroui-outside-vocabulary(132)`, `no-classname-at-sentence-tier(132)`, `no-raw-shape-at-sentence-tier(110)`, `no-cn-above-vocabulary(109)`, `no-parallel-skeleton(35)`
- by class: `safe-structural(642)`, `semantic-hold(309)`, `ambiguous(230)`, `safe-mechanical(7)`

### `blocks-layout`

- files: **273** · messages: **1071** · candidate files: **223**
- top rules: `no-cn-above-vocabulary(202)`, `require-identity-root(183)`, `no-classname-at-sentence-tier(174)`, `no-heroui-outside-vocabulary(162)`, `no-raw-shape-at-sentence-tier(151)`, `require-frame-self-declare(121)`, `page-folder-two-files-only(36)`, `no-helper-folder-in-components(23)`
- by class: `safe-structural(874)`, `ambiguous(121)`, `semantic-hold(69)`, `safe-mechanical(7)`

### `pages-learning-commerce`

- files: **96** · messages: **375** · candidate files: **53**
- top rules: `require-frame-self-declare(100)`, `page-folder-two-files-only(84)`, `no-classname-at-sentence-tier(38)`, `require-identity-root(33)`, `no-heroui-outside-vocabulary(31)`, `no-cn-above-vocabulary(24)`, `no-raw-shape-at-sentence-tier(18)`, `no-parallel-skeleton(12)`
- by class: `safe-structural(152)`, `semantic-hold(123)`, `ambiguous(100)`

### `HOLD-LOCKED`

- files: **54** · messages: **333** · candidate files: **0**
- top rules: `require-frame-self-declare(120)`, `no-inline-parameter-type(53)`, `no-raw-shape-at-sentence-tier(48)`, `no-cn-above-vocabulary(36)`, `no-emoji-in-source(13)`, `no-vietnamese-in-source-authoring(11)`, `require-identity-root(10)`, `no-classname-at-sentence-tier(10)`
- by class: `locked-path(333)`

### `app-modules-utils`

- files: **173** · messages: **268** · candidate files: **164**
- top rules: `no-vietnamese-in-source-authoring(74)`, `require-export-jsdoc(62)`, `page-folder-two-files-only(20)`, `no-raw-shape-at-sentence-tier(20)`, `require-identity-root(18)`, `no-heroui-outside-vocabulary(17)`, `no-classname-at-sentence-tier(14)`, `no-cn-above-vocabulary(14)`
- by class: `safe-mechanical(152)`, `safe-structural(83)`, `semantic-hold(25)`, `ambiguous(8)`

### `composites-frames`

- files: **21** · messages: **58** · candidate files: **6**
- top rules: `require-frame-self-declare(41)`, `no-per-part-classname-prop(13)`, `no-inline-skeleton-branch(3)`, `no-hardcoded-user-text-in-vocabulary(1)`
- by class: `ambiguous(41)`, `safe-structural(16)`, `semantic-hold(1)`

### `atoms-display-forms`

- files: **3** · messages: **5** · candidate files: **1**
- top rules: `no-hardcoded-user-text-in-vocabulary(3)`, `no-per-part-classname-prop(2)`
- by class: `semantic-hold(3)`, `safe-structural(2)`

### `storybook-only`

- files: **2** · messages: **2** · candidate files: **2**
- top rules: `handler-on-prefix(2)`
- by class: `safe-mechanical(2)`
