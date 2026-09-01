# Consumer/API reconciliation — status 2026-08-08 (BATCH 12)

Checkpoint: `db1f7a11`. HEAD at start: `22f28f4e`. Inventory: `2026-08-08-reconcile-inventory.md`.

## Aggregate

| Metric | Count |
|---|---:|
| Partitions | 7 (6 workers + 1 empty omitted) |
| Unique changed files | 14 |
| Skipped | 14 |
| Holds | 150 |
| Overlapping edits | **0** |
| Twin soft-mismatches | **0** |
| Regressions | 1 repaired (`pow10` arrow overload → reverted) |

| Partition | Changed | Holds | Skipped |
|---|---:|---:|---:|
| atoms-composites-consumers | 8 | 6 | 12 |
| blocks-consumer-migrations | 0 | 40 | 0 |
| pages-consumer-migrations | 0 | 38 | 2 |
| storybook-src-parity | 0 | 0 | 0 |
| exports-and-barrels | 1 | 1 | 0 |
| identity-safe-roots | 5 | 30 | 0 |
| heroui-boundaries | 0 | 35 | 0 |

## Resolved vs held

### Resolved (consumer/API)
- Redundant ModalShell `containerClassName` where `size="lg"` already applies
- Unused DrawerShell/SurfaceCard className forwards (PersonalProjectTaskAttemptsDrawer, MilestoneUpNextCard, ContinueCard Item/Hero)
- ContinueCard runtime namespace removed (named exports only)
- Clear identity on NestedCard, PricingCard, AiQuotaLane, AiQuotaHistoryPanel, ConsultantCard

### Held (not claimed fixed)
- DrawerShell/ModalShell/SurfaceCard/PDFView per-part props with live consumers (MiniCart, CvPreview, ContinueCard stack, PDF heights)
- HeroUI→atom non-identical APIs (Button/Typography/Chip/compounds) — blocks/pages/heroui partitions
- Unclear host identity roots
- `pow10` prefer-arrow (function overloads required for BN|Decimal)
- ChipBase, handleSide, missing-both, page-folder, skeletons, teacher holds, Nivo/locked

## Before → after (starci-fe)

| | Count |
|---|---:|
| Before | 4690 |
| After | 4679 |
| Delta | **−11** |
| a11y (untouched) | 11 |

### Rule deltas (nonzero)

| Rule | Δ | After |
|---|---:|---:|
| require-identity-root | −5 | 621 |
| no-heroui-outside-vocabulary | −2 | 507 |
| no-cn-above-vocabulary | −2 | 598 |
| no-classname-at-sentence-tier | −1 | 541 |
| no-runtime-namespace | −1 | **0** |

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass (after pow10 repair) |
| `npx eslint --quiet` on 14 changed files | pass |
| `npx eslint --max-warnings=0` on changed files | fails on **pre-existing held warnings** (0 errors) |
| plugin tests | 8/8 pass |
| principle-style | 7/7 pass |
| `npm run audit:fe` | exit 0; 27 teacher holds / 0 failing |

No commit. Ambiguous / API-held findings were not claimed fixed.
