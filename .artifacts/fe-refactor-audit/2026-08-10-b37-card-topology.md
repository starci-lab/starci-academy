# B37 Phase 0 — Card topology inventory

Checkpoint note: HEAD `84b92cd77`; inventory of **current worktree** (B36 may be uncommitted).

Generated: 2026-08-08T16:59:25.169Z

## Remeasure (substring containment in `src` + `.storybook/components` + `.storybook/stories`)

| Token | Files |
|---|---:|
| LabeledCard | 97 |
| frameless | 54 |
| flushContent | 2 |
| fillHeight | 8 |
| SurfaceListCard | 87 |
| SurfaceListCardRow | 12 |
| SurfaceListCardItem | 62 |
| SurfaceCardList | 111 |
| SurfaceCardAccordion | 24 |

### SurfaceCard.* members used as JSX

| Member | Files |
|---|---:|
| SurfaceCard.Accordion / alias | 13 |
| SurfaceCard.Base / alias | 199 |
| SurfaceCard.CrossList / alias | 5 |
| SurfaceCard.List / alias | 69 |
| SurfaceCard.Nested / alias | 6 |
| SurfaceCard.Placeholder / alias | 2 |
| SurfaceCard.PressableGroup / alias | 13 |
| SurfaceCard.SelectableGroup / alias | 3 |

## Classes A–H (StarCi consumers only)

| Class | Meaning | Count |
|---|---|---:|
| A | LabeledCard frameless + SurfaceListCard | 17 |
| B | LabeledCard + SurfaceCardList | 1 |
| C | LabeledCard frameless + SurfaceCardList | 3 |
| D | LabeledCard + SurfaceCardAccordion | 0 |
| E | LabeledCard frameless + another self-framed composite | 12 |
| F | LabeledCard legitimately owns a generic framed body | 26 |
| G | legacy SurfaceListCard without label | 26 |
| H | behavior mismatch requiring hold | 17 |

Unclassified StarCi mentions (direct SurfaceCardList/Accordion, row helpers, imports): **135**

## API snapshot

- **SurfaceLabelProps** (`surface-card-header`): label, labelEnd, onSeeMore, seeMoreLabel, action, subtleLabel, isSkeleton
- **SurfaceCardList**: extends SurfaceLabelProps + items, emptyState, error/errorState, variant, description, isSkeleton, classNames, identity
- **SurfaceCardAccordion**: extends SurfaceLabelProps + items, emptyState, description, isSkeleton, identity (no error branch)
- **SurfaceListCard** (src children API): children, bordered, className, identity — **no** label/empty/error/isSkeleton
- **LabeledCard**: label, labelEnd, onSeeMore, action, description, frameless, flushContent, fillHeight, subtleLabel, bordered, identity

## Required first targets

| Target | Class | Child | Owner agent |
|---|---|---|---|
| `src/components/pages/DashboardPage/TrendingContents/component.tsx` | H | SurfaceListCard | dashboard-consumers |
| `src/components/pages/DashboardPage/TrendingContents/TrendingContentsSkeleton/index.tsx` | H | SurfaceListCard | dashboard-consumers |
| `src/components/pages/DashboardPage/DailyQuest/component.tsx` | C | SurfaceCardList | dashboard-consumers |
| `src/components/pages/DashboardPage/RecommendedCourses/component.tsx` | A | SurfaceListCard | dashboard-consumers |
| `src/components/pages/ProfileOverviewPage/OverviewCodeSkills/index.tsx` | C | SurfaceCardList | profile-consumers-a |
| `src/components/pages/ProfileOverviewPage/OverviewChallengeSkills/index.tsx` | C | SurfaceCardList | profile-consumers-a |
| `src/components/pages/ProfileSkillsPage/ProfileCoding/index.tsx` | A | SurfaceListCard | profile-consumers-a |
| `src/components/pages/ProfileChallengesPage/ProfileChallenges/index.tsx` | A | SurfaceListCard | profile-consumers-a |
| `src/components/pages/FlashcardsPage/FlashcardReviewHistory/component.tsx` | A | SurfaceListCard | learn-flashcard-consumers |
| `src/components/pages/FlashcardsPage/QuizSession/FlashcardQuizHistory/component.tsx` | A | SurfaceListCard | learn-flashcard-consumers |
| `src/components/blocks/feed/ActivityFeed/component.tsx` | H | SurfaceListCard | feed-overlay-commerce-consumers |
| `src/components/overlays/drawers/MindMapNodeDrawer/component.tsx` | A | SurfaceListCard | feed-overlay-commerce-consumers |
| `src/components/pages/AiUsagePage/AiUsageHistory/index.tsx` | A | SurfaceListCard | feed-overlay-commerce-consumers |
| `src/components/pages/ContactPage/ContactChannels/index.tsx` | B | SurfaceCardList | feed-overlay-commerce-consumers |
| `src/components/pages/ProfileProjectsPage/ProfileCapstone/index.tsx` | A | SurfaceListCard | profile-consumers-b |
| `src/components/blocks/learn/RelatedContentList/component.tsx` | H | SurfaceListCard | learn-flashcard-consumers |

## Manifest overlap

- **overlapPass**: true
- claimed product paths: 116
- required targets assigned: true

## Short counts (return)

```
byClass: A=17 B=1 C=3 D=0 E=12 F=26 G=26 H=17
LabeledCard files: 97
frameless files: 54
SurfaceListCard remaining: 87
SurfaceCardList files: 111
overlapPass: true
```
