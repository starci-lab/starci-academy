# Overlap-cluster SAFE burn — 2026-08-07 (batch)

**Repo:** `D:\Repositories\starci-academy`  
**Commit/push:** none  
**Authoring:** not redone  

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **exit 0** |
| `node --test .storybook/test-runner/principle-style.test.mjs` | **7/7 pass** |
| `node …/check-pattern-coverage.mjs .` | **OK** (27 held only; 0 failing) |

## Fixed counts (edited files vs baseline)

Overlap-cluster rules on the ~32 files touched this batch:

| Rule | Baseline (edited set) | After | Fixed (Δ) |
|---|---:|---:|---:|
| `no-heroui-outside-vocabulary` | 29 | 8 | **−21** |
| `no-cn-above-vocabulary` | 10 | 9 | **−1** |
| `no-classname-at-sentence-tier` | 12 | 12 | 0 |
| `no-raw-shape-at-sentence-tier` | 23 | 22 | **−1** |
| `no-per-part-classname-prop` | 0 | 0 | 0 |
| `no-inline-skeleton-branch` | 7 | 4 | **−3** |

Root-cause accounting (fix once): ~25 message drops across the cluster on this file set.

## What burned (SAFE)

### HeroUI → house vocabulary
- **Spinner → atom** (4): `LearnShellLayout`, `AdminUploadVideoPage/map`, `AdminUploadVideoPage/LoadingScreen` (Spinner only; `cn` kept for public `className`), `SepayCheckoutPage`
- **Chip → atom** (3): `CourseTrialChip`, `PostRow`, `FeaturedPost` (`color`→`tone`, children→`text`)
- **HeroSkeleton → `@/components/blocks/skeleton/Skeleton`** (22 product files). Skipped `blocks/skeleton/**` house wrappers (they *are* the vocabulary).

### Frame + principle
- `PostRow`: host flex column/meta row → `StackV` `title-subtitle` + `StackH` `separator-dot` with explain

### Inline skeleton → co-located `isSkeleton`
- `JobReadinessWidget` (+ SB twin): `ProgressMeter isSkeleton` (dropped HeroSkeleton meter arm)
- `WeeklyGoals` (+ SB twin): meter arm → `ProgressMeter isSkeleton` (icon shimmer arm left — hard)
- `ChallengeScoreCard` (+ SB twin): same ProgressMeter consolidation
- `PhaseScarcityNote`: dropped `cn` after skeleton swap (join class list)

## Hard-cases / skipped (this batch)

| Bucket | Why |
|---|---|
| `blocks/skeleton/**` wrappers (28) | Must import HeroUI; missing vocabulary-tier Skeleton atom |
| Typography-only (~40), Button-only (~23) | House API is `text`/`label` + constrained variants — not 1:1 JSX drop-in |
| Chip with `Chip.Label` / element `icon` / custom appearance classes | e.g. `StatusChip`, `DropZone`, `TaskCriteriaList` (`variant="secondary"`) |
| Button with children icon / `className` chrome | e.g. `FloatingActionButton`, `MindMapBackButton` |
| Skeleton twins still on `cn` + `WithClassNames` | Public `className` API — removing breaks callers; raw flex+gap needs careful principle (left) |
| Icon↔Skeleton ternary | Phosphor icon has no `isSkeleton` — e.g. `WeeklyGoals` icon, `ModuleChallengeList`/`ModuleLessonList` leading |
| `no-per-part-classname-prop` (26) | Props still used by callers / vocabulary shells — SKIP |
| Locked paths | MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene, BlockAnatomy, nivo, nivoexpert, resources, Mia-Mia, teacher holds |
| SB `PhaseScarcityNote` | No SB Skeleton twin — left HeroSkeleton |
| cn-only heroui (~126 unlocked) | Need frame principle replacement, not atom swap |

## Files touched (product + SB twins)

Product: skeleton swaps (22), Spinner (4), Chip (3), PostRow layout, JobReadinessWidget / WeeklyGoals / ChallengeScoreCard / PhaseScarcityNote consolidations.  
SB: `ChallengeScoreCard`, `JobReadinessWidget`, `WeeklyGoals` ProgressMeter `isSkeleton` mirrors.

Artifacts: `_overlap-safe-scan.json`, `_overlap-dropin-classify.json`, `_overlap-skeleton-apply.json`, `_overlap-burn-delta.json`
