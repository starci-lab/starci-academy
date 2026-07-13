"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { LayoutGroup, motion, useReducedMotion } from "framer-motion"
import { Button, Chip, Label, Spinner, Typography, cn } from "@heroui/react"
import {
    ArrowRightIcon,
    CardsIcon,
    CheckCircleIcon,
    ClockCountdownIcon,
    ClockCounterClockwiseIcon,
    ClockIcon,
    FlameIcon,
    LightningIcon,
    StackIcon,
    XCircleIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { DUE_REVIEW_LIMIT, SM2_GRADES } from "../constants"
import { queryMyDueFlashcards } from "@/modules/api/graphql/queries/query-my-due-flashcards"
import { buildCloze, extractMarkerTerms, type ClozeQuestion } from "./build-cloze"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { mutateReviewFlashcard } from "@/modules/api/graphql/mutations/mutation-review-flashcard"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql/queries/query-flashcard-decks-by-course"
import { queryFlashcardDeck } from "@/modules/api/graphql/queries/query-flashcard-deck"
import { type FlashcardCardEntity } from "@/modules/types/entities/flashcard-card"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { Callout } from "@/components/blocks/feedback/Callout"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { RatingBar } from "@/components/blocks/buttons/RatingBar"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { FlashcardStatsStrip } from "../FlashcardStatsStrip"
import { FlashcardQuizHistory } from "./FlashcardQuizHistory"
import { FlashcardQuizStats } from "./FlashcardQuizStats"
import { useQueryMyWeeklyStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyWeeklyStatsSwr"
import { useMutateCompleteFlashcardQuizSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCompleteFlashcardQuizSessionSwr"
import { useMutateStartFlashcardQuizSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardQuizSessionSwr"
import { useMutateSyncFlashcardQuizSessionProgressSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSyncFlashcardQuizSessionProgressSwr"
import { useQueryMyInProgressFlashcardQuizSessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInProgressFlashcardQuizSessionSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"
import { WorkSessionHeader } from "@/components/blocks/navigation/WorkSessionHeader"
import { QuizSessionSkeleton } from "./QuizSessionSkeleton"

/** Props for {@link QuizSession}. */
export interface QuizSessionProps extends WithClassNames<undefined> {
    /** Course to draw quiz cards across (rendered only for enrolled viewers). */
    courseId: string
    /**
     * Present when reached via the dedicated `flashcards/quiz/sessions/[sessionId]`
     * route — on mount, rehydrates that session from
     * `myInProgressFlashcardQuizSession` (re-fetching the actual card objects
     * for the persisted `cardIds`, in order) and jumps straight into the
     * `active` phase at the persisted `currentIndex`, instead of showing setup.
     * Mirrors `MockInterviewSessionProps.resumeSessionId`.
     */
    resumeSessionId?: string
}

/**
 * The phases of one quick-quiz run. `setup` picks mode + level; `active` walks a
 * fixed set of cloze cards (fill blanks → check → read full answer → SM-2);
 * `recap` frames the result by mastery and grants XP.
 */
export type QuizPhase = "setup" | "active" | "recap"

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

/** Format elapsed/remaining seconds as mm:ss. Mirrors `MockInterviewSession`'s own. */
const formatElapsed = (seconds: number): string => {
    const mm = Math.floor(seconds / 60)
    const ss = seconds % 60
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
}
/** Below this many seconds remaining, the HUD countdown turns warning-colored
 *  (session time limit, real urgency — not fake scarcity). Mirrors Mock Interview's own. */
const TIME_LIMIT_WARNING_SECONDS = 5 * 60
/** XP for a fallback (no-cloze) card with a Good/Easy self-grade. */
const XP_PER_STRUCTURAL_CARD = 3
/**
 * Spring used for the word-bank ↔ blank shared-layout ("fly into place") chip
 * animation — snappy pick/place feel, not floaty. Swapped for `{ duration: 0 }`
 * under `prefers-reduced-motion` (same idiom as CollapsibleSidebar).
 */
const CLOZE_CHIP_TRANSITION = { type: "spring", stiffness: 500, damping: 32 } as const

/** A card drawn into a session, carrying the fields the quiz needs. */
interface QuizCard extends FlashcardCardEntity {
    /** Key terms — union of the card's `:::chip` list and its own cloze marker
     *  terms (a term already marked `{{cN::term}}` never needs retyping into
     *  the chip block). Empty only when the card has neither. */
    keywords: Array<string>
    /** Owning deck id — the source deck of the per-deck fetch in {@link fetchCardPool},
     *  not a GraphQL field. Drives the same-deck distractor tier. */
    deckId: string
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
 * per session. The setup's data states go through {@link FlashcardStatsStrip}.
 * @param props - {@link QuizSessionProps}
 */
export const QuizSession = ({ courseId, className, resumeSessionId }: QuizSessionProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const runGraphQL = useGraphQLWithToast()
    // trial-vs-enrolled gating (enroll upsell + AI Mock Interview readiness) now lives
    // in the converged `FlashcardQuizResult` surface, which reads it from redux itself.
    const displayId = useAppSelector((state) => state.course.displayId)
    // course name for the shared WorkSessionHeader's identity chip
    const course = useAppSelector((state) => state.course.entity)
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

    // today's due-card ids — same SWR key/shape `DueReviewHero` already reads, so
    // the scope-picker's "Chỉ thẻ cần ôn" and `startSession`'s draw-time filter
    // (below) share one fetch. `dueCount` also gates/dims the scope option when
    // nothing is due (mirrors `FlashcardReviewModeModal`'s `dueDisabled`).
    const dueSwr = useSWR(
        ["my-due-flashcards", courseId, DUE_REVIEW_LIMIT],
        async () => {
            const response = await queryMyDueFlashcards({ request: { courseId, limit: DUE_REVIEW_LIMIT } })
            return response.data?.myDueFlashcards.data ?? null
        },
    )
    const dueCardIds = useMemo(
        () => new Set((dueSwr.data?.cards ?? []).map((dueCard) => dueCard.cardId)),
        [dueSwr.data],
    )
    const dueDisabled = (dueSwr.data?.dueCount ?? 0) <= 0
    useEffect(() => {
        if (dueDisabled) {
            setScope("all")
        }
    }, [dueDisabled])

    // refreshed after a session grants XP (the setup's progress zone reads its own
    // streak from `FlashcardStatsStrip` instead)
    const weeklyStatsSwr = useQueryMyWeeklyStatsSwr()

    const runComplete = useMutateCompleteFlashcardQuizSessionSwr()
    const runStart = useMutateStartFlashcardQuizSessionSwr()
    const runSyncProgress = useMutateSyncFlashcardQuizSessionProgressSwr()
    // read BOTH by the setup screen's resume card (when NOT already resuming) and the
    // rehydrate effect below (when `resumeSessionId` IS present) — mirrors
    // `MockInterviewSession`'s single `inProgressSessionSwr` read.
    const inProgressSessionSwr = useQueryMyInProgressFlashcardQuizSessionSwr(courseId)

    // total card count across the course's decks — gates the setup CTA
    const totalCards = useMemo(
        () => (decks ?? []).reduce((sum, deck) => sum + (deck.cards?.length ?? 0), 0),
        [decks],
    )

    // shared-layout "fly into the blank" animation (word-bank chip ↔ blank chip)
    // is disabled under prefers-reduced-motion — same idiom as CollapsibleSidebar.
    const reduceMotion = useReducedMotion()

    // ── session state ────────────────────────────────────────────────────
    const [phase, setPhase] = useState<QuizPhase>("setup")
    // which setup tab is active ("Bắt đầu" / "Lịch sử" / "Thống kê") — setup phase only.
    // Seeded from `?tab=` so a shared/refreshed link lands back on the same tab (mirrors
    // MockInterviewSession's own setupTab + `layouts/dashboard-hub.md`'s "?tab= must be
    // shareable" precedent) — "begin" is the implicit default, never written to the URL.
    const [setupTab, setSetupTab] = useState<"begin" | "history" | "stats">(() => {
        const initial = searchParams.get("tab")
        return initial === "history" || initial === "stats" ? initial : "begin"
    })
    const [mode, setMode] = useState<QuizMode>("quick")
    const [level, setLevel] = useState<string | null>(null)
    // "Ôn tất cả" (draw from the whole pool) vs "Chỉ thẻ cần ôn" (draw only from
    // today's due queue) — same 2 options + wording as `FlashcardReviewModeModal`
    // (thầy 2026-07-13: "cấu hình luyện thêm ôn tất cả và chỉ thẻ cần ôn").
    const [scope, setScope] = useState<"all" | "due">("all")
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
    // in-session combo (consecutive well-answered cards) — drives the active HUD chip
    const [combo, setCombo] = useState(0)
    // true while `startSession` is drawing + persisting a fresh run — drives the
    // "Bắt đầu luyện" button's own isPending (stays ON this screen; only the
    // eventual navigation to `/quiz/[sessionId]` leaves it, restructured 2026-07-09).
    const [starting, setStarting] = useState(false)
    // set when `startSession` couldn't produce a playable session (no cards at the
    // chosen level, or the persist call failed) — shown inline on the setup screen;
    // the run never leaves `setup` until a session is actually created.
    const [startError, setStartError] = useState<string | null>(null)
    // client-generated id shared by this run → idempotent XP grant
    const sessionId = useRef<string | null>(null)
    // guards the one-shot completion mutation on entering the recap
    const completedRef = useRef(false)
    // guards the one-shot resume rehydration to run at most once per mounted instance
    const resumeAttemptedRef = useRef(false)
    // set when `resumeSessionId` couldn't be resumed (no matching session / expired
    // past its 24h TTL) — shown as an inline note on the setup screen it falls back to
    const [resumeError, setResumeError] = useState<string | null>(null)
    // server-issued deadline for THIS run (createdAt + duration) — set on start AND
    // on resume rehydrate; drives the WorkSessionHeader countdown below, same
    // `deadlineAt` contract as Mock Interview's own HUD (never a local clock start).
    const [deadlineAt, setDeadlineAt] = useState<string | null>(null)
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
    // dummy tick to force the setup screen's resume-card "còn N phút" to recompute
    // every 30s while it's on screen — same idiom as MockInterviewSession's own
    // `resumeCountdownTick` (the minutes value itself is computed inline in render).
    const [, setResumeCountdownTick] = useState(0)

    // the setup screen's mode picker drives this pre-build; once cards are actually
    // drawn (fresh OR resumed), the real count wins — a resumed run's card count
    // depends on whichever mode it was originally started with, not the setup
    // screen's current (unrelated) selection.
    const sessionLength = sessionCards.length > 0 ? sessionCards.length : MODE_LENGTH[mode]

    const card = sessionCards[index]

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

    // fetch the full cards of every deck (self-grading needs a model answer to compare
    // against). Each deck is fetched independently (allSettled) so ONE deck failing
    // (e.g. missing from the Elasticsearch index the single-deck read serves from —
    // see `FlashcardDeckReadService.getById`) can't silently empty the whole pool:
    // the caller just draws from whichever decks DID resolve. Shared by a FRESH start
    // (draws + shuffles) and a resume (looks the persisted `cardIds` up by id).
    const fetchCardPool = useCallback(async () => {
        const settled = await Promise.allSettled(
            (decks ?? []).map(async (deck) => {
                const response = await queryFlashcardDeck({
                    request: { flashcardDeckId: deck.id },
                    headers: courseHeaders,
                })
                const payload = response.data?.flashcardDeck
                if (!payload?.success) {
                    throw new Error(payload?.message ?? "flashcard deck fetch failed")
                }
                return (payload.data?.cards ?? []).map((card) => ({ ...card, deckId: deck.id }))
            }),
        )
        const anyDeckFailed = settled.some((result) => result.status === "rejected")
        const deckPayloads = settled
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value)
        const pool: Array<QuizCard> = deckPayloads
            .flat()
            .filter((card) => Boolean(card.answer))
            .map((card) => ({ ...card, keywords: extractMarkerTerms(card.answer) }))
        return { pool, anyDeckFailed }
    }, [decks, courseHeaders])

    // draw a fresh run: pool + filter by level + shuffle, persist it server-side,
    // THEN navigate to the resumable `/quiz/[sessionId]` route — stays on THIS
    // (setup) screen the whole time, pending only on the CTA itself, per thầy's
    // 2026-07-09 correction ("tạo phiên xong rồi mới load vào quiz kèm id" — no
    // more instant phase flip to a building-skeleton screen, and no more silent
    // local/non-resumable fallback when the persist call fails: a real failure
    // now surfaces inline instead of quietly degrading).
    const startSession = useCallback(async () => {
        if (!decks || decks.length === 0 || starting) {
            return
        }
        setStarting(true)
        setStartError(null)
        setResumeError(null)
        try {
            const { pool, anyDeckFailed } = await fetchCardPool()
            const drawn = shuffle(
                pool
                    .filter((card) => level === null || card.level === level)
                    .filter((card) => scope !== "due" || dueCardIds.has(card.id)),
            ).slice(0, sessionLength)

            if (drawn.length === 0) {
                // an empty pool only means "no cards at this level" when every deck
                // fetch actually succeeded — otherwise it's a load failure in disguise
                setStartError(
                    anyDeckFailed
                        ? t("flashcard.quiz.sessionLoadErrorTitle")
                        : scope === "due"
                            ? t("flashcard.quiz.emptyAtScope")
                            : t("flashcard.quiz.emptyAtLevel"),
                )
                setStarting(false)
                return
            }

            // `mode`/`level` are REQUIRED (non-null) on the backend's
            // StartFlashcardQuizSessionRequest (see start-flashcard-quiz-session/
            // graphql-types/request.ts) — omitting them fails GraphQL input
            // validation before the resolver even runs (fixed 2026-07-09).
            const started = await runStart.trigger({
                request: { courseId, cardIds: drawn.map((card) => card.id), mode, level },
                headers: courseHeaders,
            }).catch(() => null)
            const startedId = started?.data?.startFlashcardQuizSession.data?.sessionId
            if (!startedId || !displayId) {
                setStartError(t("flashcard.quiz.sessionLoadErrorTitle"))
                setStarting(false)
                return
            }
            // prime the in-progress cache with the just-created session BEFORE
            // navigating, so the fresh page that mounts at `/quiz/[sessionId]` reads
            // it (not the stale `null` this screen's own resume check cached) and
            // rehydrates cleanly instead of flashing "resume failed".
            await inProgressSessionSwr.mutate()
            router.push(
                pathConfig().locale(locale).course(displayId).learn()
                    .flashcards().quiz(startedId).build(),
            )
            // deliberately no `setStarting(false)` here — this instance is about to
            // be unmounted by the navigation, so the button stays visibly pending
            // right up until the destination page takes over.
        } catch {
            setStartError(t("flashcard.quiz.sessionLoadErrorTitle"))
            setStarting(false)
        }
    }, [decks, starting, level, scope, dueCardIds, sessionLength, t, courseHeaders, courseId, mode, runStart, inProgressSessionSwr, displayId, locale, router])

    // "Thoát" — leaves the active run for the setup screen. No confirm modal (unlike
    // Mock Interview's leave, which is destructive/abandon-ungraded): a quiz run is
    // persisted server-side (`syncFlashcardQuizSessionProgress`) so navigating away
    // just resumes later from the same card (thầy 2026-07-09: "cả 2 phần review và
    // quiz đều không có nút back về").
    const exitToSetup = useCallback(() => {
        router.push(
            `${pathConfig().locale(locale).course(displayId).learn().flashcards().build()}/quiz`,
        )
    }, [router, locale, displayId])

    // finalize the run: send the per-card breakdown so the server re-derives coverage/XP
    // itself (no client-trusted aggregate), grant XP once (idempotent), then show the recap.
    // Defined here (not just above `commitCard`) so the resume effect below can call it too
    // (2026-07-12, mirrors the same move made for `MockInterviewSession`'s `renderWorkHeader`).
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
                    return (
                        payload ?? {
                            success: false,
                            message: t("flashcard.review.error"),
                        }
                    )
                },
                { showSuccessToast: false },
            )
            if (awarded > 0) {
                // refresh the streak/XP chip now that this run counted
                void weeklyStatsSwr.mutate()
            }
            // Navigate to the dedicated result route instead of rendering the
            // result inline here — "done" is now answered by the URL, not
            // re-derived client-side (see result/page.tsx doc for root cause).
            if (displayId) {
                router.replace(
                    pathConfig()
                        .locale(locale)
                        .course(displayId)
                        .learn()
                        .flashcards()
                        .quiz(sessionId.current as string)
                        .result()
                        .build(),
                )
            }
        },
        [runComplete, runGraphQL, courseId, courseHeaders, t, weeklyStatsSwr, router, locale, displayId],
    )

    // resume, on mount, when reached via the dedicated `flashcards/quiz/sessions/[sessionId]`
    // route — waits for both the deck pool AND the in-progress query to settle, then
    // either rehydrates straight into the active phase at the persisted card/index or
    // falls back to setup with an inline error. Runs at most ONCE per mounted instance.
    useEffect(() => {
        if (!resumeSessionId || resumeAttemptedRef.current || !decks || inProgressSessionSwr.isLoading) {
            return
        }
        resumeAttemptedRef.current = true
        const data = inProgressSessionSwr.data
        if (!data || data.sessionId !== resumeSessionId) {
            setResumeError(t("flashcard.quiz.resumeFailed"))
            setPhase("setup")
            return
        }
        void (async () => {
            const { pool } = await fetchCardPool()
            const cardById = new Map(pool.map((quizCard) => [quizCard.id, quizCard]))
            const restoredCards = data.cardIds
                .map((cardId) => cardById.get(cardId))
                .filter((quizCard): quizCard is QuizCard => Boolean(quizCard))
            if (restoredCards.length === 0) {
                setResumeError(t("flashcard.quiz.resumeFailed"))
                setPhase("setup")
                return
            }
            const restoredResults: Array<CardResult> = data.results.map((result) => {
                const coverageRatio = result.totalBlanks > 0 ? result.correctBlanks / result.totalBlanks : null
                return {
                    cardId: result.cardId,
                    coverageRatio,
                    correctBlanks: result.correctBlanks,
                    totalBlanks: result.totalBlanks,
                    correct: coverageRatio === 1,
                    xp: coverageRatio !== null ? result.correctBlanks * XP_PER_CORRECT_BLANK : 0,
                }
            })
            sessionId.current = resumeSessionId
            setDeadlineAt(data.deadlineAt)
            setSessionCards(restoredCards)
            setCombo(0)
            setResumeError(null)

            // every card already has a recorded outcome — the run WAS finished,
            // but `status` never flipped to "completed" (the earlier `finish()`
            // call never landed server-side for whatever reason — network drop,
            // a duplicate-submit race, etc. — 2026-07-12, thầy: "submit rồi mà
            // F5 về câu cuối"). `currentIndex` alone can't tell "about to answer
            // the LAST card" from "just answered it" apart — both persist the
            // same last-valid-index value — only `results` coverage can. Retry
            // completion instead of silently resuming into the (already
            // answered) last card again.
            if (restoredResults.length >= restoredCards.length) {
                completedRef.current = false
                setResults(restoredResults)
                setIndex(restoredCards.length - 1)
                void finish(restoredResults)
                return
            }

            setIndex(Math.min(data.currentIndex, restoredCards.length - 1))
            setResults(restoredResults)
            completedRef.current = false
            setPhase("active")
        })()
    }, [resumeSessionId, decks, inProgressSessionSwr.isLoading, inProgressSessionSwr.data, fetchCardPool, t, finish])

    // "session time limit" — ticks every second while the run is active, counting
    // DOWN to the server-issued `deadlineAt` (never a local clock start). Mirrors
    // `MockInterviewSession`'s own countdown effect (thầy 2026-07-11: "thêm thời
    // gian mỗi phiên là 60 phút" — the deadline itself was already server-enforced
    // via `FLASHCARD_QUIZ_SESSION_DURATION_MS`; this makes it VISIBLE in the HUD).
    useEffect(() => {
        if (phase !== "active" || !deadlineAt) {
            return
        }
        const deadlineMs = new Date(deadlineAt).getTime()
        const tick = () => {
            setRemainingSeconds(Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000)))
        }
        tick()
        const id = window.setInterval(tick, 1000)
        return () => window.clearInterval(id)
    }, [phase, deadlineAt])

    // resume-card countdown (setup screen) — coarse 30s tick, only while there's
    // an actual resumable session to show a deadline for. Mirrors
    // MockInterviewSession's own resume-card countdown idiom.
    useEffect(() => {
        if (phase !== "setup" || !inProgressSessionSwr.data) {
            return
        }
        const id = window.setInterval(() => setResumeCountdownTick((previous) => previous + 1), 30_000)
        return () => window.clearInterval(id)
    }, [phase, inProgressSessionSwr.data])

    // mirror the setup tab into the URL (`?tab=history` / `?tab=stats`) — same technique
    // as MockInterviewSession's own setupTab mirror, so "Lịch sử"/"Thống kê" are
    // shareable/refresh-safe links. "begin" (the default) is never written, keeping the
    // common-case URL clean.
    useEffect(() => {
        const want = setupTab === "begin" ? null : setupTab
        if (searchParams.get("tab") === want) {
            return
        }
        const params = new URLSearchParams(searchParams.toString())
        if (want) {
            params.set("tab", want)
        } else {
            params.delete("tab")
        }
        const qs = params.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, [setupTab, pathname, searchParams, router])

    // distractor pool: sibling cards' key terms, closest-topic first (à la
    // Duolingo/Quizlet drawing from the session's own vocab) — same TAG, then
    // same DECK (still one coherent topic even without a shared tag), then the
    // whole session as a last resort. Without the deck tier, a thin same-tag
    // draw fell straight through to the WHOLE session/course pool, which is how
    // an unrelated term (e.g. a SQL clause) ended up in a NestJS DI question's
    // word bank (thầy 2026-07-11 bug report).
    const distractorPool = useMemo(() => {
        if (!card) {
            return []
        }
        const others = sessionCards.filter((_, position) => position !== index)
        const sameTag = others.filter((other) =>
            (other.tags ?? []).some((tag) => (card.tags ?? []).includes(tag)),
        )
        const sameDeck = others.filter((other) => other.deckId === card.deckId)
        const source = sameTag.length >= 2 ? sameTag : sameDeck.length >= 2 ? sameDeck : others
        return [...new Set(source.flatMap((other) => other.keywords))]
    }, [card, sessionCards, index])

    // the cloze for the current card (null → fall back to a plain flip +
    // self-grade — only when the card itself has no clozable key terms;
    // "Hỏi nhanh" and "Học thẻ" are unrelated features, so this is NOT a
    // learner-facing method choice, just a per-card content fallback).
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
            setCombo((current) => (keptCombo ? current + 1 : 0))
            const nextIndex = index < sessionLength - 1 ? index + 1 : index
            // best-effort, fire-and-forget persistence for resume — never blocks
            // advancing the quiz; still routed through `runGraphQL` (toast on failure,
            // no success toast) rather than a silent catch (thầy 2026-07-11: "fe
            // không nuốt lỗi, dùng runGraphQL đi") — a failed sync only degrades
            // resumability, but the learner should still see it.
            if (sessionId.current) {
                const syncingSessionId = sessionId.current
                void runGraphQL(
                    async () => {
                        const result = await runSyncProgress.trigger({
                            request: {
                                sessionId: syncingSessionId,
                                currentIndex: nextIndex,
                                results: nextResults.map((result) => ({
                                    cardId: result.cardId,
                                    correctBlanks: result.correctBlanks,
                                    totalBlanks: result.totalBlanks,
                                })),
                            },
                            headers: courseHeaders,
                        })
                        return (
                            result.data?.syncFlashcardQuizSessionProgress ?? {
                                success: false,
                                message: t("flashcard.quiz.error"),
                            }
                        )
                    },
                    { showSuccessToast: false },
                )
            }
            if (index < sessionLength - 1) {
                setIndex((current) => current + 1)
            } else {
                void finish(nextResults)
            }
        },
        [card, cloze, results, index, sessionLength, runGraphQL, t, finish, runSyncProgress, courseHeaders],
    )

    // ── RESUMING ─────────────────────────────────────────────────────────
    // reached via the dedicated `/quiz/[sessionId]` route and the rehydrate effect
    // above hasn't landed on `active` yet — show the active-run skeleton instead of
    // flashing the setup screen's tabs/CTA (which would be wrong for this route and
    // never actually shown once the effect commits `active`).
    if (resumeSessionId && phase === "setup" && !resumeError) {
        return <QuizSessionSkeleton className={className} />
    }

    // ── SETUP ────────────────────────────────────────────────────────────
    if (phase === "setup") {
        const resumeData = inProgressSessionSwr.data
        const learnPath = pathConfig().locale(locale).course(displayId).learn()
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                {/* NESTED under the outer "Học thẻ/Hỏi nhanh" mode switch (Flashcards/index.tsx,
                    also variant="primary") — a SECOND primary-weight pill here would render at
                    the exact same visual weight as that outer mode switch, erasing the
                    parent/child hierarchy (fe/components/tabs.md §0d, corrected 2026-07-09).
                    variant="secondary" + explicit `className="w-full"` gives the lighter,
                    full-width UNDERLINE treatment appropriate for a sub-panel switch nested
                    inside an already-selected top-level mode (mirrors `ContentTabBar`). */}
                <TabsCard
                    variant="secondary"
                    className="w-full"
                    leftTabs={{
                        items: [
                            { key: "begin", label: t("flashcard.quiz.setupTabBegin") },
                            { key: "history", label: t("flashcard.quiz.setupTabHistory") },
                            { key: "stats", label: t("flashcard.quiz.setupTabStats") },
                        ],
                        selectedKey: setupTab,
                        ariaLabel: t("flashcard.quiz.setupTabBegin"),
                        onSelectionChange: (key) => setSetupTab(key as "begin" | "history" | "stats"),
                    }}
                />

                {setupTab === "history" ? (
                    <FlashcardQuizHistory courseId={courseId} onStartQuiz={() => setSetupTab("begin")} />
                ) : setupTab === "stats" ? (
                    <FlashcardQuizStats courseId={courseId} onStartQuiz={() => setSetupTab("begin")} />
                ) : (
                    <>
                        {/* Zone 0 — resume: a "Hỏi nhanh" run left in progress (24h TTL) deep-links
                    straight back into it via the dedicated `.../quiz/[sessionId]` route,
                    ABOVE the ordinary setup zones. Demotes Zone 3's CTA to secondary below
                    so this reads as the screen's primary action while it's shown. */}
                        {resumeData ? (() => {
                            // "session time limit" — HONEST urgency: minutes left derived from
                            // the SAME server `deadlineAt` the live run enforces (never a made-up
                            // countdown), same idiom as MockInterviewSession's own resume card.
                            // The resume QUERY already hard-filters `createdAt >= now - duration`
                            // (lazy-expiry, no cron), so an expired session simply never reaches
                            // here — no "hết giờ" branch needed, unlike mock-interview's 2-gate resume.
                            const resumeRemainingMinutes = Math.max(
                                0,
                                Math.ceil((new Date(resumeData.deadlineAt).getTime() - Date.now()) / 60_000),
                            )
                            return (
                                <ContinueCard
                                    title={t("flashcard.quiz.resumeTitle")}
                                    subtitle={t("flashcard.quiz.resumeSubtitle", {
                                        current: resumeData.currentIndex + 1,
                                        total: resumeData.cardIds.length,
                                        minutes: resumeRemainingMinutes,
                                    })}
                                    urgent={resumeRemainingMinutes <= 15}
                                    value={resumeData.currentIndex}
                                    max={resumeData.cardIds.length}
                                    hideProgress
                                    ctaLabel={t("flashcard.quiz.resumeCta")}
                                    ctaVariant="chip"
                                    ctaBelow
                                    accented
                                    watermarkIcon={<ClockCounterClockwiseIcon weight="fill" />}
                                    onPress={() => router.push(learnPath.flashcards().quiz(resumeData.sessionId).build())}
                                />
                            )
                        })() : null}

                        {resumeError ? (
                            <Callout status="danger" title={resumeError} />
                        ) : null}

                        {/* Zone 1 — progress: reuse the sibling "Học thẻ" tab's stats block (shares
                    its SWR keys, so this adds no extra fetch) instead of a bespoke readout — thầy
                    2026-07-09 reversed the earlier split ("QuizProgressStrip", 1 turn prior): "ý là
                    cái Tiến bộ học nhanh => Tiến bộ và tái sử dụng component Tiến bộ ở tab học"
                    (rename back to plain "Tiến bộ" + share the ONE component again). */}
                        <FlashcardStatsStrip />

                        {/* Zone 2 — config: mode + level, its own labeled card so it reads as a
                    distinct block from the progress zone above (was one dense card before). */}
                        <LabeledCard label={t("flashcard.quiz.configLabel")} contentClassName="flex flex-col gap-6">
                            {/* Scope — same 2 options/wording as `FlashcardReviewModeModal`
                                ("Ôn tất cả" / "Chỉ thẻ cần ôn"), reused verbatim rather than
                                duplicated copy (thầy 2026-07-13: "cấu hình luyện thêm ôn tất
                                cả và chỉ thẻ cần ôn"). Disabled + auto-reset to "all" when
                                nothing is due, same guard as the modal's `dueDisabled`. */}
                            <div className="flex flex-col gap-3">
                                <Label>{t("flashcard.quiz.scopeLabel")}</Label>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("flashcard.quiz.scopeLabel")}
                                    value={scope}
                                    onChange={setScope}
                                    items={[
                                        {
                                            value: "all",
                                            content: (
                                                <span className="flex items-center gap-2">
                                                    <CardsIcon className="size-4" aria-hidden focusable="false" />
                                                    {t("flashcard.mode.fullLabel")}
                                                </span>
                                            ),
                                        },
                                        {
                                            value: "due",
                                            isDisabled: dueDisabled,
                                            content: (
                                                <span className="flex items-center gap-2">
                                                    <ClockCountdownIcon className="size-4" aria-hidden focusable="false" />
                                                    {t("flashcard.mode.dueLabel")}
                                                </span>
                                            ),
                                        },
                                    ]}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label>{t("flashcard.quiz.modeLabel")}</Label>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("flashcard.quiz.modeLabel")}
                                    value={mode}
                                    onChange={setMode}
                                    items={[
                                        {
                                            value: "quick",
                                            content: (
                                                <span className="flex items-center gap-2">
                                                    <LightningIcon className="size-4" aria-hidden focusable="false" />
                                                    {t("flashcard.quiz.modeQuick")}
                                                </span>
                                            ),
                                        },
                                        {
                                            value: "deep",
                                            content: (
                                                <span className="flex items-center gap-2">
                                                    <StackIcon className="size-4" aria-hidden focusable="false" />
                                                    {t("flashcard.quiz.modeDeep")}
                                                </span>
                                            ),
                                        },
                                    ]}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label>{t("flashcard.quiz.levelLabel")}</Label>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("flashcard.quiz.levelLabel")}
                                    value={level ?? "all"}
                                    onChange={(value) => setLevel(value === "all" ? null : value)}
                                    items={[
                                        { value: "all", content: t("flashcard.quiz.levelAll") },
                                        ...LEVELS.map((value) => ({
                                            value,
                                            content: t(`flashcard.level.${value}`),
                                        })),
                                    ]}
                                />
                            </div>
                        </LabeledCard>

                        {/* Zone 3 — CTA, standalone (matches the sibling tab's stacked-block rhythm
                    rather than being boxed inside Zone 2's card). Demoted to secondary/ghost
                    while Zone 0's resume card is shown — that card is the primary action then.
                    `isPending` while `startSession` draws + persists the run — the button stays
                    ON this screen and pending until either the destination page takes over
                    (success) or `startError` surfaces (failure); no more instant jump to a
                    separate building-skeleton screen (thầy, 2026-07-09). */}
                        <Button
                            variant={resumeData ? "secondary" : "primary"}
                            size="lg"
                            className="self-start"
                            isDisabled={!decks || totalCards === 0}
                            isPending={starting}
                            onPress={() => { void startSession() }}
                        >
                            {t("flashcard.quiz.begin")}
                            <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                        </Button>

                        {startError ? (
                            <Callout status="danger" title={startError} />
                        ) : null}
                    </>
                )}
            </div>
        )
    }

    // ── RECAP ────────────────────────────────────────────────────────────
    // Transient hand-off only — `finish()` navigates to the dedicated
    // `flashcards/quiz/sessions/[sessionId]/result` route once the completion
    // mutation resolves (2026-07-12: "done" is now answered by the ROUTE, not
    // re-derived client-side here), so this phase never has a real end state
    // to render — just the "saving" interim until that navigation lands.
    if (phase === "recap") {
        return (
            // KEEP the same `WorkSessionHeader` chrome the just-finished ACTIVE
            // phase used (2026-07-12, corrected: thầy wanted the loading state
            // to render like the active session's header, not swap to
            // `PageHeader` early). Segment bar reads full "done"
            // (`current === total` → every segment `success`), no `rightSlot`
            // (timer no longer meaningful once the run has ended).
            <div className={cn("flex w-full flex-col", className)}>
                <WorkSessionHeader
                    backLabel={t("flashcard.exit")}
                    onBack={exitToSetup}
                    title={t("flashcard.mode.quiz")}
                    identity={course?.title ? { name: course.title } : undefined}
                    counter={t("flashcard.quiz.progress", {
                        current: sessionLength,
                        total: sessionLength,
                    })}
                    current={sessionLength}
                    total={sessionLength}
                />
                <div className="px-4 pb-6 pt-10 sm:px-6">
                    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 py-10">
                        <Spinner size="lg" />
                        <Typography type="body-sm" color="muted">
                            {t("flashcard.quiz.result.savingLabel")}
                        </Typography>
                    </div>
                </div>
            </div>
        )
    }

    // ── ACTIVE ───────────────────────────────────────────────────────────
    // no cards after the level filter — offer a way back to setup. (A fresh draw
    // that fails to produce cards, or a load failure, is now caught earlier —
    // see `startError` on the setup screen — and never reaches here; this branch
    // is a resume-only guard, e.g. every persisted card was since deleted.)
    if (!card) {
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <EmptyState
                    icon={<CheckCircleIcon aria-hidden focusable="false" />}
                    title={t("flashcard.quiz.emptyAtLevel")}
                    action={
                        <Button size="sm" variant="secondary" onPress={() => setPhase("setup")}>
                            {t("flashcard.quiz.backToSetup")}
                        </Button>
                    }
                />
            </div>
        )
    }

    // shared header: WorkSessionHeader (course identity + step counter +
    // progress segments, combo chip in the right slot) — same shell as the
    // mock-interview's work-surface header. Level/tag chips moved OUT of this
    // header into the question card's own body via `belowFront`/inline (thầy
    // 2026-07-13: "chip của hỏi nhanh bỏ dưới câu hỏi theo rules ôn tập" —
    // matching the same move already done for `FlashcardReviewer`/`DueReview`,
    // per-card meta belongs to the card body, not the fixed session chrome —
    // `components/card.md` Đính chính 2026-07-13).
    const header = (
        <WorkSessionHeader
            backLabel={t("flashcard.exit")}
            onBack={exitToSetup}
            title={t("flashcard.mode.quiz")}
            identity={course?.title ? { name: course.title } : undefined}
            counter={t("flashcard.quiz.progress", {
                current: index + 1,
                total: sessionLength,
            })}
            current={index}
            total={sessionLength}
            rightSlot={
                <span className="flex shrink-0 items-center gap-3">
                    {remainingSeconds !== null ? (
                        <span
                            className={cn(
                                "flex shrink-0 items-center gap-1.5",
                                remainingSeconds <= TIME_LIMIT_WARNING_SECONDS && "text-warning",
                            )}
                        >
                            <ClockIcon className="size-4" aria-hidden focusable="false" />
                            <Typography type="body-sm" weight="medium" className="tabular-nums">
                                {formatElapsed(remainingSeconds)}
                            </Typography>
                        </span>
                    ) : null}
                    {combo > 1 ? (
                        <Chip size="sm" variant="soft" color="warning">
                            <FlameIcon className="size-4" aria-hidden focusable="false" />
                            {t("flashcard.quiz.comboChip", { combo })}
                        </Chip>
                    ) : null}
                </span>
            }
        />
    )

    // ── FALLBACK: card has no clozable key terms → plain flip + self-grade ──
    if (!cloze) {
        return (
            <div className={cn("flex w-full flex-col", className)}>
                {header}
                <div className="px-4 pb-6 pt-10 sm:px-6">
                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                        <FlipCard
                            revealed={showAnswer}
                            questionLabel={t("flashcard.questionLabel")}
                            answerLabel={t("flashcard.answerLabel")}
                            front={<MarkdownContent markdown={card.question} />}
                            belowFront={card.level || (card.tags?.length ?? 0) > 0 ? (
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
                            back={
                                <>
                                    {card.answer ? (
                                        <MarkdownContent markdown={card.answer} arcSections />
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
                            <div className="flex flex-col gap-3">
                                <Label>{t("flashcard.review.rateHint")}</Label>
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
                </div>
            </div>
        )
    }

    // ── CLOZE: fill blanks → check → read full answer → SM-2 ───────────────
    const allFilled = filled.every((value) => value !== null)
    // `cloze.blanks[blankIndex]?.` guards the same transient-render crash as
    // `filled[segment.index] ?? null` above: for one render tick right after
    // `commitCard` advances to the next card, `cloze` has ALREADY recomputed
    // for it (possibly with FEWER blanks) while `filled`/`checked` still hold
    // the PREVIOUS (possibly longer) card's values — `cloze.blanks[blankIndex]`
    // then reads `undefined` for an out-of-range index, crashing on
    // `.toLowerCase()`. Optional-chaining just makes that comparison `false`
    // for this one tick; the reset effect below realigns everything right after.
    const correctCount = checked
        ? filled.filter((value, blankIndex) =>
            value !== null && value.toLowerCase() === cloze.blanks[blankIndex]?.toLowerCase(),
        ).length
        : 0
    const coverageRatio = cloze.blanks.length > 0 ? correctCount / cloze.blanks.length : 0

    return (
        // scoped per-card (`card.id`) so the word-bank ↔ blank `layoutId` FLIP never
        // leaks its animation into the NEXT card's chips once `cloze` recomputes.
        <LayoutGroup id={`quiz-cloze-${card.id}`}>
            <div className={cn("flex w-full flex-col", className)}>
                {header}

                <div className="px-4 pb-6 pt-10 sm:px-6">
                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                        {/* question — plain Card shell (bo góc + shadow-surface), CÙNG kiểu với
                    FlipCard — the earlier accent/5 + left-border tint (2026-07-09) was
                    reverted the same day (thầy: "ý là bỏ cái kiểu bg hồng với border...
                    render plain Card như bth thôi") — 1 Card duy nhất xuyên suốt feature,
                    không mỗi màn 1 "ngôn ngữ" riêng. Tách RIÊNG khỏi phần điền cloze bên
                    dưới (thầy 2026-07-11: "tách phần điền và câu hỏi ra làm 2 labeled card
                    khác nhau") — đây là 2 bounded object khác BẢN CHẤT (nội dung đọc TĨNH
                    vs bài tập điền TƯƠNG TÁC), khác với rule "1 item + thuộc tính riêng của
                    nó ở chung 1 card" ([[concepts/card]] — case đó là 1 item + metadata CỦA
                    CHÍNH nó, không phải nội dung + 1 bài tập riêng dựa trên nội dung đó). */}
                        {/* question card + its level/tag chips as a `gap-3` group — chips
                            ride OUTSIDE/BELOW the card (thầy: "nằm ngoài card cách card
                            gap-3 ấy"), not inside its content — mirrors `FlipCard`'s own
                            internal `belowFront` structure (question + chips = gap-3,
                            that whole group ↔ next card = the outer gap-6). */}
                        <div className="flex flex-col gap-3">
                            <LabeledCard label={t("flashcard.questionLabel")}>
                                <MarkdownContent markdown={card.question} />
                            </LabeledCard>
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
                        </div>

                        <LabeledCard label={t("flashcard.quiz.fillLabel")} contentClassName="flex flex-col gap-3">
                            <Typography type="body-xs" weight="medium" color="muted">
                                {t("flashcard.quiz.clozeInstruction")}
                            </Typography>
                            <p className="text-base leading-loose text-foreground">
                                {cloze.segments.map((segment, position) =>
                                    segment.kind === "text" ? (
                                        <span key={position}>{segment.text}</span>
                                    ) : segment.kind === "code" ? (
                                    // same inline-code styling as MarkdownContent's own renderer
                                    // (reuseable/MarkdownContent/map.tsx) — kept consistent since this
                                    // sentence sits right next to the question's own MarkdownContent.
                                        <code
                                            key={position}
                                            className="rounded-md bg-default px-1 py-0.5 font-mono text-sm text-foreground [overflow-wrap:anywhere]"
                                        >
                                            {segment.text}
                                        </code>
                                    ) : segment.kind === "bold" ? (
                                        <strong key={position} className="font-semibold">{segment.text}</strong>
                                    ) : segment.kind === "italic" ? (
                                        <em key={position}>{segment.text}</em>
                                    ) : (
                                        (() => {
                                            // `?? null` guards a real crash: for one render tick right after
                                            // `commitCard` advances `index` (before the card-change effect
                                            // resets `filled`), `cloze` has ALREADY recomputed for the new
                                            // (possibly longer) card while `filled` still holds the previous
                                            // card's (possibly shorter) array — `filled[segment.index]` then
                                            // reads `undefined`, which slips past a `!== null` guard and
                                            // crashes on `.toLowerCase()`. Coercing to `null` here makes every
                                            // downstream `=== null` check treat it the same as "not filled yet".
                                            const value = filled[segment.index] ?? null
                                            const isCorrect =
                                        checked
                                        && value !== null
                                        && value.toLowerCase() === cloze.blanks[segment.index].toLowerCase()
                                        // empty = dashed-outline "slot" chip, filled surface (canon
                                        // `input.md` §1 — a fill-in affordance sitting on a surface must
                                        // have a real bg-surface fill, never bg-transparent, or it reads
                                        // as a dead patch of the page instead of a field); filled +
                                        // unchecked = solid accent (primary-solid — canon
                                        // `elements/color.md` §3, NOT a `/10` tint); checked = keep the
                                        // existing success/danger tint + shake/pop animation.
                                            const chipToneClassName = value === null
                                                ? "border border-dashed border-default bg-surface text-muted"
                                                : !checked
                                                    ? "border-0 bg-accent text-accent-foreground"
                                                    : isCorrect
                                                        ? "border border-success/60 bg-success/10 text-success motion-safe:[animation:blankPop_0.35s_ease]"
                                                        : "border border-danger/60 bg-danger/10 text-danger motion-safe:[animation:blankShake_0.4s_ease]"
                                            // shared `layoutId` with the SAME term's word-bank chip below — when
                                            // `placeTerm`/`clearBlank` swaps `value`, framer-motion FLIPs the
                                            // chip's bounding box across the two positions ("flies" into/out of
                                            // the slot). `undefined` while empty — nothing to morph from/to yet.
                                            const layoutId = value !== null ? `quiz-term-${card.id}-${value}` : undefined
                                            return (
                                                <motion.span
                                                    key={position}
                                                    layout
                                                    layoutId={layoutId}
                                                    transition={reduceMotion ? { duration: 0 } : CLOZE_CHIP_TRANSITION}
                                                    className="mx-1 inline-block align-middle"
                                                >
                                                    <button
                                                        type="button"
                                                        disabled={checked || value === null}
                                                        onClick={() => clearBlank(segment.index)}
                                                        className={!checked && value !== null ? "cursor-pointer" : undefined}
                                                    >
                                                        <Chip
                                                            size="sm"
                                                            // HeroUI bakes `.chip`/`.chip--sm`'s font-size as an
                                                            // UNLAYERED style (same trap as radius.md's rounded-*
                                                            // warning) — a `text-sm` utility class silently loses
                                                            // to it. Only an inline style (always highest
                                                            // specificity) actually overrides it; reuse the
                                                            // design system's own `--text-sm` token, not a raw px.
                                                            style={{ fontSize: "var(--text-sm)" }}
                                                            className={cn(
                                                                "min-w-16 justify-center rounded-full px-3 py-0.5 font-medium transition-colors",
                                                                chipToneClassName,
                                                            )}
                                                        >
                                                            {value ?? "···"}
                                                        </Chip>
                                                    </button>
                                                </motion.span>
                                            )
                                        })()
                                    ),
                                )}
                            </p>
                            {/* after checking, surface the right term for any blank got wrong */}
                            {checked && correctCount < cloze.blanks.length ? (
                                <Typography type="body-xs" color="muted">
                                    {t("flashcard.quiz.clozeResult", {
                                        correct: correctCount,
                                        total: cloze.blanks.length,
                                    })}
                                </Typography>
                            ) : null}
                        </LabeledCard>

                        {/* the word bank: correct terms + sibling distractors — a used term is
                    REMOVED here entirely (not just dimmed): it "flew" into its blank via
                    the shared `layoutId` above, so leaving a disabled ghost behind would
                    read as 2 copies of the same chip. loose on the page (no card wrapper)
                    — it's a bank of CHIPS to pick from, not a content surface; the tinted
                    question block above is the only card here (thầy 2026-07-09: "ngân
                    hàng từ để trong card làm gì? bỏ ra ngoài card"). */}
                        {!checked ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-3">
                                    {/* label for a group of pickable chips below — canon `label.md`
                                §1b: a section header naming a control/option GROUP uses `<Label>`,
                                never a hand-rolled muted Typography caption. */}
                                    <Label>{t("flashcard.quiz.wordBankLabel")}</Label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {cloze.bank
                                            .filter((term) => !filled.includes(term))
                                            .map((term) => (
                                                <motion.button
                                                    key={term}
                                                    type="button"
                                                    layout
                                                    layoutId={`quiz-term-${card.id}-${term}`}
                                                    transition={reduceMotion ? { duration: 0 } : CLOZE_CHIP_TRANSITION}
                                                    onClick={() => placeTerm(term)}
                                                    // a "pick me" tile feel (Quizlet/Duolingo token
                                                    // convention) — lift on hover instead of sitting flat.
                                                    className="cursor-pointer transition-transform hover:-translate-y-0.5"
                                                >
                                                    <Chip
                                                        size="sm"
                                                        className="rounded-full border border-default bg-surface px-3 py-0.5 text-sm font-medium"
                                                    >
                                                        {term}
                                                    </Chip>
                                                </motion.button>
                                            ))}
                                    </div>
                                </div>
                                <Button
                                    variant="primary"
                                    className="self-start"
                                    isDisabled={!allFilled}
                                    onPress={() => setChecked(true)}
                                >
                                    {t("flashcard.quiz.checkAnswer")}
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
                                        {t("flashcard.quiz.clozeResult", {
                                            correct: correctCount,
                                            total: cloze.blanks.length,
                                        })}
                                    </Typography>
                                </div>

                                {/* read the full model answer (the 5-layer reasoning), then self-grade */}
                                {showAnswer ? (
                                    <LabeledCard label={t("flashcard.answerLabel")} contentClassName="flex flex-col gap-3">
                                        <MarkdownContent markdown={card.answer ?? ""} arcSections />
                                        {card.explanation ? <MarkdownContent markdown={card.explanation} /> : null}
                                    </LabeledCard>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="self-start"
                                        onPress={() => setShowAnswer(true)}
                                    >
                                        {t("flashcard.quiz.showSolution")}
                                    </Button>
                                )}

                                {showAnswer ? (
                                    <div className="flex flex-col gap-3">
                                        <Label>{t("flashcard.review.rateHint")}</Label>
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
                </div>
            </div>
        </LayoutGroup>
    )
}

