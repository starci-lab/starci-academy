"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { Button, Card, CardContent, Chip, Label, ScrollShadow, Typography, cn } from "@heroui/react"
import {
    ArrowRightIcon,
    CheckCircleIcon,
    CursorClickIcon,
    FlameIcon,
    LightningIcon,
    LockKeyIcon,
    MicrophoneStageIcon,
    StackIcon,
    XCircleIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { SM2_GRADES } from "../constants"
import { InterviewSessionSkeleton } from "./InterviewSessionSkeleton"
import { parseAnswerKeywords } from "./parse-answer-keywords"
import { buildCloze, type ClozeQuestion } from "./build-cloze"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { mutateReviewFlashcard } from "@/modules/api/graphql/mutations/mutation-review-flashcard"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql/queries/query-flashcard-decks-by-course"
import { queryFlashcardDeck } from "@/modules/api/graphql/queries/query-flashcard-deck"
import { type FlashcardCardEntity } from "@/modules/types/entities/flashcard-card"
import { type QuizSessionReadinessData, type QuizSessionWeakTagData } from "@/modules/api/graphql/mutations/types/complete-flashcard-quiz-session"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { Callout } from "@/components/blocks/feedback/Callout"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { MetricCard } from "@/components/blocks/stats/MetricCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { RatingBar } from "@/components/blocks/buttons/RatingBar"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useQueryMyWeeklyStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyWeeklyStatsSwr"
import { useMutateCompleteFlashcardQuizSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCompleteFlashcardQuizSessionSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { useAppSelector } from "@/redux/hooks"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { pathConfig } from "@/resources/path"

/** Props for {@link InterviewSession}. */
export interface InterviewSessionProps extends WithClassNames<undefined> {
    /** Course to draw quiz cards across (rendered only for enrolled viewers). */
    courseId: string
}

/**
 * The phases of one quick-quiz run. `setup` picks mode + level; `active` walks a
 * fixed set of cloze cards (fill blanks → check → read full answer → SM-2);
 * `recap` frames the result by mastery and grants XP.
 */
type QuizPhase = "setup" | "active" | "recap"

/** Practice modes — differ only in how many cards a session runs. */
type QuizMode = "quick" | "deep"

/** Question count per practice mode. */
const MODE_LENGTH: Record<QuizMode, number> = { quick: 5, deep: 10 }

/** Seniority levels offered at setup (mirrors the backend `FlashcardLevel` enum). */
const LEVELS = ["junior", "middle", "senior", "staff"] as const

/** HeroUI Chip color per interview seniority level (mirrors the reviewer). */
const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "accent"> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/** A card counts toward the combo when the learner fills at least this ratio of blanks correctly. */
const COMBO_COVERAGE_THRESHOLD = 0.6
/** SM-2 grade at/above which a card also keeps the combo alive (Good / Easy). */
const COMBO_GRADE_THRESHOLD = 2
/** XP awarded per blank filled correctly — the recap's local estimate. */
const XP_PER_CORRECT_BLANK = 2
/** XP for a fallback (no-cloze) card with a Good/Easy self-grade. */
const XP_PER_STRUCTURAL_CARD = 3

/** A card drawn into a session, carrying the fields the quiz needs. */
interface QuizCard extends FlashcardCardEntity {
    /** Key terms parsed from the answer (empty when the card has no chip block). */
    keywords: Array<string>
}

/** Per-card outcome recorded during `active`, aggregated in the recap AND sent to
 *  `completeFlashcardQuizSession` so the server re-derives coverage/XP itself. */
interface CardResult {
    /** The card this outcome belongs to (sent to the server for scoring + weak-tags). */
    cardId: string
    /** Ratio of blanks filled correctly (0..1), or null for a fallback card without a cloze. */
    coverageRatio: number | null
    /** Blanks filled correctly this card had (0 for a fallback card without a cloze). */
    correctBlanks: number
    /** Total cloze blanks this card had (0 for a fallback card without a cloze). */
    totalBlanks: number
    /** Whether the learner got the card fully right without a hint (mastery signal). */
    correct: boolean
    /** XP this card contributed to the local estimate. */
    xp: number
}

/** Fisher–Yates shuffle (returns a new array; interleaves cards across decks/tags). */
const shuffle = <T,>(input: Array<T>): Array<T> => {
    const array = [...input]
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

/**
 * "Hỏi nhanh" — a non-AI, self-graded, gamified flashcard cloze quiz over a
 * course. The learner picks a mode + level, then for each drawn card fills the
 * blanks (key terms the author marked) from a word bank of correct terms +
 * sibling-card distractors, checks the answer objectively, reads the full model
 * answer, and self-grades with SM-2 (which reschedules the card). A combo tracks
 * momentum; the recap frames the run by mastery and grants leaderboard XP once
 * per session. Data states go through {@link AsyncContent}.
 * @param props - {@link InterviewSessionProps}
 */
export const InterviewSession = ({ courseId, className }: InterviewSessionProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const runGraphQL = useGraphQLWithToast()
    // trial vs enrolled — drives the recap's Zone E enroll-upsell (primary for trial viewers)
    // and gates Zone D (AI Mock Interview cross-link, only relevant once actually enrolled).
    // Populated globally by `learn/layout.tsx` (`useQueryCourseEnrollmentStatusSwr`).
    const enrolled = useAppSelector((state) => state.user.enrolled)
    // `enrolled` defaults to false, so only trust it once the status query has settled —
    // otherwise a genuinely enrolled viewer would flash the trial-upsell (Zone E) on cold load.
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)
    const displayId = useAppSelector((state) => state.course.displayId)
    // quiz cards are enrolled-only → send the course header for the backend guard
    const courseHeaders = useMemo(
        () => ({ [GraphQLHeadersKey.XCourseId]: courseId }),
        [courseId],
    )

    // mastery ("Độ thuộc") + the pool of decks to draw cards from
    const decksSwr = useSWR(
        ["flashcard-decks-by-course", courseId],
        async () => {
            const response = await queryFlashcardDecksByCourse({
                request: { courseId },
                headers: courseHeaders,
            })
            return response.data?.flashcardDecksByCourse.data ?? null
        },
    )
    const decks = decksSwr.data

    // streak chip (rolling 7-day activity) — refreshed after a session grants XP
    const weeklyStatsSwr = useQueryMyWeeklyStatsSwr()
    const streak = weeklyStatsSwr.data?.streak ?? 0

    const runComplete = useMutateCompleteFlashcardQuizSessionSwr()

    // aggregate mastery across every deck of the course
    const { masteredSum, totalCards } = useMemo(() => {
        let mastered = 0
        let total = 0
        for (const deck of decks ?? []) {
            mastered += deck.masteredCount ?? 0
            total += deck.cards?.length ?? 0
        }
        return { masteredSum: mastered, totalCards: total }
    }, [decks])

    // ── session state ────────────────────────────────────────────────────
    const [phase, setPhase] = useState<QuizPhase>("setup")
    const [mode, setMode] = useState<QuizMode>("quick")
    const [level, setLevel] = useState<string | null>(null)
    // cards drawn for the current run
    const [sessionCards, setSessionCards] = useState<Array<QuizCard>>([])
    // zero-based index of the current card
    const [index, setIndex] = useState(0)
    // the learner's chosen term per blank (null = still empty)
    const [filled, setFilled] = useState<Array<string | null>>([])
    // true once the learner checked the filled cloze (locks it, reveals correctness)
    const [checked, setChecked] = useState(false)
    // true once the full model answer is revealed (after checking)
    const [showAnswer, setShowAnswer] = useState(false)
    // true while an SM-2 grade is in flight (blocks the rating bar)
    const [rating, setRating] = useState(false)
    // per-card outcomes gathered this run
    const [results, setResults] = useState<Array<CardResult>>([])
    // in-session combo (consecutive well-answered cards) + its peak
    const [combo, setCombo] = useState(0)
    const [bestCombo, setBestCombo] = useState(0)
    // true while building the session (fetching full deck cards)
    const [building, setBuilding] = useState(false)
    // client-generated id shared by this run → idempotent XP grant
    const sessionId = useRef<string | null>(null)
    // XP awarded by the backend for this run (shown in the recap)
    const [xpEarned, setXpEarned] = useState(0)
    // whether today's daily XP cap for this source clamped the grant (recap transparency note)
    const [dailyCapReached, setDailyCapReached] = useState(false)
    // weakest tags this session, ranked worst-first (recap Zone C demand-bridge)
    const [weakTags, setWeakTags] = useState<Array<QuizSessionWeakTagData>>([])
    // AI Mock Interview readiness signal (recap Zone D)
    const [readiness, setReadiness] = useState<QuizSessionReadinessData | null>(null)
    // guards the one-shot completion mutation on entering the recap
    const completedRef = useRef(false)

    const sessionLength = MODE_LENGTH[mode]

    // SM-2 grade buttons, localized for the rating bar
    const ratingOptions = useMemo(
        () => SM2_GRADES.map((grade) => ({ grade: grade.grade, label: t(grade.labelKey) })),
        [t],
    )

    // fetch the full cards of every deck, pool + filter + shuffle, then begin
    const startSession = useCallback(async () => {
        if (!decks || decks.length === 0) {
            return
        }
        setBuilding(true)
        setPhase("active")
        try {
            // fetch each deck's full cards in parallel, then pool them
            const deckPayloads = await Promise.all(
                decks.map(async (deck) => {
                    const response = await queryFlashcardDeck({
                        request: { flashcardDeckId: deck.id },
                        headers: courseHeaders,
                    })
                    return response.data?.flashcardDeck.data?.cards ?? []
                }),
            )
            const pool: Array<QuizCard> = deckPayloads
                .flat()
                // self-grading needs a model answer to compare against
                .filter((card) => Boolean(card.answer))
                // honour the chosen seniority level
                .filter((card) => level === null || card.level === level)
                .map((card) => ({ ...card, keywords: parseAnswerKeywords(card.answer ?? "") }))
            const drawn = shuffle(pool).slice(0, sessionLength)

            sessionId.current = crypto.randomUUID()
            setSessionCards(drawn)
            setIndex(0)
            setResults([])
            setCombo(0)
            setBestCombo(0)
            setXpEarned(0)
            setDailyCapReached(false)
            setWeakTags([])
            setReadiness(null)
            completedRef.current = false
        } finally {
            setBuilding(false)
        }
    }, [decks, level, sessionLength, courseHeaders])

    const card = sessionCards[index]

    // distractor pool: sibling cards' key terms, preferring the SAME tag (closer =
    // more plausible, à la Duolingo/Quizlet drawing from the session's own vocab)
    const distractorPool = useMemo(() => {
        if (!card) {
            return []
        }
        const others = sessionCards.filter((_, position) => position !== index)
        const sameTag = others.filter((other) =>
            (other.tags ?? []).some((tag) => (card.tags ?? []).includes(tag)),
        )
        const source = sameTag.length >= 2 ? sameTag : others
        return [...new Set(source.flatMap((other) => other.keywords))]
    }, [card, sessionCards, index])

    // the cloze for the current card (null → fall back to a plain flip + self-grade)
    const cloze = useMemo<ClozeQuestion | null>(
        () =>
            card
                ? buildCloze({
                    answer: card.answer ?? "",
                    distractorPool,
                })
                : null,
        [card, distractorPool],
    )

    // reset the per-card interaction whenever the card (hence its cloze) changes
    useEffect(() => {
        setFilled(cloze ? Array(cloze.blanks.length).fill(null) : [])
        setChecked(false)
        setShowAnswer(false)
    }, [cloze])

    // place a bank term into the first empty blank (ignored once checked / already used)
    const placeTerm = useCallback(
        (term: string) => {
            if (checked) {
                return
            }
            setFilled((current) => {
                if (current.includes(term)) {
                    return current
                }
                const slot = current.indexOf(null)
                if (slot === -1) {
                    return current
                }
                const next = [...current]
                next[slot] = term
                return next
            })
        },
        [checked],
    )

    // clear a filled blank (returns its term to the bank)
    const clearBlank = useCallback(
        (blankIndex: number) => {
            if (checked) {
                return
            }
            setFilled((current) => {
                const next = [...current]
                next[blankIndex] = null
                return next
            })
        },
        [checked],
    )

    // finalize the run: send the per-card breakdown so the server re-derives coverage/XP
    // itself (no client-trusted aggregate), grant XP once (idempotent), then show the recap
    const finish = useCallback(
        async (finalResults: Array<CardResult>) => {
            setPhase("recap")
            if (completedRef.current || !sessionId.current) {
                return
            }
            completedRef.current = true
            const answers = finalResults.map((result) => ({
                cardId: result.cardId,
                correctBlanks: result.correctBlanks,
                totalBlanks: result.totalBlanks,
            }))
            let awarded = 0
            await runGraphQL(
                async () => {
                    const response = await runComplete.trigger({
                        request: {
                            sessionId: sessionId.current as string,
                            courseId,
                            answers,
                        },
                        headers: courseHeaders,
                    })
                    const payload = response.data?.completeFlashcardQuizSession
                    awarded = payload?.data?.xpEarned ?? 0
                    setDailyCapReached(payload?.data?.dailyCapReached ?? false)
                    setWeakTags(payload?.data?.weakTags ?? [])
                    setReadiness(payload?.data?.readiness ?? null)
                    return (
                        payload ?? {
                            success: false,
                            message: t("flashcard.review.error"),
                        }
                    )
                },
                { showSuccessToast: false },
            )
            setXpEarned(awarded)
            if (awarded > 0) {
                // refresh the streak/XP chip now that this run counted
                void weeklyStatsSwr.mutate()
            }
        },
        [runComplete, runGraphQL, courseId, courseHeaders, t, weeklyStatsSwr],
    )

    // record the current card's outcome + combo, reschedule via SM-2, then advance
    const commitCard = useCallback(
        async (grade: number, coverageRatio: number | null) => {
            if (!card) {
                return
            }
            setRating(true)
            // a success toast per card would be noise — only surface failures
            const ok = await runGraphQL(
                async () => {
                    const response = await mutateReviewFlashcard({
                        request: { cardId: card.id, grade },
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
            setRating(false)
            if (!ok) {
                return
            }
            const correct = coverageRatio === 1 || (coverageRatio === null && grade >= COMBO_GRADE_THRESHOLD)
            const keptCombo =
                (coverageRatio !== null && coverageRatio >= COMBO_COVERAGE_THRESHOLD)
                || grade >= COMBO_GRADE_THRESHOLD
            // this card's raw blank counts — sent to the server, which re-derives coverage/XP
            // itself (no client-trusted aggregate); a fallback (no-cloze) card sends 0/0
            const totalBlanks = coverageRatio !== null ? (cloze?.blanks.length ?? 0) : 0
            const correctBlanks = coverageRatio !== null ? Math.round(coverageRatio * totalBlanks) : 0
            const xp =
                coverageRatio !== null
                    ? correctBlanks * XP_PER_CORRECT_BLANK
                    : grade >= COMBO_GRADE_THRESHOLD
                        ? XP_PER_STRUCTURAL_CARD
                        : 0
            const nextResults = [
                ...results,
                { cardId: card.id, coverageRatio, correctBlanks, totalBlanks, correct, xp },
            ]
            setResults(nextResults)
            setCombo((current) => {
                const next = keptCombo ? current + 1 : 0
                setBestCombo((peak) => Math.max(peak, next))
                return next
            })
            if (index < sessionLength - 1) {
                setIndex((current) => current + 1)
            } else {
                void finish(nextResults)
            }
        },
        [card, cloze, results, index, sessionLength, runGraphQL, t, finish],
    )

    // ── SETUP ────────────────────────────────────────────────────────────
    if (phase === "setup") {
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <Card>
                    <CardContent className="flex flex-col gap-6">
                        {/* mastery ("Độ thuộc") + streak */}
                        <div className="flex flex-col gap-3">
                            <Label>{t("flashcard.interview.masteryTitle")}</Label>
                            <AsyncContent
                                isLoading={decksSwr.isLoading && !decks}
                                skeleton={
                                    <div className="flex flex-col gap-2">
                                        <Skeleton.Meter />
                                        <Skeleton.Typography type="body-xs" width="1/3" />
                                    </div>
                                }
                                error={!decks ? decksSwr.error : undefined}
                                errorContent={{
                                    title: t("flashcard.empty"),
                                    onRetry: () => { void decksSwr.mutate() },
                                }}
                            >
                                <div className="flex flex-col gap-2">
                                    <ProgressMeter value={masteredSum} max={totalCards} />
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <Typography type="body-xs" color="muted">
                                            {t("flashcard.interview.masteredCaption", {
                                                mastered: masteredSum,
                                                total: totalCards,
                                            })}
                                        </Typography>
                                        {weeklyStatsSwr.data && streak > 0 ? (
                                            <Chip size="sm" variant="soft" color="warning">
                                                <FlameIcon className="size-3" aria-hidden focusable="false" />
                                                {t("flashcard.interview.streakChip", { count: streak })}
                                            </Chip>
                                        ) : null}
                                    </div>
                                </div>
                            </AsyncContent>
                        </div>

                        {/* config: mode + level — divided (gap-3) from the mastery block above */}
                        <div className="flex flex-col gap-6 border-t border-divider pt-3">
                            <div className="flex flex-col gap-3">
                                <Label>{t("flashcard.interview.modeLabel")}</Label>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("flashcard.interview.modeLabel")}
                                    value={mode}
                                    onChange={setMode}
                                    insideCard
                                    items={[
                                        {
                                            value: "quick",
                                            content: (
                                                <span className="flex items-center gap-2">
                                                    <LightningIcon className="size-4" aria-hidden focusable="false" />
                                                    {t("flashcard.interview.modeQuick")}
                                                </span>
                                            ),
                                        },
                                        {
                                            value: "deep",
                                            content: (
                                                <span className="flex items-center gap-2">
                                                    <StackIcon className="size-4" aria-hidden focusable="false" />
                                                    {t("flashcard.interview.modeDeep")}
                                                </span>
                                            ),
                                        },
                                    ]}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label>{t("flashcard.interview.levelLabel")}</Label>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("flashcard.interview.levelLabel")}
                                    value={level ?? "all"}
                                    onChange={(value) => setLevel(value === "all" ? null : value)}
                                    insideCard
                                    items={[
                                        { value: "all", content: t("flashcard.interview.levelAll") },
                                        ...LEVELS.map((value) => ({
                                            value,
                                            content: t(`flashcard.level.${value}`),
                                        })),
                                    ]}
                                />
                            </div>
                        </div>

                        {/* primary CTA — one loud action */}
                        <Button
                            variant="primary"
                            size="lg"
                            className="self-start"
                            isDisabled={!decks || totalCards === 0}
                            onPress={() => { void startSession() }}
                        >
                            {t("flashcard.interview.begin")}
                            <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // ── RECAP ────────────────────────────────────────────────────────────
    if (phase === "recap") {
        const fullyCorrect = results.filter((result) => result.correct).length
        const withCoverage = results.filter((result) => result.coverageRatio !== null)
        const avgCoverage =
            withCoverage.length > 0
                ? Math.round(
                    (withCoverage.reduce((sum, result) => sum + (result.coverageRatio ?? 0), 0)
                        / withCoverage.length) * 100,
                )
                : 0

        // Zone C data: top-3 weak tags drive the primary demand-bridge row; anything past
        // 3 scrolls INSIDE the same card (never truncated silently, never a separate drawer)
        const topWeakTags = weakTags.slice(0, 3)
        const overflowWeakTags = weakTags.slice(3)
        const learn = pathConfig().locale(locale).course(displayId).learn()
        const genericContinueHref = learn.module().build()
        // resolve a weak tag straight to its lesson when the deck→lesson mapping was
        // unambiguous; `null` → the caller falls back to `genericContinueHref`
        const resolveTagHref = (tag: QuizSessionWeakTagData) =>
            tag.moduleId && tag.contentId
                ? learn.module(tag.moduleId).content(tag.contentId).build()
                : tag.moduleId
                    ? learn.module(tag.moduleId).build()
                    : null

        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <div className="flex flex-col gap-6 rounded-2xl bg-surface p-6 shadow-surface">
                    {/* Zone A — header */}
                    <div className="flex flex-col gap-2">
                        <Label>{t("flashcard.interview.recapTitle")}</Label>
                        <Typography type="h4" weight="semibold">
                            {t("flashcard.interview.answeredWithoutHint", {
                                count: fullyCorrect,
                                total: results.length,
                            })}
                        </Typography>
                    </div>

                    {/* Zone B — metric readout (XP shows a transparent daily-cap note instead
                        of reading as broken when the grant was clamped to 0/less) */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <MetricCard
                            value={`x${bestCombo}`}
                            label={t("flashcard.interview.bestCombo")}
                        />
                        <MetricCard
                            value={`+${xpEarned}`}
                            label={t("flashcard.interview.xpEarned")}
                            hint={dailyCapReached ? t("flashcard.interview.dailyCapReached") : undefined}
                        />
                        <MetricCard
                            value={`${avgCoverage}%`}
                            label={t("flashcard.interview.avgCoverage")}
                        />
                    </div>

                    {xpEarned > 0 ? (
                        <Typography type="body-xs" color="muted">
                            {t("flashcard.interview.xpAddedToLeaderboard")}
                        </Typography>
                    ) : null}
                </div>

                {/* Zone E — enroll upsell (trial only): the recap's PRIMARY action for a trial
                    viewer — keep the earned momentum going by unlocking the full course, framed
                    as a reward, not a paywall. Gated on `enrollKnown` too: `enrolled` defaults to
                    false, so without this a genuinely enrolled viewer would briefly see the
                    upsell before the status query settles. */}
                {enrollKnown && !enrolled ? <RecapEnrollUpsell /> : null}

                {/* Zone C — weak-tags demand-bridge: PRIMARY when enrolled, a smaller secondary
                    link under the upsell when trial (Zone E takes the primary slot instead).
                    Treated as non-primary until enrollment is known, same reasoning as Zone E. */}
                <RecapWeakTagsCard
                    weakTags={topWeakTags}
                    overflowWeakTags={overflowWeakTags}
                    resolveTagHref={resolveTagHref}
                    genericHref={genericContinueHref}
                    primary={enrollKnown && enrolled}
                />

                {/* Zone D — AI Mock Interview readiness: only relevant once actually enrolled
                    (state 5 in the matrix — hidden pre-enrollment/while enrollment is unknown). */}
                {enrollKnown && enrolled && readiness ? (
                    <RecapReadinessCallout readiness={readiness} mockInterviewHref={learn.mockInterview().build()} />
                ) : null}

                {/* Zone F — footer note + "Practice more", demoted to secondary now that C/D/E
                    exist: looping the quiz is no longer the screen's most-encouraged action. */}
                <Button
                    variant="secondary"
                    size="lg"
                    className="self-start"
                    onPress={() => setPhase("setup")}
                >
                    {t("flashcard.interview.practiceMore")}
                    <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                </Button>
            </div>
        )
    }

    // ── ACTIVE ───────────────────────────────────────────────────────────
    // building the session (fetching deck cards) — mirror with a content skeleton
    if (building) {
        return <InterviewSessionSkeleton className={className} />
    }

    // no cards after the level filter — offer a way back to setup
    if (!card) {
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <EmptyState
                    icon={<CheckCircleIcon aria-hidden focusable="false" />}
                    title={t("flashcard.interview.emptyAtLevel")}
                    action={
                        <Button size="sm" variant="secondary" onPress={() => setPhase("setup")}>
                            {t("flashcard.interview.backToSetup")}
                        </Button>
                    }
                />
            </div>
        )
    }

    // shared header: progress + combo + card meta
    const header = (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <ProgressMeter
                    value={index + 1}
                    max={sessionLength}
                    label={t("flashcard.interview.progress", {
                        current: index + 1,
                        total: sessionLength,
                    })}
                    className="min-w-40 flex-1"
                />
                {combo > 1 ? (
                    <Chip size="sm" variant="soft" color="warning">
                        <FlameIcon className="size-3" aria-hidden focusable="false" />
                        {t("flashcard.interview.comboChip", { combo })}
                    </Chip>
                ) : null}
            </div>
            {card.level || (card.tags?.length ?? 0) > 0 ? (
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
            ) : null}
        </>
    )

    // ── FALLBACK: card has no clozable key terms → plain flip + self-grade ──
    if (!cloze) {
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                {header}
                <FlipCard
                    revealed={showAnswer}
                    onToggle={() => setShowAnswer((flipped) => !flipped)}
                    ariaLabel={showAnswer ? t("flashcard.showQuestion") : t("flashcard.showAnswer")}
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
                            <MarkdownContent markdown={card.question} />
                        </>
                    }
                    back={
                        <>
                            <Typography type="body-xs" weight="medium" color="muted">
                                {t("flashcard.answerLabel")}
                            </Typography>
                            {card.answer ? (
                                <MarkdownContent markdown={card.answer} />
                            ) : (
                                <Typography type="body-sm" color="muted">
                                    {t("flashcard.noAnswer")}
                                </Typography>
                            )}
                            {card.explanation ? <MarkdownContent markdown={card.explanation} /> : null}
                        </>
                    }
                />
                {showAnswer ? (
                    <div className="flex flex-col gap-2">
                        <Typography type="body-xs" color="muted" align="center">
                            {t("flashcard.review.rateHint")}
                        </Typography>
                        <RatingBar
                            options={ratingOptions}
                            onRate={(grade) => void commitCard(grade, null)}
                            isPending={rating}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-end gap-3">
                        <Button size="sm" variant="outline" onPress={() => setShowAnswer(true)}>
                            {t("flashcard.showAnswer")}
                        </Button>
                    </div>
                )}
            </div>
        )
    }

    // ── CLOZE: fill blanks → check → read full answer → SM-2 ───────────────
    const allFilled = filled.every((value) => value !== null)
    const correctCount = checked
        ? filled.filter((value, blankIndex) =>
            value !== null && value.toLowerCase() === cloze.blanks[blankIndex].toLowerCase(),
        ).length
        : 0
    const coverageRatio = cloze.blanks.length > 0 ? correctCount / cloze.blanks.length : 0

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {header}

            {/* question prompt + the cloze sentence (one surface, divided) */}
            <div className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-surface">
                <Typography type="body-xs" weight="medium" color="muted">
                    {t("flashcard.questionLabel")}
                </Typography>
                <MarkdownContent markdown={card.question} />
                <Typography
                    type="body-xs"
                    weight="medium"
                    color="muted"
                    className="border-t border-divider pt-3"
                >
                    {t("flashcard.interview.clozeInstruction")}
                </Typography>
                <p className="text-base leading-loose text-foreground">
                    {cloze.segments.map((segment, position) =>
                        segment.kind === "text" ? (
                            <span key={position}>{segment.text}</span>
                        ) : (
                            (() => {
                                const value = filled[segment.index]
                                const isCorrect =
                                    checked
                                    && value !== null
                                    && value.toLowerCase() === cloze.blanks[segment.index].toLowerCase()
                                const tone = !checked
                                    ? "border-accent/60 bg-accent/10 text-accent"
                                    : isCorrect
                                        ? "border-success/60 bg-success/10 text-success"
                                        : "border-danger/60 bg-danger/10 text-danger"
                                return (
                                    <button
                                        key={position}
                                        type="button"
                                        disabled={checked || value === null}
                                        onClick={() => clearBlank(segment.index)}
                                        className={cn(
                                            "mx-1 inline-flex min-w-16 items-center justify-center rounded-lg border px-3 py-0.5 align-middle text-sm font-medium transition-colors",
                                            value === null
                                                ? "border-dashed border-default text-muted"
                                                : tone,
                                            !checked && value !== null ? "cursor-pointer" : "",
                                        )}
                                    >
                                        {value ?? " "}
                                    </button>
                                )
                            })()
                        ),
                    )}
                </p>
                {/* after checking, surface the right term for any blank got wrong */}
                {checked && correctCount < cloze.blanks.length ? (
                    <Typography type="body-xs" color="muted">
                        {t("flashcard.interview.clozeResult", {
                            correct: correctCount,
                            total: cloze.blanks.length,
                        })}
                    </Typography>
                ) : null}
            </div>

            {/* the word bank: correct terms + sibling distractors (used chips dim out) */}
            {!checked ? (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {cloze.bank.map((term) => {
                            const used = filled.includes(term)
                            return (
                                <Button
                                    key={term}
                                    size="sm"
                                    variant="outline"
                                    isDisabled={used}
                                    onPress={() => placeTerm(term)}
                                >
                                    {term}
                                </Button>
                            )
                        })}
                    </div>
                    <Button
                        variant="primary"
                        className="self-start"
                        isDisabled={!allFilled}
                        onPress={() => setChecked(true)}
                    >
                        {t("flashcard.interview.checkAnswer")}
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* verdict line */}
                    <div className="flex items-center gap-2">
                        {correctCount === cloze.blanks.length ? (
                            <CheckCircleIcon className="size-5 text-success" aria-hidden focusable="false" />
                        ) : (
                            <XCircleIcon className="size-5 text-danger" aria-hidden focusable="false" />
                        )}
                        <Typography type="body-sm" weight="medium">
                            {t("flashcard.interview.clozeResult", {
                                correct: correctCount,
                                total: cloze.blanks.length,
                            })}
                        </Typography>
                    </div>

                    {/* read the full model answer (the 5-layer reasoning), then self-grade */}
                    {showAnswer ? (
                        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-surface">
                            <Typography type="body-xs" weight="medium" color="muted">
                                {t("flashcard.answerLabel")}
                            </Typography>
                            <MarkdownContent markdown={card.answer ?? ""} />
                            {card.explanation ? <MarkdownContent markdown={card.explanation} /> : null}
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="self-start"
                            onPress={() => setShowAnswer(true)}
                        >
                            {t("flashcard.interview.showSolution")}
                        </Button>
                    )}

                    {showAnswer ? (
                        <div className="flex flex-col gap-2">
                            <Typography type="body-xs" color="muted" align="center">
                                {t("flashcard.review.rateHint")}
                            </Typography>
                            <RatingBar
                                options={ratingOptions}
                                onRate={(grade) => void commitCard(grade, coverageRatio)}
                                isPending={rating}
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

/**
 * Recap Zone E — the enroll upsell shown ONLY to trial viewers, as the recap's
 * PRIMARY action (per `LAYOUT-BRAINSTORM.md`). Mirrors {@link EnrollGate}'s visual
 * anatomy (icon badge + title + description + button) but is embedded INLINE inside
 * the recap card rather than rendered full-page, and reads as an earned reward for
 * the streak/XP the learner just built — not a blocking paywall. Opens the same
 * shared course-enroll payment overlay {@link EnrollGate} uses.
 */
const RecapEnrollUpsell = () => {
    const t = useTranslations()
    const { open } = usePaymentOverlayState()

    const onEnroll = useCallback(
        () => open({ flow: PaymentFlow.CourseEnroll }),
        [open],
    )

    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-default bg-default px-6 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent/15">
                <FlameIcon aria-hidden focusable="false" className="size-6 text-accent" />
            </div>
            <div className="flex flex-col gap-1">
                <Typography type="h4" weight="semibold">
                    {t("flashcard.interview.upsellTitle")}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {t("flashcard.interview.upsellDescription")}
                </Typography>
            </div>
            <Button
                variant="primary"
                size="lg"
                className="mt-1 w-full max-w-xs"
                onPress={onEnroll}
            >
                {t("flashcard.interview.upsellCta")}
                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
            </Button>
        </div>
    )
}

/** Props for {@link RecapWeakTagsCard}. */
interface RecapWeakTagsCardProps {
    /** Top-3 weakest tags to always show (empty when nothing qualifies — state "empty"). */
    weakTags: Array<QuizSessionWeakTagData>
    /** Any tags beyond the top-3 — scrolled INSIDE this same card, never truncated silently
     *  and never a separate drawer (state "overflow"). */
    overflowWeakTags: Array<QuizSessionWeakTagData>
    /** Resolves a weak tag to its lesson route, or `null` when the deck→lesson mapping was
     *  ambiguous (falls back to `genericHref` for that row). */
    resolveTagHref: (tag: QuizSessionWeakTagData) => string | null
    /** Generic "continue learning" destination — the empty-state CTA AND the fallback for
     *  any weak tag whose lesson mapping was ambiguous. */
    genericHref: string
    /** Whether this card is the recap's PRIMARY demand-bridge (enrolled viewers) or a
     *  smaller secondary link (trial viewers, where Zone E takes the primary slot instead). */
    primary: boolean
}

/** One weak-tag row: tag label + coverage + a "review this lesson" link. */
const WeakTagRow = ({
    tag,
    href,
}: {
    tag: QuizSessionWeakTagData
    href: string
}) => {
    const t = useTranslations()
    const router = useRouter()
    return (
        <button
            type="button"
            onClick={() => router.push(href)}
            className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-default bg-default px-4 py-3 text-left outline-none transition-colors hover:bg-default/70 focus-visible:ring-2 focus-visible:ring-accent"
        >
            <div className="flex min-w-0 flex-col gap-0.5">
                <Typography type="body-sm" weight="medium" className="truncate">
                    {tag.tag}
                </Typography>
                <Typography type="body-xs" color="muted">
                    {t("flashcard.interview.weakTagCoverage", { percent: Math.round(tag.coverage * 100) })}
                </Typography>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent">
                {t("flashcard.interview.reviewLesson")}
                <ArrowRightIcon
                    aria-hidden
                    focusable="false"
                    className="size-4 transition-transform group-hover:translate-x-1"
                />
            </span>
        </button>
    )
}

/**
 * Recap Zone C — the demand-bridge from "just played" to "go learn". Ranks the
 * session's weakest tags and links each straight back to the lesson that covers
 * it; falls back to a generic "keep learning" CTA when there's no weak-tag data
 * yet (first session, or the mapping was ambiguous). Overflow past the top-3
 * scrolls inside the same card via `ScrollShadow` — never a drawer (the card
 * always has room; see `LAYOUT-BRAINSTORM.md` state 4).
 */
const RecapWeakTagsCard = ({
    weakTags,
    overflowWeakTags,
    resolveTagHref,
    genericHref,
    primary,
}: RecapWeakTagsCardProps) => {
    const t = useTranslations()
    const router = useRouter()

    // no weak-tag data at all → the one, simple, generic bridge (state "empty"). When
    // this card IS the recap's primary action (enrolled, no upsell competing), the CTA
    // is a full primary button per LAYOUT-BRAINSTORM state 1; when it's demoted (trial),
    // it's a standalone (no primary beside it) tertiary link.
    if (weakTags.length === 0) {
        return primary ? (
            <div className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-surface">
                <Label>{t("flashcard.interview.weakTagsTitle")}</Label>
                <Typography type="body-sm" color="muted">
                    {t("flashcard.interview.weakTagsEmpty")}
                </Typography>
                <Button
                    variant="primary"
                    className="self-start"
                    onPress={() => router.push(genericHref)}
                >
                    {t("flashcard.interview.continueLearning")}
                    <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                </Button>
            </div>
        ) : (
            <Button
                variant="tertiary"
                size="sm"
                className="self-start"
                onPress={() => router.push(genericHref)}
            >
                {t("flashcard.interview.continueLearning")}
                <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
            </Button>
        )
    }

    // secondary (trial) rendering: a smaller link-style row, not the full card — Zone E
    // (enroll upsell) is the primary action instead (state "mixed (trial)"). Standalone,
    // no primary beside it → tertiary, per elements/button.md.
    if (!primary) {
        const first = weakTags[0]
        const firstHref = resolveTagHref(first) ?? genericHref
        return (
            <Button
                variant="tertiary"
                size="sm"
                className="self-start"
                onPress={() => router.push(firstHref)}
            >
                {t("flashcard.interview.weakTagSecondaryLink", { tag: first.tag })}
                <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
            </Button>
        )
    }

    return (
        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-surface">
            <Label>{t("flashcard.interview.weakTagsTitle")}</Label>
            <div className="flex flex-col gap-2">
                {weakTags.map((tag) => (
                    <WeakTagRow key={tag.tag} tag={tag} href={resolveTagHref(tag) ?? genericHref} />
                ))}
            </div>
            {overflowWeakTags.length > 0 ? (
                <ScrollShadow hideScrollBar className="max-h-40 overflow-y-auto">
                    <div className="flex flex-col gap-2 pt-0.5">
                        {overflowWeakTags.map((tag) => (
                            <WeakTagRow key={tag.tag} tag={tag} href={resolveTagHref(tag) ?? genericHref} />
                        ))}
                    </div>
                </ScrollShadow>
            ) : null}
        </div>
    )
}

/** Props for {@link RecapReadinessCallout}. */
interface RecapReadinessCalloutProps {
    /** The readiness signal returned by `completeFlashcardQuizSession`. */
    readiness: QuizSessionReadinessData
    /** Route to the AI Mock Interview surface (only navigated to once unlocked). */
    mockInterviewHref: string
}

/**
 * Recap Zone D — the cross-link toward the AI Mock Interview (StarCi's actual
 * AI-graded, credit-costing differentiator), so a learner who finishes "Hỏi
 * nhanh" feeling good is pointed at it instead of never hearing it exists.
 * Locked state stays visible (transparent about the threshold, per state
 * "special (daily-cap)"/readiness in `LAYOUT-BRAINSTORM.md`) rather than hiding.
 */
const RecapReadinessCallout = ({ readiness, mockInterviewHref }: RecapReadinessCalloutProps) => {
    const t = useTranslations()
    const router = useRouter()

    if (!readiness.unlocked) {
        return (
            <Callout
                status="default"
                icon={<LockKeyIcon className="size-5" aria-hidden focusable="false" />}
                title={t("flashcard.interview.readinessLockedTitle")}
                description={t("flashcard.interview.readinessLockedDescription", {
                    currentAvg: readiness.currentAvg,
                    threshold: readiness.threshold,
                })}
            />
        )
    }

    return (
        <Callout
            status="success"
            icon={<MicrophoneStageIcon className="size-5" aria-hidden focusable="false" />}
            title={t("flashcard.interview.readinessUnlockedTitle")}
            description={t("flashcard.interview.readinessUnlockedDescription")}
            action={(
                <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onPress={() => router.push(mockInterviewHref)}
                >
                    {t("flashcard.interview.readinessUnlockedCta")}
                    <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                </Button>
            )}
        />
    )
}

