"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { LayoutGroup, motion, useReducedMotion } from "framer-motion"
import { Button, Chip, Label, ScrollShadow, Typography, cn } from "@heroui/react"
import {
    ArrowRightIcon,
    ArrowsClockwiseIcon,
    CheckCircleIcon,
    ClockIcon,
    FlameIcon,
    LightningIcon,
    LockKeyIcon,
    MicrophoneStageIcon,
    StackIcon,
    XCircleIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { SM2_GRADES } from "../constants"
import { parseAnswerKeywords } from "./parse-answer-keywords"
import { buildCloze, type ClozeQuestion } from "./build-cloze"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { mutateReviewFlashcard } from "@/modules/api/graphql/mutations/mutation-review-flashcard"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql/queries/query-flashcard-decks-by-course"
import { queryFlashcardDeck } from "@/modules/api/graphql/queries/query-flashcard-deck"
import { type FlashcardCardEntity } from "@/modules/types/entities/flashcard-card"
import { type QuizSessionReadinessData, type QuizSessionWeakTagData } from "@/modules/api/graphql/mutations/types/complete-flashcard-quiz-session"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { Callout } from "@/components/blocks/feedback/Callout"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { StatPair } from "@/components/blocks/stats/StatPair"
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
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
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
    // trial vs enrolled — drives the recap's Zone E enroll-upsell (primary for trial viewers)
    // and gates Zone D (AI Mock Interview cross-link, only relevant once actually enrolled).
    // Populated globally by `learn/layout.tsx` (`useQueryCourseEnrollmentStatusSwr`).
    const enrolled = useAppSelector((state) => state.user.enrolled)
    // `enrolled` defaults to false, so only trust it once the status query has settled —
    // otherwise a genuinely enrolled viewer would flash the trial-upsell (Zone E) on cold load.
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)
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

    // SM-2 grade buttons, localized for the rating bar
    const ratingOptions = useMemo(
        () => SM2_GRADES.map((grade) => ({ grade: grade.grade, label: t(grade.labelKey) })),
        [t],
    )

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
                return payload.data?.cards ?? []
            }),
        )
        const anyDeckFailed = settled.some((result) => result.status === "rejected")
        const deckPayloads = settled
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value)
        const pool: Array<QuizCard> = deckPayloads
            .flat()
            .filter((card) => Boolean(card.answer))
            .map((card) => ({ ...card, keywords: parseAnswerKeywords(card.answer ?? "") }))
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
                pool.filter((card) => level === null || card.level === level),
            ).slice(0, sessionLength)

            if (drawn.length === 0) {
                // an empty pool only means "no cards at this level" when every deck
                // fetch actually succeeded — otherwise it's a load failure in disguise
                setStartError(
                    anyDeckFailed
                        ? t("flashcard.quiz.sessionLoadErrorTitle")
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
    }, [decks, starting, level, sessionLength, t, courseHeaders, courseId, mode, runStart, inProgressSessionSwr, displayId, locale, router])

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
            setIndex(Math.min(data.currentIndex, restoredCards.length - 1))
            setResults(restoredResults)
            setCombo(0)
            setBestCombo(0)
            setXpEarned(0)
            setDailyCapReached(false)
            setWeakTags([])
            setReadiness(null)
            completedRef.current = false
            setResumeError(null)
            setPhase("active")
        })()
    }, [resumeSessionId, decks, inProgressSessionSwr.isLoading, inProgressSessionSwr.data, fetchCardPool, t])

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

    const card = sessionCards[index]

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
            const nextIndex = index < sessionLength - 1 ? index + 1 : index
            // best-effort, fire-and-forget persistence for resume — never blocks
            // advancing the quiz, and a failed sync only degrades resumability
            if (sessionId.current) {
                void runSyncProgress
                    .trigger({
                        request: {
                            sessionId: sessionId.current,
                            currentIndex: nextIndex,
                            results: nextResults.map((result) => ({
                                cardId: result.cardId,
                                correctBlanks: result.correctBlanks,
                                totalBlanks: result.totalBlanks,
                            })),
                        },
                        headers: courseHeaders,
                    })
                    .catch(() => {})
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
                                    ctaLabel={t("flashcard.quiz.resumeCta")}
                                    href={learnPath.flashcards().quiz(resumeData.sessionId).build()}
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
                            <div className="flex flex-col gap-3">
                                <Label>{t("flashcard.quiz.modeLabel")}</Label>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("flashcard.quiz.modeLabel")}
                                    value={mode}
                                    onChange={setMode}
                                    insideCard
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
                                    insideCard
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
                {/* same work-surface header as the active phase — current=total reads every
                    segment as complete ("done") now that the run has ended. */}
                <WorkSessionHeader
                    backLabel={t("flashcard.quiz.exitToSetup")}
                    onBack={exitToSetup}
                    identity={course?.title ? { name: course.title } : undefined}
                    counter={t("flashcard.quiz.recapTitle")}
                    current={sessionLength}
                    total={sessionLength}
                />
                {/* body reads as a centered column under the edge-to-edge header band —
                    same split as MockInterviewSession's work-surface (header full width,
                    body `mx-auto max-w-*`); recap previously stretched full-bleed. */}
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                    {/* Zone A+B — `LabeledCard` (label OUTSIDE + a REAL framed `<Card>`), not a
                    hand-rolled `bg-surface` div with the label stuffed inside (thầy
                    2026-07-09: "cam render dạng labeled card"). */}
                    <LabeledCard label={t("flashcard.quiz.recapTitle")} contentClassName="flex flex-col gap-6">
                        <Typography type="h4" weight="semibold">
                            {t("flashcard.quiz.answeredWithoutHint", {
                                count: fullyCorrect,
                                total: results.length,
                            })}
                        </Typography>

                        {/* Zone B — metric readout: each cell is a bounded BORDERED sub-card
                        (transparent bg, not another fill) — this row sits INSIDE the
                        `LabeledCard`'s own framed `<Card>`, so per [[card]] §4
                        surface-in-surface a nested cell gets a BORDER, not a 2nd opaque
                        fill (thầy: "đỏ render dạng surface in surface, có border"; a
                        totally frameless `StatPair` row read as no boundary at all —
                        undercorrected the earlier card-in-card fix). `StatPair` still owns
                        the value/label typography; the border wrapper is the only addition. */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-default p-3">
                                <StatPair
                                    value={`x${bestCombo}`}
                                    label={t("flashcard.quiz.bestCombo")}
                                />
                            </div>
                            <div className="rounded-xl border border-default p-3">
                                <StatPair
                                    value={`+${xpEarned}`}
                                    label={t("flashcard.quiz.xpEarned")}
                                />
                            </div>
                            <div className="rounded-xl border border-default p-3">
                                <StatPair
                                    value={`${avgCoverage}%`}
                                    label={t("flashcard.quiz.avgCoverage")}
                                />
                            </div>
                        </div>

                        {dailyCapReached ? (
                            <Typography type="body-xs" color="muted">
                                {t("flashcard.quiz.dailyCapReached")}
                            </Typography>
                        ) : null}

                        {xpEarned > 0 ? (
                            <Typography type="body-xs" color="muted">
                                {t("flashcard.quiz.xpAddedToLeaderboard")}
                            </Typography>
                        ) : null}
                    </LabeledCard>

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

                    {/* quiet, self-hiding "practice this too" — course-wide RAG search auto-queried
                    on the SAME weak tags Zone C already resolved to a lesson (no typing);
                    additive since it can ALSO surface challenges/milestone tasks/other decks,
                    which the tag→lesson-only mapping above never considers. */}
                    {displayId && topWeakTags.length > 0 ? (
                        <RelatedContentList
                            courseId={courseId}
                            courseDisplayId={displayId}
                            query={topWeakTags.map((tag) => tag.tag).join(" ")}
                            label={t("flashcard.quiz.relatedContentLabel")}
                        />
                    ) : null}

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
                        {t("flashcard.quiz.practiceMore")}
                        <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                    </Button>
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

    // shared header: WorkSessionHeader (course identity + step counter + level/tag
    // meta chips inline + progress segments, combo chip in the right slot) — same
    // shell as the mock-interview's work-surface header. Level/tag folded INTO the
    // header row (thầy 2026-07-11: "bỏ mấy cái tag lên cái thanh navbar phụ") —
    // no separate chip row underneath anymore.
    const header = (
        <WorkSessionHeader
            backLabel={t("flashcard.quiz.exitToSetup")}
            onBack={exitToSetup}
            identity={course?.title ? { name: course.title } : undefined}
            counter={t("flashcard.quiz.progress", {
                current: index + 1,
                total: sessionLength,
            })}
            current={index}
            total={sessionLength}
            meta={card.level || (card.tags?.length ?? 0) > 0 ? (
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
            <div className={cn("flex flex-col gap-6", className)}>
                {header}
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                    <FlipCard
                        revealed={showAnswer}
                        onToggle={() => setShowAnswer((flipped) => !flipped)}
                        ariaLabel={showAnswer ? t("flashcard.showQuestion") : t("flashcard.showAnswer")}
                        frontHint={
                            <>
                                <ArrowsClockwiseIcon className="size-3.5" aria-hidden focusable="false" />
                                {t("flashcard.flipHint")}
                            </>
                        }
                        backHint={
                            <>
                                <ArrowsClockwiseIcon className="size-3.5" aria-hidden focusable="false" />
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
            <div className={cn("flex flex-col gap-6", className)}>
                {header}

                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                    {/* question + cloze — plain Card shell (bo góc + shadow-surface), CÙNG kiểu
                    với FlipCard — the earlier accent/5 + left-border tint (2026-07-09) was
                    reverted the same day (thầy: "ý là bỏ cái kiểu bg hồng với border...
                    render plain Card như bth thôi") — 1 Card duy nhất xuyên suốt feature,
                    không mỗi màn 1 "ngôn ngữ" riêng. */}
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
                                        // empty = dashed-outline "slot" chip; filled + unchecked = solid
                                        // accent (primary-solid — canon `elements/color.md` §3, NOT a
                                        // `/10` tint); checked = keep the existing success/danger tint +
                                        // shake/pop animation.
                                        const chipToneClassName = value === null
                                            ? "border border-dashed border-default bg-transparent text-muted"
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
                                                        className={cn(
                                                            "min-w-16 justify-center rounded-full px-3 py-0.5 text-sm font-medium transition-colors",
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
                    </div>

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
                                <Typography type="body-xs" weight="medium" color="muted">
                                    {t("flashcard.quiz.wordBankLabel")}
                                </Typography>
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
                                    {t("flashcard.quiz.showSolution")}
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
            </div>
        </LayoutGroup>
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
                    {t("flashcard.quiz.upsellTitle")}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {t("flashcard.quiz.upsellDescription")}
                </Typography>
            </div>
            <Button
                variant="primary"
                size="lg"
                className="mt-1 w-full max-w-xs"
                onPress={onEnroll}
            >
                {t("flashcard.quiz.upsellCta")}
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
                    {t("flashcard.quiz.weakTagCoverage", { percent: Math.round(tag.coverage * 100) })}
                </Typography>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent">
                {t("flashcard.quiz.reviewLesson")}
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
            <LabeledCard label={t("flashcard.quiz.weakTagsTitle")} contentClassName="flex flex-col gap-3">
                <Typography type="body-sm" color="muted">
                    {t("flashcard.quiz.weakTagsEmpty")}
                </Typography>
                <Button
                    variant="primary"
                    className="self-start"
                    onPress={() => router.push(genericHref)}
                >
                    {t("flashcard.quiz.continueLearning")}
                    <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                </Button>
            </LabeledCard>
        ) : (
            <Button
                variant="tertiary"
                size="sm"
                className="self-start"
                onPress={() => router.push(genericHref)}
            >
                {t("flashcard.quiz.continueLearning")}
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
                {t("flashcard.quiz.weakTagSecondaryLink", { tag: first.tag })}
                <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
            </Button>
        )
    }

    return (
        <LabeledCard label={t("flashcard.quiz.weakTagsTitle")} contentClassName="flex flex-col gap-3">
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
        </LabeledCard>
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
                title={t("flashcard.quiz.readinessLockedTitle")}
                description={t("flashcard.quiz.readinessLockedDescription", {
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
            title={t("flashcard.quiz.readinessUnlockedTitle")}
            description={t("flashcard.quiz.readinessUnlockedDescription")}
            action={(
                <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onPress={() => router.push(mockInterviewHref)}
                >
                    {t("flashcard.quiz.readinessUnlockedCta")}
                    <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                </Button>
            )}
        />
    )
}

