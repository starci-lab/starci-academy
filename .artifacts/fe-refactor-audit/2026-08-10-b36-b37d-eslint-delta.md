# B36+B37d ESLint delta

Command (identical for checkpoint and worktree):

```bash
npx eslint --format json --no-error-on-unmatched-pattern src .storybook
```

## Totals

| | Warnings | Files | Errors | a11y |
|---|---:|---:|---:|---:|
| Checkpoint `84b92cd77` | 6269 | 1105 | 0 | 11 |
| Current worktree | 6174 | 1084 | 0 | 11 |
| Δ | -95 | -21 | 0 | 0 |

`starci-fe/no-redundant-labeled-surface` hits: before 0, after 0 (must be 0 after B37c).

## Domain delta

| Domain | Before | After | Δ |
|---|---:|---:|---:|
| tier-ownership | 1904 | 1852 | -52 |
| sentence-shape | 2794 | 2778 | -16 |
| css-contract | 1107 | 1093 | -14 |
| lifecycle | 190 | 181 | -9 |
| authoring | 58 | 54 | -4 |

## Rule delta (non-zero only)

| Rule | Before | After | Δ | Domain |
|---|---:|---:|---:|---|
| `starci-fe/page-folder-two-files-only` | 296 | 274 | -22 | tier-ownership |
| `starci-fe/no-public-classname-prop` | 1107 | 1093 | -14 | css-contract |
| `starci-fe/require-identity-root` | 532 | 519 | -13 | tier-ownership |
| `starci-fe/require-frame-self-declare` | 630 | 622 | -8 | tier-ownership |
| `starci-fe/no-host-element-at-sentence-tier` | 1497 | 1490 | -7 | sentence-shape |
| `starci-fe/no-heroui-outside-vocabulary` | 411 | 404 | -7 | tier-ownership |
| `starci-fe/no-emoji-in-source` | 58 | 54 | -4 | authoring |
| `starci-fe/no-parallel-skeleton` | 67 | 63 | -4 | lifecycle |
| `starci-fe/no-raw-shape-at-sentence-tier` | 765 | 761 | -4 | sentence-shape |
| `starci-fe/no-classname-at-sentence-tier` | 178 | 174 | -4 | sentence-shape |
| `starci-fe/no-retired-async-content` | 40 | 37 | -3 | lifecycle |
| `starci-fe/no-helper-folder-in-components` | 35 | 33 | -2 | tier-ownership |
| `starci-fe/no-cn-above-vocabulary` | 354 | 353 | -1 | sentence-shape |
| `starci-fe/no-skeleton-twin-component` | 38 | 37 | -1 | lifecycle |
| `starci-fe/no-inline-skeleton-branch` | 45 | 44 | -1 | lifecycle |
