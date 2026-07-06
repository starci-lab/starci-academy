"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    Button,
    Spinner,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowRightIcon,
    CaretDownIcon,
    CheckCircleIcon,
    CircleIcon,
    ClockIcon,
    DoorOpenIcon,
    MicrophoneIcon,
    PenNibIcon,
    SignOutIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { ChatBubble } from "@/components/blocks/feed/ChatBubble"
import { Callout } from "@/components/blocks/feedback/Callout"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { GradeModelDropdown, type GradeModelSelection } from "@/components/blocks/grading/GradeModelDropdown"
import { GradeCreditCaption } from "@/components/blocks/grading/GradeCreditCaption"
import { pathConfig } from "@/resources/path"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis"
import { useMockInterviewTurnStream } from "@/hooks/socketio/useMockInterviewTurnStream"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { useMutateGradeMockInterviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateGradeMockInterviewSessionSwr"
import { useMutateStartMockInterviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartMockInterviewSessionSwr"
import { AiModelCategory, AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import type { AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import type { MockInterviewTurnInput } from "@/modules/api/graphql/mutations/types/grade-mock-interview-session"
import type { MockInterviewSeedTopic } from "@/modules/api/graphql/mutations/types/start-mock-interview-session"
import type { WithClassNames } from "@/modules/types/base/class-name"
import {
    MOCK_INTERVIEW_CODE_STATE_DEFAULT,
    MockInterviewWorkspace,
    type MockInterviewCodeState,
} from "../MockInterviewWorkspace"
import { serializeMockInterviewDiagram } from "../MockInterviewDiagram/serialize"
import { MockInterviewScorecard } from "../MockInterviewScorecard"
import { MockInterviewHistory } from "../MockInterviewHistory"
import { MockInterviewTrackSnapshot } from "../MockInterviewTrackSnapshot"
import { InterviewerPresence } from "../InterviewerPresence"
import { VoiceHero } from "../VoiceHero"
import { personaFor } from "../interviewPersona"
import { normalizeMockInterviewVerdict } from "../mapAttemptToGradeResult"
import type {
    MockInterviewDiagramEdgeSnapshot,
    MockInterviewDiagramNodeSnapshot,
} from "../MockInterviewDiagram"
import type {
    MockInterviewGradeResult,
    MockInterviewKind,
    MockInterviewMode,
    MockInterviewPhaseKey,
    MockInterviewTurn,
} from "../types"

/** Props for {@link MockInterviewSession}. */
export interface MockInterviewSessionProps extends WithClassNames<undefined> {
    /** Course the interview systems are drawn from (enrolled-only, like the flashcard interview). */
    courseId: string
    /** Course display id, for building the scorecard's "study this" deep link. */
    courseDisplayId: string
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

/**
 * The ONE setup decision — a 3-notch difficulty tier. Collapses what used to be two
 * hardness knobs (prompt `difficulty` + rubric `level`) into a single axis: picking a
 * tier drives BOTH the server-side prompt draw AND the grading rubric's strictness.
 */
type MockInterviewTier = "so" | "trung" | "cao"

/** Tier → rubric level string sent to `startMockInterviewSession`/`gradeMockInterviewSession`. */
const TIER_CONFIG: Record<MockInterviewTier, { level: string }> = {
    so: { level: "junior" },
    trung: { level: "middle" },
    cao: { level: "senior" },
}

/** Tier notches, in ascending order — the {@link FlexWrapButtonRadio}'s fixed item order (setup's shared Mức control). */
const TIERS: ReadonlyArray<MockInterviewTier> = ["so", "trung", "cao"]

/** Number of questions drawn for a `mode="qna"` session (mirrors the BE's default seed count). */
const QNA_QUESTION_COUNT = 5

/**
 * Setup's top-level config mode (Vòng 5) — "Tự động" (default) is the flat,
 * sensible-default mock-exam run (random everything, feeds job-readiness);
 * "Tùy chỉnh" reveals the deliberate-practice controls below and does NOT
 * feed job-readiness (kept a clean signal from random runs only).
 */
type MockInterviewConfigMode = "auto" | "configurable"

/**
 * "Tùy chỉnh"'s question-count options, in ascending order. Kept as STRINGS
 * (not numbers) because {@link FlexWrapButtonRadio} is a `<T extends string>`
 * single-select — parsed back to a number only when building the request.
 */
const QUESTION_COUNT_OPTIONS: ReadonlyArray<"3" | "5" | "10"> = ["3", "5", "10"]

/** "Tùy chỉnh"'s per-question cognitive frames, in fixed display order. */
const KIND_OPTIONS: ReadonlyArray<MockInterviewKind> = ["theory", "reasoning", "scenario"]

/**
 * How the candidate answers each question — FE-only (the backend never sees
 * this): "voice" shows only the mic control, "text" only the typing box,
 * "both" (default) shows both, mirroring the mic-icon-inside-the-textfield
 * composer already built for the qna screen.
 */
type MockInterviewAnswerMode = "voice" | "text" | "both"

/**
 * The prompt drawn for the current run, as returned by `startMockInterviewSession`.
 * `id`/`title` are consumed by the interviewer stream + grade request; `seedTopics`
 * additionally drives the `mode="qna"` question counter + each question's own
 * seed text + kind badge (empty for `mode="design"`).
 */
interface DrawnMockInterviewPrompt {
    id: string
    title: string
    seedTopics: Array<MockInterviewSeedTopic>
}

/** Format elapsed seconds as mm:ss. */
const formatElapsed = (seconds: number): string => {
    const mm = Math.floor(seconds / 60)
    const ss = seconds % 60
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
}

/**
 * Mock interview — two top-level MODES (2026-07-06 "mode split"): `qna` draws
 * N independent questions, each RANDOMLY assigned one of 3 cognitive frames
 * (theory/reasoning/scenario) at draw time — mixed within one session, "y như
 * phỏng vấn thật" — badged per-question ("Câu 2/5 · Tình huống"); `design`
 * keeps the unchanged 5-phase system-design flow, reached from its own setup
 * button (System-Design courses only).
 *
 * Setup is flat (no per-control cards): a 3-notch tier (Sơ/Trung/Cao) drives
 * both the random draw and the rubric's strictness; the prompt/questions are
 * only revealed once the session starts (like a real interview). The
 * right-pane workspace ({@link MockInterviewWorkspace}) offers three
 * persistent candidate tools — whiteboard, code, notes — each folded into the
 * transcript as a labeled synthetic candidate turn at grade time. The AI
 * interviewer's turns stream over the `/mock_interview` socket
 * (`useMockInterviewTurnStream`, one active stream at a time), grounded via
 * RAG on the current course. The end-of-session grade calls
 * `gradeMockInterviewSession`.
 * @param props - {@link MockInterviewSessionProps}
 */
export const MockInterviewSession = ({ courseId, courseDisplayId, className }: MockInterviewSessionProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const recognitionLang = locale === "vi" ? "vi-VN" : "en-US"

    // unified AI credit pool snapshot — re-checked (typed, no message-string guessing)
    // right after a grading failure so a quota-exhausted failure can be told apart
    // from any other failure and routed to the AI-subscription upsell (mirrors the
    // pattern ChallengeSubmissionPanel already uses via `resolveGradeCreditDisplay`).
    const aiQuotaSwr = useQueryMyAiQuotaSwr()

    const {
        supported,
        listening,
        transcript,
        interimTranscript,
        start,
        stop,
        reset,
    } = useSpeechRecognition({ lang: recognitionLang })

    // text-to-speech — the interviewer READS its question aloud (default on).
    // Kept in a ref so `askNextTurn` can speak/cancel without re-subscribing the
    // single in-flight socket stream when the toggle or locale changes.
    const tts = useSpeechSynthesis({ lang: recognitionLang })
    const ttsRef = useRef(tts)
    ttsRef.current = tts

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

    const turnStream = useMockInterviewTurnStream()
    const gradeSwr = useMutateGradeMockInterviewSessionSwr()
    const startSessionSwr = useMutateStartMockInterviewSessionSwr()

    const [phase, setPhase] = useState<MockInterviewPhase>("setup")
    const [tier, setTier] = useState<MockInterviewTier>("trung")
    // setup's "Tự động" vs "Tùy chỉnh" toggle — see MockInterviewConfigMode.
    const [configMode, setConfigMode] = useState<MockInterviewConfigMode>("auto")
    // "Tùy chỉnh" only — Số câu (single-select, kept as a string — see QUESTION_COUNT_OPTIONS).
    const [questionCount, setQuestionCount] = useState<"3" | "5" | "10">("5")
    // "Tùy chỉnh" only — Kiểu câu (multi-select; empty array reads as "Tất cả").
    const [selectedKinds, setSelectedKinds] = useState<Array<MockInterviewKind>>([])
    // "Tùy chỉnh" only — Cách trả lời, shapes the qna composer (voice-only/text-only/both).
    const [answerMode, setAnswerMode] = useState<MockInterviewAnswerMode>("both")
    // the TOP-LEVEL flow the current/last-started run is in — "qna" (default,
    // started from the primary CTA) draws N questions each randomly assigned
    // its own kind; "design" (started from its own button, System-Design
    // courses only) keeps the unchanged 5-phase flow.
    const [mode, setMode] = useState<MockInterviewMode>("qna")
    // the prompt drawn for the CURRENT run — only set once the session starts (by the
    // server), so it is never shown on the setup screen (revealed after "Bắt đầu",
    // like a real exam)
    const [selectedPrompt, setSelectedPrompt] = useState<DrawnMockInterviewPrompt | undefined>(undefined)
    // set when the server-side draw itself fails — surfaced on the setup screen so the
    // candidate can retry without losing their tier/model picks
    const [startError, setStartError] = useState<string | null>(null)
    const [selection, setSelection] = useState<GradeModelSelection>(AUTO_SELECTION)
    // which of the 5 phases the interview is currently in (mode="design" only)
    const [phaseIndex, setPhaseIndex] = useState(0)
    // which seed question the interview is currently on (Q&A kinds only) — advances
    // over `selectedPrompt.seedTopics` the same way `phaseIndex` advances over `PHASES`
    const [questionIndex, setQuestionIndex] = useState(0)
    // the conversation so far — candidate turns captured via STT, interviewer turns streamed
    const [turns, setTurns] = useState<Array<MockInterviewTurn>>([])
    // end-of-session grade (null until `gradeMockInterviewSession` resolves)
    const [grade, setGrade] = useState<MockInterviewGradeResult | null>(null)
    // set when grading throws/fails — surfaced back on the interview screen so nothing is lost
    const [gradeError, setGradeError] = useState<string | null>(null)
    // true when the LAST grading failure was specifically the AI credit pool being
    // exhausted — shown as a distinct upsell card instead of the generic error box
    const [gradeQuotaExceeded, setGradeQuotaExceeded] = useState(false)
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

    // right-pane workspace — which tool is active + each tool's persisted artifact.
    // "qna" defaults to Notes (most answers are spoken/typed, not drawn/coded —
    // Whiteboard/Code stay one tab away for whichever question needs them);
    // "design" keeps defaulting to the whiteboard (its capstones are architecture
    // systems).
    const [workspaceTool, setWorkspaceTool] = useState<"whiteboard" | "code" | "notes">(
        mode === "design" ? "whiteboard" : "notes",
    )
    const diagramRef = useRef<{
        nodes: Array<MockInterviewDiagramNodeSnapshot>
        edges: Array<MockInterviewDiagramEdgeSnapshot>
    }>({ nodes: [], edges: [] })
    const [hasDiagramContent, setHasDiagramContent] = useState(false)
    const [codeState, setCodeState] = useState<MockInterviewCodeState>(MOCK_INTERVIEW_CODE_STATE_DEFAULT)
    const [notes, setNotes] = useState("")
    // mode="qna" only — the single answer field's typed draft. Voice input mirrors into
    // this same value (see the effect below) so gõ/nói land in ONE editable field
    // instead of the old mic-only flow with nowhere to type.
    const [answerDraft, setAnswerDraft] = useState("")
    // mode="qna" only — whether the optional whiteboard/code/notes panel is expanded.
    // Collapsed by default (Vòng 5): most Q&A answers are spoken/typed, not drawn/coded,
    // so the workspace no longer eats half the screen unconditionally. Stays MOUNTED
    // (just hidden) so an in-progress sketch/code/notes buffer is never lost by toggling.
    const [workspaceOpen, setWorkspaceOpen] = useState(false)
    // green room — whether the (collapsed-by-default) "Tùy chỉnh phiên" config is open.
    // Defaults sensible (Tự động), so the pre-interview screen reads as a calm waiting
    // room, not a settings form; power users expand it to tune the run.
    const [configOpen, setConfigOpen] = useState(false)

    // the interviewer's presented identity for the room (FE-only; seniority scales
    // with tier). Its role label is resolved from `mockInterview.personaRole.<tier>`.
    const persona = personaFor(tier)

    // "Luyện thiết kế hệ thống" is only offered for a System-Design course — its
    // capstones are architecture systems, the only ones the unchanged 5-phase
    // script fits.
    // TODO: refine to "a module large enough for a design interview" once a
    // non-SD track has a capstone that size, rather than gating by track alone.
    const isDesignAvailable = courseDisplayId.includes("system-design")
    const currentPhase = PHASES[phaseIndex]
    const currentLevel = TIER_CONFIG[tier].level
    const isQna = mode === "qna"
    // the current question's own seed text + randomly-assigned kind (mode="qna" only)
    const currentSeedTopic = selectedPrompt?.seedTopics[questionIndex]
    const currentSeed = currentSeedTopic?.title ?? null
    const currentKind = currentSeedTopic?.kind
    const totalQuestions = selectedPrompt?.seedTopics.length ?? QNA_QUESTION_COUNT
    const isLastQuestion = questionIndex >= totalQuestions - 1
    // the single question card (mode="qna", Vòng 5) shows ONLY the interviewer's turn for
    // the CURRENT question — never the short seed-title preview, which used to render
    // ALONGSIDE the full generated question and read as a duplicate.
    const currentQuestionTurn = [...turns].reverse().find(
        (turn) => turn.role === "interviewer" && turn.questionIndex === questionIndex,
    )
    // the interviewer's role label, scaled by tier (Sơ → engineer … Cao → staff)
    const roleLabel = t(`mockInterview.personaRole.${persona.roleTier}`)

    // mirror the finalized STT transcript into the single answer draft while listening,
    // so gõ (typing) and nói (voice) both land in ONE editable field. Skipped on the
    // very first (empty) tick after `start()` resets the hook's own transcript, so a
    // manually-typed draft is never wiped the instant the mic is tapped.
    useEffect(() => {
        if (listening && transcript.length > 0) {
            setAnswerDraft(transcript)
        }
    }, [listening, transcript])

    // tick the interview timer once per second while in the interview
    useEffect(() => {
        if (phase !== "interview") {
            return
        }
        const id = window.setInterval(() => setElapsed((previous) => previous + 1), 1000)
        return () => window.clearInterval(id)
    }, [phase])

    // ask the interviewer for its next turn (opening line, a probe after an answer, a
    // phase-transition line for mode="design", or a fresh seed question for mode="qna")
    // and stream the reply into `turns` once it completes. Shared by
    // startSession/submitAnswer/advancePhase/submitQnaAnswer so there is exactly one
    // place that touches the single in-flight stream tracked by `useMockInterviewTurnStream`.
    const askNextTurn = useCallback(
        (params: {
            phase: MockInterviewPhaseKey
            latestAnswer: string
            history: Array<MockInterviewTurn>
            prompt: DrawnMockInterviewPrompt
            questionIndex: number
            currentSeed: string | null
        }) => {
            streamingRef.current = ""
            setIsAsking(true)
            setStreamingText("")
            // silence any previous spoken question before the next one streams in
            ttsRef.current.cancel()
            // THIS question's own kind (mode="qna") — randomly assigned per-seed by
            // the server draw, read off the seed the ask is currently framed around.
            const askKind = isQna ? params.prompt.seedTopics[params.questionIndex]?.kind : undefined
            turnStream.ask({
                courseId,
                promptId: params.prompt.id,
                promptTitle: params.prompt.title,
                phase: params.phase,
                history: params.history.map((turn) => ({ role: turn.role, content: turn.content })),
                latestAnswer: params.latestAnswer,
                model: selection.model,
                provider: selection.provider,
                level: currentLevel,
                mode,
                kind: askKind,
                currentSeed: params.currentSeed,
                questionIndex: isQna ? params.questionIndex : null,
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
                        setTurns((previous) => [
                            ...previous,
                            {
                                role: "interviewer",
                                phase: params.phase,
                                content: finalText,
                                questionIndex: isQna ? params.questionIndex : undefined,
                            },
                        ])
                        // the interviewer reads the finished question aloud (no-op if muted/unsupported)
                        ttsRef.current.speak(finalText)
                    }
                },
            })
        },
        [courseId, selection, currentLevel, mode, isQna, turnStream],
    )

    // ask the SERVER to draw a fresh prompt for the current tier and start a new run.
    // Re-drawing (rather than reusing the same prompt) is also how "Phỏng vấn lại"
    // behaves — retrying asks the server for a fresh draw of the SAME mode/tier, never
    // the same prompt twice. The client never picks the prompt itself — it only asks
    // for one and stores the `sessionId` the server hands back, which
    // `gradeMockInterviewSession` later looks up server-side to trust the
    // stored prompt/level/mode instead of whatever the client echoes.
    //
    // Takes an explicit mode so the two setup entry points ("Bắt đầu phỏng vấn" →
    // qna, "Luyện thiết kế hệ thống" → design) each start the RIGHT mode without
    // racing `setMode` — retry (no arg) reuses whichever mode the last run was in.
    const startSession = useCallback(async (nextMode: MockInterviewMode = mode) => {
        setStartError(null)
        setMode(nextMode)
        // "Tự động" = random everything (all kinds, default question count) + counts
        // toward job-readiness. "Tùy chỉnh" sends the picked question count/kinds and
        // is EXCLUDED from job-readiness (kept a clean signal from random runs only).
        // mode="design" always counts (server forces it regardless of what's sent).
        const isConfigurable = nextMode === "qna" && configMode === "configurable"
        try {
            const response = await startSessionSwr.trigger({
                courseId,
                level: currentLevel,
                mode: nextMode,
                questionCount: isConfigurable ? Number(questionCount) : undefined,
                kinds: isConfigurable && selectedKinds.length > 0 ? selectedKinds : undefined,
                countsToReadiness: !isConfigurable,
            })
            const payload = response.data?.startMockInterviewSession
            if (!payload?.success || !payload.data) {
                setStartError(payload?.message ?? t("mockInterview.startFailed"))
                return
            }
            const drawn: DrawnMockInterviewPrompt = {
                id: payload.data.promptId,
                title: payload.data.promptTitle,
                seedTopics: payload.data.seedTopics,
            }
            sessionId.current = payload.data.sessionId
            setSelectedPrompt(drawn)
            setTurns([])
            setPhaseIndex(0)
            setQuestionIndex(0)
            setElapsed(0)
            setGrade(null)
            setGradeError(null)
            setGradeQuotaExceeded(false)
            diagramRef.current = { nodes: [], edges: [] }
            setHasDiagramContent(false)
            setCodeState(MOCK_INTERVIEW_CODE_STATE_DEFAULT)
            setNotes("")
            setAnswerDraft("")
            setWorkspaceOpen(false)
            // Q&A defaults the workspace to Notes (most answers are spoken/typed);
            // design keeps defaulting to the whiteboard (architecture systems).
            setWorkspaceTool(nextMode === "design" ? "whiteboard" : "notes")
            setPhase("interview")
            // the interviewer opens the session — empty history, no answer yet. For
            // mode="qna" the opening turn is framed around the first drawn seed topic.
            askNextTurn({
                phase: PHASES[0],
                latestAnswer: "",
                history: [],
                prompt: drawn,
                questionIndex: 0,
                currentSeed: drawn.seedTopics[0]?.title ?? null,
            })
        } catch {
            setStartError(t("mockInterview.startFailed"))
        }
    }, [courseId, currentLevel, mode, configMode, questionCount, selectedKinds, startSessionSwr, askNextTurn, t])

    // mode="design" only (Vòng 5) — record the current spoken answer as a candidate
    // turn, then ask the interviewer to probe/follow-up on it within the SAME phase,
    // then clear the mic buffer. A real system-design interview is a multi-turn
    // Socratic back-and-forth per phase, so this stays as-is. mode="qna" uses
    // `submitQnaAnswer` instead (one answer → straight to the next question).
    const submitAnswer = useCallback(() => {
        const answer = transcript.trim()
        if (answer.length === 0 || isAsking || !selectedPrompt) {
            return
        }
        if (listening) {
            stop()
        }
        const nextTurns: Array<MockInterviewTurn> = [
            ...turns,
            {
                role: "candidate",
                phase: currentPhase,
                content: answer,
                questionIndex: isQna ? questionIndex : undefined,
            },
        ]
        setTurns(nextTurns)
        reset()
        askNextTurn({
            phase: currentPhase,
            latestAnswer: answer,
            history: nextTurns,
            prompt: selectedPrompt,
            questionIndex,
            currentSeed,
        })
    }, [transcript, listening, stop, reset, currentPhase, turns, isAsking, selectedPrompt, questionIndex, currentSeed, isQna, askNextTurn])

    // mode="design" only — advance to the next of the 5 canonical phases, unchanged.
    const advancePhase = useCallback(() => {
        if (isAsking || !selectedPrompt) {
            return
        }
        setPhaseIndex((previous) => {
            const next = Math.min(previous + 1, PHASES.length - 1)
            if (next !== previous) {
                // let the interviewer proactively introduce the new phase (no fresh answer yet)
                askNextTurn({
                    phase: PHASES[next],
                    latestAnswer: "",
                    history: turns,
                    prompt: selectedPrompt,
                    questionIndex: 0,
                    currentSeed: null,
                })
            }
            return next
        })
    }, [isAsking, selectedPrompt, askNextTurn, turns])

    const finishAndGrade = useCallback(async (turnsOverride?: Array<MockInterviewTurn>) => {
        if (!selectedPrompt || isAsking) {
            return
        }
        // `turnsOverride` lets `submitQnaAnswer` grade the LAST question's answer
        // immediately — `setTurns` is async, so reading the `turns` state right after
        // calling it would miss the answer that was just recorded.
        const turnsToGrade = turnsOverride ?? turns
        setPhase("grading")
        setGradeError(null)
        setGradeQuotaExceeded(false)
        // fold each non-empty workspace artifact in as a labeled synthetic candidate
        // turn — kept FE-only (no new BE field) by reusing the existing transcript shape.
        // Every turn (recorded + synthetic) carries its `questionIndex` for Q&A kinds so
        // the server can group them into per-question `phaseScores`; omitted for design.
        const turnsForGrading: Array<MockInterviewTurnInput> = turnsToGrade.map((turn) => ({
            role: turn.role,
            phase: turn.phase,
            content: turn.content,
            questionIndex: turn.questionIndex,
        }))
        const syntheticQuestionIndex = isQna ? questionIndex : undefined
        const diagramText = serializeMockInterviewDiagram(diagramRef.current.nodes, diagramRef.current.edges)
        if (diagramText) {
            turnsForGrading.push({
                role: "candidate",
                phase: currentPhase,
                content: `[Whiteboard]\n${diagramText}`,
                questionIndex: syntheticQuestionIndex,
            })
        }
        if (codeState.code.trim().length > 0) {
            turnsForGrading.push({
                role: "candidate",
                phase: currentPhase,
                content: `[Code lang=${codeState.lang}]\n${codeState.code}`,
                questionIndex: syntheticQuestionIndex,
            })
        }
        if (notes.trim().length > 0) {
            turnsForGrading.push({
                role: "candidate",
                phase: currentPhase,
                content: `[Notes]\n${notes}`,
                questionIndex: syntheticQuestionIndex,
            })
        }
        try {
            const response = await gradeSwr.trigger({
                courseId,
                promptId: selectedPrompt.id,
                promptTitle: selectedPrompt.title,
                level: currentLevel,
                turns: turnsForGrading,
                sessionId: sessionId.current ?? crypto.randomUUID(),
                selectedModel: selection.model ?? undefined,
                selectedModelProvider: selection.provider ?? undefined,
            })
            const payload = response.data?.gradeMockInterviewSession
            // typed backend failure (quota, substance gate, validation …) — surface the
            // message and stay in the interview so nothing recorded so far is lost
            if (!payload?.success || !payload.data) {
                // the mutation response has no typed error CODE to distinguish "quota
                // exhausted" from other failures — re-check the credit pool right after
                // the failure so the upsell card is based on the FRESH quota state, not
                // string-matching the BE's error message
                const freshQuota = await aiQuotaSwr.mutate()
                const overQuotaNow = Boolean(
                    freshQuota
                    && (freshQuota.credit.remaining5h < 1 || freshQuota.credit.remainingWeek < 1),
                )
                setGradeQuotaExceeded(overQuotaNow)
                setGradeError(payload?.message ?? t("mockInterview.gradingFailed"))
                setPhase("interview")
                return
            }
            setGrade({
                overallScore: payload.data.overallScore,
                verdict: normalizeMockInterviewVerdict(payload.data.verdict),
                phaseScores: payload.data.phaseScores.map((item) => ({
                    phase: item.phase,
                    score: item.score,
                    max: item.max,
                })),
                attributeScores: payload.data.attributeScores,
                strengths: payload.data.strengths,
                gaps: payload.data.gaps,
                followUpQuestion: payload.data.followUpQuestion ?? null,
                matchedContentIds: payload.data.matchedContentIds ?? [],
            })
            setPhase("scorecard")
        } catch {
            // thrown (network/GraphQL) error — not a typed backend failure, so no fresh
            // quota re-check is meaningful here; treat as the generic failure
            setGradeQuotaExceeded(false)
            setGradeError(t("mockInterview.gradingFailed"))
            setPhase("interview")
        }
    }, [courseId, selectedPrompt, isAsking, currentLevel, turns, currentPhase, isQna, questionIndex, codeState, notes, selection, gradeSwr, aiQuotaSwr, t])

    // mode="qna" only (Vòng 5) — "hỏi từng câu": record the answer, then move STRAIGHT
    // to the next question (or straight to grading on the last one) — one combined
    // action instead of the old "gửi câu trả lời" + separate "câu tiếp theo" buttons.
    // No same-question follow-up probe (that stays design-only, see `submitAnswer`).
    const submitQnaAnswer = useCallback(() => {
        const answer = answerDraft.trim()
        if (answer.length === 0 || isAsking || !selectedPrompt) {
            return
        }
        if (listening) {
            stop()
        }
        const nextTurns: Array<MockInterviewTurn> = [
            ...turns,
            { role: "candidate", phase: currentPhase, content: answer, questionIndex },
        ]
        setTurns(nextTurns)
        reset()
        setAnswerDraft("")
        if (isLastQuestion) {
            void finishAndGrade(nextTurns)
            return
        }
        const next = questionIndex + 1
        setQuestionIndex(next)
        askNextTurn({
            phase: currentPhase,
            latestAnswer: "",
            history: nextTurns,
            prompt: selectedPrompt,
            questionIndex: next,
            currentSeed: selectedPrompt.seedTopics[next]?.title ?? null,
        })
    }, [answerDraft, isAsking, selectedPrompt, listening, stop, turns, currentPhase, questionIndex, reset, isLastQuestion, finishAndGrade, askNextTurn])

    // leave the interview mid-run (abandon, ungraded) — confirm first, then hush the
    // mic + any spoken question and return to the green room.
    const leaveInterview = useCallback(() => {
        if (typeof window !== "undefined" && !window.confirm(t("mockInterview.leaveConfirm"))) {
            return
        }
        if (listening) {
            stop()
        }
        ttsRef.current.cancel()
        setPhase("setup")
    }, [listening, stop, t])

    // mirror the whiteboard's plain-object snapshot into a ref (read only at grade time)
    const handleDiagramChange = useCallback(
        (nodes: Array<MockInterviewDiagramNodeSnapshot>, edges: Array<MockInterviewDiagramEdgeSnapshot>) => {
            diagramRef.current = { nodes, edges }
            setHasDiagramContent(nodes.length > 0)
        },
        [],
    )

    // ── SETUP · GREEN ROOM ───────────────────────────────────────────────
    if (phase === "setup") {
        // rough time-ahead estimate for the pre-interview line (~3 min per question)
        const estCount = configMode === "configurable" ? Number(questionCount) : QNA_QUESTION_COUNT
        const estMinutes = estCount * 3
        return (
            <div className={cn("mx-auto flex w-full max-w-2xl flex-col gap-6", className)}>
                {/* A3 — "where you stand" snapshot before starting a new run (retention hook).
                    Self-hides when the viewer has no track/interview attempt yet. */}
                <MockInterviewTrackSnapshot courseId={courseId} />

                {/* green room — a calm pre-interview waiting room: the interviewer you're
                    about to meet, what's ahead, and the ONE way in. Config is tucked away
                    (collapsed) so this reads as an occasion, not a settings form. */}
                <div className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-surface">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg font-medium text-accent" aria-hidden>
                            {persona.monogram}
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <Typography type="body" weight="medium" className="truncate">{persona.name}</Typography>
                            <Typography type="body-xs" color="muted" className="truncate">{roleLabel}</Typography>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Typography type="h4" weight="semibold">{t("mockInterview.aboutToBeInterviewed")}</Typography>
                        <Typography type="body-sm" color="muted">
                            {t("mockInterview.roomSummary", { count: estCount, tier: t(`mockInterview.tier.${tier}`), minutes: estMinutes })}
                        </Typography>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            isDisabled={startSessionSwr.isMutating}
                            onPress={() => void startSession("qna")}
                        >
                            {startSessionSwr.isMutating ? (
                                <Spinner size="sm" />
                            ) : (
                                <DoorOpenIcon className="size-5" aria-hidden focusable="false" />
                            )}
                            {t("mockInterview.enterRoom")}
                        </Button>
                        {isDesignAvailable ? (
                            <Button
                                variant="secondary"
                                size="lg"
                                isDisabled={startSessionSwr.isMutating}
                                onPress={() => void startSession("design")}
                            >
                                <PenNibIcon className="size-5" aria-hidden focusable="false" />
                                {t("mockInterview.designModeCta")}
                            </Button>
                        ) : null}
                    </div>
                </div>

                {/* Tùy chỉnh phiên — collapsed by default; all run config lives here so the
                    green room stays calm. Every control is a WrapButton/chip; the grading
                    model sits INSIDE the card as an isDropdown field with its weekly credit. */}
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => setConfigOpen((previous) => !previous)}
                        aria-expanded={configOpen}
                        className="group flex w-fit cursor-pointer items-center gap-1.5 text-muted hover:text-foreground"
                    >
                        <CaretDownIcon
                            className={cn("size-4 transition-transform", configOpen && "rotate-180")}
                            aria-hidden
                            focusable="false"
                        />
                        <Typography type="body-sm" className="group-hover:underline">
                            {t("mockInterview.customizeSession")}
                        </Typography>
                    </button>
                    {configOpen ? (
                        <LabeledCard
                            label={t("mockInterview.configTitle")}
                            labelEnd={configMode === "auto" ? t("mockInterview.autoCaption") : undefined}
                            contentClassName="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-2">
                                <Typography type="body-xs" color="muted">{t("mockInterview.modeToggleLabel")}</Typography>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("mockInterview.modeToggleLabel")}
                                    value={configMode}
                                    onChange={setConfigMode}
                                    items={[
                                        { value: "auto" as const, content: t("mockInterview.modeAuto") },
                                        { value: "configurable" as const, content: t("mockInterview.modeConfigurable") },
                                    ]}
                                />
                            </div>

                            {configMode === "configurable" ? (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Typography type="body-xs" color="muted">{t("mockInterview.questionCountLabel")}</Typography>
                                        <FlexWrapButtonRadio
                                            ariaLabel={t("mockInterview.questionCountLabel")}
                                            value={questionCount}
                                            onChange={setQuestionCount}
                                            items={QUESTION_COUNT_OPTIONS.map((count) => ({
                                                value: count,
                                                content: t("mockInterview.questionCountOption", { count }),
                                            }))}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Typography type="body-xs" color="muted">{t("mockInterview.kindPickerLabel")}</Typography>
                                        <div role="group" aria-label={t("mockInterview.kindPickerLabel")} className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                aria-pressed={selectedKinds.length === 0}
                                                onClick={() => setSelectedKinds([])}
                                                className={cn(
                                                    "cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                                                    selectedKinds.length === 0
                                                        ? "border-accent bg-accent/10 text-foreground"
                                                        : "border-default bg-surface text-muted shadow-surface hover:bg-default",
                                                )}
                                            >
                                                {t("mockInterview.kindAll")}
                                            </button>
                                            {KIND_OPTIONS.map((kind) => {
                                                const isSelected = selectedKinds.includes(kind)
                                                return (
                                                    <button
                                                        key={kind}
                                                        type="button"
                                                        aria-pressed={isSelected}
                                                        onClick={() => setSelectedKinds((previous) => (isSelected
                                                            ? previous.filter((value) => value !== kind)
                                                            : [...previous, kind]))}
                                                        className={cn(
                                                            "cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                                                            isSelected
                                                                ? "border-accent bg-accent/10 text-foreground"
                                                                : "border-default bg-surface text-muted shadow-surface hover:bg-default",
                                                        )}
                                                    >
                                                        {t(`mockInterview.kind.${kind}`)}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Typography type="body-xs" color="muted">{t("mockInterview.answerModeLabel")}</Typography>
                                        <FlexWrapButtonRadio
                                            ariaLabel={t("mockInterview.answerModeLabel")}
                                            value={answerMode}
                                            onChange={setAnswerMode}
                                            items={(["voice", "text", "both"] as const).map((value) => ({
                                                value,
                                                content: t(`mockInterview.answerMode.${value}`),
                                            }))}
                                        />
                                    </div>
                                </>
                            ) : null}

                            <div className="flex flex-col gap-2">
                                <Typography type="body-xs" color="muted">{t("mockInterview.tierLabel")}</Typography>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("mockInterview.tierLabel")}
                                    value={tier}
                                    onChange={setTier}
                                    items={TIERS.map((value) => ({
                                        value,
                                        content: t(`mockInterview.tier.${value}`),
                                    }))}
                                />
                                <Typography type="body-xs" color="muted">
                                    {t("mockInterview.tierCaption")}
                                </Typography>
                            </div>

                            {/* grading model — INSIDE the card as a field; because it's nested in
                        the config card (card-in-card / surface-in-surface), the field reads
                        by BORDER not shadow: `shadow-none` drops shadow-field so it doesn't
                        stack elevation inside the card. The Auto lane ALWAYS carries its
                        weekly credit beside it (unified-pool concept). */}
                            <div className="flex flex-col gap-2">
                                <Typography type="body-xs" color="muted">{t("mockInterview.modelLabel")}</Typography>
                                <div className="flex flex-wrap items-center gap-3">
                                    <GradeModelDropdown
                                        isDropdown
                                        className="w-full shadow-none sm:w-72"
                                        models={gradeModels}
                                        selection={selection}
                                        canPremium={canPremium}
                                        task={AiModelTask.Grading}
                                        floor={AiModelCategory.Balanced}
                                        showAutoLane
                                        onSelect={setSelection}
                                        onUpgrade={() => router.push(`/${locale}/profile/settings/ai-subscription`)}
                                    />
                                    <GradeCreditCaption
                                        creditUsage={aiQuotaSwr.data}
                                        hasPinnedModel={Boolean(selection.model)}
                                        autoCreditCost={undefined}
                                    />
                                </div>
                            </div>
                        </LabeledCard>
                    ) : null}
                </div>

                {startError ? (
                    <Callout status="danger" title={startError} onClose={() => setStartError(null)} />
                ) : null}

                <MockInterviewHistory courseId={courseId} courseDisplayId={courseDisplayId} />
            </div>
        )
    }

    // ── GRADING (debrief opening) ────────────────────────────────────────
    if (phase === "grading") {
        return (
            <div className={cn("mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl bg-surface p-8 shadow-surface", className)}>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg font-medium text-accent" aria-hidden>
                    {persona.monogram}
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Typography type="body" weight="medium" align="center">
                        {t("mockInterview.interviewerGrading", { name: persona.name })}
                    </Typography>
                    <Spinner size="sm" />
                    <Typography type="body-sm" color="muted" align="center">
                        {t("mockInterview.gradingPending")}
                    </Typography>
                </div>
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
            <div className={cn("mx-auto flex w-full max-w-2xl flex-col gap-6", className)}>
                {/* debrief header — the interviewer "sits down" to give feedback */}
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-base font-medium text-accent" aria-hidden>
                        {persona.monogram}
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <Typography type="body" weight="medium">{t("mockInterview.debriefTitle")}</Typography>
                        <Typography type="body-xs" color="muted" className="truncate">{persona.name} · {roleLabel}</Typography>
                    </div>
                </div>
                {/* B6/B7 live INSIDE the scorecard now: the primary action studies the weak
                    phase in the course (closes the demand loop, Hole 1), retry is a
                    tertiary action beside it — see MockInterviewScorecard. Retry draws a
                    FRESH random prompt of the same tier, never the same prompt twice. */}
                <MockInterviewScorecard
                    grade={grade}
                    courseId={courseId}
                    courseDisplayId={courseDisplayId}
                    promptTitle={selectedPrompt?.title}
                    onRetry={startSession}
                />
                <Button variant="tertiary" className="self-start" onPress={() => setPhase("setup")}>
                    {t("mockInterview.backToSetup")}
                </Button>
            </div>
        )
    }

    // ── INTERVIEW, mode="qna" (Vòng 5 — "hỏi từng câu"): 1 CỘT, 1 câu, 1 ô trả lời ──
    // No 2-pane split (Q&A doesn't need a workspace open by default), no chat-bubble
    // thread (the question renders ONCE, as a card — no more seed-preview + full-text
    // duplicate), no 2 separate buttons (answer + advance are 1 action).
    if (isQna) {
        // the grade-error callouts are shared with the design branch below
        const errorCallout = gradeQuotaExceeded ? (
            <Callout
                status="warning"
                title={t("mockInterview.quotaExceededTitle")}
                description={t("mockInterview.quotaExceededDescription")}
                action={(
                    <Button
                        variant="secondary"
                        size="sm"
                        onPress={() => router.push(pathConfig().locale(locale).profile().aiSubscription().build())}
                    >
                        {t("mockInterview.quotaExceededCta")}
                    </Button>
                )}
            />
        ) : gradeError ? (
            <div className="rounded-xl bg-danger/10 p-4">
                <Typography type="body-sm" className="text-danger">{gradeError}</Typography>
            </div>
        ) : null

        return (
            <div className={cn("mx-auto flex w-full max-w-2xl flex-col gap-6", className)}>
                {/* HUD — leave (left) · timer (center) · question counter + kind (right) */}
                <div className="flex items-center justify-between gap-3">
                    <Button variant="tertiary" size="sm" onPress={leaveInterview}>
                        <SignOutIcon className="size-4" aria-hidden focusable="false" />
                        {t("mockInterview.leaveInterview")}
                    </Button>
                    <div className="flex items-center gap-2 text-muted">
                        <ClockIcon className="size-4" aria-hidden focusable="false" />
                        <Typography type="body-sm" weight="medium" className="tabular-nums">{formatElapsed(elapsed)}</Typography>
                    </div>
                    <Typography type="body-xs" weight="medium" color="muted">
                        {currentKind
                            ? t("mockInterview.questionCounterWithKind", {
                                index: questionIndex + 1,
                                total: totalQuestions,
                                kind: t(`mockInterview.kind.${currentKind}`),
                            })
                            : t("mockInterview.questionCounter", { index: questionIndex + 1, total: totalQuestions })}
                    </Typography>
                </div>

                {/* progress dots — done=success, current=accent, upcoming=track */}
                <div className="flex gap-1" role="presentation">
                    {Array.from({ length: totalQuestions }, (_, position) => (
                        <span
                            key={position}
                            className={cn(
                                "h-1 flex-1 rounded-full",
                                position < questionIndex ? "bg-success" : position === questionIndex ? "bg-accent" : "bg-default",
                            )}
                        />
                    ))}
                </div>

                {errorCallout}

                {/* interviewer presence — avatar + persona + "đang nói" pulse + TTS toggle,
                    wrapping THIS question's streamed turn (once) as the body */}
                <InterviewerPresence
                    persona={persona}
                    roleLabel={roleLabel}
                    speaking={isAsking}
                    speakingLabel={t("mockInterview.interviewerSpeaking")}
                    ttsSupported={tts.supported}
                    ttsEnabled={tts.enabled}
                    onToggleTts={() => tts.setEnabled(!tts.enabled)}
                    muteLabel={t("mockInterview.muteInterviewer")}
                    unmuteLabel={t("mockInterview.unmuteInterviewer")}
                >
                    {isAsking ? (
                        streamingText ? (
                            <div className="text-sm font-medium text-foreground">
                                <MarkdownContent markdown={streamingText} />
                            </div>
                        ) : (
                            <Spinner size="sm" />
                        )
                    ) : currentQuestionTurn ? (
                        <div className="text-sm font-medium text-foreground">
                            <MarkdownContent markdown={currentQuestionTurn.content} />
                        </div>
                    ) : (
                        <Typography type="body-sm" color="muted">
                            {t("mockInterview.interviewerPending")}
                        </Typography>
                    )}
                </InterviewerPresence>

                {/* answer — voice is the hero (big push-to-talk mic + live transcript),
                    typing is the quiet fallback. Voice + typing both land in `answerDraft`
                    (the STT mirror effect keeps them in sync). */}
                <VoiceHero
                    sttSupported={supported}
                    listening={listening}
                    interimTranscript={interimTranscript}
                    value={answerDraft}
                    onValueChange={setAnswerDraft}
                    onToggleListen={() => (listening ? stop() : start())}
                    answerMode={answerMode}
                    labels={{
                        pushToTalk: t("mockInterview.pushToTalk"),
                        listening: t("mockInterview.listening"),
                        typeInstead: t("mockInterview.typeInstead"),
                        useVoice: t("mockInterview.useVoice"),
                        placeholder: t("mockInterview.answerPlaceholder"),
                    }}
                />

                {/* optional artifact tools — collapsed by default; kept MOUNTED (hidden, not
                    unmounted) so an in-progress sketch is never lost by toggling */}
                <button
                    type="button"
                    onClick={() => setWorkspaceOpen((previous) => !previous)}
                    className="group flex w-fit cursor-pointer items-center gap-1.5 text-muted hover:text-foreground"
                >
                    <PenNibIcon className="size-4" aria-hidden focusable="false" />
                    <Typography type="body-xs" className="group-hover:underline">
                        {workspaceOpen ? t("mockInterview.hideArtifactToggle") : t("mockInterview.addArtifactToggle")}
                    </Typography>
                </button>
                <MockInterviewWorkspace
                    className={cn(!workspaceOpen && "hidden")}
                    tool={workspaceTool}
                    onToolChange={setWorkspaceTool}
                    onDiagramChange={handleDiagramChange}
                    hasDiagramContent={hasDiagramContent}
                    codeState={codeState}
                    onCodeStateChange={setCodeState}
                    notes={notes}
                    onNotesChange={setNotes}
                />

                <Button
                    variant="primary"
                    size="lg"
                    onPress={submitQnaAnswer}
                    isDisabled={answerDraft.trim().length === 0 || isAsking}
                >
                    {isLastQuestion ? t("mockInterview.answerAndFinish") : t("mockInterview.answerAndNext")}
                    <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                </Button>
                {/* grade before the last question (rarely needed — auto-finishes on the last) */}
                <Button variant="tertiary" size="sm" className="self-center" onPress={() => void finishAndGrade()} isDisabled={isAsking}>
                    {t("mockInterview.finishEarly")}
                </Button>
            </div>
        )
    }

    // ── INTERVIEW, mode="design" (2-pane: conversation | tool workspace) — unchanged ──
    return (
        <div className={cn("flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6", className)}>
            {/* LEFT — the conversation: presence + phase stepper + timer + thread + voice composer */}
            <div className="flex flex-col gap-3">
                <InterviewerPresence
                    persona={persona}
                    roleLabel={roleLabel}
                    speaking={isAsking}
                    speakingLabel={t("mockInterview.interviewerSpeaking")}
                    ttsSupported={tts.supported}
                    ttsEnabled={tts.enabled}
                    onToggleTts={() => tts.setEnabled(!tts.enabled)}
                    muteLabel={t("mockInterview.muteInterviewer")}
                    unmuteLabel={t("mockInterview.unmuteInterviewer")}
                />
                <div className="flex items-center gap-2 text-muted">
                    <ClockIcon className="size-4" aria-hidden focusable="false" />
                    <Typography type="body-sm" weight="medium" className="tabular-nums">{formatElapsed(elapsed)}</Typography>
                </div>
                <ul className="flex flex-wrap gap-3">
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

                <div className="flex flex-col gap-2 rounded-xl bg-default/40 p-4">
                    <Typography type="body-xs" weight="medium" color="muted">
                        {t("mockInterview.promptLabel")}
                    </Typography>
                    <Typography type="body" weight="medium">{selectedPrompt?.title}</Typography>
                </div>

                {/* grading failure — distinguish the AI-credit-pool-exhausted case (typed via
                    the `myAiQuota` re-check right after the failure, not message-string
                    matching) from any other backend failure (validation, substance gate …),
                    which is shown inline with whatever message the backend returned. */}
                {gradeQuotaExceeded ? (
                    <Callout
                        status="warning"
                        title={t("mockInterview.quotaExceededTitle")}
                        description={t("mockInterview.quotaExceededDescription")}
                        action={(
                            <Button
                                variant="secondary"
                                size="sm"
                                onPress={() => router.push(pathConfig().locale(locale).profile().aiSubscription().build())}
                            >
                                {t("mockInterview.quotaExceededCta")}
                            </Button>
                        )}
                    />
                ) : gradeError ? (
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
            </div>

            {/* RIGHT — the candidate tool workspace: whiteboard / code / notes, "y như
                phỏng vấn thật". Artifacts persist across tab switches; each non-empty
                artifact is folded into the transcript as a labeled turn at grade time. */}
            <MockInterviewWorkspace
                tool={workspaceTool}
                onToolChange={setWorkspaceTool}
                onDiagramChange={handleDiagramChange}
                hasDiagramContent={hasDiagramContent}
                codeState={codeState}
                onCodeStateChange={setCodeState}
                notes={notes}
                onNotesChange={setNotes}
            />
        </div>
    )
}
