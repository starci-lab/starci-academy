"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    Button,
    Label,
    Spinner,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowRightIcon,
    CheckCircleIcon,
    CircleIcon,
    ClockIcon,
    MicrophoneIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { ChatBubble } from "@/components/blocks/feed/ChatBubble"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { GradeModelDropdown, type GradeModelSelection } from "@/components/blocks/grading/GradeModelDropdown"
import { SelectableCardGroup } from "@/components/blocks/navigation/SelectableCardGroup"
import { SkeletonRadioGroup } from "@/components/blocks/skeleton/Skeleton/RadioGroup"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { useMockInterviewTurnStream } from "@/hooks/socketio/useMockInterviewTurnStream"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import { useQueryMockInterviewPromptsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMockInterviewPromptsSwr"
import { useMutateGradeMockInterviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateGradeMockInterviewSessionSwr"
import { AiModelCategory, AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import type { AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import type { MockInterviewPromptSummary } from "@/modules/api/graphql/queries/types/mock-interview-prompts"
import type { MockInterviewTurnInput } from "@/modules/api/graphql/mutations/types/grade-mock-interview-session"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { MockInterviewDiagram } from "../MockInterviewDiagram"
import { serializeMockInterviewDiagram } from "../MockInterviewDiagram/serialize"
import { MockInterviewScorecard } from "../MockInterviewScorecard"
import { MockInterviewHistory } from "../MockInterviewHistory"
import { normalizeMockInterviewVerdict } from "../mapAttemptToGradeResult"
import type {
    MockInterviewDiagramEdgeSnapshot,
    MockInterviewDiagramNodeSnapshot,
} from "../MockInterviewDiagram"
import type {
    MockInterviewGradeResult,
    MockInterviewPhaseKey,
    MockInterviewTurn,
} from "../types"

/** Props for {@link MockInterviewSession}. */
export interface MockInterviewSessionProps extends WithClassNames<undefined> {
    /** Course the interview systems are drawn from (enrolled-only, like the flashcard interview). */
    courseId: string
}

/** The four screens of one mock interview. */
type MockInterviewPhase = "setup" | "interview" | "grading" | "scorecard"

/** The five canonical interview phases, in interview-driven order. */
const PHASES: ReadonlyArray<MockInterviewPhaseKey> = [
    "requirements",
    "estimation",
    "highLevel",
    "deepDive",
    "tradeoffs",
]

/** Auto lane (balancer picks) — the default grading selection. */
const AUTO_SELECTION: GradeModelSelection = {
    model: null,
    provider: null,
}

/** Mid-tier and above — the only categories offered for interview grading. */
const GRADE_CATEGORIES: ReadonlyArray<AiModelCategory> = [
    AiModelCategory.Balanced,
    AiModelCategory.Premium,
    AiModelCategory.Frontier,
]

/** Seniority levels (drive rubric strictness at grade time). */
const LEVELS = ["junior", "middle", "senior", "staff"] as const

/** Format elapsed seconds as mm:ss. */
const formatElapsed = (seconds: number): string => {
    const mm = Math.floor(seconds / 60)
    const ss = seconds % 60
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
}

/**
 * Mock interview — a phase-scaffolded, conversational interview (voice-first)
 * that grades against a 5-phase rubric at the end.
 *
 * The AI interviewer's turns stream over the `/mock_interview` socket
 * (`useMockInterviewTurnStream`, one active stream at a time), grounded via RAG
 * on the current course. The optional whiteboard sketch (Pha 2) is folded into the
 * transcript as a synthetic final candidate turn at grade time (FE-only — no new
 * BE field). The end-of-session grade calls `gradeMockInterviewSession`.
 * @param props - {@link MockInterviewSessionProps}
 */
export const MockInterviewSession = ({ courseId, className }: MockInterviewSessionProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const recognitionLang = locale === "vi" ? "vi-VN" : "en-US"

    const {
        supported,
        listening,
        transcript,
        interimTranscript,
        start,
        stop,
        reset,
    } = useSpeechRecognition({ lang: recognitionLang })

    // grading-model catalog + entitlement (mid+ tiers unlock on paid OR enrolled)
    const aiModelsSwr = useQueryAiModelsSwr()
    const myAiSettingsSwr = useQueryMyAiSettingsSwr()
    const canPremium = Boolean(myAiSettingsSwr.data?.canPremium)
    const gradeModels = useMemo<Array<AiGradableModel>>(
        () => (aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []).filter(
            (model) =>
                GRADE_CATEGORIES.includes(model.category)
                && (model.supportedTasks?.length
                    ? model.supportedTasks.includes(AiModelTask.Grading)
                    : true),
        ),
        [aiModelsSwr.data],
    )

    // prompt bank (capstone systems, course-scoped) — the setup picker's live data
    const promptsSwr = useQueryMockInterviewPromptsSwr(courseId)
    const prompts = useMemo<Array<MockInterviewPromptSummary>>(
        () => promptsSwr.data?.prompts ?? [],
        [promptsSwr.data],
    )

    const turnStream = useMockInterviewTurnStream()
    const gradeSwr = useMutateGradeMockInterviewSessionSwr()

    const [phase, setPhase] = useState<MockInterviewPhase>("setup")
    const [promptId, setPromptId] = useState<string>("")
    const [level, setLevel] = useState<string>("all")
    const [selection, setSelection] = useState<GradeModelSelection>(AUTO_SELECTION)
    // which of the 5 phases the interview is currently in
    const [phaseIndex, setPhaseIndex] = useState(0)
    // the conversation so far — candidate turns captured via STT, interviewer turns streamed
    const [turns, setTurns] = useState<Array<MockInterviewTurn>>([])
    // end-of-session grade (null until `gradeMockInterviewSession` resolves)
    const [grade, setGrade] = useState<MockInterviewGradeResult | null>(null)
    // set when grading throws/fails — surfaced back on the interview screen so nothing is lost
    const [gradeError, setGradeError] = useState<string | null>(null)
    // elapsed seconds while in the interview
    const [elapsed, setElapsed] = useState(0)
    // client-generated run id (groups this session's attempt in history)
    const sessionId = useRef<string | null>(null)
    // live text of the interviewer's turn currently streaming in ("" once started, null when idle)
    const [streamingText, setStreamingText] = useState<string | null>(null)
    // mirrors streamingText but read synchronously from the onDelta callback (avoids stale closures)
    const streamingRef = useRef<string>("")
    // true while an interviewer turn is in flight — gates submitAnswer/advancePhase/finishAndGrade
    // so a second `ask()` never overwrites the single in-flight stream tracked by the socket hook
    const [isAsking, setIsAsking] = useState(false)
    // latest whiteboard sketch (Pha 2) — read only at grade time, so a ref is enough
    const diagramRef = useRef<{
        nodes: Array<MockInterviewDiagramNodeSnapshot>
        edges: Array<MockInterviewDiagramEdgeSnapshot>
    }>({ nodes: [], edges: [] })

    // default the selection to the first loaded prompt once — never fight a
    // deliberate user pick on later re-renders (e.g. after a revalidation).
    useEffect(() => {
        if (promptId === "" && prompts.length > 0) {
            setPromptId(prompts[0].id)
        }
    }, [promptId, prompts])

    const selectedPrompt = useMemo(
        () => prompts.find((prompt) => prompt.id === promptId),
        [prompts, promptId],
    )
    const currentPhase = PHASES[phaseIndex]

    // tick the interview timer once per second while in the interview
    useEffect(() => {
        if (phase !== "interview") {
            return
        }
        const id = window.setInterval(() => setElapsed((previous) => previous + 1), 1000)
        return () => window.clearInterval(id)
    }, [phase])

    // ask the interviewer for its next turn (opening line, a probe after an answer, or a
    // phase-transition line) and stream the reply into `turns` once it completes. Shared by
    // startSession/submitAnswer/advancePhase so there is exactly one place that touches the
    // single in-flight stream tracked by `useMockInterviewTurnStream`.
    const askNextTurn = useCallback(
        (params: { phase: MockInterviewPhaseKey; latestAnswer: string; history: Array<MockInterviewTurn> }) => {
            if (!selectedPrompt) {
                return
            }
            streamingRef.current = ""
            setIsAsking(true)
            setStreamingText("")
            turnStream.ask({
                courseId,
                promptId: selectedPrompt.id,
                promptTitle: selectedPrompt.title,
                phase: params.phase,
                history: params.history.map((turn) => ({ role: turn.role, content: turn.content })),
                latestAnswer: params.latestAnswer,
                model: selection.model,
                provider: selection.provider,
                onDelta: (delta) => {
                    // accumulate in a ref (synchronous) so the onDone below always reads the
                    // full text, then mirror it into state for the live-streaming bubble
                    streamingRef.current += delta
                    setStreamingText(streamingRef.current)
                },
                onDone: (error) => {
                    setIsAsking(false)
                    setStreamingText(null)
                    const finalText = streamingRef.current.trim()
                    // append the completed interviewer turn only when the stream actually
                    // produced something — an aborted/errored stream leaves nothing behind
                    if (!error && finalText.length > 0) {
                        setTurns((previous) => [...previous, { role: "interviewer", phase: params.phase, content: finalText }])
                    }
                },
            })
        },
        [courseId, selectedPrompt, selection, turnStream],
    )

    const startSession = useCallback(() => {
        sessionId.current = crypto.randomUUID()
        setTurns([])
        setPhaseIndex(0)
        setElapsed(0)
        setGrade(null)
        setGradeError(null)
        setPhase("interview")
        // the interviewer opens the session — empty history, no answer yet
        askNextTurn({ phase: PHASES[0], latestAnswer: "", history: [] })
    }, [askNextTurn])

    // record the current spoken answer as a candidate turn, then ask the interviewer to
    // probe/follow-up on it, then clear the mic buffer
    const submitAnswer = useCallback(() => {
        const answer = transcript.trim()
        if (answer.length === 0 || isAsking) {
            return
        }
        if (listening) {
            stop()
        }
        const nextTurns: Array<MockInterviewTurn> = [
            ...turns,
            { role: "candidate", phase: currentPhase, content: answer },
        ]
        setTurns(nextTurns)
        reset()
        askNextTurn({ phase: currentPhase, latestAnswer: answer, history: nextTurns })
    }, [transcript, listening, stop, reset, currentPhase, turns, isAsking, askNextTurn])

    const advancePhase = useCallback(() => {
        if (isAsking) {
            return
        }
        setPhaseIndex((previous) => {
            const next = Math.min(previous + 1, PHASES.length - 1)
            if (next !== previous) {
                // let the interviewer proactively introduce the new phase (no fresh answer yet)
                askNextTurn({ phase: PHASES[next], latestAnswer: "", history: turns })
            }
            return next
        })
    }, [isAsking, askNextTurn, turns])

    const finishAndGrade = useCallback(async () => {
        if (!selectedPrompt || isAsking) {
            return
        }
        setPhase("grading")
        setGradeError(null)
        // fold the whiteboard sketch (if any) in as a final candidate turn — kept FE-only
        // (no new BE field) by reusing the existing transcript shape
        const diagramText = serializeMockInterviewDiagram(diagramRef.current.nodes, diagramRef.current.edges)
        const turnsForGrading: Array<MockInterviewTurnInput> = turns.map((turn) => ({
            role: turn.role,
            phase: turn.phase,
            content: turn.content,
        }))
        if (diagramText) {
            turnsForGrading.push({ role: "candidate", phase: currentPhase, content: `[Diagram]\n${diagramText}` })
        }
        try {
            const response = await gradeSwr.trigger({
                courseId,
                promptId: selectedPrompt.id,
                promptTitle: selectedPrompt.title,
                level: level === "all" ? undefined : level,
                turns: turnsForGrading,
                sessionId: sessionId.current ?? crypto.randomUUID(),
                selectedModel: selection.model ?? undefined,
                selectedModelProvider: selection.provider ?? undefined,
            })
            const payload = response.data?.gradeMockInterviewSession
            // typed backend failure (quota, validation …) — surface the message and stay in
            // the interview so nothing recorded so far is lost
            if (!payload?.success || !payload.data) {
                setGradeError(payload?.message ?? t("mockInterview.gradingFailed"))
                setPhase("interview")
                return
            }
            setGrade({
                overallScore: payload.data.overallScore,
                verdict: normalizeMockInterviewVerdict(payload.data.verdict),
                phaseScores: payload.data.phaseScores.map((item) => ({
                    phase: item.phase as MockInterviewPhaseKey,
                    score: item.score,
                    max: item.max,
                })),
                attributeScores: payload.data.attributeScores,
                strengths: payload.data.strengths,
                gaps: payload.data.gaps,
                followUpQuestion: payload.data.followUpQuestion ?? null,
            })
            setPhase("scorecard")
        } catch {
            setGradeError(t("mockInterview.gradingFailed"))
            setPhase("interview")
        }
    }, [courseId, selectedPrompt, isAsking, level, turns, currentPhase, selection, gradeSwr, t])

    // mirror the whiteboard's plain-object snapshot into a ref (read only at grade time)
    const handleDiagramChange = useCallback(
        (nodes: Array<MockInterviewDiagramNodeSnapshot>, edges: Array<MockInterviewDiagramEdgeSnapshot>) => {
            diagramRef.current = { nodes, edges }
        },
        [],
    )

    // ── SETUP ────────────────────────────────────────────────────────────
    if (phase === "setup") {
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <LabeledCard label={t("mockInterview.systemLabel")}>
                    <AsyncContent
                        isLoading={promptsSwr.isLoading && prompts.length === 0}
                        skeleton={<SkeletonRadioGroup items={4} labelWidth="w-64" />}
                        isEmpty={!promptsSwr.isLoading && prompts.length === 0}
                        emptyContent={{ title: t("mockInterview.promptsEmpty") }}
                        error={prompts.length === 0 ? promptsSwr.error : undefined}
                        errorContent={{
                            title: t("mockInterview.promptsError"),
                            onRetry: () => void promptsSwr.mutate(),
                            retryLabel: t("mockInterview.promptsRetry"),
                        }}
                    >
                        <SelectableCardGroup
                            ariaLabel={t("mockInterview.systemLabel")}
                            value={promptId}
                            onChange={setPromptId}
                            columns={1}
                            items={prompts.map((prompt) => ({
                                value: prompt.id,
                                label: prompt.title,
                                description: t(`challenge.difficulty.${prompt.difficulty}`),
                            }))}
                        />
                    </AsyncContent>
                </LabeledCard>

                <LabeledCard label={t("mockInterview.gradingLabel")} contentClassName="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <Label>{t("flashcard.interview.levelLabel")}</Label>
                        <FlexWrapButtonRadio
                            ariaLabel={t("flashcard.interview.levelLabel")}
                            value={level}
                            onChange={setLevel}
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
                    <div className="flex flex-col gap-2">
                        <Label>{t("mockInterview.modelLabel")}</Label>
                        <GradeModelDropdown
                            className="text-sm text-muted"
                            models={gradeModels}
                            selection={selection}
                            canPremium={canPremium}
                            task={AiModelTask.Grading}
                            floor={AiModelCategory.Balanced}
                            showAutoLane
                            onSelect={setSelection}
                            onUpgrade={() => router.push(`/${locale}/profile/settings/ai-subscription`)}
                        />
                    </div>
                </LabeledCard>

                <Button
                    variant="primary"
                    size="lg"
                    className="self-start"
                    isDisabled={!selectedPrompt}
                    onPress={startSession}
                >
                    <MicrophoneIcon className="size-5" aria-hidden focusable="false" />
                    {t("mockInterview.begin")}
                </Button>

                <MockInterviewHistory courseId={courseId} />
            </div>
        )
    }

    // ── GRADING ──────────────────────────────────────────────────────────
    if (phase === "grading") {
        return (
            <div className={cn("flex flex-col items-center gap-3 rounded-xl bg-default/40 p-8", className)}>
                <Spinner size="lg" />
                <Typography type="body" weight="medium">
                    {t("mockInterview.grading")}
                </Typography>
                <Typography type="body-sm" color="muted" align="center">
                    {t("mockInterview.gradingPending")}
                </Typography>
            </div>
        )
    }

    // ── SCORECARD ────────────────────────────────────────────────────────
    if (phase === "scorecard") {
        if (!grade) {
            return (
                <div className={cn("flex flex-col items-center gap-3 py-10", className)}>
                    <Typography type="body-sm" color="muted" align="center">
                        {t("mockInterview.scorecardPending")}
                    </Typography>
                    <Button variant="secondary" onPress={() => setPhase("setup")}>
                        {t("mockInterview.backToSetup")}
                    </Button>
                </div>
            )
        }
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <MockInterviewScorecard grade={grade} promptTitle={selectedPrompt?.title} />
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" onPress={startSession}>
                        {t("mockInterview.retry")}
                    </Button>
                    <Button variant="secondary" onPress={() => setPhase("setup")}>
                        {t("mockInterview.backToSetup")}
                    </Button>
                </div>
            </div>
        )
    }

    // ── INTERVIEW (2-pane: phase rail | conversation) ────────────────────
    return (
        <div className={cn("flex flex-col gap-3 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6", className)}>
            {/* LEFT — phase rail: status list (icon carries state, no row tint) + timer + finish.
                Non-clickable (interview-driven): status per accent-system §2. */}
            <aside className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-muted">
                    <ClockIcon className="size-4" aria-hidden focusable="false" />
                    <Typography type="body-sm" weight="medium">{formatElapsed(elapsed)}</Typography>
                </div>
                <ul className="flex flex-col gap-1">
                    {PHASES.map((phaseKey, position) => {
                        const done = position < phaseIndex
                        const current = position === phaseIndex
                        return (
                            <li key={phaseKey} className="flex items-center gap-2 px-1 py-2">
                                {done ? (
                                    <CheckCircleIcon className="size-5 shrink-0 text-success" aria-hidden focusable="false" />
                                ) : (
                                    <CircleIcon
                                        className={cn("size-5 shrink-0", current ? "text-accent" : "text-muted")}
                                        aria-hidden
                                        focusable="false"
                                    />
                                )}
                                <Typography
                                    type="body-sm"
                                    className={cn(current ? "text-accent" : done ? "text-foreground" : "text-muted")}
                                    aria-current={current ? "step" : undefined}
                                >
                                    {t(`mockInterview.phase.${phaseKey}`)}
                                </Typography>
                            </li>
                        )
                    })}
                </ul>
                <div className="flex flex-col gap-2">
                    <Button
                        variant="secondary"
                        onPress={advancePhase}
                        isDisabled={phaseIndex >= PHASES.length - 1 || isAsking}
                    >
                        {t("mockInterview.nextPhase")}
                        <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                    </Button>
                    <Button variant="primary" onPress={() => void finishAndGrade()} isDisabled={isAsking}>
                        {t("mockInterview.finishAndGrade")}
                    </Button>
                </div>
            </aside>

            {/* RIGHT — the design system prompt + conversation thread + voice composer */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 rounded-xl bg-default/40 p-4">
                    <Typography type="body-xs" weight="medium" color="muted">
                        {t("mockInterview.promptLabel")}
                    </Typography>
                    <Typography type="body" weight="medium">{selectedPrompt?.title}</Typography>
                </div>

                {gradeError ? (
                    <div className="rounded-xl bg-danger/10 p-4">
                        <Typography type="body-sm" className="text-danger">{gradeError}</Typography>
                    </div>
                ) : null}

                {/* thread — candidate turns (STT) + interviewer turns streamed over the socket */}
                <div className="flex flex-col gap-3">
                    {turns.length === 0 && !isAsking ? (
                        <ChatBubble role="assistant">
                            <Typography type="body-sm" color="muted">
                                {t("mockInterview.interviewerPending")}
                            </Typography>
                        </ChatBubble>
                    ) : (
                        turns.map((turn, position) => (
                            <ChatBubble key={position} role={turn.role === "candidate" ? "user" : "assistant"}>
                                <div className="text-sm text-foreground">
                                    <MarkdownContent markdown={turn.content} />
                                </div>
                            </ChatBubble>
                        ))
                    )}
                    {isAsking ? (
                        <ChatBubble role="assistant">
                            {streamingText ? (
                                <div className="text-sm text-foreground">
                                    <MarkdownContent markdown={streamingText} />
                                </div>
                            ) : (
                                <Spinner size="sm" />
                            )}
                        </ChatBubble>
                    ) : null}
                </div>

                {/* composer — mic + live transcript + submit */}
                {!supported ? (
                    <div className="rounded-xl bg-default/40 p-4">
                        <Typography type="body-sm" color="muted" align="center">
                            {t("flashcard.interview.unsupported")}
                        </Typography>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {transcript || interimTranscript ? (
                            <div className="rounded-xl bg-default/40 p-4">
                                <Typography className="text-foreground">
                                    {transcript} <span className="text-muted">{interimTranscript}</span>
                                </Typography>
                            </div>
                        ) : null}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                variant={listening ? "danger" : "secondary"}
                                onPress={() => (listening ? stop() : start())}
                            >
                                <MicrophoneIcon className="size-5" aria-hidden focusable="false" />
                                {listening ? t("flashcard.interview.stop") : t("flashcard.interview.record")}
                            </Button>
                            <Button
                                variant="primary"
                                onPress={submitAnswer}
                                isDisabled={transcript.trim().length === 0 || listening || isAsking}
                            >
                                {t("mockInterview.sendAnswer")}
                            </Button>
                            {listening ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-2 animate-pulse rounded-full bg-danger" />
                                    <Typography type="body-xs" className="text-danger">
                                        {t("flashcard.interview.recording")}
                                    </Typography>
                                </span>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* Pha 2 — editable whiteboard; onChange only mirrors into a ref, read at grade time */}
                <MockInterviewDiagram onChange={handleDiagramChange} />
            </div>
        </div>
    )
}
