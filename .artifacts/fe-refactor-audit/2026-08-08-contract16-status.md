# BATCH 16 — Remaining contract holds

**HEAD base:** `ed86d170` · **branch:** `mtp` · **committed:** no

## Verdict

Applied only proven existing contracts: SurfaceCard SB identity twin sync, clear identity stamps/relocates, zero-consumer SB shell prop removals, and unused Link/Stack namespace object deletion. HeroUI / skeleton / invented-slot holds documented only — not claimed fixed.

## Resolved (applied)

### Storybook/src parity
- SB `SurfaceCard` non-Base members now accept `identity` + `resolveIdentity` (matches src)
- Removed dead SB `SurfaceCardListItem.titleClassName` (0 consumers; absent from src)

### Clear identity roots
| Component | Action |
|---|---|
| MilestoneUpNextCard (src+SB) | stamp on `SurfaceCard` |
| QuizCard | stamp on `SectionCard` |
| PitchCard | stamp on `SectionCard` |
| VerdictHeroCard | stamp on `SectionCard` |
| WeeklyGoals (src+SB blocks) | relocate stamp to export-root `SurfaceCard`; drop inner `StackV` stamps |
| JobReadinessWidget (src+SB blocks) | relocate stamp to export-root `SurfaceCard` |

### Dead props removed (proof: 0 JSX consumers; absent from src twin)
| Prop | File |
|---|---|
| `titleClassName` | SB ModalShell |
| `dialogClassName` | SB ModalShell |
| `footerClassName` | SB ModalShell |
| `titleClassName` | SB DrawerShell |
| `bodyClassName` | SB DrawerShell |
| `titleClassName` | SB SurfaceCardListItem |

### Direct exports
- Removed unused `export const Link = {…}` (src+SB); kept `LinkBack`/`LinkSeeMore`
- Removed unused `export const Stack = {…}` (src+SB); kept `StackV`/`StackH`

## Holds (not claimed fixed)

| Hold | Reason |
|---|---|
| ModalShell.`bodyClassName` | story consumer |
| DrawerShell.`contentClassName` | LessonEditorPanel (nivoexpert) |
| DrawerShell.`dialogClassName`/`footerClassName` | MiniCart live; src twin API |
| MiniCart / CvPreview / PDF | API-hold — do not invent dialogWidth/viewportFit/height enum |
| ContinueCard / skeleton / stacking | redesign holds |
| 30 HeroUI vendor-boundary files | non-identical APIs |
| 29 unclear identity hosts | ambiguous |
| 27 teacher pattern seams | untouched |
| QuizCard HeroUI / classNames debt | vendor / BLOCK-4 — pre-existing |

## Changed files (product)

```
.storybook/components/atoms/navigation/Link/Link.tsx
.storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx
.storybook/components/composites/layout/DrawerShell/DrawerShell.tsx
.storybook/components/composites/layout/ModalShell/ModalShell.tsx
.storybook/components/frames/Stack/Stack.tsx
.storybook/components/starci/blocks/dashboard/JobReadinessWidget/JobReadinessWidget.tsx
.storybook/components/starci/blocks/dashboard/WeeklyGoals/WeeklyGoals.tsx
.storybook/components/starci/blocks/learn/MilestoneUpNextCard/MilestoneUpNextCard.tsx
src/components/atoms/navigation/Link/index.tsx
src/components/blocks/dashboard/JobReadinessWidget/index.tsx
src/components/blocks/dashboard/WeeklyGoals/index.tsx
src/components/blocks/learn/MilestoneUpNextCard/index.tsx
src/components/blocks/learn/QuizCard/index.tsx
src/components/blocks/marketing/PitchCard/index.tsx
src/components/blocks/stats/VerdictHeroCard/index.tsx
src/components/frames/Stack/index.tsx
.claude/fe/decision-ledger.json
```

## Coordinator checks

| Check | Result |
|---|---|
| Overlapping worker edits | **0** |
| Storybook/src SurfaceCard identity | **aligned** (all members) |
| Runtime namespace / plural principle return | **none** introduced |
| Removed props have 0 consumers | **confirmed** |
| Vendor boundaries intact | **yes** (no HeroUI migrations) |

## Verification

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npx eslint --quiet` all changed | exit 0 (0 errors) |
| `npx eslint --max-warnings=0` clean subset | exit 0 |
| `npx eslint --max-warnings=0` all changed | fails on **pre-existing held warnings** in WeeklyGoals/QuizCard/VerdictHeroCard/JobReadinessWidget/MilestoneUpNextCard (emoji, frame-self-declare, HeroUI, BLOCK-4) — not introduced this batch |
| namespaces + authoring + contentpage tests | 8 pass |
| principle-style | 7 pass |
| `npm run audit:fe` | exit 0; 27 held; 0 failing |

## Workers

- `2026-08-08-contract16-worker-clear-identity-roots.json`
- `2026-08-08-contract16-worker-dead-prop-consumers.json`
- `2026-08-08-contract16-worker-direct-export-and-barrel-consumers.json`
- `2026-08-08-contract16-worker-Storybook-src-parity.json`
- `2026-08-08-contract16-worker-HeroUI-vendor-boundaries.json`
- `2026-08-08-contract16-worker-skeleton-and-layout-holds.json`
