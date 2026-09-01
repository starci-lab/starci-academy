# SAFE MASS-BURN — inventory 2026-08-08 (BATCH 11)

HEAD: `d1d71459`. Fresh ESLint: `2026-08-08-safe-mass-eslint-raw.json`.
Prior: BATCH 10 deferred burn still uncommitted in working tree.

## Totals

| Metric | Count |
|---|---:|
| starci-fe messages | 4767 |
| a11y (untouched) | 11 |
| locked-path messages | 333 |

### By classification

| Classification | Count |
|---|---:|
| `hold` | 2727 |
| `safe` | 1331 |
| `ambiguous` | 709 |

## By rule

| Rule | Count |
|---|---:|
| `starci-fe/require-frame-self-declare` | 829 |
| `starci-fe/no-raw-shape-at-sentence-tier` | 708 |
| `starci-fe/require-identity-root` | 637 |
| `starci-fe/no-cn-above-vocabulary` | 604 |
| `starci-fe/no-classname-at-sentence-tier` | 542 |
| `starci-fe/no-heroui-outside-vocabulary` | 513 |
| `starci-fe/page-folder-two-files-only` | 354 |
| `starci-fe/require-export-jsdoc` | 70 |
| `starci-fe/no-parallel-skeleton` | 68 |
| `starci-fe/no-vietnamese-in-source-authoring` | 66 |
| `starci-fe/no-inline-parameter-type` | 65 |
| `starci-fe/no-helper-folder-in-components` | 63 |
| `starci-fe/no-emoji-in-source` | 61 |
| `starci-fe/no-inline-skeleton-branch` | 48 |
| `starci-fe/no-retired-async-content` | 40 |
| `starci-fe/no-skeleton-twin-component` | 39 |
| `starci-fe/no-per-part-classname-prop` | 18 |
| `starci-fe/no-arbitrary-token` | 16 |
| `starci-fe/handler-on-prefix` | 11 |
| `starci-fe/no-hero-heading-class` | 8 |
| `starci-fe/no-hardcoded-user-text-in-vocabulary` | 4 |
| `starci-fe/no-runtime-namespace` | 1 |
| `starci-fe/no-identity-wrapper-div` | 1 |
| `starci-fe/prefer-arrow-export` | 1 |

## Allowed / hard holds

**Allowed:** vocabulary redirects / approved substitutions; public-export JSDoc + English authoring; mechanical type/import/export with proven consumers; identity root only on clear declared roots; HeroUI layout wrappers → existing atoms (identical API); remove unused per-part classname (non-vendor, no consumers).

**Hard holds:** a11y / ChipBase API / handleSide / teacher holds / Nivo / locked paths; missing-both frame principles / page-folder / parallel skeleton; raw-shape without existing honest principle; vendor HeroUI compounds / fake tokens / eslint-disable / git ops.

## Partitions

### `blocks-domain`

- files: **347** · messages: **1569** · safe-candidate files: **293**
- top rules: `no-raw-shape-at-sentence-tier(364)`, `require-identity-root(266)`, `no-cn-above-vocabulary(234)`, `require-frame-self-declare(209)`, `no-classname-at-sentence-tier(186)`, `no-heroui-outside-vocabulary(172)`
- by class: `hold(851)`, `safe(509)`, `ambiguous(209)`

### `blocks-layout`

- files: **271** · messages: **1053** · safe-candidate files: **192**
- top rules: `no-cn-above-vocabulary(196)`, `require-identity-root(181)`, `no-classname-at-sentence-tier(172)`, `no-heroui-outside-vocabulary(160)`, `no-raw-shape-at-sentence-tier(151)`, `require-frame-self-declare(121)`
- by class: `hold(588)`, `safe(344)`, `ambiguous(121)`

### `pages-profile-dashboard`

- files: **276** · messages: **1182** · safe-candidate files: **155**
- top rules: `require-frame-self-declare(230)`, `page-folder-two-files-only(205)`, `require-identity-root(134)`, `no-heroui-outside-vocabulary(132)`, `no-classname-at-sentence-tier(132)`, `no-raw-shape-at-sentence-tier(110)`
- by class: `hold(684)`, `safe(268)`, `ambiguous(230)`

### `app-modules-utils`

- files: **147** · messages: **235** · safe-candidate files: **137**
- top rules: `require-export-jsdoc(58)`, `no-vietnamese-in-source-authoring(54)`, `page-folder-two-files-only(20)`, `no-raw-shape-at-sentence-tier(20)`, `require-identity-root(18)`, `no-heroui-outside-vocabulary(17)`
- by class: `safe(154)`, `hold(73)`, `ambiguous(8)`

### `pages-learning-commerce`

- files: **94** · messages: **340** · safe-candidate files: **34**
- top rules: `require-frame-self-declare(100)`, `page-folder-two-files-only(84)`, `require-identity-root(28)`, `no-classname-at-sentence-tier(28)`, `no-heroui-outside-vocabulary(23)`, `no-cn-above-vocabulary(15)`
- by class: `hold(189)`, `ambiguous(100)`, `safe(51)`

### `composites-frames`

- files: **20** · messages: **48** · safe-candidate files: **4**
- top rules: `require-frame-self-declare(41)`, `no-per-part-classname-prop(5)`, `no-inline-skeleton-branch(1)`, `no-hardcoded-user-text-in-vocabulary(1)`
- by class: `ambiguous(41)`, `safe(5)`, `hold(2)`

### `HOLD-LOCKED`

- files: **54** · messages: **333** · safe-candidate files: **0**
- top rules: `require-frame-self-declare(120)`, `no-inline-parameter-type(53)`, `no-raw-shape-at-sentence-tier(48)`, `no-cn-above-vocabulary(36)`, `no-emoji-in-source(13)`, `no-vietnamese-in-source-authoring(11)`
- by class: `hold(333)`

### `storybook-only`

- files: **2** · messages: **2** · safe-candidate files: **0**
- top rules: `handler-on-prefix(2)`
- by class: `hold(2)`

### `atoms`

- files: **3** · messages: **5** · safe-candidate files: **0**
- top rules: `no-hardcoded-user-text-in-vocabulary(3)`, `no-per-part-classname-prop(2)`
- by class: `hold(5)`
