"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { DUE_REVIEW_LIMIT, SM2_GRADES } from "../constants"
import { _DueReview, type DueReviewCard, type DueReviewLabels } from "./component"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { mutateReviewFlashcard } from "@/modules/api/graphql/mutations/mutation-review-flashcard"
import { queryMyDueFlashcards } from "@/modules/api/graphql/queries/query-my-due-flashcards"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useQueryFlashcardCardsByIdsSwr } from "@/hooks/swr/api/graphql/queries/useQueryFlashcardCardsByIdsSwr"
import { useMutateStartFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardDueReviewSessionSwr"
import { useMutateSyncFlashcardDueReviewSessionProgressSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSyncFlashcardDueReviewSessionProgressSwr"
import { useMutateCompleteFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCompleteFlashcardDueReviewSessionSwr"
import { useQueryMyInProgressFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInProgressFlashcardDueReviewSessionSwr"
import { useQueryMyFlashcardReviewSessionBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardReviewSessionBySessionIdSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { useAppSelector } from "@/redux/hooks"

/** Props for {@link DueReview}. */
export interface DueReviewProps extends WithClassNames<undefined> {
    /** Leave the session and return to the flashcards home. */
    onExit: () => void
    /**
     * Present when reached via the dedicated `flashcards/review/sessions/[sessionId]`
     * route — this component then hydrates straight from THAT session (no
     * resolve-or-start call) instead of resolving one itself. Absent when
     * reached via the bare `review?session=due` route (teacher's 2026-07-11
     * correction: "due review should also create a new session" — that bare route is now a
     * RESOLVE-ONLY shim: it resolves-or-starts a session then `router.push`es
     * into the sessioned URL (teacher: keep the history entry, don't use `.replace`),
     * mirroring `FlashcardReviewer`'s own idiom).
     * Mirrors `FlashcardReviewerProps.sessionId`.
     */
    sessionId?: string
}

/**
 * The spaced-repetition (SM-2) review session over the viewer's due cards, drawn
 * across every enrolled course — the CONNECTED half: it fetches the due queue,
 * runs the resolve-or-start/resume state machine, resolves every label (incl.
 * interpolation), and hands them to the presentational {@link _DueReview}. The
 * due count is the page's primary loop, so this is the main entry from the home
 * hero. See `tiers/split.md`.
 * @param props - {@link DueReviewProps}
 */
export const DueReview = ({ onExit, sessionId }: DueReviewProps) => {
    const t = useTranslations()
    const router = useRouter()
    const pathname = usePathname()
    const runGraphQL = useGraphQLWithToast()
    const { mutate: globalMutate } = useSWRConfig()
    // scope the due queue to THIS course; shared SWR key with the hero (DueReviewHero)
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const dueKey = useMemo(
        () => ["my-due-flashcards", courseId ?? null, DUE_REVIEW_LIMIT] as const,
        [courseId],
    )
    // index of the card currently shown + whether its answer is revealed
    const [currentIndex, setCurrentIndex] = useState(0)
    const [revealed, setRevealed] = useState(false)
    // true while a grade is in flight (blocks the rating bar)
    const [reviewing, setReviewing] = useState(false)
    // how many cards were graded this session (shown in the summary)
    const [reviewedCount, setReviewedCount] = useState(0)
    // WHICH card positions have been graded this session (0-indexed, order-
    // independent) — drives the progress bar's per-segment green so a card
    // graded out of order (free-nav jump ahead → grade → jump back) still
    // reads green (2026-07-12, teacher: free-nav "both before and after"). A Set for
    // O(1) membership; persisted as an array via `gradedIndexes` sync so a
    // resume rehydrates it.
    const [gradedIndexes, setGradedIndexes] = useState<Set<number>>(() => new Set())
    // explicit "Finish" — end the session now regardless of position, distinct
    // from reaching the last card. Feeds `done` below.
    const [finished, setFinished] = useState(false)

    // the due queue (count + first batch of cards), shared key with the hero
    const { data, isLoading, error, mutate } = useSWR(dueKey, async () => {
        const response = await queryMyDueFlashcards({ request: { courseId, limit: DUE_REVIEW_LIMIT } })
        return response.data?.myDueFlashcards.data ?? null
    })

    const cards = data?.cards ?? []

    // session-persistence (mirrors QuizSession's/FlashcardReviewer's resumable-session
    // idiom, scoped cross-deck by enrollment only — no deckId, unlike the single-deck
    // reviewer): each rating is already saved immediately via `reviewFlashcard` (safe),
    // but WHICH batch/position within it was not persisted, so leaving mid-batch used
    // to lose the in-batch progress. `startFlashcardDueReviewSession` /
    // `syncFlashcardDueReviewSessionProgress` / `completeFlashcardDueReviewSession`
    // wrap that sequence with a resumable cursor, now with its OWN resumable URL too
    // (teacher's 2026-07-11 correction: "due review should also create a new session" — parity with
    // `FlashcardReviewer`'s own 2026-07-11 correction; superseding the earlier same-day
    // "silently, no new UI/route" note).
    const courseHeaders = useMemo<GraphQLHeaders | undefined>(
        () => (courseId ? { [GraphQLHeadersKey.XCourseId]: courseId } : undefined),
        [courseId],
    )
    const runStartSession = useMutateStartFlashcardDueReviewSessionSwr()
    const runSyncSession = useMutateSyncFlashcardDueReviewSessionProgressSwr()
    const runCompleteSession = useMutateCompleteFlashcardDueReviewSessionSwr()
    // no-`sessionId` shim route only: MRU "is there a resumable draw at all"
    // lookup, used to resolve-or-start before a sessioned URL exists yet.
    const inProgressSessionSwr = useQueryMyInProgressFlashcardDueReviewSessionSwr(courseId)
    // sessioned route: resolve THIS EXACT session by id (not an MRU guess) —
    // mirrors the identical fix in `FlashcardReviewer` (2026-07-12: "this one
    // glitches too"). The old code reused `inProgressSessionSwr` here too and
    // manually checked `resumeData.sessionId === sessionId` as a workaround for
    // using the wrong query.
    const sessionByIdSwr = useQueryMyFlashcardReviewSessionBySessionIdSwr(sessionId, courseId)
    // whichever of the two above is the resumable-session SOURCE OF TRUTH for
    // this render — by-id when we have a concrete sessionId, MRU otherwise.
    const resumableSessionData = sessionId ? sessionByIdSwr.data : inProgressSessionSwr.data
    const resumableSessionLoading = sessionId ? sessionByIdSwr.isLoading : inProgressSessionSwr.isLoading
    // status-agnostic re-fetch of the resumable session's OWN cards, by exact id —
    // NOT filtered by "due today" like `cards` above. Feeds `applyResume` below: a
    // card already graded THIS run gets rescheduled (SM-2) and drops out of the due
    // queue instantly, so matching purely against `cards` silently lost it on resume
    // (misaligning `currentIndex`, or failing resume outright once enough cards had
    // been graded — 2026-07-12, teacher: "why is it rendering this page" → traced to a
    // reload-after-grading orphaning the session). `nextIntervals` isn't part of this
    // shape (only the live due query carries it) — `applyResume` falls back to
    // `undefined` for a card resolved this way, which `RatingBar`'s optional `hint`
    // already renders as "no preview" instead of crashing.
    const resumeCardIds = resumableSessionData?.cardIds ?? []
    const resumeCardsByIdSwr = useQueryFlashcardCardsByIdsSwr(resumeCardIds, courseId)
    // when a resumable session is found, the fetched due batch is reordered/filtered
    // to match its persisted `cardIds` (never re-drawn) — null while resuming didn't
    // apply (fresh draw, or no resumable session), in which case the raw fetched
    // `cards` above is used as-is. `nextIntervals` optional (not `QueryMyDueFlashcardData`'s
    // own required field) — see `resumeCardsByIdSwr` comment above.
    const [resumedCards, setResumedCards] = useState<Array<DueReviewCard> | null>(null)
    // server-issued id for the current batch — set once on start OR resume
    const sessionIdRef = useRef<string | null>(null)
    // guards the one-shot resolve-or-start effect to run its work at most once
    // per mount (prevents a duplicate `start` call on re-render).
    const resolveAttemptedRef = useRef(false)
    // STATE, separate from the ref above — `isSkeleton` below reads THIS, so the
    // shimmer stays up until the resumed cards/cursor are ACTUALLY applied, not
    // just until the underlying query settled (2026-07-12 fix: closes a 1-frame
    // flash — card 1 appears, then jumps to the real resume position). Stays
    // false on the redirect-away paths (fresh session / no-sessionId shim) — the
    // shimmer correctly holds through the navigation.
    const [resolveApplied, setResolveApplied] = useState(false)
    // guards the one-shot completion call on reaching `done`
    const completedRef = useRef(false)

    const effectiveCards = resumedCards ?? cards
    const card = effectiveCards[currentIndex]
    // complete when the learner explicitly ends it ("Finish") OR steps past
    // the last card. With free navigation "past the last card" is no longer the
    // only finish path, so the explicit `finished` flag is the primary one.
    const done = effectiveCards.length > 0 && (finished || currentIndex >= effectiveCards.length)

    /**
     * Hydrate from an in-progress session's persisted batch/cursor; false if none
     * of its cards resolve. Looks up the LIVE due queue FIRST (carries
     * `nextIntervals`), falling back to the status-agnostic by-id fetch
     * (`resumeCardsByIdSwr`) for a card already graded this run — grading
     * reschedules a card (SM-2) OUT of "due" immediately, so a due-only lookup
     * silently dropped it, corrupting the resumed order/cursor (2026-07-12 fix).
     */
    const applyResume = useCallback(
        (resumeData: { sessionId: string, cardIds: Array<string>, currentIndex: number, reviewedCount: number, gradedIndexes?: Array<number> }): boolean => {
            const dueById = new Map(cards.map((dueCard) => [dueCard.cardId, dueCard]))
            const byId = new Map((resumeCardsByIdSwr.data ?? []).map((idCard) => [idCard.cardId, idCard]))
            const ordered = resumeData.cardIds
                .map((cardId): DueReviewCard | undefined => dueById.get(cardId) ?? byId.get(cardId))
                .filter((resolvedCard): resolvedCard is DueReviewCard => Boolean(resolvedCard))
            if (ordered.length === 0) {
                return false
            }
            sessionIdRef.current = resumeData.sessionId
            setResumedCards(ordered)
            setResolveApplied(true)
            // every card in the batch was already graded (`reviewedCount` reaches
            // the batch size) but `status` never flipped to "completed" — the
            // earlier completion call never landed (2026-07-12, same root cause
            // traced in `QuizSession`: "already submitted but F5 goes back to the last question"). Clamping
            // `currentIndex` to `ordered.length - 1` here would ALWAYS re-show the
            // last card (an index at the last position can't tell "about to
            // answer" from "just answered" apart) — set it to the FULL length
            // instead so `done` computes true immediately and the "finish" effect
            // below retries completion, instead of clamping into the last card
            // every time this session gets revisited.
            setCurrentIndex(
                resumeData.reviewedCount >= ordered.length
                    ? ordered.length
                    : Math.min(resumeData.currentIndex, ordered.length - 1),
            )
            setReviewedCount(resumeData.reviewedCount)
            // rehydrate the graded-set from the resumed session; fall back to
            // "first N contiguous" when the backend didn't send it (older row
            // synced before `gradedIndexes` existed) so green isn't lost.
            setGradedIndexes(
                resumeData.gradedIndexes && resumeData.gradedIndexes.length > 0
                    ? new Set(resumeData.gradedIndexes)
                    : new Set(Array.from({ length: resumeData.reviewedCount }, (_, i) => i)),
            )
            completedRef.current = false
            return true
        },
        [cards, resumeCardsByIdSwr.data],
    )

    // start a fresh session over the batch just drawn, then redirect into its
    // sessioned URL — mirrors `FlashcardReviewer`'s own `startSessionAndRedirect`.
    // Routed through `runGraphQL` (toast on failure, no success toast) instead of a
    // silent catch (teacher, 2026-07-11: "FE shouldn't swallow errors, use runGraphQL").
    // the bare `.../review` base, with any existing `/sessions/<id>` segment
    // stripped — so redirecting into a session NEVER appends a second
    // `/sessions/...` when we're already on a sessioned URL (the revisit-crash:
    // `.../sessions/A//sessions/B`). Reached via either route, this resolves to
    // the same base.
    const reviewBasePath = pathname.replace(/\/sessions\/[^/]+\/?$/, "")

    const startSessionAndRedirect = useCallback(async () => {
        if (!courseId) {
            return
        }
        const ok = await runGraphQL(
            async () => {
                const started = await runStartSession.trigger({
                    request: { courseId, cardIds: cards.map((dueCard) => dueCard.cardId) },
                    headers: courseHeaders as GraphQLHeaders,
                })
                const response = started.data?.startFlashcardDueReviewSession
                if (response?.data?.sessionId) {
                    sessionIdRef.current = response.data.sessionId
                }
                return response ?? { success: false, message: t("flashcard.review.error") }
            },
            { showSuccessToast: false },
        )
        if (ok && sessionIdRef.current) {
            router.replace(`${reviewBasePath}/sessions/${sessionIdRef.current}`)
        }
    }, [courseId, cards, courseHeaders, runStartSession, runGraphQL, router, reviewBasePath, t])

    // resolve-or-start, once the batch + the in-progress query have both settled — TWO
    // routes into this component (mirrors `FlashcardReviewer`'s own 2026-07-11 shim):
    // (a) reached via the dedicated `review/sessions/[sessionId]` route (`sessionId`
    //     prop set) → hydrate straight from THAT session; a stale/invalid id falls
    //     back to (b) instead of getting stuck.
    // (b) reached via the bare `review?session=due` route (`sessionId` absent) →
    //     resume the caller's existing draw if one exists, otherwise start a fresh
    //     one, THEN redirect into the sessioned URL.
    useEffect(() => {
        if (
            resolveAttemptedRef.current
            || !courseId
            || cards.length === 0
            || resumableSessionLoading
            // there IS a session to resume — wait for its status-agnostic by-id
            // cards to settle too, so `applyResume` can fall back to them for an
            // already-graded card the due queue no longer carries (see
            // `resumeCardsByIdSwr` above).
            || (resumableSessionData && resumeCardsByIdSwr.isLoading)
        ) {
            return
        }
        resolveAttemptedRef.current = true
        const resumeData = resumableSessionData

        if (sessionId) {
            // `resumableSessionData` was resolved BY id when `sessionId` is set
            // (see `sessionByIdSwr` above) — no need to re-check `.sessionId`.
            if (resumeData && applyResume(resumeData)) {
                return
            }
            // stale/invalid session id — start a fresh one and correct the URL
            void startSessionAndRedirect()
            return
        }

        if (resumeData && applyResume(resumeData)) {
            router.replace(`${reviewBasePath}/sessions/${resumeData.sessionId}`)
            return
        }
        void startSessionAndRedirect()
    }, [
        sessionId,
        courseId,
        cards,
        resumableSessionLoading,
        resumableSessionData,
        resumeCardsByIdSwr.isLoading,
        applyResume,
        startSessionAndRedirect,
        router,
        reviewBasePath,
    ])

    // finish: record the finished batch once (guarded), best-effort — a failed
    // complete call only means the row stays "in_progress" (still resumable),
    // it never blocks the learner from leaving. Routed through `runGraphQL`
    // (teacher, 2026-07-11: "FE shouldn't swallow errors, use runGraphQL") instead of a
    // silent catch.
    useEffect(() => {
        if (!done || completedRef.current || !sessionIdRef.current) {
            return
        }
        completedRef.current = true
        const completingSessionId = sessionIdRef.current
        void (async () => {
            await runGraphQL(
                async () => {
                    const result = await runCompleteSession.trigger({
                        request: { sessionId: completingSessionId, reviewedCount, xpEarned: 0 },
                        headers: courseHeaders as GraphQLHeaders,
                    })
                    return (
                        result.data?.completeFlashcardDueReviewSession ?? {
                            success: false,
                            message: t("flashcard.review.error"),
                        }
                    )
                },
                { showSuccessToast: false },
            )
            // whether it succeeded or the toast surfaced a failure, drop the
            // saving state and hand off to the dedicated result route (reads
            // events directly by sessionId, independent of the session row's
            // status — "done" is now answered by the URL, not re-derived
            // client-side; see `.../result/page.tsx` doc for the root cause).
            // the due count changed — refresh the queue so the home hero reads correctly
            // whenever the learner navigates back there.
            void globalMutate(dueKey)
            router.replace(`${reviewBasePath}/sessions/${completingSessionId}/result`)
        })()
    }, [done, reviewedCount, runCompleteSession, courseHeaders, runGraphQL, t, router, reviewBasePath, globalMutate, dueKey])

    // SM-2 grade buttons for the current card: localized label + next-interval
    // preview ("4 days") computed server-side from the card's current state
    const ratingOptions = useMemo(() => {
        const intervals = card?.nextIntervals
        // map a grade to its previewed next-interval in days
        const daysForGrade = (grade: number): number | undefined => {
            if (!intervals) {
                return undefined
            }
            return [intervals.again, intervals.hard, intervals.good, intervals.easy][grade]
        }
        return SM2_GRADES.map((grade) => {
            const days = daysForGrade(grade.grade)
            return {
                grade: grade.grade,
                label: t(grade.labelKey),
                hint: days === undefined ? undefined : t("flashcard.review.intervalDays", { count: days }),
            }
        })
    }, [t, card])

    // grade the current card, reschedule it (SM-2), then advance to the next
    const handleRate = useCallback(
        async (grade: number) => {
            if (!card) {
                return
            }
            setReviewing(true)
            // a success toast per card would be noise — only surface failures
            const ok = await runGraphQL(
                async () => {
                    const response = await mutateReviewFlashcard({
                        // thread the live session id so the review event links to
                        // this session — powers the per-session stats aggregate.
                        request: { cardId: card.cardId, grade, sessionId: sessionIdRef.current ?? undefined },
                    })
                    return (
                        response.data?.reviewFlashcard ?? {
                            success: false,
                            message: t("flashcard.review.error"),
                        }
                    )
                },
                { showSuccessToast: false },
            )
            setReviewing(false)
            if (ok) {
                // mark THIS position graded (set dedupes a re-grade) — the source
                // of truth for both the per-segment green and the reviewed count.
                const nextGraded = new Set(gradedIndexes).add(currentIndex)
                const nextReviewedCount = nextGraded.size
                const nextIndex = currentIndex + 1
                setGradedIndexes(nextGraded)
                setReviewedCount(nextReviewedCount)
                setRevealed(false)
                setCurrentIndex(nextIndex)
                // best-effort, fire-and-forget persistence for resume — never blocks
                // advancing to the next card; still routed through `runGraphQL`
                // (toast on failure, no success toast) rather than a silent catch
                // (teacher, 2026-07-11: "FE shouldn't swallow errors, use runGraphQL").
                if (sessionIdRef.current) {
                    const syncingSessionId = sessionIdRef.current
                    void runGraphQL(
                        async () => {
                            const result = await runSyncSession.trigger({
                                request: {
                                    sessionId: syncingSessionId,
                                    currentIndex: nextIndex,
                                    reviewedCount: nextReviewedCount,
                                    gradedIndexes: Array.from(nextGraded),
                                    xpEarned: 0,
                                },
                                headers: courseHeaders as GraphQLHeaders,
                            })
                            return (
                                result.data?.syncFlashcardDueReviewSessionProgress ?? {
                                    success: false,
                                    message: t("flashcard.review.error"),
                                }
                            )
                        },
                        { showSuccessToast: false },
                    ).then(() => {
                        // invalidate the Hub's "Review in progress" (ContinueCard) cache —
                        // it reads THIS exact key, and nothing else was invalidating it
                        // per-grade (only on completion, see the `done` effect below) —
                        // so a revisit to the Hub mid-session showed a stale currentIndex
                        // from whenever that card first mounted, not the position just
                        // synced here (2026-07-12, teacher: "pressing the back button returns to 2 while it's
                        // actually at 5" — the DB was correct the whole time; only this cache
                        // was stale, verified directly against Postgres).
                        if (courseId) {
                            void globalMutate(["QUERY_MY_IN_PROGRESS_FLASHCARD_DUE_REVIEW_SESSION_SWR", courseId])
                        }
                    })
                }
            }
        },
        [card, runGraphQL, t, currentIndex, gradedIndexes, runSyncSession, courseHeaders, courseId, globalMutate],
    )
    // presentational callback contract is sync — `handleRate` is fire-and-forget from the click.
    const onRate = useCallback((grade: number) => { void handleRate(grade) }, [handleRate])

    // step back to re-see an earlier card (question side; no re-grade) — mirrors
    // `FlashcardReviewer`'s own `goPrev` (teacher: sync the UI, both session types should
    // have a "Previous" button, due-review was previously missing this button).
    const isFirst = currentIndex === 0
    const isLast = currentIndex >= effectiveCards.length - 1
    const goPrev = useCallback(() => {
        setRevealed(false)
        setCurrentIndex((index) => Math.max(index - 1, 0))
    }, [])
    // "Next" — explicit, symmetric counterpart to "Previous": browse forward
    // WITHOUT grading (mirrors `FlashcardReviewer`'s own `goNext`, teacher,
    // 2026-07-12: "next prev" flanking the primary "Show answer" CTA).
    const goNext = useCallback(() => {
        setRevealed(false)
        setCurrentIndex((index) => Math.min(index + 1, effectiveCards.length - 1))
    }, [effectiveCards.length])
    // jump straight to ANY step from the progress-segment bar — free navigation,
    // "both before and after, even ones not reached yet can be clicked" (2026-07-12). No re-grade; the
    // card's graded/green state is independent of which one you're viewing.
    const goToIndex = useCallback((position: number) => {
        setRevealed(false)
        setCurrentIndex(position)
    }, [])
    // end the session now → the completion effect (`done`) fires + navigates to
    // results. Distinct from "Exit" (back-link: leave, keep resumable).
    const onFinish = useCallback(() => setFinished(true), [])
    const onReveal = useCallback(() => setRevealed(true), [])

    // first load, nothing in hand → shimmer (loading-and-skeleton.md §2); also holds through the
    // due-review resolve-or-start/resume state machine (forced skeleton while the bare
    // `?session=due` shim resolves-or-starts a session and redirects, and — once the batch has
    // loaded — until the resumed cursor has actually been APPLIED, not just until its underlying
    // query settled, closing a 1-frame flash: card 1 appears, then jumps to the real resume position).
    const isSkeleton = (isLoading && !data) || (!sessionId && cards.length > 0) || (Boolean(sessionId) && cards.length > 0 && !resolveApplied)
    const isEmpty = cards.length === 0

    const levelLabel = card?.level ? t(`flashcard.level.${card.level}`) : undefined

    const labels: DueReviewLabels = {
        exit: t("flashcard.exit"),
        modeTitle: t("flashcard.mode.due"),
        counter: t("flashcard.cardProgress", {
            current: done ? effectiveCards.length : currentIndex + 1,
            total: effectiveCards.length,
        }),
        finish: t("flashcard.finish"),
        savingLabel: t("flashcard.review.stats.savingLabel"),
        // NB: keeps the pre-existing (mismatched) copy verbatim — "No flashcards for this course
        // yet." doubling as the due-queue error title predates this split, unchanged here.
        errorTitle: t("flashcard.empty"),
        emptyTitle: t("flashcard.due.allCaught"),
        emptyDescription: t("flashcard.due.allCaughtHint"),
        questionLabel: t("flashcard.questionLabel"),
        answerLabel: t("flashcard.answerLabel"),
        rateHint: t("flashcard.review.rateHint"),
        rateAria: t("flashcard.review.rateAria"),
        showAnswer: t("flashcard.showAnswer"),
        previous: t("flashcard.previous"),
        next: t("flashcard.next"),
    }

    return (
        <_DueReview
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            error={error}
            onRetry={() => { void mutate() }}
            onBack={onExit}
            done={done}
            card={card}
            levelLabel={levelLabel}
            revealed={revealed}
            onReveal={onReveal}
            reviewing={reviewing}
            ratingOptions={ratingOptions}
            onRate={onRate}
            currentIndex={currentIndex}
            totalCount={effectiveCards.length}
            gradedIndexes={Array.from(gradedIndexes)}
            isFirst={isFirst}
            isLast={isLast}
            onSegmentClick={goToIndex}
            onPrev={goPrev}
            onNext={goNext}
            onFinish={onFinish}
            labels={labels}
        />
    )
}
