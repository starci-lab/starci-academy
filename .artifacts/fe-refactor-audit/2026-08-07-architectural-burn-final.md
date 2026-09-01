# Architectural ESLint burn — final (2026-08-07)

**Repo:** `D:\Repositories\starci-academy`  
**Commit/push:** none  
**Authoring pass:** not redone  

Phase 1 scan: `.artifacts/fe-refactor-audit/2026-08-07-architectural-burn-report.md`  
Classify JSON: `.artifacts/fe-refactor-audit/2026-08-07-architectural-burn-classify.json`  
Baselines: `eslint-arch-burn-baseline.json` → `eslint-arch-burn-final.json`

## Totals

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| All product messages | 5516 | **5433** | **−83** |
| Architectural rules sum | 4636 | **4554** | **−82** |
| ESLint errors | 1 | **0** | −1 |
| a11y (`jsx-a11y/*`) | 11 | **11** | 0 (untouched) |
| Teacher holds | 27 | **27** | preserved |

## Architectural warnings before → after by rule

| Rule | Before | After | Δ |
|---|---:|---:|---:|
| require-frame-self-declare | 836 | 834 | −2 |
| require-identity-root | 701 | 647 | **−54** |
| no-identity-wrapper-div | 1 | 1 | 0 (RagSourceGraph hard-case) |
| no-raw-shape-at-sentence-tier | 717 | 716 | −1 |
| no-heroui-outside-vocabulary | 546 | 525 | **−21** |
| no-cn-above-vocabulary | 623 | 622 | −1 |
| no-classname-at-sentence-tier | 555 | 555 | 0 |
| no-per-part-classname-prop | 26 | 26 | 0 |
| no-parallel-skeleton | 68 | 68 | 0 |
| no-inline-skeleton-branch | 55 | 52 | −3 |
| no-skeleton-twin-component | 39 | 39 | 0 |
| no-retired-async-content | 40 | 40 | 0 (hard-case) |
| page-folder-two-files-only | 356 | 356 | 0 |
| no-helper-folder-in-components | 66 | 66 | 0 |
| export-matches-folder | 7 | 7 | 0 |

After structural follow-up: **export-matches −6** (aliases only); **helper-folder −2** (utils → `modules/utils`); page-folder still 356.

## Confirmed fixed

1. **Error:** removed unused `Typography` import in `SubmissionResultHeader`.
2. **Identity root (−54):** clear single Stack/Box/Cluster/… roots under sentence tier (+ SB frame twins where prop exists).
3. **HeroUI → atoms (−21):** Spinner/Chip/Skeleton swaps where 1:1 atom API matched.
4. **Inline skeleton (−3):** ProgressMeter `isSkeleton` consolidations (JobReadinessWidget, WeeklyGoals, ChallengeScoreCard + twins).
5. **Explain-only unlocked (−1):** `SectionCard` content StackV; **71** remaining explain-only sit on locked MockInterviewSession / QuizSession / LearnLoopScroll.
6. **PostRow:** host flex → Stack + principles; `explain` rewritten to satisfy `explain-justifies-token-choice` family rule.
7. **Overlap:** raw-shape/cn −1 each on touched set.

## Overlaps consolidated

Treated heroui + cn + raw-shape + classname as one ownership fix where safe (Spinner/Chip/Skeleton/PostRow). Did not count each rule hit as a separate defect in the burn narrative.

## Scope bugs / contract gaps

| Item | Class | Action |
|---|---|---|
| `componentTier` src-only (SB invisible) | scope-bug / contract-gap | **Not expanded** this batch |
| RagSourceGraph `<div data-tier="block">` | hard-case | Ledger `ragsourcegraph-data-tier-div-2026-08-07` — left unchanged |
| Missing-both frame-self-declare (764) | hard-case at repair | No invented tokens |
| Host/`Link` identity roots | hard-case | Left (e.g. PostRow root is `Link`) |

## Hard cases & teacher holds

- **27** pattern-coverage teacher holds preserved (`audit:fe` green).
- Locked paths untouched (BlockAnatomy, MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene, nivo/nivoexpert, resources).
- `no-retired-async-content` ×40 — API mismatch, left.
- page-folder / helper-folder / export-matches — high import risk; left without mass moves.
- Remaining heroui where HeroUI JSX ≠ house atom API or atom missing.

## Files changed (high level)

- Identity: ~54 src + ~19 SB frame twins  
- HeroUI/skeleton/overlap: ~30 product (+ SB twins for ProgressMeter sites)  
- `SectionCard`, `PostRow`, `SubmissionResultHeader`  
- Ledger: `ragsourcegraph-data-tier-div-2026-08-07`, `eslint-arch-burn-pass2-2026-08-07`  
- Tooling/authoring: **not** reworked this pass  

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **pass** |
| `node --test .storybook/test-runner/principle-style.test.mjs` | **pass (7)** |
| `npm run audit:fe` / pattern-coverage | **pass** (27 holds, 0 failing) |
| `npx eslint --max-warnings=0 <all changed product files>` | **Not green repo-wide** — changed files still carry pre-existing arch warns (`require-identity-root`, heroui, raw-shape, …). Touched files with only targeted fixes are clean of **new errors**; PostRow still warns identity-root (Link root = hard-case). |
| a11y / axe | **not run / not modified** |

## Stop

No commit/push. Largest remaining architectural piles: missing-both principles (764), raw-shape/cn/classname/heroui (~2.4k), identity host roots (~647), page-folder (356).
