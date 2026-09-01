# B35c ESLint delta

Command: `npx eslint --format json --no-error-on-unmatched-pattern src .storybook`

| | Warnings | Files | Errors | a11y |
|---|---:|---:|---:|---:|
| Checkpoint `02011807` (measured) | 6882 | 1234 | 0 | 11 |
| Worktree after B35 | 6265 | 1104 | 0 | 11 |
| Δ | -617 | -130 | 0 | 0 |

## Candidate vs measured

B35 status candidate before was 6872/1232 (B34c-after artifact).
Fresh detached remasure at checkpoint is **6882/1234**. Certification uses measured values.

## High-frequency rule Δ

| Rule | Before | After | Δ |
|---|---:|---:|---:|
| starci-fe/no-host-element-at-sentence-tier | 1680 | 1497 | -183 |
| starci-fe/no-raw-shape-at-sentence-tier | 829 | 765 | -64 |
| starci-fe/no-classname-at-sentence-tier | 198 | 178 | -20 |
| starci-fe/no-cn-above-vocabulary | 372 | 354 | -18 |
| starci-fe/no-public-classname-prop | 1193 | 1107 | -86 |
| starci-fe/require-identity-root | 571 | 532 | -39 |
| starci-fe/require-frame-self-declare | 691 | 630 | -61 |
| starci-fe/no-heroui-outside-vocabulary | 437 | 411 | -26 |
| starci-fe/no-frame-fragment-item | 102 | 74 | -28 |
| starci-fe/page-folder-two-files-only | 351 | 296 | -55 |

## Introduced on commit manifest

_none_

Reduced files on commit manifest: 182
