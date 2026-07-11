"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { Button, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, CheckCircleIcon, CursorClickIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { DUE_REVIEW_LIMIT, SM2_GRADES } from "../constants"
import { DueReviewSkeleton } from "./DueReviewSkeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { mutateReviewFlashcard } from "@/modules/api/graphql/mutations/mutation-review-flashcard"
import { queryMyDueFlashcards } from "@/modules/api/graphql/queries/query-my-due-flashcards"
import type { QueryMyDueFlashcardData } from "@/modules/api/graphql/queries/types/my-due-flashcards"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
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
}

/**
 * The spaced-repetition (SM-2) review session over the viewer's due cards, drawn
 * across every enrolled course. One card at a time: flip to reveal the answer,
 * then grade recall (Again / Hard / Good / Easy) — each grade reschedules the card
 * via `reviewFlashcard` and advances. A session summary closes the run. The due
 * count is the page's primary loop, so this is the main entry from the home hero.
 * @param props - {@link DueReviewProps}
 */
export const DueReview = ({ onExit, className }: DueReviewProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const runGraphQL = useGraphQLWithToast()
    const { mutate: globalMutate } = useSWRConfig()
    // scope the due queue to THIS course; shared SWR key with the hero (DueReviewHero)
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // course-loop handoff: after clearing due cards, the next rung is a mock interview
    // (enrolled-only). `enrollKnown` gates the flicker before the status query settles.
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)
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

    // the due queue (count + first batch of cards), shared key with the hero
    const { data, isLoading, error, mutate } = useSWR(dueKey, async () => {
        const response = await queryMyDueFlashcards({ request: { courseId, limit: DUE_REVIEW_LIMIT } })
        return response.data?.myDueFlashcards.data ?? null
    })

    const cards = data?.cards ?? []

    // session-persistence (mirrors QuizSession's resumable-session idiom, scoped
    // cross-deck by enrollment only — no deckId, unlike the single-deck reviewer):
    // each rating is already saved immediately via `reviewFlashcard` (safe), but
    // WHICH batch/position within it was not persisted, so leaving mid-batch used
    // to lose the in-batch progress. `startFlashcardDueReviewSession` /
    // `syncFlashcardDueReviewSessionProgress` / `completeFlashcardDueReviewSession`
    // wrap that sequence with a resumable cursor, silently (no new UI/route).
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

    // resolve-or-start, once the batch + the in-progress query have both settled:
    // a matching resumable session hydrates `currentIndex`/`reviewedCount` and
    // reorders the batch to the session's own persisted `cardIds` (never a fresh
    // random draw); otherwise a fresh session is started for the batch just drawn.
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
        if (resumeData) {
            const cardById = new Map(cards.map((dueCard) => [dueCard.cardId, dueCard]))
            const ordered = resumeData.cardIds
                .map((cardId) => cardById.get(cardId))
                .filter((dueCard): dueCard is QueryMyDueFlashcardData => Boolean(dueCard))
            if (ordered.length > 0) {
                sessionIdRef.current = resumeData.sessionId
                setResumedCards(ordered)
                setCurrentIndex(Math.min(resumeData.currentIndex, ordered.length - 1))
                setReviewedCount(resumeData.reviewedCount)
                completedRef.current = false
                return
            }
        }
        // no resumable session (or none of its cards still match the batch) —
        // persist a fresh draw so it becomes resumable going forward.
        void runStartSession
            .trigger({
                request: { courseId, cardIds: cards.map((dueCard) => dueCard.cardId) },
                headers: courseHeaders as GraphQLHeaders,
            })
            .then((started) => {
                sessionIdRef.current = started.data?.startFlashcardDueReviewSession.data?.sessionId ?? null
            })
            .catch(() => {})
    }, [courseId, cards, inProgressSessionSwr.isLoading, inProgressSessionSwr.data, runStartSession, courseHeaders])

    // finish: record the finished batch once (guarded), best-effort — a failed
    // complete call only means the row stays "in_progress" (still resumable),
    // it never blocks the learner from leaving.
    useEffect(() => {
        if (!done || completedRef.current || !sessionIdRef.current) {
            return
        }
        completedRef.current = true
        void runCompleteSession
            .trigger({
                request: { sessionId: sessionIdRef.current, reviewedCount, xpEarned: 0 },
                headers: courseHeaders as GraphQLHeaders,
            })
            .catch(() => {})
    }, [done, reviewedCount, runCompleteSession, courseHeaders])

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
                        request: { cardId: card.cardId, grade },
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
                // advancing to the next card; a failed sync only degrades resumability
                if (sessionIdRef.current) {
                    void runSyncSession
                        .trigger({
                            request: {
                                sessionId: sessionIdRef.current,
                                currentIndex: nextIndex,
                                reviewedCount: nextReviewedCount,
                                xpEarned: 0,
                            },
                            headers: courseHeaders as GraphQLHeaders,
                        })
                        .catch(() => {})
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

    return (
        <AsyncContent
            isLoading={isLoading && !data}
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
                <EmptyState
                    icon={<CheckCircleIcon aria-hidden focusable="false" />}
                    title={t("flashcard.review.sessionDoneTitle")}
                    description={t("flashcard.review.sessionDoneDescription", { count: reviewedCount })}
                    action={
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {/* cross-track NUDGE (flashcards feed no pillar; interview feeds the
                                30% pillar) — keep it a quiet `secondary`, not a loud accent primary,
                                so it reads as "you could also…" not the forced next step. */}
                            {enrollKnown && enrolled && courseDisplayId ? (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onPress={() => router.push(
                                        pathConfig().locale(locale).course(courseDisplayId).learn().mockInterview().build(),
                                    )}
                                >
                                    {t("flashcard.review.mockInterviewCta")}
                                    <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                </Button>
                            ) : null}
                            <Button
                                size="sm"
                                variant={enrollKnown && enrolled ? "tertiary" : "primary"}
                                onPress={onFinish}
                            >
                                {t("flashcard.review.backToHome")}
                            </Button>
                        </div>
                    }
                />
            ) : (
                <div className={cn("flex flex-col gap-6", className)}>
                    {/* back out early — no confirm modal needed (thầy 2026-07-09: "sao không
                        có kết thúc sớm, trở về"): each grade is saved immediately via
                        `reviewFlashcard`, AND (2026-07-11) the batch/position itself is now
                        persisted too (`syncFlashcardDueReviewSessionProgress`) — leaving
                        mid-run loses nothing, resumes exactly where it left off. */}
                    <BackLink target={t("flashcard.title")} onPress={onExit} />

                    <div className="flex flex-col gap-3">
                        {/* progress through this batch */}
                        <ProgressMeter
                            value={currentIndex + 1}
                            max={effectiveCards.length}
                            label={t("flashcard.cardProgress", {
                                current: currentIndex + 1,
                                total: effectiveCards.length,
                            })}
                        />

                        {/* which deck this card belongs to (cards span all courses) — bumped
                            to a readable weight so it reads as the deck's NAME, not a stray
                            caption (thầy: "hiển thị cái tên deck ra ở đây"). */}
                        {card ? (
                            <Typography type="body-sm" weight="medium">
                                {card.deckTitle}
                            </Typography>
                        ) : null}
                    </div>

                    {/* the flip card: prompt → answer */}
                    <FlipCard
                        revealed={revealed}
                        onToggle={() => setRevealed((flipped) => !flipped)}
                        ariaLabel={revealed ? t("flashcard.showQuestion") : t("flashcard.showAnswer")}
                        frontHint={
                            <>
                                <CursorClickIcon className="size-3.5" aria-hidden focusable="false" />
                                {t("flashcard.flipHint")}
                            </>
                        }
                        backHint={
                            <>
                                <CursorClickIcon className="size-3.5" aria-hidden focusable="false" />
                                {t("flashcard.flipBackHint")}
                            </>
                        }
                        front={
                            <>
                                <Typography type="body-xs" weight="medium" color="muted">
                                    {t("flashcard.questionLabel")}
                                </Typography>
                                <MarkdownContent markdown={card?.front ?? ""} />
                            </>
                        }
                        back={
                            <>
                                <Typography type="body-xs" weight="medium" color="muted">
                                    {t("flashcard.answerLabel")}
                                </Typography>
                                <MarkdownContent markdown={card?.back ?? ""} />
                            </>
                        }
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
                        <Button size="sm" variant="outline" onPress={() => setRevealed(true)}>
                            {t("flashcard.showAnswer")}
                        </Button>
                    )}
                </div>
            )}
        </AsyncContent>
    )
}
