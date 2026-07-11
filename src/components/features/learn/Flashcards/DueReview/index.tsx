"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { Button, Chip, Spinner, Typography, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { DUE_REVIEW_LIMIT, SM2_GRADES } from "../constants"
import { DueReviewSkeleton } from "./DueReviewSkeleton"
import { FlashcardSessionStats } from "../FlashcardSessionStats"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { mutateReviewFlashcard } from "@/modules/api/graphql/mutations/mutation-review-flashcard"
import { queryMyDueFlashcards } from "@/modules/api/graphql/queries/query-my-due-flashcards"
import type { QueryMyDueFlashcardData } from "@/modules/api/graphql/queries/types/my-due-flashcards"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { WorkSessionHeader } from "@/components/blocks/navigation/WorkSessionHeader"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { RatingBar } from "@/components/blocks/buttons/RatingBar"
import { useMutateStartFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardDueReviewSessionSwr"
import { useMutateSyncFlashcardDueReviewSessionProgressSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSyncFlashcardDueReviewSessionProgressSwr"
import { useMutateCompleteFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCompleteFlashcardDueReviewSessionSwr"
import { useQueryMyInProgressFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInProgressFlashcardDueReviewSessionSwr"
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
    // owning course slug — the finished-session stats surface uses it to deep-link
    // study suggestions (RAG) back into the course.
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
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
    // true while the completeSession mutation is in flight — shows a brief
    // "saving" state between the last card and the stats recap.
    const [completing, setCompleting] = useState(false)

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
    const inProgressSessionSwr = useQueryMyInProgressFlashcardDueReviewSessionSwr(courseId)
    // when a resumable session is found, the fetched due batch is reordered/filtered
    // to match its persisted `cardIds` (never re-drawn) — null while resuming didn't
    // apply (fresh draw, or no resumable session), in which case the raw fetched
    // `cards` above is used as-is.
    const [resumedCards, setResumedCards] = useState<Array<QueryMyDueFlashcardData> | null>(null)
    // server-issued id for the current batch — set once on start OR resume
    const sessionIdRef = useRef<string | null>(null)
    // guards the one-shot resolve-or-start effect to run at most once per mount
    const resolveAttemptedRef = useRef(false)
    // guards the one-shot completion call on reaching `done`
    const completedRef = useRef(false)

    const effectiveCards = resumedCards ?? cards
    const card = effectiveCards[currentIndex]
    // past the last card → the session is complete
    const done = effectiveCards.length > 0 && currentIndex >= effectiveCards.length

    /** Hydrate from an in-progress session's persisted batch/cursor; false if none of its cards still match. */
    const applyResume = useCallback(
        (resumeData: NonNullable<typeof inProgressSessionSwr.data>): boolean => {
            const cardById = new Map(cards.map((dueCard) => [dueCard.cardId, dueCard]))
            const ordered = resumeData.cardIds
                .map((cardId) => cardById.get(cardId))
                .filter((dueCard): dueCard is QueryMyDueFlashcardData => Boolean(dueCard))
            if (ordered.length === 0) {
                return false
            }
            sessionIdRef.current = resumeData.sessionId
            setResumedCards(ordered)
            setCurrentIndex(Math.min(resumeData.currentIndex, ordered.length - 1))
            setReviewedCount(resumeData.reviewedCount)
            completedRef.current = false
            return true
        },
        [cards],
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
            || inProgressSessionSwr.isLoading
        ) {
            return
        }
        resolveAttemptedRef.current = true
        const resumeData = inProgressSessionSwr.data

        if (sessionId) {
            if (resumeData && resumeData.sessionId === sessionId && applyResume(resumeData)) {
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
    }, [sessionId, courseId, cards, inProgressSessionSwr.isLoading, inProgressSessionSwr.data, applyResume, startSessionAndRedirect, router, reviewBasePath])

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
        setCompleting(true)
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
            // saving state and hand off to the stats recap (which reads events
            // directly by sessionId, independent of the session row's status).
            setCompleting(false)
        })()
    }, [done, reviewedCount, runCompleteSession, courseHeaders, runGraphQL, t])

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
                const nextIndex = currentIndex + 1
                const nextReviewedCount = reviewedCount + 1
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
                    )
                }
            }
        },
        [card, runGraphQL, t, currentIndex, reviewedCount, runSyncSession, courseHeaders],
    )

    // finish: refresh the due queue (count changed) and return home
    const onFinish = useCallback(() => {
        void globalMutate(dueKey)
        onExit()
    }, [globalMutate, onExit, dueKey])

    // step back to re-see an earlier card (question side; no re-grade) — mirrors
    // `FlashcardReviewer`'s own `goPrev` (thầy: đồng bộ UI, cả 2 loại phiên đều
    // có nút "Trước", ảnh due-review trước đó thiếu nút này).
    const isFirst = currentIndex === 0
    const goPrev = useCallback(() => {
        setRevealed(false)
        setCurrentIndex((index) => Math.max(index - 1, 0))
    }, [])

    // the session this batch persisted to — snapshotted into a local so TS can
    // narrow it (a ref's `.current` never narrows) before the stats recap.
    const finishedSessionId = sessionIdRef.current

    return (
        <AsyncContent
            // forced loading while the bare `?session=due` shim resolves-or-starts a
            // session and redirects (mirrors `FlashcardReviewer`'s own `!sessionId` gate)
            // — but only when there IS a batch to redirect with; an empty batch (no due
            // cards) must still fall through to `isEmpty` below instead of spinning forever.
            isLoading={(isLoading && !data) || (!sessionId && cards.length > 0)}
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
                !completing && finishedSessionId && courseId && courseDisplayId ? (
                    // the completion screen IS the stats recap now (no flat "done" card,
                    // no interview nudge) — 4-grade distribution + weak tags + study loop.
                    <FlashcardSessionStats
                        className={className}
                        sessionId={finishedSessionId}
                        courseId={courseId}
                        courseDisplayId={courseDisplayId}
                        onBack={onFinish}
                    />
                ) : (
                    // brief "saving" state while completeSession commits — mirrors the
                    // stats surface's own header so the hand-off reads as one screen.
                    <div className={cn("flex flex-col gap-6", className)}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <BackLink label={t("flashcard.title")} onPress={onExit} />
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.review.stats.headerCaption")}
                            </Typography>
                        </div>
                        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 py-10">
                            <Spinner size="lg" />
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.review.stats.savingLabel")}
                            </Typography>
                        </div>
                    </div>
                )
            ) : (
                <div className={cn("flex flex-col gap-6", className)}>
                    {/* shared header: WorkSessionHeader (current card's OWN deck as identity +
                        counter + progress segments), same shell as FlashcardReviewer/QuizSession
                        (thầy 2026-07-11: "đồng bộ UI, đều render navbar" + "render ra which deck
                        ... có đang due hay không"). Identity changes PER CARD here (a due batch
                        spans multiple decks) — the "Đến hạn" chip marks this as the cross-deck
                        kind, mirroring `FlashcardReviewer`'s level/tag chips slot. No confirm modal
                        on back (thầy 2026-07-09: "sao không có kết thúc sớm, trở về"): each grade
                        is saved immediately via `reviewFlashcard`, AND the batch/position itself
                        is persisted too (`syncFlashcardDueReviewSessionProgress`) — leaving
                        mid-run loses nothing, resumes exactly where it left off. */}
                    <WorkSessionHeader
                        backLabel={t("flashcard.title")}
                        onBack={onExit}
                        identity={card ? { name: card.deckTitle } : undefined}
                        counter={t("flashcard.cardProgress", {
                            current: currentIndex + 1,
                            total: effectiveCards.length,
                        })}
                        current={currentIndex}
                        total={effectiveCards.length}
                        meta={<Chip size="sm" variant="soft" color="warning">{t("flashcard.due.label")}</Chip>}
                    />

                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                        {/* the flip card: prompt → answer */}
                        <FlipCard
                            revealed={revealed}
                            questionLabel={t("flashcard.questionLabel")}
                            answerLabel={t("flashcard.answerLabel")}
                            front={<MarkdownContent markdown={card?.front ?? ""} />}
                            back={<MarkdownContent markdown={card?.back ?? ""} arcSections />}
                        />

                        {/* reveal first, then grade recall (which advances) */}
                        {revealed ? (
                            <div className="flex flex-col gap-2">
                                <Typography type="body-xs" color="muted" align="center">
                                    {t("flashcard.review.rateHint")}
                                </Typography>
                                <RatingBar
                                    options={ratingOptions}
                                    onRate={(grade) => void onRate(grade)}
                                    isPending={reviewing}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    isDisabled={isFirst}
                                    onPress={goPrev}
                                >
                                    {t("flashcard.previous")}
                                </Button>
                                <Button size="sm" variant="outline" onPress={() => setRevealed(true)}>
                                    {t("flashcard.showAnswer")}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AsyncContent>
    )
}
