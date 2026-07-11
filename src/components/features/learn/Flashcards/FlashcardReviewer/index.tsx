"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { Button, Chip, Spinner, Typography, cn } from "@heroui/react"
import { LockIcon } from "@phosphor-icons/react"
import { useTranslations, useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { SM2_GRADES } from "../constants"
import { FlashcardReviewerSkeleton } from "./FlashcardReviewerSkeleton"
import { FlashcardSessionStats } from "../FlashcardSessionStats"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { mutateReviewFlashcard } from "@/modules/api/graphql/mutations/mutation-review-flashcard"
import { queryFlashcardDeck } from "@/modules/api/graphql/queries/query-flashcard-deck"
import { type FlashcardCardEntity } from "@/modules/types/entities/flashcard-card"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { WorkSessionHeader } from "@/components/blocks/navigation/WorkSessionHeader"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { RatingBar } from "@/components/blocks/buttons/RatingBar"
import { useAppSelector } from "@/redux/hooks"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { pathConfig } from "@/resources/path"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { useMutateStartFlashcardReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardReviewSessionSwr"
import { useMutateSyncFlashcardReviewSessionProgressSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSyncFlashcardReviewSessionProgressSwr"
import { useMutateCompleteFlashcardReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCompleteFlashcardReviewSessionSwr"
import { useQueryMyInProgressFlashcardReviewSessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInProgressFlashcardReviewSessionSwr"

/** Props for {@link FlashcardReviewer}. */
export interface FlashcardReviewerProps extends WithClassNames<undefined> {
    /** Deck id being reviewed. */
    deckId: string
    /**
     * Present when reached via the dedicated, resumable
     * `flashcards/review/decks/[deckId]/sessions/[sessionId]` route — this
     * component then hydrates straight from THAT session (no resolve-or-start
     * call) instead of resolving one itself. Absent when reached via the bare
     * `.../decks/[deckId]` route (thầy 2026-07-11 đính chính: "để lưu lại phiên
     * ôn" — that bare route is now a RESOLVE-ONLY shim: it resolves-or-starts a
     * session then `router.push`es into the sessioned URL, mirroring
     * `QuizSession`'s `startSession` → `router.push` idiom). Mirrors
     * `QuizSessionProps.resumeSessionId`.
     */
    sessionId?: string
    /** Returns to the study overview (due + mastery + deck list). Passed straight
     *  through as `WorkSessionHeader`'s `onBack` (mirrors `QuizSession`'s own
     *  `exitToSetup` — thầy 2026-07-09: "cả 2 phần review và quiz đều không có
     *  nút back về"). */
    onBack?: () => void
}

/** HeroUI Chip color per quiz seniority level. */
const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "accent"> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/**
 * Spaced-repetition reviewer over one deck. One card at a time: the Markdown
 * question on the front, flipped to reveal the model answer plus optional depth,
 * then graded for recall (Again / Hard / Good / Easy) — each grade reschedules the
 * card via `reviewFlashcard` (SM-2) and advances. Previous steps back to re-grade;
 * a summary closes the run. Data states go through {@link AsyncContent}.
 * @param props - {@link FlashcardReviewerProps}
 */
export const FlashcardReviewer = ({ deckId, sessionId, className, onBack }: FlashcardReviewerProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const runGraphQL = useGraphQLWithToast()
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
    // true while the completeSession mutation is in flight — a brief "saving"
    // state between the last card and the stats recap.
    const [completing, setCompleting] = useState(false)

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

    // cards in display order
    const cards = useMemo<Array<FlashcardCardEntity>>(
        () => [...(data?.cards ?? [])].sort((prev, next) => prev.sortIndex - next.sortIndex),
        [data?.cards],
    )

    // ── resumable review session (2026-07-09: "đều lưu session lại để build
    // stats" — mirrors QuizSession's own start/sync/complete/resume wiring,
    // scoped to this ONE deck instead of the whole course) ──────────────────
    const runStartSession = useMutateStartFlashcardReviewSessionSwr()
    const runSyncSession = useMutateSyncFlashcardReviewSessionProgressSwr()
    const runCompleteSession = useMutateCompleteFlashcardReviewSessionSwr()
    const inProgressSessionSwr = useQueryMyInProgressFlashcardReviewSessionSwr(deckId, courseId)
    // the server-issued session id — a ref (not state) since it never drives a render
    const sessionIdRef = useRef<string | null>(null)
    // guards the mount-time resume/start effect so it runs at most once per deck
    const initAttemptedRef = useRef(false)
    // guards `completeFlashcardReviewSession` so a re-render at `done` never double-fires it
    const completedRef = useRef(false)

    // once the deck's cards AND the in-progress check have both settled — TWO
    // routes into this component (2026-07-11 đính chính: "để lưu lại phiên ôn"):
    // (a) reached via the dedicated `.../decks/[deckId]/sessions/[sessionId]`
    //     route (`sessionId` prop set) → hydrate straight from THAT session
    //     (no start call); a stale/invalid id (expired past 24h, or bogus) falls
    //     back to (b) below instead of getting stuck.
    // (b) reached via the bare `.../decks/[deckId]` route (`sessionId` absent)
    //     → this is now a RESOLVE-ONLY shim: resume the caller's existing draw
    //     if one exists, otherwise start a fresh one, THEN `router.push` into
    //     the sessioned URL — mirrors `QuizSession`'s own `startSession` →
    //     `router.push` idiom. Never renders the live reviewer itself; `done`
    //     stays false the whole time (`AsyncContent`'s `isLoading` gate below
    //     covers this branch), so only the skeleton ever shows here.
    // start a fresh session + redirect into its sessioned URL — used by the
    // resolve effect (2 branches below). Routed through
    // `runGraphQL` (toast on failure, no success toast — best-effort/silent
    // success) instead of a bare `.catch(() => {})` (thầy 2026-07-11: "fe
    // không nuốt lỗi, dùng runGraphQL đi") — a failed start now surfaces to
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
                // the live URL carries ONLY the sessionId, no `?deckId=` (thầy
                // 2026-07-11: "bỏ deck đi, only session thôi" — no more `decks/<id>`
                // path segment either; `review/sessions/[sessionId]` is shared with
                // `DueReview`). `Flashcards` resolves deck identity back out via
                // `myFlashcardReviewSessionBySessionId` — the session already
                // persists it, no query hint needed.
                router.push(`${redirectBase}/sessions/${freshId}`)
            }
        },
        [cards, deckId, courseHeaders, runStartSession, runGraphQL, router, t],
    )

    useEffect(() => {
        if (
            initAttemptedRef.current
            || cards.length === 0
            || inProgressSessionSwr.isLoading
            || !courseHeaders
        ) {
            return
        }
        initAttemptedRef.current = true
        const resumable = inProgressSessionSwr.data

        if (sessionId) {
            if (resumable && resumable.sessionId === sessionId) {
                sessionIdRef.current = sessionId
                setCurrentIndex(Math.min(resumable.currentIndex, cards.length - 1))
                setReviewedCount(resumable.reviewedCount)
                return
            }
            // stale/invalid session id — start a fresh one and correct the URL,
            // same as the no-`sessionId` branch below.
            void startSessionAndRedirect(pathname.replace(/\/sessions\/.+$/, ""))
            return
        }

        if (resumable) {
            sessionIdRef.current = resumable.sessionId
            setCurrentIndex(Math.min(resumable.currentIndex, cards.length - 1))
            setReviewedCount(resumable.reviewedCount)
            // strip any existing `/sessions/<id>` so we never append a second
            // one (the `.../sessions/A//sessions/B` revisit crash); replace, not
            // push, so the stale URL doesn't linger in history.
            router.replace(`${pathname.replace(/\/sessions\/.+$/, "")}/sessions/${resumable.sessionId}`)
            return
        }
        void startSessionAndRedirect(pathname.replace(/\/sessions\/.+$/, ""))
    }, [cards, sessionId, courseHeaders, inProgressSessionSwr.isLoading, inProgressSessionSwr.data, router, pathname, startSessionAndRedirect])

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

    /** Open the course page so the viewer can enrol to unlock premium cards. */
    const onUnlock = useCallback(() => {
        router.push(pathConfig().locale(locale).course(courseDisplayId).build())
    }, [router, locale, courseDisplayId])
    // past the last card → the run is complete
    const done = cards.length > 0 && currentIndex >= cards.length

    // step back to re-grade an earlier card (always on its question side)
    const goPrev = () => {
        setRevealed(false)
        setCurrentIndex((index) => Math.max(index - 1, 0))
    }

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
                const nextReviewedCount = reviewedCount + 1
                const nextIndex = currentIndex + 1
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
                    )
                }
            }
        },
        [card, runGraphQL, t, reviewedCount, currentIndex, courseHeaders, runSyncSession],
    )

    // the run just finished (past the last card) — close out the persisted
    // session ONCE so `myFlashcardReviewHistory`/`myFlashcardReviewStats` can
    // read it; guarded so a re-render at `done` never double-fires it. Routed
    // through `runGraphQL` (thầy 2026-07-11: "fe không nuốt lỗi, dùng
    // runGraphQL đi") instead of a silent catch.
    useEffect(() => {
        if (!done || completedRef.current || !sessionIdRef.current || !courseHeaders) {
            return
        }
        completedRef.current = true
        setCompleting(true)
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
            // hand off to the stats recap once the session is closed out (the recap
            // reads events by sessionId, independent of the session row's status).
            setCompleting(false)
        })()
    }, [done, reviewedCount, courseHeaders, runCompleteSession, runGraphQL, t])

    // the session this run persisted to — snapshotted into a local so TS can
    // narrow it (a ref's `.current` never narrows) before handing it to the stats
    // recap, and so the recap has a stable id for the whole `done` render.
    const finishedSessionId = sessionIdRef.current

    return (
        <AsyncContent
            // no `sessionId` prop = the resolve-only shim (bare `review?deckId=<id>`
            // route) — ALWAYS the skeleton, never error/empty/live UI; it
            // `router.replace`s into the sessioned URL as soon as resolving lands
            // (effect above). `AsyncContent` checks `error` BEFORE `isLoading`
            // (bug fixed 2026-07-11: gate `error`/`isEmpty` on `sessionId` too, not
            // just `isLoading` — a genuine deck-query error used to leak through
            // as "chưa có Flashcards" on the shim even while still resolving).
            isLoading={!sessionId || ((isLoading || !data) && cards.length === 0)}
            skeleton={<FlashcardReviewerSkeleton />}
            isEmpty={Boolean(sessionId) && cards.length === 0}
            emptyContent={{ title: t("flashcard.empty") }}
            error={sessionId && cards.length === 0 ? error : undefined}
            errorContent={{
                title: t("flashcard.empty"),
                onRetry: () => { void mutate() },
            }}
        >
            {done ? (
                !completing && finishedSessionId && courseId && courseDisplayId ? (
                    // the completion screen IS the stats recap now (no flat "done" card) —
                    // 4-grade distribution + weak tags + the study-again loop back in.
                    <FlashcardSessionStats
                        className={className}
                        sessionId={finishedSessionId}
                        courseId={courseId}
                        courseDisplayId={courseDisplayId}
                        onBack={onBack ?? (() => {})}
                    />
                ) : (
                    // brief "saving" state while completeSession commits — mirrors the
                    // stats surface's own header so the hand-off reads as one screen.
                    <div className={cn("flex flex-col gap-6", className)}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <BackLink label={t("flashcard.title")} onPress={onBack ?? (() => {})} />
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
                    {/* shared header: WorkSessionHeader (deck identity + card counter +
                        level/tag meta chips inline + progress segments) — same shell as
                        QuizSession's "Hỏi nhanh" (thầy 2026-07-11: "ôn thẻ giao diện y
                        chang"). Level/tag folded INTO the header row, no separate row below. */}
                    <WorkSessionHeader
                        backLabel={t("flashcard.title")}
                        onBack={onBack ?? (() => {})}
                        identity={data?.title ? { name: data.title } : undefined}
                        counter={t("flashcard.cardProgress", {
                            current: currentIndex + 1,
                            total: cards.length,
                        })}
                        current={currentIndex}
                        total={cards.length}
                        meta={card && (card.level || (card.tags?.length ?? 0) > 0) ? (
                            <>
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
                            </>
                        ) : undefined}
                    />

                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                        {/* the flip card: question → answer (+ optional depth) */}
                        <FlipCard
                            revealed={revealed}
                            questionLabel={t("flashcard.questionLabel")}
                            answerLabel={t("flashcard.answerLabel")}
                            front={<MarkdownContent markdown={card?.question ?? ""} />}
                            back={
                                <>
                                    {isLocked ? (
                                    // premium card, viewer not enrolled → withhold the answer
                                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                                            <LockIcon aria-hidden focusable="false" className="size-8 text-muted" />
                                            <Typography type="body-sm" weight="semibold">
                                                {t("flashcard.premiumLockedTitle")}
                                            </Typography>
                                            <Typography type="body-xs" color="muted">
                                                {t("flashcard.premiumLockedHint")}
                                            </Typography>
                                        </div>
                                    ) : (
                                        <>
                                            {card?.answer ? (
                                                <MarkdownContent markdown={card.answer} arcSections />
                                            ) : (
                                                <Typography type="body-sm" color="muted">
                                                    {t("flashcard.noAnswer")}
                                                </Typography>
                                            )}
                                            {card?.explanation ? (
                                                <MarkdownContent markdown={card.explanation} />
                                            ) : null}
                                        </>
                                    )}
                                </>
                            }
                        />

                        {/* reveal first, then grade recall (which advances) — unless the card is
                        locked premium, where we surface an enrol CTA instead of grading */}
                        {revealed && isLocked ? (
                            <div className="flex justify-center">
                                <Button size="sm" variant="primary" onPress={onUnlock}>
                                    {t("flashcard.premiumCta")}
                                </Button>
                            </div>
                        ) : revealed ? (
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
