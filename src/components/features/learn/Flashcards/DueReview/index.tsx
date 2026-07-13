"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { Button, Chip, Label, Spinner, Typography, cn } from "@heroui/react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { DUE_REVIEW_LIMIT, SM2_GRADES } from "../constants"
import { DueReviewSkeleton } from "./DueReviewSkeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { mutateReviewFlashcard } from "@/modules/api/graphql/mutations/mutation-review-flashcard"
import { queryMyDueFlashcards } from "@/modules/api/graphql/queries/query-my-due-flashcards"
import type { QueryMyDueFlashcardData } from "@/modules/api/graphql/queries/types/my-due-flashcards"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { WorkSessionHeader } from "@/components/blocks/navigation/WorkSessionHeader"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { RatingBar } from "@/components/blocks/buttons/RatingBar"
import { useQueryFlashcardCardsByIdsSwr } from "@/hooks/swr/api/graphql/queries/useQueryFlashcardCardsByIdsSwr"
import { useMutateStartFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardDueReviewSessionSwr"
import { useMutateSyncFlashcardDueReviewSessionProgressSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSyncFlashcardDueReviewSessionProgressSwr"
import { useMutateCompleteFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCompleteFlashcardDueReviewSessionSwr"
import { useQueryMyInProgressFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInProgressFlashcardDueReviewSessionSwr"
import { useQueryMyFlashcardReviewSessionBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardReviewSessionBySessionIdSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { useAppSelector } from "@/redux/hooks"

/** HeroUI Chip color per quiz seniority level (mirrors `FlashcardReviewer`). */
const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "accent"> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/** Props for {@link DueReview}. */
export interface DueReviewProps extends WithClassNames<undefined> {
    /** Leave the session and return to the flashcards home. */
    onExit: () => void
    /**
     * Present when reached via the dedicated `flashcards/review/sessions/[sessionId]`
     * route — this component then hydrates straight from THAT session (no
     * resolve-or-start call) instead of resolving one itself. Absent when
     * reached via the bare `review?session=due` route (thầy 2026-07-11 đính
     * chính: "due review cũng tạo session mới nhé" — that bare route is now a
     * RESOLVE-ONLY shim: it resolves-or-starts a session then `router.push`es
     * into the sessioned URL (thầy: giữ history entry, không dùng `.replace`),
     * mirroring `FlashcardReviewer`'s own idiom).
     * Mirrors `FlashcardReviewerProps.sessionId`.
     */
    sessionId?: string
}

/**
 * A card as rendered in this session — the live "due" shape (carries
 * `nextIntervals`, used for the RatingBar's day-preview hints) OR a card
 * resolved status-agnostically by id during resume (no `nextIntervals` — see
 * `resumeCardsByIdSwr` in the component body). `RatingBar`'s `hint` is already
 * optional, so a card without `nextIntervals` just renders without the preview.
 */
type DueReviewCard = Omit<QueryMyDueFlashcardData, "nextIntervals"> & {
    nextIntervals?: QueryMyDueFlashcardData["nextIntervals"]
}

/**
 * The spaced-repetition (SM-2) review session over the viewer's due cards, drawn
 * across every enrolled course. One card at a time: flip to reveal the answer,
 * then grade recall (Again / Hard / Good / Easy) — each grade reschedules the card
 * via `reviewFlashcard` and advances. A session summary closes the run. The due
 * count is the page's primary loop, so this is the main entry from the home hero.
 * @param props - {@link DueReviewProps}
 */
export const DueReview = ({ onExit, sessionId, className }: DueReviewProps) => {
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
    // reads green (2026-07-12, thầy: free-nav "cả trước và sau"). A Set for
    // O(1) membership; persisted as an array via `gradedIndexes` sync so a
    // resume rehydrates it.
    const [gradedIndexes, setGradedIndexes] = useState<Set<number>>(() => new Set())
    // explicit "Kết thúc" — end the session now regardless of position, distinct
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
    // (thầy 2026-07-11 đính chính: "due review cũng tạo session mới nhé" — parity with
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
    // mirrors the identical fix in `FlashcardReviewer` (2026-07-12: "cái này
    // cũng giật này"). The old code reused `inProgressSessionSwr` here too and
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
    // been graded — 2026-07-12, thầy: "sao render ra trang này vậy" → traced to a
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
    // STATE, separate from the ref above — `AsyncContent`'s `isLoading` gate below
    // reads THIS, so the skeleton stays up until the resumed cards/cursor are
    // ACTUALLY applied, not just until the underlying query settles (2026-07-12
    // fix: closes a 1-frame flash — card 1 appears, then jumps to the real resume
    // position). Stays false on the redirect-away paths (fresh session / no-
    // sessionId shim) — the skeleton correctly holds through the navigation.
    const [resolveApplied, setResolveApplied] = useState(false)
    // guards the one-shot completion call on reaching `done`
    const completedRef = useRef(false)

    const effectiveCards = resumedCards ?? cards
    const card = effectiveCards[currentIndex]
    // complete when the learner explicitly ends it ("Kết thúc") OR steps past
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
            // traced in `QuizSession`: "submit rồi mà F5 về câu cuối"). Clamping
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
    // silent catch (thầy 2026-07-11: "fe không nuốt lỗi, dùng runGraphQL đi").
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
    // (thầy 2026-07-11: "fe không nuốt lỗi, dùng runGraphQL đi") instead of a
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
                // (thầy 2026-07-11: "fe không nuốt lỗi, dùng runGraphQL đi").
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
                        // invalidate the Hub's "Ôn tập dở dang" (ContinueCard) cache —
                        // it reads THIS exact key, and nothing else was invalidating it
                        // per-grade (only on completion, see the `done` effect below) —
                        // so a revisit to the Hub mid-session showed a stale currentIndex
                        // from whenever that card first mounted, not the position just
                        // synced here (2026-07-12, thầy: "bấm nút back thì về 2 trong khi
                        // đang là 5" — the DB was correct the whole time; only this cache
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

    // step back to re-see an earlier card (question side; no re-grade) — mirrors
    // `FlashcardReviewer`'s own `goPrev` (thầy: đồng bộ UI, cả 2 loại phiên đều
    // có nút "Trước", ảnh due-review trước đó thiếu nút này).
    const isFirst = currentIndex === 0
    const isLast = currentIndex >= effectiveCards.length - 1
    const goPrev = useCallback(() => {
        setRevealed(false)
        setCurrentIndex((index) => Math.max(index - 1, 0))
    }, [])
    // "Tiếp" — explicit, symmetric counterpart to "Trước": browse forward
    // WITHOUT grading (mirrors `FlashcardReviewer`'s own `goNext`, thầy
    // 2026-07-12: "next prev" flanking the primary "Xem đáp án" CTA).
    const goNext = useCallback(() => {
        setRevealed(false)
        setCurrentIndex((index) => Math.min(index + 1, effectiveCards.length - 1))
    }, [effectiveCards.length])
    // jump straight to ANY step from the progress-segment bar — free navigation,
    // "cả trước và sau, chưa tới vẫn click được" (2026-07-12). No re-grade; the
    // card's graded/green state is independent of which one you're viewing.
    const goToIndex = useCallback((position: number) => {
        setRevealed(false)
        setCurrentIndex(position)
    }, [])
    // end the session now → the completion effect (`done`) fires + navigates to
    // results. Distinct from "Thoát" (back-link: leave, keep resumable).
    const onFinish = useCallback(() => setFinished(true), [])

    return (
        <AsyncContent
            // forced loading while the bare `?session=due` shim resolves-or-starts a
            // session and redirects (mirrors `FlashcardReviewer`'s own `!sessionId` gate)
            // — but only when there IS a batch to redirect with; an empty batch (no due
            // cards) must still fall through to `isEmpty` below instead of spinning forever.
            // `cards.length > 0 && !resolveApplied` (2026-07-12 fix, mirrors the
            // identical `FlashcardReviewer` fix): once the due batch itself has
            // loaded, ALSO hold the skeleton until the resume/start effect has
            // actually applied the resumed cursor — not just until its underlying
            // query settled — closing a 1-frame flash (card 1 appears, then jumps
            // to the real resume position).
            isLoading={(isLoading && !data) || (!sessionId && cards.length > 0) || (Boolean(sessionId) && cards.length > 0 && !resolveApplied)}
            skeleton={<DueReviewSkeleton />}
            isEmpty={cards.length === 0}
            emptyContent={{
                title: t("flashcard.due.allCaught"),
                description: t("flashcard.due.allCaughtHint"),
            }}
            error={error}
            errorContent={{
                title: t("flashcard.empty"),
                onRetry: () => { void mutate() },
            }}
        >
            {done ? (
                // transient hand-off only — the "finish" effect above
                // `router.replace`s into the dedicated `.../result` route once
                // the completion mutation resolves (2026-07-12: "done" is now
                // answered by the ROUTE, not re-derived client-side here), so
                // this branch never has a real end state to render — just the
                // "saving" interim until that navigation lands. KEEP the same
                // `WorkSessionHeader` chrome the just-finished ACTIVE phase
                // used (thầy wanted the loading state to render like the
                // active session's header, not swap to `PageHeader` early).
                <div className={cn("flex w-full flex-col", className)}>
                    <WorkSessionHeader
                        backLabel={t("flashcard.exit")}
                        onBack={onExit}
                        title={t("flashcard.mode.due")}
                        counter={t("flashcard.cardProgress", {
                            current: effectiveCards.length,
                            total: effectiveCards.length,
                        })}
                        current={effectiveCards.length}
                        total={effectiveCards.length}
                    />
                    <div className="px-4 pb-6 pt-10 sm:px-6">
                        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 py-10">
                            <Spinner size="lg" />
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.review.stats.savingLabel")}
                            </Typography>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cn("flex w-full flex-col", className)}>
                    {/* shared header: WorkSessionHeader (current card's OWN deck as identity +
                        counter + progress segments), same shell as FlashcardReviewer/QuizSession
                        (thầy 2026-07-11: "đồng bộ UI, đều render navbar" + "render ra which deck
                        ... có đang due hay không"). Identity changes PER CARD here (a due batch
                        spans multiple decks) — the "Đến hạn" chip marks this as the cross-deck
                        kind, mirroring `FlashcardReviewer`'s level/tag chips slot. `title` disambiguates
                        this mode from FlashcardReviewer/QuizSession sharing the exact same shell
                        (thầy 2026-07-12: "2 cái trang này y chang nhau"). No confirm modal
                        on back (thầy 2026-07-09: "sao không có kết thúc sớm, trở về"): each grade
                        is saved immediately via `reviewFlashcard`, AND the batch/position itself
                        is persisted too (`syncFlashcardDueReviewSessionProgress`) — leaving
                        mid-run loses nothing, resumes exactly where it left off. */}
                    <WorkSessionHeader
                        backLabel={t("flashcard.exit")}
                        onBack={onExit}
                        title={t("flashcard.mode.due")}
                        identity={card ? { name: card.deckTitle } : undefined}
                        counter={t("flashcard.cardProgress", {
                            current: currentIndex + 1,
                            total: effectiveCards.length,
                        })}
                        // `current` = the VIEWED card (→ accent/pink follows what
                        // you're looking at); the green/done state is per-card via
                        // `doneSet={gradedIndexes}` so a card graded out of order
                        // (free-nav jump-ahead → grade → jump-back) still reads green
                        // regardless of where the cursor is (2026-07-12, thầy: free-
                        // nav "cả trước và sau"). Every segment is clickable
                        // (`onSegmentClick`), and "Kết thúc" ends the run explicitly.
                        current={currentIndex}
                        total={effectiveCards.length}
                        doneSet={Array.from(gradedIndexes)}
                        onSegmentClick={goToIndex}
                        onFinish={onFinish}
                        finishLabel={t("flashcard.finish")}
                    />

                    <div className="px-4 pb-6 pt-10 sm:px-6">
                        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                            {/* the flip card: prompt → answer; the level/tag chips ride under
                                the QUESTION via `belowFront` (thầy 2026-07-13: "chip gap-3 ở
                                dưới câu hỏi" + "due render chip label giống bên deck") — same
                                per-card level+tag chips as `FlashcardReviewer`, NOT the old
                                generic "Đến hạn" chip (the header title already says "Ôn thẻ
                                đến hạn"). */}
                            <FlipCard
                                revealed={revealed}
                                questionLabel={t("flashcard.questionLabel")}
                                answerLabel={t("flashcard.answerLabel")}
                                front={<MarkdownContent markdown={card?.front ?? ""} />}
                                belowFront={card && (card.level || (card.tags?.length ?? 0) > 0) ? (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {card.level ? (
                                            <Chip size="sm" variant="soft" color={LEVEL_COLOR[card.level] ?? "default"}>
                                                {t(`flashcard.level.${card.level}`)}
                                            </Chip>
                                        ) : null}
                                        {card.tags?.map((tag) => (
                                            <Chip key={tag} size="sm" variant="soft" color="default">
                                                {tag}
                                            </Chip>
                                        ))}
                                    </div>
                                ) : undefined}
                                back={<MarkdownContent markdown={card?.back ?? ""} arcSections />}
                            />

                            {/* reveal first, then grade recall (which advances) */}
                            {revealed ? (
                                <div className="flex flex-col gap-3">
                                    <Label>{t("flashcard.review.rateHint")}</Label>
                                    <RatingBar
                                        options={ratingOptions}
                                        onRate={(grade) => void onRate(grade)}
                                        isPending={reviewing}
                                    />
                                </div>
                            ) : (
                                // "Xem đáp án" (primary, lấp hết chỗ trống còn lại) · "Tiếp"/"Trước"
                                // ICON-ONLY (caret, không text) — mirrors `FlashcardReviewer` y hệt
                                // (thầy 2026-07-13, devtools, đổi lần 3). `flex` + `flex-1` thay `grid`
                                // cột cố định (chỉ primary co giãn). gap-2.
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* KHÔNG expand full-width trên desktop — hug-content, nằm bên trái
                                        cùng 2 nút caret (thầy 2026-07-13: "tất cả nằm bên trái, không
                                        expand trừ khi card nhỏ"). `w-full` chỉ dưới `sm:` (mobile, tap
                                        target rộng hơn dễ bấm), `sm:w-auto` trở lên hug-content. */}
                                    <Button size="sm" variant="primary" className="w-full sm:w-auto" onPress={() => setRevealed(true)}>
                                        {t("flashcard.showAnswer")}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        isIconOnly
                                        isDisabled={isFirst}
                                        aria-label={t("flashcard.previous")}
                                        onPress={goPrev}
                                    >
                                        <CaretLeftIcon className="size-4" aria-hidden focusable="false" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        isIconOnly
                                        isDisabled={isLast}
                                        aria-label={t("flashcard.next")}
                                        onPress={goNext}
                                    >
                                        <CaretRightIcon className="size-4" aria-hidden focusable="false" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AsyncContent>
    )
}
