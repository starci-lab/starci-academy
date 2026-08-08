"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { useTranslations, useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { SM2_GRADES } from "@/modules/utils/flashcards"
import { _FlashcardReviewer, type FlashcardReviewerLabels } from "./component"
import { mutateReviewFlashcard } from "@/modules/api/graphql/mutations/mutation-review-flashcard"
import { queryFlashcardDeck } from "@/modules/api/graphql/queries/query-flashcard-deck"
import { type FlashcardCardEntity } from "@/modules/types/entities/flashcard-card"
import { useAppSelector } from "@/redux/hooks"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { pathConfig } from "@/resources/path"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { useMutateStartFlashcardReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardReviewSessionSwr"
import { useMutateSyncFlashcardReviewSessionProgressSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSyncFlashcardReviewSessionProgressSwr"
import { useMutateCompleteFlashcardReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCompleteFlashcardReviewSessionSwr"
import { useQueryMyInProgressFlashcardReviewSessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInProgressFlashcardReviewSessionSwr"
import { useQueryMyFlashcardReviewSessionBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardReviewSessionBySessionIdSwr"

/** Props for {@link FlashcardReviewer}. */
export interface FlashcardReviewerProps {
    /** Deck id being reviewed. */
    deckId: string
    /**
     * Present when reached via the dedicated, resumable
     * `flashcards/review/decks/[deckId]/sessions/[sessionId]` route — this
     * component then hydrates straight from THAT session (no resolve-or-start
     * call) instead of resolving one itself. Absent when reached via the bare
     * `.../decks/[deckId]` route (teacher 2026-07-11 correction: "so the review
     * session gets saved" — that bare route is now a RESOLVE-ONLY shim: it resolves-or-starts a
     * session then `router.push`es into the sessioned URL, mirroring
     * `QuizSession`'s `startSession` → `router.push` idiom). Mirrors
     * `QuizSessionProps.resumeSessionId`.
     */
    sessionId?: string
    /** Returns to the study overview (due + mastery + deck list). Passed straight
     *  through as `WorkSessionHeader`'s `onBack` (mirrors `QuizSession`'s own
     *  `exitToSetup` — teacher 2026-07-09: "neither the review nor the quiz
     *  section has a back button"). */
    onBack?: () => void
}

/**
 * Rehydrate the graded-position set from a resumed session: prefer the
 * server's `gradedIndexes` (order-independent, exact), else fall back to
 * "first `reviewedCount` contiguous" for an older row synced before the
 * column existed — so green isn't lost on resume of a legacy session.
 */
const seedGradedSet = (resumed: { gradedIndexes?: Array<number>, reviewedCount: number }): Set<number> =>
    resumed.gradedIndexes && resumed.gradedIndexes.length > 0
        ? new Set(resumed.gradedIndexes)
        : new Set(Array.from({ length: resumed.reviewedCount }, (_, i) => i))

/**
 * Spaced-repetition reviewer over one deck — the CONNECTED half: it owns the deck
 * fetch, the resumable-session resolve/sync/complete wiring, every piece of local
 * run state (current card, reveal, grading), and every i18n resolution, then hands
 * fully-resolved props to the presentational {@link _FlashcardReviewer}. One card at
 * a time: the Markdown question on the front, flipped to reveal the model answer
 * plus optional depth, then graded for recall (Again / Hard / Good / Easy) — each
 * grade reschedules the card via `reviewFlashcard` (SM-2) and advances. Previous
 * steps back to re-grade; a summary closes the run. See `tiers/split.md`.
 * @param props - {@link FlashcardReviewerProps}
 */
export const FlashcardReviewer = ({ deckId, sessionId, onBack }: FlashcardReviewerProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const runGraphQL = useGraphQLWithToast()
    const { mutate: globalMutate } = useSWRConfig()
    // owning course slug drives the deep-links to referenced lessons/modules
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // owning course id (uuid) — for the review-session mutations' enrollment-guard header
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const courseHeaders = useMemo(
        () => (courseId ? { [GraphQLHeadersKey.XCourseId]: courseId } : undefined),
        [courseId],
    )
    // entitlement: enrolled viewers unlock premium cards (first ~20%/deck stay free)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    // index of the card currently shown
    const [currentIndex, setCurrentIndex] = useState(0)
    // whether the current card is flipped to its answer side
    const [revealed, setRevealed] = useState(false)
    // true while a grade is in flight (blocks the rating bar)
    const [reviewing, setReviewing] = useState(false)
    // how many cards were graded this run (shown in the summary)
    const [reviewedCount, setReviewedCount] = useState(0)
    // WHICH card positions have been graded (0-indexed, order-independent) —
    // drives the progress bar's per-segment green under free navigation
    // (2026-07-12; mirrors `DueReview`). Persisted via `gradedIndexes` sync.
    const [gradedIndexes, setGradedIndexes] = useState<Set<number>>(() => new Set())
    // explicit "Finish" — end the run now regardless of position.
    const [finished, setFinished] = useState(false)
    // confirm-before-exit ("leave"/"endEarly" dialog toggle) is pure UI chrome —
    // it now lives as local state in the presentational `_FlashcardReviewer`
    // (loading-and-skeleton.md's test: no server/store/session needed to render it).

    // load the full deck graph (cards with question + answer)
    const { data, isLoading, error, mutate } = useSWR(
        ["flashcard-deck", deckId],
        async () => {
            const response = await queryFlashcardDeck({
                request: { flashcardDeckId: deckId },
            })
            return response.data?.flashcardDeck.data ?? null
        },
    )

    // ── resumable review session (2026-07-09: "always save the session to
    // build stats" — mirrors QuizSession's own start/sync/complete/resume wiring,
    // scoped to this ONE deck instead of the whole course) ──────────────────
    const runStartSession = useMutateStartFlashcardReviewSessionSwr()
    const runSyncSession = useMutateSyncFlashcardReviewSessionProgressSwr()
    const runCompleteSession = useMutateCompleteFlashcardReviewSessionSwr()
    // no-`sessionId` shim route only: MRU "is there a resumable draw at all"
    // lookup, used to resolve-or-start before a sessioned URL exists yet.
    const inProgressSessionSwr = useQueryMyInProgressFlashcardReviewSessionSwr(deckId, courseId)
    // sessioned route: resolve THIS EXACT session by id (not an MRU guess) —
    // fixes a visible jank on load (2026-07-12: "this one jitters too"). The
    // old code reused `inProgressSessionSwr` here too and manually checked
    // `resumable.sessionId === sessionId` as a workaround for using the wrong
    // query; worse, that query's `isLoading` wasn't part of the `isSkeleton`
    // gate below, so the skeleton could resolve before `currentIndex` was set,
    // flashing card 1 before jumping to the real resume position.
    const sessionByIdSwr = useQueryMyFlashcardReviewSessionBySessionIdSwr(sessionId, courseId)

    // cards in review order. When a session resolves, its PERSISTED `cardIds` is
    // the source of truth for WHICH cards + their order — so "Due cards only"
    // ("due" mode, teacher 2026-07-13) actually shows only its narrowed subset
    // instead of the whole deck. Order follows the session's `cardIds` exactly
    // (a card id no longer in the deck is dropped). Before a session exists (the
    // bare `?deckId=` shim, which starts a FULL draw), fall back to the whole
    // deck sorted by `sortIndex` — that same fallback is what `startSessionAndRedirect`
    // persists for the shim path.
    const sessionCardIds = sessionByIdSwr.data?.cardIds ?? null
    const cards = useMemo<Array<FlashcardCardEntity>>(
        () => {
            const all = [...(data?.cards ?? [])].sort((prev, next) => prev.sortIndex - next.sortIndex)
            if (!sessionCardIds || sessionCardIds.length === 0) {
                return all
            }
            const byId = new Map(all.map((deckCard) => [deckCard.id, deckCard]))
            return sessionCardIds
                .map((id) => byId.get(id))
                .filter((deckCard): deckCard is FlashcardCardEntity => Boolean(deckCard))
        },
        [data?.cards, sessionCardIds],
    )

    // the server-issued session id — a ref (not state) since it never drives a render
    const sessionIdRef = useRef<string | null>(null)
    // guards the mount-time resume/start effect so it runs its work at most once
    // per deck (prevents a duplicate `start` call on re-render).
    const initAttemptedRef = useRef(false)
    // STATE, separate from the ref above — the `isSkeleton` gate below reads
    // THIS, so the skeleton stays up until `currentIndex`/`reviewedCount` are
    // ACTUALLY set, not just until the underlying query settles (closes a 1-frame
    // flash this component used to show: card 1 appears, then jumps to the real
    // resume position). Stays false on the redirect-away paths (fresh session /
    // no-sessionId shim) — the skeleton correctly holds through the navigation.
    const [initResolved, setInitResolved] = useState(false)
    // guards `completeFlashcardReviewSession` so a re-render at `done` never double-fires it
    const completedRef = useRef(false)

    // once the deck's cards AND the in-progress check have both settled — TWO
    // routes into this component (2026-07-11 correction: "so the review session gets saved"):
    // (a) reached via the dedicated `.../decks/[deckId]/sessions/[sessionId]`
    //     route (`sessionId` prop set) → hydrate straight from THAT session
    //     (no start call); a stale/invalid id (expired past 24h, or bogus) falls
    //     back to (b) below instead of getting stuck.
    // (b) reached via the bare `.../decks/[deckId]` route (`sessionId` absent)
    //     → this is now a RESOLVE-ONLY shim: resume the caller's existing draw
    //     if one exists, otherwise start a fresh one, THEN `router.push` into
    //     the sessioned URL — mirrors `QuizSession`'s own `startSession` →
    //     `router.push` idiom. Never renders the live reviewer itself; `done`
    //     stays false the whole time (the `isSkeleton` gate below covers this
    //     branch), so only the skeleton ever shows here.
    // start a fresh session + redirect into its sessioned URL — used by the
    // resolve effect (2 branches below). Routed through
    // `runGraphQL` (toast on failure, no success toast — best-effort/silent
    // success) instead of a bare `.catch(() => {})` (teacher 2026-07-11: "FE
    // shouldn't swallow errors, use runGraphQL") — a failed start now surfaces to
    // the learner instead of leaving the shim route stuck silently.
    const startSessionAndRedirect = useCallback(
        async (redirectBase: string) => {
            if (!courseHeaders) {
                return
            }
            let freshId: string | undefined
            await runGraphQL(
                async () => {
                    const result = await runStartSession.trigger({
                        request: { deckId, cardIds: cards.map((deckCard) => deckCard.id) },
                        headers: courseHeaders,
                    })
                    const response = result.data?.startFlashcardReviewSession
                    freshId = response?.data?.sessionId
                    return response ?? { success: false, message: t("flashcard.review.error") }
                },
                { showSuccessToast: false },
            )
            if (freshId) {
                sessionIdRef.current = freshId
                // the live URL carries ONLY the sessionId, no `?deckId=` (teacher
                // 2026-07-11: "drop the deck, session only" — no more `decks/<id>`
                // path segment either; `review/sessions/[sessionId]` is shared with
                // `DueReview`). `FlashcardsPage` resolves deck identity back out via
                // `myFlashcardReviewSessionBySessionId` — the session already
                // persists it, no query hint needed.
                router.push(`${redirectBase}/sessions/${freshId}`)
            }
        },
        [cards, deckId, courseHeaders, runStartSession, runGraphQL, router, t],
    )

    // every card in the deck was already graded (`reviewedCount` reaches the
    // deck size) but `status` never flipped to "completed" — the earlier
    // completion call never landed (2026-07-12, same root cause traced in
    // `QuizSession`: "already submitted but F5 goes back to the last question"). Clamping `currentIndex`
    // to `cards.length - 1` would ALWAYS re-show the last card (that index
    // can't tell "about to answer" from "just answered" apart) — resolve to
    // the FULL length instead so `done` computes true immediately and the
    // "finish" effect below retries completion.
    const resolveIndex = useCallback(
        (resumable: { reviewedCount: number, currentIndex: number }) =>
            resumable.reviewedCount >= cards.length
                ? cards.length
                : Math.min(resumable.currentIndex, cards.length - 1),
        [cards.length],
    )

    useEffect(() => {
        if (
            initAttemptedRef.current
            || cards.length === 0
            || !courseHeaders
        ) {
            return
        }

        if (sessionId) {
            if (sessionByIdSwr.isLoading) {
                return
            }
            initAttemptedRef.current = true
            const resolved = sessionByIdSwr.data
            if (resolved) {
                sessionIdRef.current = sessionId
                setCurrentIndex(resolveIndex(resolved))
                setReviewedCount(resolved.reviewedCount)
                setGradedIndexes(seedGradedSet(resolved))
                setInitResolved(true)
                return
            }
            // stale/invalid session id (not found/not owned/expired past 24h) —
            // start a fresh one and correct the URL, same as the no-`sessionId`
            // branch below.
            void startSessionAndRedirect(pathname.replace(/\/sessions\/.+$/, ""))
            return
        }

        if (inProgressSessionSwr.isLoading) {
            return
        }
        initAttemptedRef.current = true
        const resumable = inProgressSessionSwr.data
        if (resumable) {
            sessionIdRef.current = resumable.sessionId
            setCurrentIndex(resolveIndex(resumable))
            setReviewedCount(resumable.reviewedCount)
            setGradedIndexes(seedGradedSet(resumable))
            // strip any existing `/sessions/<id>` so we never append a second
            // one (the `.../sessions/A//sessions/B` revisit crash); replace, not
            // push, so the stale URL doesn't linger in history.
            router.replace(`${pathname.replace(/\/sessions\/.+$/, "")}/sessions/${resumable.sessionId}`)
            return
        }
        void startSessionAndRedirect(pathname.replace(/\/sessions\/.+$/, ""))
    }, [
        cards,
        sessionId,
        courseHeaders,
        sessionByIdSwr.isLoading,
        sessionByIdSwr.data,
        inProgressSessionSwr.isLoading,
        inProgressSessionSwr.data,
        resolveIndex,
        router,
        pathname,
        startSessionAndRedirect,
    ])

    const card = cards[currentIndex]

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

    // a premium card is locked for a non-enrolled viewer — its answer is withheld
    const isLocked = Boolean(card?.isPremium) && !enrolled
    const isFirst = currentIndex === 0
    const isLast = currentIndex >= cards.length - 1

    /** Open the course page so the viewer can enrol to unlock premium cards. */
    const onUnlock = useCallback(() => {
        router.push(pathConfig().locale(locale).course(courseDisplayId).build())
    }, [router, locale, courseDisplayId])
    // past the last card → the run is complete
    const done = cards.length > 0 && (finished || currentIndex >= cards.length)

    // step back to re-grade an earlier card (always on its question side)
    const goPrev = () => {
        setRevealed(false)
        setCurrentIndex((index) => Math.max(index - 1, 0))
    }
    // jump straight to ANY step from the progress-segment bar — free navigation,
    // "both before and after, clickable even before you reach it" (2026-07-12, mirrors `DueReview`).
    const goToIndex = useCallback((position: number) => {
        setRevealed(false)
        setCurrentIndex(position)
    }, [])
    // "Next" — the explicit, symmetric counterpart to "Previous": browse forward
    // WITHOUT revealing/grading (mirrors `goPrev`; both are just the free-nav
    // `goToIndex` under the hood, per teacher 2026-07-12: "next prev" flanking the
    // primary "Show answer" CTA, researched against Mochi/Anki's ← → idiom).
    const goNext = useCallback(() => {
        setRevealed(false)
        setCurrentIndex((index) => Math.min(index + 1, cards.length - 1))
    }, [cards.length])
    // end the run now → the completion effect (`done`) fires + navigates to the
    // result route. Distinct from "Exit" (back-link: leave, keep resumable).
    const onFinish = useCallback(() => setFinished(true), [])

    // grade the current card, reschedule it (SM-2), then advance
    const onRate = useCallback(
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
                        request: { cardId: card.id, grade, sessionId: sessionIdRef.current ?? undefined },
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
                // mark THIS position graded (set dedupes a re-grade) — source of
                // truth for the per-segment green + the reviewed count.
                const nextGraded = new Set(gradedIndexes).add(currentIndex)
                const nextReviewedCount = nextGraded.size
                const nextIndex = currentIndex + 1
                setGradedIndexes(nextGraded)
                setReviewedCount(nextReviewedCount)
                setRevealed(false)
                setCurrentIndex(nextIndex)
                // best-effort, fire-and-forget persistence for resume — never blocks
                // advancing the reviewer; still routed through `runGraphQL` (toast on
                // failure, no success toast) rather than a silent catch — a failed sync
                // only degrades resumability, but the learner should still see it.
                if (sessionIdRef.current && courseHeaders) {
                    const syncSessionId = sessionIdRef.current
                    void runGraphQL(
                        async () => {
                            const result = await runSyncSession.trigger({
                                request: {
                                    sessionId: syncSessionId,
                                    currentIndex: nextIndex,
                                    reviewedCount: nextReviewedCount,
                                    gradedIndexes: Array.from(nextGraded),
                                    xpEarned: 0,
                                },
                                headers: courseHeaders,
                            })
                            return (
                                result.data?.syncFlashcardReviewSessionProgress ?? {
                                    success: false,
                                    message: t("flashcard.review.error"),
                                }
                            )
                        },
                        { showSuccessToast: false },
                    ).then(() => {
                        // invalidate any resumable-session indicator elsewhere reading
                        // THIS exact key (mirrors the identical fix on `DueReview`,
                        // 2026-07-12: "pressing back showed 2 while it was actually 5" — a
                        // per-grade sync never invalidated the cache, only the `done`
                        // completion path did, so a revisit mid-session could read a
                        // stale currentIndex even though the DB itself was correct).
                        void globalMutate(["QUERY_MY_IN_PROGRESS_FLASHCARD_REVIEW_SESSION_SWR", deckId])
                    })
                }
            }
        },
        [card, runGraphQL, t, gradedIndexes, currentIndex, courseHeaders, runSyncSession, globalMutate, deckId],
    )

    // the run just finished (past the last card) — close out the persisted
    // session ONCE so `myFlashcardReviewHistory`/`myFlashcardReviewStats` can
    // read it; guarded so a re-render at `done` never double-fires it. Routed
    // through `runGraphQL` (teacher 2026-07-11: "FE shouldn't swallow errors,
    // use runGraphQL") instead of a silent catch.
    useEffect(() => {
        if (!done || completedRef.current || !sessionIdRef.current || !courseHeaders) {
            return
        }
        completedRef.current = true
        const completingSessionId = sessionIdRef.current
        void (async () => {
            await runGraphQL(
                async () => {
                    const result = await runCompleteSession.trigger({
                        request: {
                            sessionId: completingSessionId,
                            reviewedCount,
                            xpEarned: 0,
                        },
                        headers: courseHeaders,
                    })
                    return (
                        result.data?.completeFlashcardReviewSession ?? {
                            success: false,
                            message: t("flashcard.review.error"),
                        }
                    )
                },
                { showSuccessToast: false },
            )
            // hand off to the dedicated result route once the session is closed out
            // (reads events by sessionId, independent of the session row's status —
            // "done" is now answered by the URL, not re-derived client-side; see
            // `.../result/page.tsx` doc for the root cause).
            router.replace(`${pathname.replace(/\/sessions\/.+$/, "")}/sessions/${completingSessionId}/result`)
        })()
    }, [done, reviewedCount, courseHeaders, runCompleteSession, runGraphQL, t, router, pathname])

    // first load, nothing in hand yet — the deck query AND the session-resolve
    // effect both have to settle (loading-and-skeleton.md §2). No `sessionId` prop
    // = the resolve-only shim (bare `review?deckId=<id>` route) — ALWAYS the
    // skeleton, never error/empty/live UI; it `router.replace`s into the sessioned
    // URL as soon as resolving lands (effect above). `cards.length > 0 &&
    // !initResolved` (2026-07-12 fix): once the deck itself has loaded, ALSO hold
    // the skeleton until the resume/start effect has actually applied
    // `currentIndex`/`reviewedCount` — not just until its underlying query
    // settled — closing a 1-frame flash (card 1 appears, then jumps to the real
    // resume position). Scoped to `cards.length > 0` so a genuinely empty deck
    // still falls through to `isEmpty` below (that effect never runs — and never
    // resolves `initResolved` — when there are no cards to resume into).
    const isSkeleton = !sessionId || ((isLoading || !data) && cards.length === 0) || (cards.length > 0 && !initResolved)
    // settled, sessioned, and the resolved card list is empty.
    const isEmpty = Boolean(sessionId) && cards.length === 0
    // error beats a stale loading flag (bug fixed 2026-07-11: gate `error`/`isEmpty`
    // on `sessionId` too, not just loading — a genuine deck-query error used to leak
    // through as "no FlashcardsPage yet" on the shim even while still resolving).
    const resolvedError = sessionId && cards.length === 0 ? error : undefined

    const cardLevelLabel = card?.level ? t(`flashcard.level.${card.level}`) : undefined
    // interpolated per `done` — the same pair the two branches used to compute
    // separately ("done" is now answered by the URL, not re-derived client-side).
    const counter = t("flashcard.cardProgress", {
        current: done ? cards.length : currentIndex + 1,
        total: cards.length,
    })

    const labels: FlashcardReviewerLabels = {
        exit: t("flashcard.exit"),
        title: t("flashcard.mode.study"),
        counter,
        savingLabel: t("flashcard.review.stats.savingLabel"),
        leaveTitle: t("flashcard.leaveTitle"),
        finishEarlyTitle: t("flashcard.finishEarlyTitle"),
        leaveConfirm: t("flashcard.leaveConfirm"),
        finishEarlyConfirm: t("flashcard.finishEarlyConfirm"),
        leaveCta: t("flashcard.leaveCta"),
        finishEarlyCta: t("flashcard.finishEarlyCta"),
        stayIn: t("flashcard.stayIn"),
        questionLabel: t("flashcard.questionLabel"),
        answerLabel: t("flashcard.answerLabel"),
        premiumLockedTitle: t("flashcard.premiumLockedTitle"),
        premiumLockedHint: t("flashcard.premiumLockedHint"),
        noAnswer: t("flashcard.noAnswer"),
        premiumCta: t("flashcard.premiumCta"),
        rateHint: t("flashcard.review.rateHint"),
        rateAria: t("flashcard.review.rateAria"),
        showAnswer: t("flashcard.showAnswer"),
        previous: t("flashcard.previous"),
        next: t("flashcard.next"),
        finishEarly: t("flashcard.finishEarly"),
        // shared by both the empty and the error branch — mirrors the original,
        // which used this same key for both.
        emptyTitle: t("flashcard.empty"),
    }

    return (
        <_FlashcardReviewer
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            error={resolvedError}
            onRetry={() => { void mutate() }}
            labels={labels}
            deckTitle={data?.title}
            done={done}
            currentIndex={currentIndex}
            totalCards={cards.length}
            card={card}
            cardLevelLabel={cardLevelLabel}
            isLocked={isLocked}
            isFirst={isFirst}
            isLast={isLast}
            revealed={revealed}
            reviewing={reviewing}
            gradedIndexes={Array.from(gradedIndexes)}
            ratingOptions={ratingOptions}
            onBack={onBack}
            onReveal={() => setRevealed(true)}
            onRate={(grade) => void onRate(grade)}
            onPrev={goPrev}
            onNext={goNext}
            onSegmentClick={goToIndex}
            onFinishEarly={onFinish}
            onUnlock={onUnlock}
        />
    )
}
