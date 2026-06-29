"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { Button, Card, CardContent, Chip, Label, Spinner, Typography, cn } from "@heroui/react"
import { LightningIcon, ListNumbersIcon, MicrophoneIcon, RobotIcon, StackIcon, StairsIcon, TargetIcon } from "@phosphor-icons/react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { SegmentedControl } from "@/components/blocks/navigation/SegmentedControl"
import { SelectableCardGroup } from "@/components/blocks/navigation/SelectableCardGroup"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { GradeModelDropdown, type GradeModelSelection } from "@/components/blocks/grading/GradeModelDropdown"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { InterviewSessionSkeleton } from "./InterviewSessionSkeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { queryDrawInterviewCard } from "@/modules/api/graphql/queries/query-draw-interview-card"
import { queryMyInterviewHistory } from "@/modules/api/graphql/queries/query-my-interview-history"
import type { InterviewCardData } from "@/modules/api/graphql/queries/types/draw-interview-card"
import type { InterviewGradeResultData } from "@/modules/api/graphql/mutations/types/grade-interview-answer"
import type { AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { AiMode } from "@/modules/api/graphql/queries/query-my-ai-settings"
import { AiModelCategory, AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import { InterviewVerdict } from "@/modules/api/graphql/mutations/types/grade-interview-answer"
import { useMutateGradeInterviewAnswerSwr } from "@/hooks/swr/api/graphql/mutations/useMutateGradeInterviewAnswerSwr"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { useGraphQLWithToast } from "@/modules/toast/hooks"

/** Props for {@link InterviewSession}. */
export interface InterviewSessionProps extends WithClassNames<undefined> {
    /** Course to draw random interview questions across (random mode, no topic pick). */
    courseId: string
}

/**
 * The phases of one mock-interview session. `active` collects every spoken answer
 * (no verdict between questions — realistic interview); `grading` then grades the
 * whole batch sequentially; `summary` shows the scorecard.
 */
type InterviewPhase = "setup" | "active" | "grading" | "summary"

/** One spoken answer stored during `active`, queued for end-of-session grading. */
interface PendingAnswer {
    /** Deck the question belongs to (needed by the grade mutation). */
    deckId: string
    /** Card whose model answer drives the grading. */
    cardId: string
    /** The question prompt (echoed back in the scorecard). */
    question: string
    /** The transcribed spoken answer. */
    transcript: string
    /** Technology tags of the question (weak-topic aggregation). */
    tags: Array<string>
    /** Seniority level of the question, if any. */
    level: string | null
}

/** A graded answer in the scorecard — the model result plus its source question. */
interface GradedAnswer extends InterviewGradeResultData {
    /** The question prompt this grade is for. */
    question: string
    /** Technology tags of the question (weak-topic aggregation). */
    tags: Array<string>
}

/** Practice modes that change how a session runs. `quick`/`deep` only differ in
 * length and ship now; `weak` (drill weak tags) + `ladder` (level progression)
 * need backend support (tag-filtered draw / per-level history) → shown coming-soon. */
type InterviewMode = "quick" | "deep"

/** Question count per practice mode. */
const MODE_LENGTH: Record<InterviewMode, number> = { quick: 5, deep: 10 }

/** Seniority levels offered at setup (mirrors the backend `FlashcardLevel` enum). */
const LEVELS = ["junior", "middle", "senior", "staff"] as const

/** HeroUI Chip color per interview seniority level (mirrors the reviewer). */
const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "accent"> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/** Mid-tier and above — the only categories offered for interview grading. */
const INTERVIEW_GRADE_CATEGORIES: ReadonlyArray<AiModelCategory> = [
    AiModelCategory.Balanced,
    AiModelCategory.Premium,
    AiModelCategory.Frontier,
]

/** Auto lane (balancer picks) — the default grading selection. */
const AUTO_SELECTION: GradeModelSelection = {
    mode: AiMode.Auto,
    model: null,
    provider: null,
}

/** Soft, borderless surface shared by the question + transcript panels. */
const PANEL_CLASS = "flex flex-col gap-3 rounded-xl bg-default/40 p-8"

/**
 * Voice mock-interview over a course, run as a fixed-length session graded AT THE
 * END (no verdict between questions — realistic interview): the learner optionally
 * picks a practice mode + seniority level + a grading model (mid-tier and above),
 * then answers a fixed number of questions aloud. Each answer is transcribed
 * client-side and queued; after the last answer the whole batch is graded
 * sequentially, then a scorecard aggregates the average score, the verdict
 * breakdown, the weakest topics, and a per-question feedback list. Draw is an
 * imperative one-shot query (random pick per question, de-duplicated within the
 * session).
 * @param props - {@link InterviewSessionProps}
 */
export const InterviewSession = ({ courseId, className }: InterviewSessionProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // recognize speech in the active UI locale (Web Speech wants a BCP-47 tag)
    const recognitionLang = locale === "vi" ? "vi-VN" : "en-US"
    // mock interview is enrolled-only → send the course header for the backend guard
    const courseHeaders = useMemo<GraphQLHeaders>(
        () => ({ [GraphQLHeadersKey.XCourseId]: courseId }),
        [courseId],
    )

    const {
        supported,
        listening,
        transcript,
        interimTranscript,
        error: speechError,
        start,
        stop,
        reset,
    } = useSpeechRecognition({ lang: recognitionLang })

    const { trigger: gradeAnswer } = useMutateGradeInterviewAnswerSwr()
    const runGraphQL = useGraphQLWithToast()

    // grading-model catalog + entitlement (paid OR enrolled unlocks mid+ tiers).
    // Mirrors ChallengeSubmissionPanel's enrollment/entitlement source.
    const aiModelsSwr = useQueryAiModelsSwr()
    const myAiSettingsSwr = useQueryMyAiSettingsSwr()
    const canPremium = Boolean(myAiSettingsSwr.data?.canPremium)
    // models suited for interview grading: mid-tier and above + lists the Grading task.
    const interviewModels = useMemo<Array<AiGradableModel>>(
        () => (aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []).filter(
            (model) =>
                INTERVIEW_GRADE_CATEGORIES.includes(model.category)
                && (model.supportedTasks?.length
                    ? model.supportedTasks.includes(AiModelTask.Grading)
                    : true),
        ),
        [aiModelsSwr.data],
    )

    // which phase the session is in
    const [phase, setPhase] = useState<InterviewPhase>("setup")
    // chosen seniority level (null = any level)
    const [level, setLevel] = useState<string | null>(null)
    // chosen practice mode → drives the session length
    const [mode, setMode] = useState<InterviewMode>("quick")
    // chosen grading lane + model (Auto by default)
    const [selection, setSelection] = useState<GradeModelSelection>(AUTO_SELECTION)
    // how many questions this session runs (derived from the mode)
    const sessionLength = MODE_LENGTH[mode]
    // zero-based index of the current question within the session
    const [index, setIndex] = useState(0)
    // the currently drawn question (null while drawing / on draw failure)
    const [card, setCard] = useState<InterviewCardData | null>(null)
    // true while a draw is in flight
    const [drawing, setDrawing] = useState(false)
    // typed draw failure message, or null
    const [drawError, setDrawError] = useState<string | null>(null)
    // answers collected this session, awaiting end-of-session grading
    const [pendingAnswers, setPendingAnswers] = useState<Array<PendingAnswer>>([])
    // graded results (drives the scorecard), filled during the grading phase
    const [gradedResults, setGradedResults] = useState<Array<GradedAnswer>>([])
    // how many answers have been graded so far (n of N progress)
    const [gradedCount, setGradedCount] = useState(0)
    // grade failure message, or null
    const [gradeError, setGradeError] = useState<string | null>(null)
    // card ids already drawn this session — avoids repeats across questions
    const seenIds = useRef<Set<string>>(new Set())

    // the viewer's cross-session history for this deck (persisted server-side per
    // graded answer); `mutate` refreshes it after a session adds new attempts
    const { data: history, mutate: refreshHistory } = useSWR(
        ["interview-history", courseId],
        async () => {
            const response = await queryMyInterviewHistory({
                request: { courseId },
                headers: courseHeaders,
            })
            return response.data?.myInterviewHistory.data ?? null
        },
    )

    // draw a fresh (un-seen) random question for the current slot
    const drawCurrent = useCallback(async () => {
        setDrawing(true)
        setDrawError(null)
        reset()
        try {
            let drawn: InterviewCardData | null = null
            // redraw a few times to dodge a repeat within the session (decks are small)
            for (let attempt = 0; attempt < 5; attempt += 1) {
                const response = await queryDrawInterviewCard({
                    request: { courseId, level },
                    headers: courseHeaders,
                })
                const payload = response.data?.drawInterviewCard
                // typed backend failure (e.g. no gradable card at this level)
                if (!payload?.success || !payload.data) {
                    setDrawError(payload?.message ?? t("flashcard.interview.drawError"))
                    setCard(null)
                    return
                }
                drawn = payload.data
                if (!seenIds.current.has(drawn.id)) {
                    break
                }
            }
            if (drawn) {
                seenIds.current.add(drawn.id)
                setCard(drawn)
            }
        } catch {
            setDrawError(t("flashcard.interview.drawError"))
            setCard(null)
        } finally {
            setDrawing(false)
        }
    }, [courseId, level, reset, t, courseHeaders])

    // while active, (re)draw whenever the slot index changes
    useEffect(() => {
        if (phase === "active") {
            void drawCurrent()
        }
    }, [phase, index, drawCurrent])

    // grade the queued answers sequentially, then move to the scorecard.
    const runGrading = useCallback(
        async (answers: Array<PendingAnswer>) => {
            setGradeError(null)
            setGradedCount(0)
            setGradedResults([])
            const collected: Array<GradedAnswer> = []
            for (const answer of answers) {
                let graded: InterviewGradeResultData | null = null
                const ok = await runGraphQL(async () => {
                    const response = await gradeAnswer({
                        flashcardDeckId: answer.deckId,
                        flashcardCardId: answer.cardId,
                        transcript: answer.transcript,
                        // omit on the Auto lane → balancer picks; otherwise pin the model
                        selectedModel: selection.model ?? undefined,
                        selectedModelProvider: selection.provider ?? undefined,
                    })
                    const payload = response.data?.gradeInterviewAnswer
                    graded = payload?.data ?? null
                    return (
                        payload ?? {
                            success: false,
                            message: t("flashcard.interview.gradeError"),
                        }
                    )
                })
                if (ok && graded) {
                    const result = graded as InterviewGradeResultData
                    collected.push({ ...result, question: answer.question, tags: answer.tags })
                } else {
                    setGradeError(t("flashcard.interview.gradeError"))
                }
                setGradedCount((previous) => previous + 1)
            }
            setGradedResults(collected)
            // attempts are now persisted server-side → refresh the cross-session history
            void refreshHistory()
            setPhase("summary")
        },
        [gradeAnswer, runGraphQL, selection, t, refreshHistory],
    )

    // begin a session at the chosen level: reset all per-session state
    const startSession = useCallback(() => {
        seenIds.current.clear()
        setPendingAnswers([])
        setGradedResults([])
        setGradedCount(0)
        setGradeError(null)
        setIndex(0)
        setPhase("active")
    }, [])

    // store the current spoken answer and advance; grade the batch after the last one.
    const nextQuestion = useCallback(() => {
        if (!card || transcript.trim().length === 0) {
            return
        }
        if (listening) {
            stop()
        }
        const answer: PendingAnswer = {
            deckId: card.deckId,
            cardId: card.id,
            question: card.question,
            transcript: transcript.trim(),
            tags: card.tags ?? [],
            level: card.level ?? null,
        }
        const nextAnswers = [...pendingAnswers, answer]
        setPendingAnswers(nextAnswers)
        if (index < sessionLength - 1) {
            setIndex((previous) => previous + 1)
        } else {
            // last answer recorded → grade the whole batch
            setPhase("grading")
            void runGrading(nextAnswers)
        }
    }, [card, transcript, listening, stop, pendingAnswers, index, sessionLength, runGrading])

    // ── SETUP — readiness hub (single column, no bento split) ────────────
    if (phase === "setup") {
        // weak/ladder need backend (tag-filtered draw / per-level history) → coming-soon
        const comingSoonBadge = (
            <span className="text-xs text-muted">{t("flashcard.interview.comingSoon")}</span>
        )
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <Card>
                    <CardContent className="flex flex-col gap-6">
                        {/* hero: mic + headline */}
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                                <MicrophoneIcon className="size-6" aria-hidden focusable="false" />
                            </div>
                            <div className="flex flex-col">
                                <Typography type="h4" weight="semibold">
                                    {t("flashcard.interview.setupTitle")}
                                </Typography>
                                <Typography type="body-sm" color="muted">
                                    {t("flashcard.interview.setupSubtitle")}
                                </Typography>
                            </div>
                        </div>

                        {/* what to expect — quick chips */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Chip size="sm" variant="soft" color="default">
                                <ListNumbersIcon className="size-4" aria-hidden focusable="false" />
                                {t("flashcard.interview.expectCount", { total: sessionLength })}
                            </Chip>
                            <Chip size="sm" variant="soft" color="default">
                                <MicrophoneIcon className="size-4" aria-hidden focusable="false" />
                                {t("flashcard.interview.expectVoice")}
                            </Chip>
                            <Chip size="sm" variant="soft" color="default">
                                <RobotIcon className="size-4" aria-hidden focusable="false" />
                                {t("flashcard.interview.expectAiGrade")}
                            </Chip>
                        </div>

                        {/* readiness — compact full-width strip (not a side column) */}
                        <div className="flex flex-col gap-2">
                            <Label>{t("flashcard.interview.readinessTitle")}</Label>
                            {history === undefined ? (
                                <div className="flex items-center gap-3">
                                    <Skeleton.Typography type="h4" width="1/4" />
                                    <Skeleton.Meter className="flex-1" />
                                </div>
                            ) : history && history.totalAnswered > 0 ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                        <div className="flex items-baseline gap-2">
                                            <Typography className="text-2xl font-medium text-foreground">
                                                {history.averageScore}
                                            </Typography>
                                            <Typography type="body-xs" color="muted">
                                                {`/100 · ${t("flashcard.interview.bestScore").toLowerCase()} ${history.bestScore}`}
                                            </Typography>
                                        </div>
                                        <ProgressMeter value={history.averageScore} max={100} className="min-w-40 flex-1" />
                                    </div>
                                    {/* verdict breakdown — pass / borderline / fail counts */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Chip size="sm" variant="soft" color="success">
                                            {`${t("flashcard.interview.pass")} · ${history.passCount}`}
                                        </Chip>
                                        <Chip size="sm" variant="soft" color="warning">
                                            {`${t("flashcard.interview.borderline")} · ${history.borderlineCount}`}
                                        </Chip>
                                        <Chip size="sm" variant="soft" color="danger">
                                            {`${t("flashcard.interview.fail")} · ${history.failCount}`}
                                        </Chip>
                                    </div>
                                    {/* weak topics to revisit (tag-filtered drill ships next round) */}
                                    {history.weakTags.length > 0 ? (
                                        <div className="flex flex-wrap items-center gap-2">
                                            {history.weakTags.map((tag) => (
                                                <Chip key={tag} size="sm" variant="soft" color="default">
                                                    {tag}
                                                </Chip>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                // never interviewed yet → meter at 0 + nudge (don't self-hide).
                                // stack (meter full-width, hint below) so the hint doesn't float
                                // far right on a wide card — keep the row balanced.
                                <div className="flex flex-col gap-2">
                                    <ProgressMeter value={0} max={100} />
                                    <Typography type="body-sm" color="muted">
                                        {t("flashcard.interview.readinessEmpty")}
                                    </Typography>
                                </div>
                            )}
                        </div>

                        {/* practice mode — selectable surface cards (one lights up) */}
                        <div className="flex flex-col gap-3">
                            <Label>{t("flashcard.interview.modeLabel")}</Label>
                            <SelectableCardGroup
                                ariaLabel={t("flashcard.interview.modeLabel")}
                                value={mode}
                                onChange={(next) => {
                                    // only quick/deep are selectable (weak/ladder disabled)
                                    if (next === "quick" || next === "deep") {
                                        setMode(next)
                                    }
                                }}
                                columns={2}
                                items={[
                                    {
                                        value: "quick",
                                        label: t("flashcard.interview.modeQuick"),
                                        icon: <LightningIcon className="size-4" />,
                                    },
                                    {
                                        value: "deep",
                                        label: t("flashcard.interview.modeDeep"),
                                        icon: <StackIcon className="size-4" />,
                                    },
                                    {
                                        value: "weak",
                                        label: t("flashcard.interview.modeWeak"),
                                        icon: <TargetIcon className="size-4" />,
                                        isDisabled: true,
                                        badge: comingSoonBadge,
                                    },
                                    {
                                        value: "ladder",
                                        label: t("flashcard.interview.modeLadder"),
                                        icon: <StairsIcon className="size-4" />,
                                        isDisabled: true,
                                        badge: comingSoonBadge,
                                    },
                                ]}
                            />
                        </div>

                        {/* seniority level — group label uses <Label> + block segmented */}
                        <div className="flex flex-col gap-2">
                            <Label>{t("flashcard.interview.levelLabel")}</Label>
                            <SegmentedControl
                                ariaLabel={t("flashcard.interview.levelLabel")}
                                value={level ?? "all"}
                                onChange={(value) => setLevel(value === "all" ? null : value)}
                                items={[
                                    { value: "all", label: t("flashcard.interview.levelAll") },
                                    ...LEVELS.map((value) => ({
                                        value,
                                        label: t(`flashcard.level.${value}`),
                                    })),
                                ]}
                            />
                        </div>

                        {/* grading model — mid-tier and above (Auto default) */}
                        <div className="flex flex-col gap-3">
                            <Label>{t("flashcard.interview.modelLabel")}</Label>
                            <GradeModelDropdown
                                className="self-start"
                                models={interviewModels}
                                selection={selection}
                                canPremium={canPremium}
                                task={AiModelTask.Grading}
                                floor={AiModelCategory.Balanced}
                                showAutoLane
                                onSelect={setSelection}
                                onUpgrade={() => router.push(`/${locale}/profile/settings/ai-subscription`)}
                            />
                        </div>

                        {/* primary CTA — loud, mic-led (one primary action) */}
                        <Button variant="primary" size="lg" className="self-start" onPress={startSession}>
                            <MicrophoneIcon className="size-5" aria-hidden focusable="false" />
                            {t("flashcard.interview.begin")}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // ── GRADING — grade the whole batch sequentially ─────────────────────
    if (phase === "grading") {
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <div className="flex flex-col items-center gap-3 rounded-xl bg-default/40 p-8">
                    <Spinner size="lg" />
                    <Typography type="body" weight="medium">
                        {t("flashcard.interview.gradingSession")}
                    </Typography>
                    <Typography type="body-sm" color="muted">
                        {t("flashcard.interview.gradingProgress", {
                            current: Math.min(gradedCount + 1, pendingAnswers.length),
                            total: pendingAnswers.length,
                        })}
                    </Typography>
                    <ProgressMeter
                        value={gradedCount}
                        max={pendingAnswers.length || 1}
                        className="w-full max-w-sm"
                    />
                </div>
            </div>
        )
    }

    // ── SUMMARY — scorecard + per-question feedback ──────────────────────
    if (phase === "summary") {
        const answered = gradedResults.length
        const averageScore =
            answered > 0
                ? Math.round(
                    (gradedResults.reduce((sum, item) => sum + item.score, 0) / answered) * 10,
                ) / 10
                : 0
        const passCount = gradedResults.filter((item) => item.verdict === InterviewVerdict.Pass).length
        const borderlineCount = gradedResults.filter(
            (item) => item.verdict === InterviewVerdict.Borderline,
        ).length
        const failCount = gradedResults.filter((item) => item.verdict === InterviewVerdict.Fail).length
        // weakest topics: tag frequency across the questions not passed
        const weakTagCounts = new Map<string, number>()
        for (const item of gradedResults) {
            if (item.verdict !== InterviewVerdict.Pass) {
                for (const tag of item.tags) {
                    weakTagCounts.set(tag, (weakTagCounts.get(tag) ?? 0) + 1)
                }
            }
        }
        const weakTags = [...weakTagCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([tag]) => tag)

        /** Verdict → chip color (đạt / cận / chưa đạt). */
        const verdictColorOf = (verdict: InterviewVerdict): "success" | "warning" | "danger" =>
            verdict === InterviewVerdict.Pass
                ? "success"
                : verdict === InterviewVerdict.Borderline
                    ? "warning"
                    : "danger"
        /** Verdict → localized label. */
        const verdictLabelOf = (verdict: InterviewVerdict): string =>
            verdict === InterviewVerdict.Pass
                ? t("flashcard.interview.pass")
                : verdict === InterviewVerdict.Borderline
                    ? t("flashcard.interview.borderline")
                    : t("flashcard.interview.fail")

        return (
            <div className={cn("flex flex-col gap-6", className)}>
                {/* overall scorecard */}
                <div className="flex flex-col gap-6 rounded-xl bg-default/40 p-8">
                    <div className="flex items-center justify-between gap-3">
                        <Typography type="body" weight="medium">
                            {t("flashcard.interview.summaryTitle")}
                        </Typography>
                        <Typography type="body-sm" color="muted">
                            {t("flashcard.interview.progress", {
                                current: answered,
                                total: sessionLength,
                            })}
                        </Typography>
                    </div>

                    {/* average score + verdict breakdown */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-col">
                            <Typography type="body-xs" color="muted">
                                {t("flashcard.interview.avgScore")}
                            </Typography>
                            <Typography className="text-2xl font-medium text-foreground">
                                {averageScore}
                            </Typography>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Chip size="sm" variant="soft" color="success">
                                {t("flashcard.interview.pass")} · {passCount}
                            </Chip>
                            <Chip size="sm" variant="soft" color="warning">
                                {t("flashcard.interview.borderline")} · {borderlineCount}
                            </Chip>
                            <Chip size="sm" variant="soft" color="danger">
                                {t("flashcard.interview.fail")} · {failCount}
                            </Chip>
                        </div>
                    </div>

                    {/* weak topics to revisit (from questions not passed) */}
                    {weakTags.length > 0 ? (
                        <div className="flex flex-col gap-2 border-t border-divider pt-6">
                            <Typography type="body-xs" weight="medium" color="muted">
                                {t("flashcard.interview.weakTags")}
                            </Typography>
                            <div className="flex flex-wrap items-center gap-2">
                                {weakTags.map((tag) => (
                                    <Chip key={tag} size="sm" variant="soft" color="default">
                                        {tag}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <Button
                        variant="primary"
                        className="self-start"
                        onPress={() => setPhase("setup")}
                    >
                        {t("flashcard.interview.replay")}
                    </Button>
                </div>

                {/* per-question feedback list */}
                {gradedResults.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        <Label>{t("flashcard.interview.perQuestionTitle")}</Label>
                        {gradedResults.map((item, position) => (
                            <div
                                key={position}
                                className="flex flex-col gap-6 rounded-xl bg-default/40 p-8"
                            >
                                {/* question number + verdict + score */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <Chip size="md" variant="soft" color={verdictColorOf(item.verdict)}>
                                            {verdictLabelOf(item.verdict)}
                                        </Chip>
                                        <Typography type="body-sm" weight="medium">
                                            {t("flashcard.interview.score", { score: item.score })}
                                        </Typography>
                                    </div>
                                    <Typography type="body-xs" weight="medium" color="muted">
                                        {t("flashcard.interview.questionN", { n: position + 1 })}
                                    </Typography>
                                    <div className="text-foreground">
                                        <MarkdownContent markdown={item.question} />
                                    </div>
                                </div>

                                {/* concrete things done right */}
                                {item.strengths.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <Typography type="body-xs" weight="medium" className="text-success">
                                            {t("flashcard.interview.strengths")}
                                        </Typography>
                                        <ul className="flex list-disc flex-col gap-2 pl-5">
                                            {item.strengths.map((strength, strengthPosition) => (
                                                <li key={strengthPosition}>
                                                    <Typography type="body-sm">{strength}</Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                {/* concrete gaps to address */}
                                {item.gaps.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <Typography type="body-xs" weight="medium" className="text-danger">
                                            {t("flashcard.interview.gaps")}
                                        </Typography>
                                        <ul className="flex list-disc flex-col gap-2 pl-5">
                                            {item.gaps.map((gap, gapPosition) => (
                                                <li key={gapPosition}>
                                                    <Typography type="body-sm">{gap}</Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                {/* one-line nudge toward the model answer */}
                                {item.modelAnswerHint ? (
                                    <div className="flex flex-col gap-2 border-t border-divider pt-6">
                                        <Typography type="body-xs" weight="medium" color="muted">
                                            {t("flashcard.interview.hint")}
                                        </Typography>
                                        <Typography type="body-sm">{item.modelAnswerHint}</Typography>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        )
    }

    // ── ACTIVE ───────────────────────────────────────────────────────────
    // initial load / redraw: mirror with a content-shaped skeleton
    if (drawing) {
        return <InterviewSessionSkeleton />
    }

    // draw failed (e.g. no gradable card at this level) — offer a retry
    if (drawError || !card) {
        return (
            <div className="flex flex-col items-center gap-3 py-10">
                <Typography type="body-sm" color="muted" align="center">
                    {drawError}
                </Typography>
                <Button size="sm" variant="secondary" onPress={() => void drawCurrent()}>
                    {t("flashcard.interview.retry")}
                </Button>
            </div>
        )
    }

    // whether anything has been transcribed yet (gates the next button)
    const hasTranscript = transcript.trim().length > 0
    // the action shown: advance, or finish (grade the batch) on the last question
    const isLastQuestion = index >= sessionLength - 1

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* session progress + question meta (level + tags) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Typography type="body-sm" weight="medium" color="muted">
                    {t("flashcard.interview.progress", {
                        current: index + 1,
                        total: sessionLength,
                    })}
                </Typography>
                {(card.level || (card.tags?.length ?? 0) > 0) ? (
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

            {/* the question prompt (answer is never sent to the client) */}
            <div className={PANEL_CLASS}>
                <Typography type="body-xs" weight="medium" color="muted">
                    {t("flashcard.questionLabel")}
                </Typography>
                <div className="text-lg font-medium text-foreground">
                    <MarkdownContent markdown={card.question} />
                </div>
            </div>

            {/* the recorder: unsupported notice, or mic control + live transcript */}
            {!supported ? (
                <div className="rounded-xl bg-default/40 p-4">
                    <Typography type="body-sm" color="muted" align="center">
                        {t("flashcard.interview.unsupported")}
                    </Typography>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center">
                        <Button
                            variant={listening ? "danger" : "primary"}
                            onPress={() => (listening ? stop() : start())}
                        >
                            <MicrophoneIcon className="size-5" aria-hidden focusable="false" />
                            {listening
                                ? t("flashcard.interview.stop")
                                : t("flashcard.interview.record")}
                        </Button>
                    </div>

                    {/* recording pulse hint */}
                    {listening ? (
                        <div className="flex items-center justify-center gap-2">
                            <span className="size-2 animate-pulse rounded-full bg-danger" />
                            <Typography type="body-xs" className="text-danger">
                                {t("flashcard.interview.recording")}
                            </Typography>
                        </div>
                    ) : null}

                    {/* live transcript: finalized words + greyed interim tail */}
                    <div className={PANEL_CLASS}>
                        <Typography type="body-xs" weight="medium" color="muted">
                            {t("flashcard.interview.yourAnswer")}
                        </Typography>
                        {hasTranscript || interimTranscript ? (
                            <Typography className="text-foreground">
                                {transcript}{" "}
                                <span className="text-muted">{interimTranscript}</span>
                            </Typography>
                        ) : (
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.interview.transcriptHint")}
                            </Typography>
                        )}
                    </div>

                    {/* microphone permission / recognition error */}
                    {speechError ? (
                        <Typography type="body-xs" align="center" className="text-danger">
                            {t("flashcard.interview.micError")}
                        </Typography>
                    ) : null}
                </div>
            )}

            {/* grade error (transport / typed failure) */}
            {gradeError ? (
                <Typography type="body-sm" align="center" className="text-danger">
                    {gradeError}
                </Typography>
            ) : null}

            {/* store this answer + advance (no verdict between questions); grade after the last */}
            <div className="flex items-center justify-end gap-3">
                <Button
                    variant="primary"
                    onPress={nextQuestion}
                    isDisabled={!hasTranscript || listening}
                >
                    {isLastQuestion
                        ? t("flashcard.interview.finishAndGrade")
                        : t("flashcard.interview.nextQuestion")}
                </Button>
            </div>
        </div>
    )
}
