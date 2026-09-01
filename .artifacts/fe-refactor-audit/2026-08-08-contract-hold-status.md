# Contract hold closure — status 2026-08-08 (BATCH 13)

Checkpoint context: HEAD `22f28f4e` (+ BATCH 12 uncommitted). Inventory: `2026-08-08-contract-hold-inventory.md`.

## Aggregate

| Metric | Count |
|---|---:|
| Partitions | 6 (5 workers + twin-parity coordinator) |
| Worker product edits | 1 (`WeeklyChallengeCard` identity) |
| Coordinator applies | 2 (`ContinueCardDataProps.className` src+SB) |
| Unique changed files (final) | **3** |
| Decisions recorded | ~105 |
| Overlapping edits | **0** |
| Regressions | 1 repaired (SB identity stamp reverted — SurfaceCard twin lacks `identity`) |

| Partition | Changed | Decisions | Outcome |
|---|---:|---:|---|
| per-part-props | 0 | 9 | named-slot proposals only |
| stacking-layout | 0 | 11 | stack chrome = new slots; deferred safe removal applied by coordinator |
| heroui-boundaries | 0 | 30 | all `vendor-boundary` |
| identity-hosts | 1 | 29 | 1 clear root; 29 host/mixed recorded |
| skeleton-contracts | 0 | 25 | all `skeleton-decision` |
| twin-parity | 1 | 2 | ContinueCard types mirrored; WeeklyChallenge SB identity blocked |

## Contract decisions made

### Applied
1. **ContinueCardDataProps.className** — `safe-api-removal` (0 consumers; Hero/Item never forward). Removed from src + SB types.
2. **WeeklyChallengeCard** (src) — identity on capable `SurfaceCard` root.

### Proposed APIs (not applied — need architecture)
| ID | Proposal |
|---|---|
| DrawerShell | `dialogWidth="md"` + `footerVariant="stacked"` (MiniCart) |
| ModalShell | `viewportFit="near-fullscreen"` (CvPreview ≠ cover/full) |
| PDFView | height token enum — **no invent**; keep `heightClassName` |
| SurfaceCard / ContinueCard | `bodyVariant` / `contentStack` for stack chrome |
| SB SurfaceCard | accept `identity` like src (blocks WeeklyChallenge twin parity) |

### Vendor boundaries preserved
All 30 heroui-boundaries files: Button/Typography/Chip/compounds/`cn`-only / missing CloseButton·ScrollShadow — non-identical atom APIs.

### Holds requiring explicit architecture
- Per-part props with live consumers (MiniCart, CvPreview, PDF stories)
- ContinueCard / League / Leaderboard stack ownership
- Skeleton twin/parallel redesigns
- 29 unclear identity hosts
- SB/src SurfaceCard `identity` API drift

## Before → after (starci-fe)

| | Count |
|---|---:|
| Before | 4679 |
| After | 4677 |
| Delta | **−2** |

| Rule | Δ |
|---|---:|
| no-classname-at-sentence-tier | −1 |
| require-identity-root | −1 |

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass (after SB identity revert) |
| `npx eslint --quiet` on changed files | pass |
| `npx eslint --max-warnings=0` on changed files | fails on **pre-existing held warnings** (0 errors) |
| plugin tests | 8/8 pass |
| principle-style | 7/7 pass |
| `npm run audit:fe` | exit 0; 27 teacher holds / 0 failing |

No commit. Ambiguous / new-slot / vendor / skeleton decisions were not claimed fixed.
