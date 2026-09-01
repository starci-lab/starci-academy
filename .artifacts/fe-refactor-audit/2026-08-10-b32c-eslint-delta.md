# B32c ESLint delta (normalized)

Command: `npx eslint --format json --no-error-on-unmatched-pattern src .storybook`
Before: checkpoint `9e86cbdf` via worktree `D:\Repositories\starci-academy\.artifacts\_b32c-worktree-9e86cbdf`
After: active worktree HEAD `139391b6d248024019f62c88ec6a765495854f0f`

## Totals

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| Raw messages | 7444 | 6903 | -541 |
| Affected files | 1437 | 1230 | -207 |
| Errors | 0 | 1 | 1 |
| Warnings | 7444 | 6902 | -542 |
| StarCi | 7433 | 6892 | -541 |
| A11y (observed) | 11 | 11 | 0 |

## Hold classes

| Class | Before | After | Delta |
|---|---:|---:|---:|
| actionable | 6721 | 6184 | -537 |
| locked | 712 | 708 | -4 |
| a11y-observed | 11 | 11 | 0 |

## Rule delta (sorted by improvement)

- `starci-fe/no-public-classname-prop`: 1494 → 1211 (-283)
- `starci-fe/require-frame-self-declare`: 762 → 694 (-68)
- `starci-fe/no-host-element-at-sentence-tier`: 1744 → 1690 (-54)
- `starci-fe/require-export-jsdoc`: 50 → 17 (-33)
- `starci-fe/require-identity-root`: 592 → 574 (-18)
- `starci-fe/no-classname-at-sentence-tier`: 216 → 198 (-18)
- `starci-fe/no-vietnamese-in-source-authoring`: 27 → 9 (-18)
- `starci-fe/no-heroui-outside-vocabulary`: 448 → 437 (-11)
- `starci-fe/no-emoji-in-source`: 60 → 50 (-10)
- `starci-fe/page-folder-two-files-only`: 354 → 344 (-10)
- `starci-fe/no-cn-above-vocabulary`: 377 → 371 (-6)
- `starci-fe/no-frame-fragment-item`: 107 → 102 (-5)
- `starci-fe/no-helper-folder-in-components`: 63 → 58 (-5)
- `starci-fe/no-per-part-classname-prop`: 9 → 8 (-1)
- `starci-fe/no-raw-shape-at-sentence-tier`: 835 → 834 (-1)
- `starci-fe/no-inline-skeleton-branch`: 47 → 46 (-1)
- `starci-fe/explain-justifies-token-choice`: 0 → 1 (+1)

## Path family delta

- `src-blocks`: 3664 → 3503 (-161)
- `src-composites`: 169 → 82 (-87)
- `sb-starci`: 261 → 204 (-57)
- `src-modules`: 68 → 18 (-50)
- `src-pages`: 2412 → 2370 (-42)
- `sb-composites`: 73 → 41 (-32)
- `sb-atoms`: 43 → 14 (-29)
- `src-atoms`: 48 → 19 (-29)
- `src-overlays`: 200 → 171 (-29)
- `sb-frames`: 17 → 9 (-8)
- `src-frames`: 20 → 12 (-8)
- `src-layouts`: 130 → 125 (-5)
- `sb-other`: 28 → 24 (-4)

## Freeze-audit reconciliation

Freeze audit claimed 7,347 / 1,358. B32 inventory claimed 7,428 / 1,434.
Normalized checkpoint remeasure: **7444 / 1437**.
Use this normalized pair for all B32c claims; discard prior mismatched baselines.
