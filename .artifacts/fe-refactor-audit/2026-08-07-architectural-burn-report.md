# Architectural ESLint burn report — 2026-08-07

**Repo:** `D:\Repositories\starci-academy`  
**Phase:** 1 — scan/classify (no product edits in this phase)  
**Authoring pass:** not redone (per mission)  
**Commit/push:** none  

## Baselines

| Check | Result |
|---|---|
| `npx eslint src .storybook --format json` | **5515** warnings + **1** error → `eslint-arch-burn-baseline.json` |
| `npx tsc --noEmit` | **exit 0** |

Machine classify: `2026-08-07-architectural-burn-classify.json`

### One error (fix before partition burns)

| File | Rule | Fix |
|---|---|---|
| `src/components/blocks/learn/SubmissionResultHeader/index.tsx:3` | `@typescript-eslint/no-unused-vars` | Remove unused `Typography` import |

## Out of scope (left alone)

| Count | Bucket |
|------:|---|
| 11 | `jsx-a11y/*` |
| ~authoring leftovers | `no-vietnamese`, `no-emoji`, `no-inline-parameter-type`, `handler-on-prefix`, `prefer-arrow-export`, `require-export-jsdoc`, `no-arbitrary-token`, `no-hero-heading-class`, `no-hardcoded-*` — **do not redo authoring pass** |

## Architectural findings only

**4636** messages on architectural rules.

### By rule (burn order)

| Count | Rule | Priority |
|------:|------|---|
| 836 | `require-frame-self-declare` | 1 |
| 701 | `require-identity-root` | 2 |
| 1 | `no-identity-wrapper-div` | 3 |
| 717 | `no-raw-shape-at-sentence-tier` | 4 |
| 546 | `no-heroui-outside-vocabulary` | 5 |
| 623 | `no-cn-above-vocabulary` | 6 |
| 555 | `no-classname-at-sentence-tier` | 7 |
| 26 | `no-per-part-classname-prop` | 8 |
| 68 | `no-parallel-skeleton` | 9 |
| 55 | `no-inline-skeleton-branch` | 9 |
| 39 | `no-skeleton-twin-component` | 9 |
| 40 | `no-retired-async-content` | 9 (mostly hard-case) |
| 356 | `page-folder-two-files-only` | 10 |
| 66 | `no-helper-folder-in-components` | 10 |
| 7 | `export-matches-folder` | 10 |

### Classification (architectural only)

| Class | Count | Meaning |
|---|------:|---|
| **confirmed** | 3867 | Eligible for repair when ownership is clear |
| **overlap** | 347 | Same line as another root-cause rule — fix once |
| **hard-case** | 287 | Locked paths / unsafe inference / prior API mismatch |
| **teacher-hold** | 135 | Open ledger path — preserve |

**Overlap locations (file:line ≥2 rules):** counted in classify JSON; 347 secondaries marked.

### `require-frame-self-declare` split

| Kind | Count | Repair policy |
|---|------:|---|
| missing both `principle` + `explain` | **764** | Only if registered token is inferable from existing gap/pad; else **hard-case** (no invented tokens) |
| missing `explain` only | **72** | **confirmed** — add English `explain` |
| missing `principle` only | 0 | — |

Registered tokens (do not invent outside this set): see `.storybook/components/frames/_principles.ts` / `patterns.mjs`.

## Locked paths (hard-case — no edits)

- `.storybook/utils/BlockAnatomy/**`
- `MockInterviewPage/MockInterviewSession/**`
- `FlashcardsPage/QuizSession/**`
- `LandingPage/LearnLoopScroll/**`
- `blocks/learn/ContentAiChat/**`
- `blocks/marketing/ArchitectureScene/**` (emoji debt; avoid layout churn)
- `.storybook/components/nivo/**`, `nivoexpert/**`
- `src/resources/**`
- Mia-Mia trees

## Representative suspicious cases

| File:line | Rules | Root cause | Class | Proposed fix | Risk |
|---|---|---|---|---|---|
| `SubmissionResultHeader/index.tsx:3` | no-unused-vars | unused import | confirmed | drop import | none |
| `RagSourceGraph/index.tsx:204` | no-identity-wrapper-div | `<div data-tier="block">` | confirmed | `identity` on root frame/composite | low–med |
| many pages/blocks | require-frame-self-declare (explain-only ×72) | principle present, no explain | confirmed | add English explain; keep principle+className same line | none |
| many pages/blocks | require-frame-self-declare (missing-both ×764) | undeclared seam | confirmed→hard-case at repair | infer token from gap/pad **or leave** | high if wrong token |
| sentence-tier files | require-identity-root ×701 | no `identity` on root | confirmed / hard-case | add on clear Stack/Box/SurfaceCard root; skip host `div` | med |
| sentence-tier | raw-shape + cn + classname + heroui (overlap) | host layout / vendor / cn | overlap→confirmed | move to atom/composite/frame once | high if cosmetic only |
| `*Skeleton*` twins | no-skeleton-twin / parallel / inline | parallel resting tree | confirmed | thread `isSkeleton` | med |
| page folders with extras | page-folder-two-files-only ×356 | extra files in screen folder | confirmed | move to blocks/hooks/modules — **inspect imports** | high |
| AsyncContent imports | no-retired-async-content ×40 | retired 4-branch API | hard-case | leave (API mismatch) | high |

## Overlap policy

When `no-raw-shape` + `no-cn` + `no-classname` + `no-heroui` (+ optionally frame-self-declare / identity) share a line or root cause:

1. Fix identity wrapper / identity root first  
2. Replace HeroUI import with atom  
3. Replace host flex/gap with principle-bearing frame  
4. Remove `cn` / public className  

Do **not** count each rule as a separate defect in progress reporting.

## Scope-bug notes (tooling — optional this batch)

- `componentTier()` still matches `/src/components/**` only — Storybook blueprint invisible to many tier rules. Expanding scope without a burn plan floods debt. **Do not expand in this batch** unless teacher orders it.
- `check-pattern-coverage` `src/components/page` prefix matches `pages/` — pre-existing; keep `principle` on same line as spacing `className`.

## Partition plan (disjoint)

| Worker | Domain | First cuts |
|---|---|---|
| 1 | atoms/vocabulary | export-matches; no new public className |
| 2 | composites | identity roots; explain-only; classname/cn ownership |
| 3 | frames/layout | explain plumbing already present; no fake tokens |
| 4 | blocks | frame-self explain-only; identity; then heroui→atom where twin exists |
| 5 | pages | same; skip locked; careful page-folder moves |
| 6 | Storybook-only | mirror-first for twins; skip nivo/nivoexpert |
| 7 | folder/export | page-folder / helper-folder / export-matches after inspect |
| 8 | tooling/tests | only if scope bug blocks a confirmed fix |

## Stop Phase 1

No architectural product edits in this phase. Phase 2 starts next: error fix → identity-wrapper (1) → explain-only frame-self-declare → identity clear roots → overlap tier-boundary burns → skeleton → folder structure.
