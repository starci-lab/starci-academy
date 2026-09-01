# BATCH 20 — classname inventory

Generated: 2026-08-07T01:09:06.515Z

Total hits: **2885** across **979** files.

## By classification (hits)

| Classification | Hits |
|---|---:|
| `ambiguous` | 2467 |
| `locked-or-teacher-hold` | 362 |
| `vendor-boundary` | 56 |

## By partition (hits)

| Partition | Hits | Files |
|---|---:|---:|
| `atoms-display-forms` | 155 | 78 |
| `atoms-navigation-overlay` | 32 | 16 |
| `blocks-layout-domain` | 1128 | 475 |
| `composites-layout-cards` | 220 | 67 |
| `composites-viewers-text` | 215 | 65 |
| `pages-and-overlays` | 1099 | 261 |
| `storybook-only` | 36 | 17 |

## By kind

| Kind | Hits |
|---|---:|
| `declaration` | 1182 |
| `usage` | 1213 |
| `withClassNames` | 490 |

## Approved contracts (from B19)

- DrawerShell `dialogWidth` / `footerVariant` — implemented
- ModalShell `viewportFit` — implemented
- PDFView `height` — implemented
- SurfaceCard `bodyVariant` — present; keep only with ≥2 identical consumers (ContinueCard)

## Classification policy

1. `vendor-boundary` — Box + HeroUI wrapper atoms; internal forwards to vendor primitives
2. `locked-or-teacher-hold` — locked paths, nivo/nivoexpert, skeletons, teacher seams
3. `ambiguous` — default until worker proves dead / parent-placement / intrinsic-semantic
4. Workers must not invent variants; SurfaceCard bodyVariant only if ≥2 identical consumers

## Top files by hit count

| Hits | File | Classification | Partition |
|---:|---|---|---|
| 34 | `src/components/composites/cards/SurfaceCard/index.tsx` | ambiguous | composites-layout-cards |
| 25 | `src/components/blocks/profile/ProfileLoadingState/index.tsx` | ambiguous | blocks-layout-domain |
| 22 | `.storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx` | ambiguous | composites-layout-cards |
| 20 | `src/components/pages/LeaguePage/GlobalBoard/component.tsx` | ambiguous | pages-and-overlays |
| 19 | `src/components/pages/LeaguePage/WeeklyBoard/component.tsx` | ambiguous | pages-and-overlays |
| 18 | `src/components/pages/MockInterviewPage/MockInterviewSession/index.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 16 | `src/components/pages/MockInterviewPage/MockInterviewHistory/index.tsx` | ambiguous | pages-and-overlays |
| 16 | `src/components/pages/PracticeProblemPage/PracticeProblemSkeleton/index.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 16 | `src/components/pages/ProfileRedirectPage/index.tsx` | ambiguous | pages-and-overlays |
| 15 | `src/components/pages/FlashcardsPage/FlashcardReviewer/component.tsx` | ambiguous | pages-and-overlays |
| 15 | `src/components/pages/FlashcardsPage/QuizSession/FlashcardQuizHistory/component.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 15 | `src/components/pages/MockInterviewPage/MockInterviewSessionSkeleton/index.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 14 | `src/components/composites/lists/List/index.tsx` | ambiguous | composites-viewers-text |
| 14 | `src/components/composites/viewers/MarkdownContent/MarkdownTableParts.tsx` | ambiguous | composites-viewers-text |
| 14 | `src/components/pages/FlashcardsPage/QuizSession/index.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 14 | `src/components/pages/ProfileSkillsPage/ProfileCoding/index.tsx` | ambiguous | pages-and-overlays |
| 13 | `src/components/pages/FlashcardsPage/DueReview/component.tsx` | ambiguous | pages-and-overlays |
| 13 | `src/components/pages/LeaguePage/WeeklyBoard/WeeklyBoardSkeleton/index.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 12 | `src/components/pages/LeaguePage/GlobalBoard/GlobalBoardSkeleton/index.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 12 | `src/components/pages/MockInterviewPage/MockInterviewScorecard/index.tsx` | ambiguous | pages-and-overlays |
| 12 | `src/components/pages/SystemStatusPage/SystemStatusSkeleton/index.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 11 | `src/components/pages/FlashcardsPage/FlashcardReviewHistory/component.tsx` | ambiguous | pages-and-overlays |
| 11 | `src/components/pages/MockInterviewPage/MockInterviewStats/index.tsx` | ambiguous | pages-and-overlays |
| 10 | `src/components/blocks/learn/EnrollGate/index.tsx` | ambiguous | blocks-layout-domain |
| 10 | `src/components/composites/data/KeyValue/index.tsx` | ambiguous | composites-viewers-text |
| 10 | `src/components/pages/DashboardPage/LeagueCard/component.tsx` | vendor-boundary | pages-and-overlays |
| 10 | `src/components/pages/DashboardPage/WeeklyChallengeCard/component.tsx` | vendor-boundary | pages-and-overlays |
| 10 | `src/components/pages/FlashcardsPage/FlashcardReviewStats/component.tsx` | ambiguous | pages-and-overlays |
| 10 | `src/components/pages/FlashcardsPage/QuizSession/QuizSessionSkeleton/index.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 9 | `src/components/blocks/cards/SurfaceListCard/index.tsx` | ambiguous | blocks-layout-domain |
| 9 | `src/components/overlays/drawers/MiniCartDrawer/component.tsx` | ambiguous | pages-and-overlays |
| 9 | `src/components/pages/AdminLoginPage/index.tsx` | ambiguous | pages-and-overlays |
| 9 | `src/components/pages/CartPage/component.tsx` | ambiguous | pages-and-overlays |
| 9 | `src/components/pages/CvEditorPage/index.tsx` | ambiguous | pages-and-overlays |
| 9 | `src/components/pages/FlashcardsPage/DueReview/DueReviewSkeleton/index.tsx` | locked-or-teacher-hold | pages-and-overlays |
| 9 | `src/components/pages/JobListPage/component.tsx` | ambiguous | pages-and-overlays |
| 9 | `src/components/pages/NotificationsPage/index.tsx` | vendor-boundary | pages-and-overlays |
| 9 | `src/components/pages/PracticeHubPage/ProblemCatalog/index.tsx` | vendor-boundary | pages-and-overlays |
| 8 | `.storybook/components/composites/lists/List/List.tsx` | ambiguous | composites-viewers-text |
| 8 | `.storybook/components/composites/viewers/MarkdownContent/MarkdownTableParts.tsx` | ambiguous | composites-viewers-text |


## Proven dead doors (consumer-searched, pre-edit)

| File | Prop | Evidence |
|---|---|---|
| `.storybook/components/composites/layout/DrawerShell/DrawerShell.tsx` | `classNames` | Zero <DrawerShell classNames=> callers in src or .storybook |
| `src/components/composites/layout/DrawerShell/index.tsx` | `classNames` | Zero <DrawerShell classNames=> callers |
| `.storybook/components/composites/layout/ModalShell/ModalShell.tsx` | `classNames` | Zero layout consumers; AiQuotaModal forward is transitive-dead |
| `src/components/composites/layout/ModalShell/index.tsx` | `classNames` | Zero <ModalShell classNames=> callers |
| `.storybook/components/composites/viewers/PDFView/PDFView.tsx` | `classNames` | Zero callers; height contract owns sizing |
| `src/components/composites/viewers/PDFView/index.tsx` | `classNames` | Zero callers; height contract owns sizing |
| `src/components/blocks/marketing/ShowcaseMockup/index.tsx` | `className` | Zero <ShowcaseMockup className=> callers; contentClassName still live (hold) |
| `src/components/blocks/cards/LabeledCard/index.tsx` | `classNames/WithClassNames + className` | Zero classNames callers; className only unused passthrough chain |

## Holds (do not delete this batch)

| Target | Classification | Evidence |
|---|---|---|
| `.storybook/components/composites/layout/DrawerShell/DrawerShell.tsx` | `locked-or-teacher-hold` | nivoexpert LessonEditorPanel w-full sm:max-w-[560px] |
| `SurfaceCard.contentClassName / PressableGroup TILE_CHROME` | `ambiguous` | B19 ledger hold — not bodyVariant |
| `LabeledCard.contentClassName` | `parent-placement` | Live callers; prefer children StackV/Grid — not deleting this batch |
| `ShowcaseMockup.contentClassName` | `parent-placement` | TalentMarketplace + LearnLoopScroll live |

## Approved contracts

| Contract | Status | Consumers |
|---|---|---|
| `DrawerShell.dialogWidth/footerVariant` | implemented-b19 | MiniCartDrawer |
| `ModalShell.viewportFit` | implemented-b19 | CvPreviewModal |
| `PDFView.height` | implemented-b19 | CvPreviewModal, PDFView.stories |
| `SurfaceCard.bodyVariant` | keep-from-b19 | ContinueCard Item + Hero (≥2 identical tile consumers) |
