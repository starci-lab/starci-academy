# Deferred FE debt burn — status 2026-08-08 (BATCH 10)

Checkpoint: `27127bb5`. HEAD at start: `d1d71459`. Inventory: `2026-08-08-deferred-burn-inventory.md`.

## Aggregate

| Metric | Count |
|---|---:|
| Workers | 8 |
| Unique changed files | 61 |
| Skipped (worker-reported) | 85 |
| Holds (worker-reported) | 269 |
| Overlapping edits | **0** |
| Twin soft-mismatches | **0** |
| Regressions | **0** |

| Partition | Changed | Holds | Skipped |
|---|---:|---:|---:|
| atoms-display-forms | 0 | 4 | 0 |
| composites-frames | 4 | 23 | 0 |
| blocks-layout | 6 | 4 | 39 |
| blocks-domain | 4 | 44 | 44 |
| pages-learning-commerce | 15 | 42 | 1 |
| pages-profile-dashboard | 6 | 150 | 1 |
| app-modules-utils | 26 | 0 | 0 |
| storybook-only | 0 | 2 | 0 |

## Before → after (starci-fe)

| | Count |
|---|---:|
| Before | 4881 |
| After | 4767 |
| Delta | **−114** |
| a11y (untouched) | 11 |

### Rule deltas (nonzero)

| Rule | Δ | After |
|---|---:|---:|
| no-vietnamese-in-source-authoring | −21 | 66 |
| no-inline-parameter-type | −17 | 65 |
| no-cn-above-vocabulary | −17 | 604 |
| no-classname-at-sentence-tier | −13 | 542 |
| no-heroui-outside-vocabulary | −11 | 513 |
| require-identity-root | −9 | 637 |
| no-per-part-classname-prop | −8 | 18 |
| no-raw-shape-at-sentence-tier | −6 | 708 |
| require-export-jsdoc | −4 | 70 |
| handler-on-prefix | −3 | 11 |
| prefer-arrow-export | −2 | 1 |
| no-inline-skeleton-branch | −2 | 48 |
| no-emoji-in-source | −1 | 61 |

Unchanged high piles (still deferred): `require-frame-self-declare` (829, mostly ambiguous missing-both), `page-folder-two-files-only` (354), parallel/twin skeleton, helper-folder, retired-async.

## Holds preserved

- 27 pattern-coverage teacher holds (`audit:fe` OK)
- Locked / Nivo / Mia-Mia / ContentPage Box closed contract
- ChipBase `dotClassName` API redesign (out-of-manifest + locked Nivo importers)
- ResizableRail `handleSide` false-positive
- missing-both frame-self-declare (no invented tokens)
- page-folder / parallel skeleton / unclear host identity roots

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `npx eslint --quiet` on 61 changed files | pass (0 errors) |
| `npx eslint --max-warnings=0` on changed files | fails with **pre-existing held warnings** on partially burned files (0 errors; not new regressions) |
| plugin tests (namespaces/authoring/contentpage) | 8/8 pass |
| principle-style | 7/7 pass |
| `npm run audit:fe` | exit 0; ATOM-11 ok; 27 teacher holds / 0 failing |

## Next partition

Continue deferred structural burn on capped leftovers of `blocks-domain` / `blocks-layout` / `pages-*`, prioritizing clear vocabulary redirects and capable identity roots — **not** missing-both frame-self-declare or broad page-folder moves.

No commit.
