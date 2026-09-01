# SAFE MASS-BURN — status 2026-08-08 (BATCH 11)

HEAD at start: `d1d71459`. Inventory: `2026-08-08-safe-mass-inventory.md`.

## Aggregate

| Metric | Count |
|---|---:|
| Partitions | 8 (6 workers + 2 empty/hold-only) |
| Unique changed files | 72 |
| Skipped | 5 |
| Holds | 315 |
| Overlapping edits | **0** |
| Twin soft-mismatches | **0** |
| Regressions | **0** |

| Partition | Changed | Holds | Skipped |
|---|---:|---:|---:|
| atoms | 0 | 4 | 0 |
| composites-frames | 0 | 2 | 4 |
| blocks-layout | 6 | 40 | 0 |
| blocks-domain | 14 | 40 | 0 |
| pages-learning-commerce | 0 | 34 | 0 |
| pages-profile-dashboard | 2 | 193 | 1 |
| app-modules-utils | 50 | 0 | 0 |
| storybook-only | 0 | 2 | 0 |

## Before → after (starci-fe)

| | Count |
|---|---:|
| Before | 4767 |
| After | 4690 |
| Delta | **−77** |
| a11y (untouched) | 11 |

### Rule deltas (nonzero)

| Rule | Δ | After |
|---|---:|---:|
| no-vietnamese-in-source-authoring | −30 | 36 |
| require-export-jsdoc | −18 | 52 |
| require-identity-root | −11 | 626 |
| handler-on-prefix | −4 | 7 |
| no-heroui-outside-vocabulary | −4 | 509 |
| no-cn-above-vocabulary | −4 | 600 |
| no-per-part-classname-prop | −3 | 15 |
| no-inline-parameter-type | −2 | 63 |
| no-emoji-in-source | −1 | 60 |

Ambiguous / hold piles intentionally untouched: `require-frame-self-declare` (missing-both), page-folder, raw-shape, parallel skeleton, ChipBase, handleSide.

## Holds preserved

- ChipBase `dotClassName`, ResizableRail `handleSide`
- 27 teacher pattern holds
- Locked / Nivo / Mia-Mia
- Per-part classname with live consumers (DrawerShell, ModalShell, SurfaceCard, PDFView, …)
- Non-identical HeroUI→atom swaps; unclear host roots; page-folder; skeletons

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `npx eslint --quiet` on 72 changed files | pass |
| `npx eslint --max-warnings=0` on changed files | fails on **pre-existing held warnings** in partially burned files (0 errors) |
| plugin tests | 8/8 pass |
| principle-style | 7/7 pass |
| `npm run audit:fe` | exit 0; 27 teacher holds / 0 failing |

No commit. Ambiguous debt was not claimed fixed.
