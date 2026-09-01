# Consumer/API reconciliation — inventory 2026-08-08 (BATCH 12)

Checkpoint: `db1f7a11`. HEAD: `22f28f4e`. Fresh ESLint: `2026-08-08-reconcile-eslint-raw.json`.

## Totals

| Metric | Count |
|---|---:|
| starci-fe messages | 4690 |
| a11y (untouched) | 11 |
| locked-path messages | 333 |

### By classification

| Classification | Count |
|---|---:|
| `api-hold` | 2852 |
| `ambiguous` | 709 |
| `identity-safe` | 616 |
| `consumer-safe` | 511 |
| `export-safe` | 2 |

## By rule

| Rule | Count |
|---|---:|
| `starci-fe/require-frame-self-declare` | 829 |
| `starci-fe/no-raw-shape-at-sentence-tier` | 708 |
| `starci-fe/require-identity-root` | 626 |
| `starci-fe/no-cn-above-vocabulary` | 600 |
| `starci-fe/no-classname-at-sentence-tier` | 542 |
| `starci-fe/no-heroui-outside-vocabulary` | 509 |
| `starci-fe/page-folder-two-files-only` | 354 |
| `starci-fe/no-parallel-skeleton` | 68 |
| `starci-fe/no-inline-parameter-type` | 63 |
| `starci-fe/no-helper-folder-in-components` | 63 |
| `starci-fe/no-emoji-in-source` | 60 |
| `starci-fe/require-export-jsdoc` | 52 |
| `starci-fe/no-inline-skeleton-branch` | 48 |
| `starci-fe/no-retired-async-content` | 40 |
| `starci-fe/no-skeleton-twin-component` | 39 |
| `starci-fe/no-vietnamese-in-source-authoring` | 36 |
| `starci-fe/no-arbitrary-token` | 16 |
| `starci-fe/no-per-part-classname-prop` | 15 |
| `starci-fe/no-hero-heading-class` | 8 |
| `starci-fe/handler-on-prefix` | 7 |
| `starci-fe/no-hardcoded-user-text-in-vocabulary` | 4 |
| `starci-fe/no-runtime-namespace` | 1 |
| `starci-fe/no-identity-wrapper-div` | 1 |
| `starci-fe/prefer-arrow-export` | 1 |

## Consumer units (per-part classname)

- **DrawerShell-classNames**: defs 2, importers 3
- **ModalShell-classNames**: defs 2, importers 2
- **SurfaceCard-contentClassName**: defs 2, importers 17
- **PDFView-heightClassName**: defs 3, importers 3

## Partitions

### `blocks-consumer-migrations`

- files: **295** · messages: **1802** · candidate files: **295**
- top rules: `no-raw-shape-at-sentence-tier(439)`, `no-cn-above-vocabulary(397)`, `no-heroui-outside-vocabulary(295)`, `require-identity-root(293)`, `no-classname-at-sentence-tier(273)`, `require-frame-self-declare(44)`
- by class: `api-hold(1166)`, `consumer-safe(299)`, `identity-safe(293)`, `ambiguous(44)`

### `identity-safe-roots`

- files: **195** · messages: **562** · candidate files: **195**
- top rules: `require-identity-root(195)`, `require-frame-self-declare(132)`, `page-folder-two-files-only(57)`, `no-classname-at-sentence-tier(52)`, `no-raw-shape-at-sentence-tier(46)`, `no-heroui-outside-vocabulary(17)`
- by class: `api-hold(218)`, `identity-safe(195)`, `ambiguous(132)`, `consumer-safe(17)`

### `pages-consumer-migrations`

- files: **128** · messages: **820** · candidate files: **128**
- top rules: `no-heroui-outside-vocabulary(127)`, `require-identity-root(127)`, `no-classname-at-sentence-tier(110)`, `no-cn-above-vocabulary(110)`, `no-raw-shape-at-sentence-tier(100)`, `page-folder-two-files-only(91)`
- by class: `api-hold(488)`, `consumer-safe(128)`, `identity-safe(127)`, `ambiguous(77)`

### `heroui-boundaries`

- files: **59** · messages: **283** · candidate files: **59**
- top rules: `no-heroui-outside-vocabulary(60)`, `no-raw-shape-at-sentence-tier(52)`, `require-frame-self-declare(45)`, `no-cn-above-vocabulary(42)`, `no-classname-at-sentence-tier(34)`, `page-folder-two-files-only(19)`
- by class: `api-hold(178)`, `consumer-safe(60)`, `ambiguous(45)`

### `atoms-composites-consumers`

- files: **6** · messages: **32** · candidate files: **5**
- top rules: `require-frame-self-declare(21)`, `no-per-part-classname-prop(6)`, `no-heroui-outside-vocabulary(1)`, `require-identity-root(1)`, `no-classname-at-sentence-tier(1)`, `no-cn-above-vocabulary(1)`
- by class: `ambiguous(21)`, `consumer-safe(7)`, `api-hold(3)`, `identity-safe(1)`

### `exports-and-barrels`

- files: **2** · messages: **2** · candidate files: **2**
- top rules: `no-runtime-namespace(1)`, `prefer-arrow-export(1)`
- by class: `export-safe(2)`

### `HOLD-LOCKED`

- files: **54** · messages: **333** · candidate files: **0**
- top rules: `require-frame-self-declare(120)`, `no-inline-parameter-type(53)`, `no-raw-shape-at-sentence-tier(48)`, `no-cn-above-vocabulary(36)`, `no-emoji-in-source(13)`, `no-vietnamese-in-source-authoring(11)`
- by class: `api-hold(333)`

### `HOLD-OTHER`

- files: **425** · messages: **856** · candidate files: **0**
- top rules: `require-frame-self-declare(390)`, `page-folder-two-files-only(176)`, `no-helper-folder-in-components(63)`, `no-classname-at-sentence-tier(62)`, `require-export-jsdoc(44)`, `no-inline-skeleton-branch(28)`
- by class: `api-hold(466)`, `ambiguous(390)`
