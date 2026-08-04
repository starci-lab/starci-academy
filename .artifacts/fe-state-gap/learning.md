# FE ↔ BE state-coverage gaps — LEARNING cluster

Read-only audit. FE repo `C:/Repositories/starci-academy`, BE state SSOT
`C:/Repositories/ac/starci-academy-backend/.artifacts/states/<domain>/business.md`.
Routes audited: `contents/[contentId]`, `practice`, `practice/[slug]`, `review`, `league`.
BE domains read: `progress`, `coding`, `flashcard`, `content-ai`, `weekly-challenge`, `league`.

### Summary

| Severity | Count |
|---|---|
| high | 1 |
| med | 4 |
| low | 5 |

**AI Lab EVAL check (removed on BE):** CLEAN for this cluster. Grepped `eval` /
`aiLab` / `evaluateSubmission` across all five routes and their mounted components —
zero hits. AiLab code (`my-ai-lab-runs`, `ai-lab-playground`, `useQueryAiLabRunStream…`)
lives only under `LessonReader/AiLab` and `learn/Playground`, none of which this cluster
mounts. No learning/practice/review/league page calls a removed eval query or renders an
AI-Lab-eval-only state.

**Domains with no surface in this cluster (not a defect, noted for coverage):**
- `content-ai` (the tutor-chat state machine) is rendered by `LessonReader/ContentAiChat`,
  NOT by any route here. `contents/[contentId]` is the public SEO article
  (`publicContent` read via `PublicArticle`), a different, minimal surface.
- `weekly-challenge` is surfaced by the dashboard `WeeklyChallengeCard`, not by `league`
  (which is `myLeague` + `globalLeaderboard` only). No page in this cluster renders it.
- There is no `contents` (list) route — only `contents/[contentId]`.

---

## contents/[contentId]

Route: `src/app/[locale]/contents/[contentId]/page.tsx` (server component) →
`src/components/features/content/PublicArticle/index.tsx`.
Reads `publicContent` (unauthenticated). Loading/not-found handled server-side
(`await` + `notFound()` on null) — no client loading/error state needed. Largely faithful.

1. **[low] Render-wrong — premium body may render in full.**
   `PublicArticle/index.tsx:34` renders `content.body` unconditionally, while the
   route's JSON-LD (`page.tsx:95`) sets `isAccessibleForFree: !content.isPremium` — so the
   page KNOWS the content is premium yet shows the whole body. Whether this is a leak
   depends on what `publicContent` returns for a premium doc (no `content` business.md was
   in scope to confirm BE gating). Fix direction: confirm the `publicContent` resolver
   nulls/truncates `body` for premium; if it returns full body, gate the client render
   behind `isPremium` with a paywall CTA.

---

## practice

Route: `src/app/[locale]/practice/page.tsx` → `src/components/features/practice/index.tsx`.
Composes `ProgressCockpit`, `ProblemCatalog` (problems view) / `CodingLeaderboard`
(leaderboard view). BE domain: `coding`.

`ProblemCatalog` (per-problem solved/attempted/revealed overlay via `deriveStatus`),
`CodingLeaderboard` (ranks by `solvedCount` desc, matches BE `codingLeaderboard`), and
all `AsyncContent` loading/empty/error states are faithful. Findings:

1. **[med] Render-wrong — cockpit "points" is the whole Coin balance, mislabeled as coding points.**
   `ProgressCockpit/index.tsx:60,73,140` renders `progress.totalPoints` under the
   `practice.cockpit.metric.points` label. The `coding` business.md is explicit
   (`coding/business.md` "Progress" section + Invariant #3): `totalPoints` "here is the
   user's whole spendable Coin balance, not a coding-only figure … points callers wanting a
   true 'coding points' metric at the `user_xp` projection's per-source breakdown." The
   cockpit presents a global Coin wallet as this problem-page's "points". `CodingLeaderboard`
   even documents that points "are a different currency" and ranks on `solvedCount` instead —
   so the two surfaces on the same page disagree on what "points" means. Fix direction: either
   relabel the cockpit metric (e.g. "coins/balance") or source a real coding-points figure
   from the `user_xp` per-source breakdown.

---

## practice/[slug]

Route: `src/app/[locale]/practice/[slug]/page.tsx` →
`src/components/features/practice/PracticeProblem/index.tsx`. BE domain: `coding`.

The submit → async-judge → verdict flow is well modeled: `VERDICT_TONE`
(`PracticeProblem/index.tsx:81-91`) covers every `CodingVerdict` incl. `pending`,
`judging`, `internalError`; live judging renders `AIProcessingText` off the socket job
status; terminal → refetch → per-case grid + stats. Findings:

1. **[high] Missing state — a 404 / disabled problem renders the skeleton forever.**
   `PracticeProblem/index.tsx:169-175` fetcher returns `null` on `codingProblem.data ?? null`,
   and `:340` `if (isLoading || !problem) return <PracticeProblemSkeleton />`. Per
   `coding/business.md` Invariant #5, `getBySlug` returns a uniform 404 for
   unknown/disabled problems (and the SWR fetcher also yields `null` on a network/GraphQL
   error). In every one of those cases `isLoading` is false and `problem` is null, so the
   page shows an infinite loading skeleton — the BE "not found" and "error" states are never
   rendered. Fix direction: distinguish `problem === null && !isLoading` → render a
   not-found / error state (BackLink + retry), route through `AsyncContent`.

2. **[low] Missing state — submit failure is silent.**
   `PracticeProblem/index.tsx:295-327` `onSubmit` has no `catch`; a thrown submit mutation
   (network/auth) only flips `submitting` off in `finally`, with no toast/error surfaced and
   the console left on the empty "Result" tab. Fix direction: surface a failure toast /
   inline error on the console.

3. **[low] Render-wrong (edge) — a judge job that fails at infra level can leave a stale `pending` verdict.**
   `:331-336` on terminal job status the effect refetches submissions and clears the pending
   id. If the judge worker fails before writing a terminal `CodingVerdict` (BE keeps
   `pending`/`internalError`), the "Result" tab (`:483`) then renders `latestSubmission` with
   a `pending` chip and `0/0` passed, after the transient `Failed` AIProcessingText has gone.
   Fix direction: keep the last `Failed` job state visible, or treat a non-terminal verdict
   after job-fail as an error state.

---

## review

Route: `src/app/[locale]/review/page.tsx` →
`src/components/features/practice/flashcard-review/FlashcardReviewPage/index.tsx`.
BE domain: `flashcard`. Uses `useQueryMyDueFlashcardsSwr` (`myDueFlashcards`) +
`reviewFlashcard`. Empty (`cards.length === 0`) and done (queue exhausted) states are both
handled; grade failure correctly does NOT advance the queue (toast via `runGraphQL`). Findings:

1. **[med] Missing state — query error renders the spinner forever.**
   `FlashcardReviewPage/index.tsx:67,121` — the hook exposes `error`, but the guard is only
   `if (isLoading || !data)` → `<Spinner/>`. On an SWR error `isLoading` is false and `data`
   is undefined, so `!data` holds and the page spins indefinitely with no error/retry state.
   Fix direction: read `error` from the hook and render an error state (retry), ideally via
   `AsyncContent` like the practice components do.

2. **[med] Missing render — `nextIntervals` (per-grade preview) fetched but never shown.**
   BE returns per-grade next-interval days for each due card
   (`modules/api/graphql/queries/types/my-due-flashcards.ts:3-13,30`), which `flashcard/business.md`
   ("The scheduler: SM-2") says explicitly "powers the rating-button preview (`nextIntervals`)
   shown before the learner picks a grade." The four grade buttons
   (`FlashcardReviewPage/index.tsx:40-50,188-201`) render only the label — the SM-2 preview the
   BE ships for each card is dropped. Fix direction: surface `current.nextIntervals[grade]` on
   each Again/Hard/Good/Easy button.

3. **[low] Missing distinction — overdue vs new buckets collapsed.**
   BE deliberately splits the queue into `dueReviewCount` / `newCount` / `newTotalCount`
   (the "449 bug" fix, `flashcard/business.md` "due-queue split"). The page only uses
   `cards.length` and a running index (`:78,166`), so the learner never sees overdue-vs-new
   context or the capped-new headline. Low (functional walk is fine). Fix direction: optionally
   show the split in the progress header.

---

## league

Route: `src/app/[locale]/league/page.tsx` →
`src/components/features/dashboard/league/League/index.tsx` → `WeeklyBoard` (`myLeague`,
System A) / `GlobalBoard` (`globalLeaderboard`, System B). BE domain: `league`.

Faithful on the critical invariant: `league/business.md` warns `rankDelta === null` must NOT
render as "0/unchanged" — `RankDeltaCaret/index.tsx:41-42` correctly renders NOTHING for null
(and `:44-45` a muted dash only for an actual 0), and `WeeklyBoard`'s row band uses
`rankDelta ?? 0` → null yields no band. The two boards correctly use different point systems
(weekly `weekPoints`, global `points`). Findings:

1. **[low] Dead/contradictory state — weekly "not placed" empty state is unreachable.**
   `WeeklyBoard/index.tsx:118-124` funnels to courses when `!data || entries.length === 0`.
   `league/business.md` ("What a front-end screen can rely on"): a user's FIRST `myLeague`
   read is NEVER empty — `placeUserLazily` guarantees a Bronze tier + cohort (with the user
   in it) before the query returns. So `entries.length === 0` can only fire on a null/errored
   `data`, and the "climb by learning" empty copy would then be shown for what is really a
   load failure. Low. Fix direction: split a true error/empty branch from the (dead) not-placed
   branch, or drop the unreachable empty copy.

2. **[low] Render-wrong (fragile) — self-row identified by best-effort username match.**
   `WeeklyBoard/index.tsx:81,85-87` and `GlobalBoard/index.tsx:80` locate the viewer by
   `entry.username === me.username` even though each entry carries a stable `userGlobalId`.
   If username is null/renamed the hero standing card silently drops. Low. Fix direction:
   match on `userGlobalId` decoded against the viewer id.
