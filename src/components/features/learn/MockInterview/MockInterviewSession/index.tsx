"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    Button,
    Chip,
    Label,
    Link,
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
    CodeIcon,
    DoorOpenIcon,
    MicrophoneIcon,
    PenNibIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { ChatBubble } from "@/components/blocks/feed/ChatBubble"
import { Callout } from "@/components/blocks/feedback/Callout"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { ModalShell } from "@/components/blocks/layout/ModalShell"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { GradeModelDropdown, type GradeModelSelection } from "@/components/blocks/grading/GradeModelDropdown"
import { GradeCreditCaption } from "@/components/blocks/grading/GradeCreditCaption"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { pathConfig } from "@/resources/path"
import { useQueryUserSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserSwr"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis"
import { useMockInterviewTurnStream } from "@/hooks/socketio/useMockInterviewTurnStream"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { useQueryMyInProgressMockInterviewSessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInProgressMockInterviewSessionSwr"
import { useMutateGradeMockInterviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateGradeMockInterviewSessionSwr"
import { useMutateStartMockInterviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartMockInterviewSessionSwr"
import { useMutateSyncMockInterviewSessionTurnsSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSyncMockInterviewSessionTurnsSwr"
import { AiModelCategory, AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import type { AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import type { MockInterviewTurnInput } from "@/modules/api/graphql/mutations/types/grade-mock-interview-session"
import type { MockInterviewTurnInput as SyncMockInterviewTurnInput } from "@/modules/api/graphql/mutations/types/sync-mock-interview-session-turns"
import type { MockInterviewSeedTopic } from "@/modules/api/graphql/mutations/types/start-mock-interview-session"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { ProgrammingLanguage } from "@/modules/types/enums/programming-language"
import { DEFAULT_PROGRAMMING_LANGUAGES } from "@/modules/types/utils/programming-language"
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
import { VoiceUnavailableModal } from "../VoiceUnavailableModal"
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
    /**
     * Present when mounted from the dedicated `/mock-interview/interview/[sessionId]`
     * route — on mount, rehydrates that session from `myInProgressMockInterviewSession`
     * (24h TTL) and skips straight to the interview phase instead of showing the
     * green room. Falls back to normal setup when the session can't be resumed
     * (null / mismatched / expired).
     */
    resumeSessionId?: string
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

/** Reverse of {@link TIER_CONFIG}'s `level` — resolves a resumed session's server-stored
 *  level string back to its notch, so a resumed run's tier control reads correctly. */
const LEVEL_TO_TIER: Record<string, MockInterviewTier> = {
    junior: "so",
    middle: "trung",
    senior: "cao",
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
    /** Where the questions came from — `"interview-bank"` (authored prompts,
     *  delivered STATICALLY with no AI call) vs `"flashcard"` (AI-framed live). */
    source: string
}

/** Bank questions are pre-authored → the interviewer just READS them (no AI turn
 *  call to ask); only flashcard-seed sessions AI-frame a topic into a question. */
const isStaticBankPrompt = (prompt: DrawnMockInterviewPrompt | undefined): boolean =>
    prompt?.source === "interview-bank"

/**
 * Coerce an authored `givenLang` string to one of the workspace editor's four
 * supported languages (its values ARE Monaco language ids), defaulting to
 * TypeScript for an unset/unknown language — so a debug question's given code
 * always seeds into a syntax-highlighted editor.
 */
const mapGivenLangToProgrammingLanguage = (lang: string | null | undefined): ProgrammingLanguage => {
    const normalized = (lang ?? "").trim().toLowerCase()
    return DEFAULT_PROGRAMMING_LANGUAGES.find((candidate) => candidate === normalized)
        ?? ProgrammingLanguage.TypeScript
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
export const MockInterviewSession = ({ courseId, courseDisplayId, resumeSessionId, className }: MockInterviewSessionProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
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
    // the viewer's resumable in-progress session for this course (24h TTL), if any —
    // read BOTH by the rehydrate effect below (when `resumeSessionId` is present) and
    // by the setup screen's "Resume phiên" card (always, so it can offer resuming even
    // when the learner just landed on the plain `/mock-interview` route).
    const inProgressSessionSwr = useQueryMyInProgressMockInterviewSessionSwr(courseId)
    const syncTurnsSwr = useMutateSyncMockInterviewSessionTurnsSwr()
    // `inProgressSessionSwr`'s query key is gated on `state.keycloak.authenticated`
    // (starts false, only flips true once the app's user-auth check succeeds), so while
    // that check is still in flight the query is DISABLED — SWR reports `isLoading: false`
    // for a disabled query, which looks identical to "fetched, no session" if the
    // rehydrate effect below only checked `isLoading`. Reuse `useQueryUserSwr` (the SAME
    // hook `SwrSideEffects` already calls once at the app root — SWR dedupes by key, so
    // this shares its cache/loading state instead of firing a second request) as the real
    // "has the auth check settled yet" signal. `state.keycloak.initialized` looks like it
    // should serve this — it does NOT: nothing in the app ever dispatches `setInitialized`,
    // so it is permanently `false` and must NOT be used as a gate (verified 2026-07-08 —
    // gating on it here previously made the rehydrate effect below never run at all).
    const authCheckSwr = useQueryUserSwr()

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
    // set when `resumeSessionId` couldn't be resumed (no matching session / expired past
    // the 24h TTL) — surfaced on the setup screen the candidate falls back to
    const [resumeError, setResumeError] = useState<string | null>(null)
    // which destructive-ish interview action is awaiting confirmation in the shared
    // confirm modal (replaces the old `window.confirm` alert): "leave" abandons the run
    // ungraded, "endEarly" grades with the answers given so far. null = modal closed.
    const [confirmAction, setConfirmAction] = useState<null | "leave" | "endEarly">(null)
    // which start CTA is drawing a session right now (so ONLY the pressed button shows the
    // pending spinner while the OTHER is disabled — both share one `startSessionSwr`, so a
    // bare `isMutating` would spin both). null = idle.
    const [startingMode, setStartingMode] = useState<MockInterviewMode | null>(null)
    // guards the rehydrate effect below to at most one resume attempt per mounted
    // instance, regardless of how many times `inProgressSessionSwr` re-renders/revalidates
    const resumeAttemptedRef = useRef(false)
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
    // mode="qna" only — true while the CURRENT open state was forced by a given-code
    // question (deliverStaticQuestion), not clicked open by the candidate themselves.
    // Lets the NEXT question auto-close a workspace it auto-opened, without ever
    // clobbering one the candidate deliberately opened (e.g. to jot notes) — a ref
    // (not state) because it's pure bookkeeping that never itself drives a render.
    const workspaceAutoOpenedRef = useRef(false)
    // green room — whether the (collapsed-by-default) "Tùy chỉnh phiên" config is open.
    // Defaults sensible (Tự động), so the pre-interview screen reads as a calm waiting
    // room, not a settings form; power users expand it to tune the run.
    const [configOpen, setConfigOpen] = useState(false)
    // whether the "no voice for this language installed" nudge is open — the browser's
    // TTS reads the interviewer's question aloud, but only pronounces the current locale
    // correctly if the OS has a matching voice installed (an OS-level resource the page
    // cannot install itself). Opened ONCE per interview when the gap is detected (see the
    // effect below); dismissing persists so it never nags again.
    const [voiceModalOpen, setVoiceModalOpen] = useState(false)
    // guards the nudge to at most once per mounted session (independent of the
    // persisted "dismissed forever" flag) so re-checks/re-renders don't reopen it
    const voiceNudgeShownRef = useRef(false)

    // the interviewer's presented identity for the room (FE-only) — StarCi, a fixed
    // brand persona (face + name), no seniority label. Tier scales questions, not this.
    const persona = personaFor()

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

    // mirror the active phase into the URL (`?phase=interview`) so the learn shell + the
    // MockInterview page shell can drop the course rails + centered padding for the LIVE
    // interview only (a full-bleed work surface); setup/grading/scorecard stay centered.
    // Guarded so it never loops: replaces only when the param differs from the current phase.
    useEffect(() => {
        const want = phase === "interview" ? "interview" : null
        if (searchParams.get("phase") === want) {
            return
        }
        const params = new URLSearchParams(searchParams.toString())
        if (want) {
            params.set("phase", want)
        } else {
            params.delete("phase")
        }
        const qs = params.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, [phase, pathname, searchParams, router])

    // nudge the candidate to install a matching TTS voice ONCE per interview, only
    // once the browser's voice list has actually loaded and confirms none matches the
    // current locale — the interviewer would otherwise read (e.g.) Vietnamese in an
    // English voice. Skipped entirely when TTS is off/unsupported, when a voice IS
    // present, or when the candidate previously dismissed it (persisted forever).
    useEffect(() => {
        if (phase !== "interview" || voiceNudgeShownRef.current) {
            return
        }
        if (!tts.supported || !tts.enabled || !tts.voicesLoaded || tts.hasLocaleVoice) {
            return
        }
        if (typeof window !== "undefined" && window.localStorage.getItem("starci.mockInterview.voiceNudgeDismissed") === "1") {
            voiceNudgeShownRef.current = true
            return
        }
        voiceNudgeShownRef.current = true
        setVoiceModalOpen(true)
    }, [phase, tts.supported, tts.enabled, tts.voicesLoaded, tts.hasLocaleVoice])

    // any close of the voice nudge (X / backdrop / dismiss / auto-close after a
    // successful re-check) persists "dismissed forever" so it never reopens.
    const closeVoiceModal = useCallback((open: boolean) => {
        setVoiceModalOpen(open)
        if (!open && typeof window !== "undefined") {
            window.localStorage.setItem("starci.mockInterview.voiceNudgeDismissed", "1")
        }
    }, [])

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
            /**
             * Overrides the closure's `mode`/`isQna` for this ONE call — needed by the
             * resume-rehydrate effect, which calls `setMode(nextMode)` and immediately
             * asks the opening turn in the SAME synchronous pass: `setMode` doesn't take
             * effect until the next render, so without this override the ask would use
             * the STALE pre-resume `mode` (always "qna", the component's initial value)
             * even when resuming a "design" session.
             */
            modeOverride?: MockInterviewMode
        }) => {
            streamingRef.current = ""
            setIsAsking(true)
            setStreamingText("")
            // silence any previous spoken question before the next one streams in
            ttsRef.current.cancel()
            const effectiveMode = params.modeOverride ?? mode
            const effectiveIsQna = effectiveMode === "qna"
            // THIS question's own kind (mode="qna") — randomly assigned per-seed by
            // the server draw, read off the seed the ask is currently framed around.
            const askKind = effectiveIsQna ? params.prompt.seedTopics[params.questionIndex]?.kind : undefined
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
                mode: effectiveMode,
                kind: askKind,
                currentSeed: params.currentSeed,
                questionIndex: effectiveIsQna ? params.questionIndex : null,
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
                                questionIndex: effectiveIsQna ? params.questionIndex : undefined,
                            },
                        ])
                        // the interviewer reads the finished question aloud (no-op if muted/unsupported)
                        ttsRef.current.speak(finalText)
                    }
                },
            })
        },
        [courseId, selection, currentLevel, mode, turnStream],
    )

    // deliver a PRE-AUTHORED interview-bank question with NO AI call — the
    // question is fully written in `.mount`, so the interviewer just reads it
    // (rendered as-is, incl. any folded diagram/code) and speaks it aloud (TTS).
    // Only grading needs AI; asking a static question does not.
    const deliverStaticQuestion = useCallback((index: number, prompt: DrawnMockInterviewPrompt) => {
        const topic = prompt.seedTopics[index]
        const questionText = topic?.title ?? ""
        if (questionText.length === 0) {
            return
        }
        // a debug/review/optimize question ships GIVEN code → seed it into the
        // editable Code tool + surface the tool (open + switch to the Code tab) so
        // the candidate FIXES it in place; the bubble then shows a "code loaded"
        // chip, not the code inline. A voice-only question RESETS the code buffer so
        // the previous question's code never lingers into — or is graded against —
        // the next one (each question's own code is captured at submit time).
        const givenCode = topic?.givenCode?.trim() ? topic.givenCode : null
        if (givenCode) {
            setCodeState({ lang: mapGivenLangToProgrammingLanguage(topic?.givenLang), code: givenCode })
            setWorkspaceTool("code")
            setWorkspaceOpen(true)
            workspaceAutoOpenedRef.current = true
        } else {
            setCodeState(MOCK_INTERVIEW_CODE_STATE_DEFAULT)
            // this question doesn't need the workspace — close it again, but ONLY if
            // it was THIS flow that opened it for a previous code question; a
            // candidate-opened workspace (notes, say) must never be force-closed
            if (workspaceAutoOpenedRef.current) {
                setWorkspaceOpen(false)
                workspaceAutoOpenedRef.current = false
            }
        }
        ttsRef.current.cancel()
        setIsAsking(false)
        setStreamingText(null)
        setTurns((previous) => [
            ...previous,
            {
                role: "interviewer",
                phase: PHASES[0],
                content: questionText,
                questionIndex: index,
                artifactHint: givenCode ? "code" : undefined,
            },
        ])
        ttsRef.current.speak(questionText)
    }, [])

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
        setStartingMode(nextMode)
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
                setStartingMode(null)
                return
            }
            const drawn: DrawnMockInterviewPrompt = {
                id: payload.data.promptId,
                title: payload.data.promptTitle,
                seedTopics: payload.data.seedTopics,
                source: payload.data.source,
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
            workspaceAutoOpenedRef.current = false
            // Q&A defaults the workspace to Notes (most answers are spoken/typed);
            // design keeps defaulting to the whiteboard (architecture systems).
            setWorkspaceTool(nextMode === "design" ? "whiteboard" : "notes")
            // navigate to the dedicated, resumable `/interview/[sessionId]` route instead
            // of just flipping `phase` locally — that route's `MockInterviewSession`
            // instance rehydrates via `myInProgressMockInterviewSession` and (since a
            // freshly-drawn session has no synced turns yet) is the one that actually
            // asks the opening question, mirroring the block this replaced.
            //
            // CRITICAL: revalidate `myInProgressMockInterviewSession` BEFORE navigating.
            // The `/interview/[id]` route REMOUNTS this component, and its rehydrate effect
            // matches `data.sessionId === resumeSessionId(url)`. Without this, the remounted
            // effect reads the STALE SWR cache from the setup screen (the PREVIOUS in-progress
            // session, or null) → id mismatch → false "session expired" + fallback to setup.
            // Refetching now writes the just-created session into the shared SWR cache so the
            // remounted effect sees the right one. (SWR dedupes by key across the remount.)
            try {
                await inProgressSessionSwr.mutate()
            } catch {
                // best-effort — a failed revalidate just risks the mismatch above; navigation
                // still proceeds and the effect's own fetch may recover it on the next tick.
            }
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .mockInterview()
                    .interview(payload.data.sessionId)
                    .build(),
            )
        } catch {
            setStartError(t("mockInterview.startFailed"))
            setStartingMode(null)
        }
        // note: on SUCCESS we intentionally do NOT reset `startingMode` — the router.push
        // above navigates to `/interview/[id]`, unmounting this setup instance, so the
        // spinner naturally disappears with it (resetting here would flash the icon back
        // for a frame before the route swaps).
    }, [courseId, courseDisplayId, currentLevel, mode, configMode, questionCount, selectedKinds, startSessionSwr, inProgressSessionSwr, router, locale, t])

    // resume, on mount, when reached via the dedicated `/interview/[sessionId]` route —
    // waits for `inProgressSessionSwr` to settle, then either rehydrates straight into
    // the interview phase (skipping setup entirely) or falls back to setup with an
    // inline error. Runs at most ONCE per mounted instance (`resumeAttemptedRef`), same
    // shape as the block `startSession` used to run locally before it started
    // navigating here instead — a freshly-drawn session (no synced turns yet, since sync
    // only fires after a turn completes) is exactly when this is the one asking the
    // opening question; a GENUINE resume (turns already synced) just continues the
    // thread as-is.
    useEffect(() => {
        // `authCheckSwr.isLoading` covers the hard-refresh window where `authenticated` is
        // still false → `inProgressSessionSwr`'s query key is null → its `isLoading` reads
        // `false` (a disabled query looks "settled") even though the real fetch hasn't had
        // a chance to run yet.
        if (!resumeSessionId || resumeAttemptedRef.current || authCheckSwr.isLoading || inProgressSessionSwr.isLoading) {
            return
        }
        resumeAttemptedRef.current = true
        const data = inProgressSessionSwr.data
        if (!data || data.sessionId !== resumeSessionId) {
            setResumeError(t("mockInterview.resumeFailed"))
            setPhase("setup")
            return
        }
        const nextMode: MockInterviewMode = data.mode === "design" ? "design" : "qna"
        const nextTier = (data.level && LEVEL_TO_TIER[data.level]) || "trung"
        const seedTopics: Array<MockInterviewSeedTopic> = (data.seedQuestions ?? []).map((question) => ({
            cardId: question.cardId,
            kind: question.kind,
            title: question.title,
            givenCode: null,
            givenLang: null,
        }))
        const drawn: DrawnMockInterviewPrompt = {
            id: data.promptId,
            title: data.promptTitle,
            seedTopics,
            source: data.source,
        }
        const rehydratedTurns: Array<MockInterviewTurn> = (data.turns ?? []).map((turn) => ({
            role: turn.role as MockInterviewTurn["role"],
            phase: turn.phase as MockInterviewTurn["phase"],
            content: turn.content,
            questionIndex: turn.questionIndex,
            artifactHint: turn.artifactHint === "code" ? "code" : undefined,
        }))
        sessionId.current = resumeSessionId
        setMode(nextMode)
        setTier(nextTier)
        setSelectedPrompt(drawn)
        setTurns(rehydratedTurns)
        setQuestionIndex(data.questionIndex)
        setPhaseIndex(data.phaseIndex)
        setElapsed(0)
        setGrade(null)
        setGradeError(null)
        setGradeQuotaExceeded(false)
        setStartError(null)
        setResumeError(null)
        diagramRef.current = { nodes: [], edges: [] }
        setHasDiagramContent(false)
        setCodeState(MOCK_INTERVIEW_CODE_STATE_DEFAULT)
        setNotes("")
        setAnswerDraft("")
        setWorkspaceOpen(false)
        workspaceAutoOpenedRef.current = false
        setWorkspaceTool(nextMode === "design" ? "whiteboard" : "notes")
        setPhase("interview")
        if (rehydratedTurns.length === 0) {
            if (nextMode === "qna" && isStaticBankPrompt(drawn)) {
                deliverStaticQuestion(0, drawn)
            } else {
                askNextTurn({
                    phase: PHASES[0],
                    latestAnswer: "",
                    history: [],
                    prompt: drawn,
                    questionIndex: 0,
                    currentSeed: drawn.seedTopics[0]?.title ?? null,
                    modeOverride: nextMode,
                })
            }
        }
    }, [resumeSessionId, authCheckSwr.isLoading, inProgressSessionSwr.isLoading, inProgressSessionSwr.data, askNextTurn, deliverStaticQuestion, t])

    // best-effort, fire-and-forget persistence of the transcript-so-far — fires whenever
    // the turn list (or the current question/phase pointer) changes while live, so it
    // covers every append site (interviewer turns from `askNextTurn`/`deliverStaticQuestion`,
    // candidate turns from `submitAnswer`/`submitQnaAnswer`) without sprinkling a trigger
    // call at each one. Never awaited by the caller, errors swallowed — a failed sync only
    // degrades resumability (`myInProgressMockInterviewSession`), it never blocks the live
    // interview.
    const syncTurnsTrigger = syncTurnsSwr.trigger
    useEffect(() => {
        if (phase !== "interview" || !sessionId.current || turns.length === 0) {
            return
        }
        const turnsForSync: Array<SyncMockInterviewTurnInput> = turns.map((turn) => ({
            role: turn.role,
            phase: turn.phase,
            content: turn.content,
            questionIndex: turn.questionIndex,
            artifactHint: turn.artifactHint,
        }))
        syncTurnsTrigger({
            sessionId: sessionId.current,
            turns: turnsForSync,
            questionIndex,
            phaseIndex,
        }).catch(() => {})
        // `syncTurnsTrigger` (not the whole `syncTurnsSwr` object) is the dep — `useSWRMutation`
        // returns a freshly-constructed wrapper object on every render (only `trigger`/`reset`
        // are individually memoized), so depending on the object itself re-fires this effect on
        // every unrelated re-render during the live interview (streaming deltas, the once-a-second
        // elapsed timer) — spamming the sync mutation far more than "the transcript changed".
    }, [phase, turns, questionIndex, phaseIndex, syncTurnsTrigger])

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
        // qna captures each question's code as its own per-question turn in
        // submitQnaAnswer (tagged with that question's index), so folding the shared
        // buffer again here would double-count it against the LAST question. Design
        // mode is a single "question" → the once-at-grade fold is correct there.
        if (!isQna && codeState.code.trim().length > 0) {
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
        // capture THIS question's edited code as its own candidate artifact turn,
        // tagged with THIS question's index, so a debug/review question's FIX is
        // graded against the right question (the shared code buffer is reset for the
        // next question's seed in deliverStaticQuestion). This is why finishAndGrade's
        // global code-fold is skipped for qna — code is captured here, per-question.
        if (codeState.code.trim().length > 0) {
            nextTurns.push({
                role: "candidate",
                phase: currentPhase,
                content: `[Code lang=${codeState.lang}]\n${codeState.code}`,
                questionIndex,
            })
        }
        setTurns(nextTurns)
        reset()
        setAnswerDraft("")
        if (isLastQuestion) {
            void finishAndGrade(nextTurns)
            return
        }
        const next = questionIndex + 1
        setQuestionIndex(next)
        // static bank → read the next authored question (no AI); flashcard → AI-frame
        if (isStaticBankPrompt(selectedPrompt)) {
            deliverStaticQuestion(next, selectedPrompt)
        } else {
            askNextTurn({
                phase: currentPhase,
                latestAnswer: "",
                history: nextTurns,
                prompt: selectedPrompt,
                questionIndex: next,
                currentSeed: selectedPrompt.seedTopics[next]?.title ?? null,
            })
        }
    }, [answerDraft, isAsking, selectedPrompt, listening, stop, turns, currentPhase, questionIndex, reset, isLastQuestion, finishAndGrade, askNextTurn, deliverStaticQuestion, codeState])

    // return to the mock-interview HOME route (the green room / setup). Since the live
    // interview + grading + scorecard now live on the dedicated `/interview/[sessionId]`
    // route, "back to setup" is a real NAVIGATION home — not a local `setPhase("setup")`,
    // which would leave the URL stranded on `/interview/[id]` (and re-trigger the resume
    // effect). The left-behind session stays `in_progress`, so home re-offers it via the
    // resume card.
    const goToMockInterviewHome = useCallback(() => {
        router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .learn()
                .mockInterview()
                .build(),
        )
    }, [router, locale, courseDisplayId])

    // open the leave-confirm modal (the actual leave runs from the modal's confirm — see
    // `performLeave`). Replaces the old blocking `window.confirm` alert.
    const leaveInterview = useCallback(() => setConfirmAction("leave"), [])

    // actually leave the interview mid-run (abandon, ungraded): hush the mic + any spoken
    // question, then navigate back to the green room home. Called only from the confirm modal.
    const performLeave = useCallback(() => {
        if (listening) {
            stop()
        }
        ttsRef.current.cancel()
        goToMockInterviewHome()
    }, [listening, stop, goToMockInterviewHome])

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

        // "Resume phiên" — surfaces the viewer's resumable in-progress session (if any)
        // for this course, one card above the interview history so leaving mid-run never
        // reads as lost work. `value`/`max` mirror however progress is measured for that
        // session's mode elsewhere in this file: qna counts questions (same as the
        // question counter), design counts phases (same as `renderWorkHeader`'s counter).
        const resumeSession = inProgressSessionSwr.data
        const resumeCard = resumeSession ? (() => {
            const resumeMode: MockInterviewMode = resumeSession.mode === "design" ? "design" : "qna"
            const resumeTier = (resumeSession.level && LEVEL_TO_TIER[resumeSession.level]) || "trung"
            const resumeMax = resumeMode === "design"
                ? PHASES.length
                : (resumeSession.seedQuestions.length || QNA_QUESTION_COUNT)
            const resumeValue = resumeMode === "design" ? resumeSession.phaseIndex : resumeSession.questionIndex
            const progressLabel = resumeMode === "design"
                ? `${resumeSession.phaseIndex + 1}/${PHASES.length} · ${t(`mockInterview.phase.${PHASES[resumeSession.phaseIndex]}`)}`
                : t("mockInterview.questionCounter", { index: resumeSession.questionIndex + 1, total: resumeMax })
            return (
                <ContinueCard
                    title={resumeSession.promptTitle}
                    subtitle={t("mockInterview.resumeSubtitle", {
                        progress: progressLabel,
                        tier: t(`mockInterview.tier.${resumeTier}`),
                    })}
                    value={resumeValue}
                    max={resumeMax}
                    ctaLabel={t("mockInterview.resumeCta")}
                    href={pathConfig()
                        .locale(locale)
                        .course(courseDisplayId)
                        .learn()
                        .mockInterview()
                        .interview(resumeSession.sessionId)
                        .build()}
                />
            )
        })() : null

        return (
            <div className={cn("flex w-full flex-col gap-6", className)}>
                {/* A3 — "where you stand" snapshot before starting a new run (retention hook).
                    Self-hides when the viewer has no track/interview attempt yet. */}
                <MockInterviewTrackSnapshot courseId={courseId} />

                {/* green room — a calm pre-interview waiting room: the interviewer you're
                    about to meet, what's ahead, and the ONE way in. Config is tucked away
                    (collapsed) so this reads as an occasion, not a settings form. */}
                <div className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-surface">
                    <div className="flex items-center gap-3">
                        <img src={persona.avatarSrc} alt="" className="size-12 shrink-0 rounded-full object-cover" aria-hidden />
                        <div className="flex min-w-0 flex-col">
                            <Typography type="body" weight="medium" className="truncate">{persona.name}</Typography>
                            <Typography type="body-xs" color="muted" className="truncate">{persona.role}</Typography>
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
                            isPending={startingMode === "qna"}
                            isDisabled={startingMode !== null && startingMode !== "qna"}
                            onPress={() => void startSession("qna")}
                        >
                            {({ isPending }) => (
                                <>
                                    {isPending ? (
                                        <Spinner size="sm" color="current" />
                                    ) : (
                                        <DoorOpenIcon className="size-5" aria-hidden focusable="false" />
                                    )}
                                    {t("mockInterview.enterRoom")}
                                </>
                            )}
                        </Button>
                        {isDesignAvailable ? (
                            <Button
                                variant="secondary"
                                size="lg"
                                isPending={startingMode === "design"}
                                isDisabled={startingMode !== null && startingMode !== "design"}
                                onPress={() => void startSession("design")}
                            >
                                {({ isPending }) => (
                                    <>
                                        {isPending ? (
                                            <Spinner size="sm" color="current" />
                                        ) : (
                                            <PenNibIcon className="size-5" aria-hidden focusable="false" />
                                        )}
                                        {t("mockInterview.designModeCta")}
                                    </>
                                )}
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
                        {/* plain span (not Typography, which bakes its own text-foreground and would
                            never read muted at rest) — inherits the button's text-muted/hover:text-foreground
                            so the icon and label stay the same color at every state. */}
                        <span className="text-sm group-hover:underline">
                            {t("mockInterview.customizeSession")}
                        </span>
                    </button>
                    {configOpen ? (
                        <LabeledCard
                            label={t("mockInterview.configTitle")}
                            labelEnd={configMode === "auto" ? t("mockInterview.autoCaption") : undefined}
                            contentClassName="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-2">
                                <Label>{t("mockInterview.modeToggleLabel")}</Label>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("mockInterview.modeToggleLabel")}
                                    value={configMode}
                                    onChange={setConfigMode}
                                    insideCard
                                    items={[
                                        { value: "auto" as const, content: t("mockInterview.modeAuto") },
                                        { value: "configurable" as const, content: t("mockInterview.modeConfigurable") },
                                    ]}
                                />
                            </div>

                            {configMode === "configurable" ? (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Label>{t("mockInterview.questionCountLabel")}</Label>
                                        <FlexWrapButtonRadio
                                            ariaLabel={t("mockInterview.questionCountLabel")}
                                            value={questionCount}
                                            onChange={setQuestionCount}
                                            insideCard
                                            items={QUESTION_COUNT_OPTIONS.map((count) => ({
                                                value: count,
                                                content: t("mockInterview.questionCountOption", { count }),
                                            }))}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>{t("mockInterview.kindPickerLabel")}</Label>
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
                                        <Label>{t("mockInterview.answerModeLabel")}</Label>
                                        <FlexWrapButtonRadio
                                            ariaLabel={t("mockInterview.answerModeLabel")}
                                            value={answerMode}
                                            onChange={setAnswerMode}
                                            insideCard
                                            items={(["voice", "text", "both"] as const).map((value) => ({
                                                value,
                                                content: t(`mockInterview.answerMode.${value}`),
                                            }))}
                                        />
                                    </div>
                                </>
                            ) : null}

                            <div className="flex flex-col gap-2">
                                <Label>{t("mockInterview.tierLabel")}</Label>
                                <FlexWrapButtonRadio
                                    ariaLabel={t("mockInterview.tierLabel")}
                                    value={tier}
                                    onChange={setTier}
                                    insideCard
                                    items={TIERS.map((value) => ({
                                        value,
                                        content: t(`mockInterview.tier.${value}`),
                                    }))}
                                />
                                <Typography type="body-xs" color="muted">
                                    {t("mockInterview.tierCaption")}
                                </Typography>
                            </div>

                            {/* grading model — `isButton` trigger (real `Button variant="tertiary"`)
                        so it reads as a button among its siblings (the kind-picker toggles),
                        not a bare inline link. `isDropdown` (bordered Select-style field) stays
                        reserved for surfaces mirroring a REAL adjacent Select (e.g. the CV
                        editor's language field) — this card has none. The Auto lane ALWAYS
                        carries its weekly credit beside it (unified-pool concept). */}
                            <div className="flex flex-col gap-2">
                                <Label>{t("mockInterview.modelLabel")}</Label>
                                <div className="flex flex-wrap items-center gap-3">
                                    <GradeModelDropdown
                                        isButton
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
                {resumeError ? (
                    <Callout status="danger" title={resumeError} onClose={() => setResumeError(null)} />
                ) : null}

                <MockInterviewHistory courseId={courseId} courseDisplayId={courseDisplayId} />
                {resumeCard}
            </div>
        )
    }

    // ── GRADING (debrief opening) ────────────────────────────────────────
    if (phase === "grading") {
        return (
            <div className={cn("flex w-full flex-col items-center gap-4 rounded-2xl bg-surface p-8 shadow-surface", className)}>
                <img src={persona.avatarSrc} alt="" className="size-12 shrink-0 rounded-full object-cover" aria-hidden />

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
                    <Button variant="secondary" onPress={goToMockInterviewHome}>
                        {t("mockInterview.backToSetup")}
                    </Button>
                </div>
            )
        }
        return (
            <div className={cn("flex w-full flex-col gap-6", className)}>
                {/* debrief header — the interviewer "sits down" to give feedback */}
                <div className="flex items-center gap-3">
                    <img src={persona.avatarSrc} alt="" className="size-10 shrink-0 rounded-full object-cover" aria-hidden />
                    <div className="flex min-w-0 flex-col">
                        <Typography type="body" weight="medium">{t("mockInterview.debriefTitle")}</Typography>
                        <Typography type="body-xs" color="muted" className="truncate">{persona.name} · {persona.role}</Typography>
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
                <Button variant="tertiary" className="self-start" onPress={goToMockInterviewHome}>
                    {t("mockInterview.backToSetup")}
                </Button>
            </div>
        )
    }

    // shared confirm modal for the two irreversible interview actions (leave / finish
    // early) — a real HeroUI `Modal` (via `ModalShell`), NOT a `window.confirm` alert.
    // Rendered inside BOTH interview returns (qna + design) so either pane can trigger it.
    const confirmCopy = confirmAction === "leave"
        ? {
            title: t("mockInterview.leaveInterview"),
            body: t("mockInterview.leaveConfirm"),
            cta: t("mockInterview.leaveInterview"),
            // abandon-ungraded is the destructive read → danger CTA
            ctaVariant: "danger" as const,
            onConfirm: performLeave,
        }
        : confirmAction === "endEarly"
            ? {
                title: t("mockInterview.finishEarlyTitle"),
                body: t("mockInterview.finishEarlyConfirm"),
                cta: t("mockInterview.finishEarlyCta"),
                // finishing to grade is a forward action (not destructive) → primary CTA
                ctaVariant: "primary" as const,
                onConfirm: () => void finishAndGrade(),
            }
            : null
    const confirmModalNode = (
        <ModalShell
            isOpen={confirmAction !== null}
            onOpenChange={(open) => {
                if (!open) {
                    setConfirmAction(null)
                }
            }}
            title={confirmCopy?.title}
            size="sm"
            bodyClassName="gap-4"
        >
            <Typography type="body-sm" color="muted">{confirmCopy?.body}</Typography>
            <div className="flex justify-end gap-2">
                <Button variant="tertiary" onPress={() => setConfirmAction(null)}>
                    {t("mockInterview.stayInInterview")}
                </Button>
                <Button
                    variant={confirmCopy?.ctaVariant ?? "primary"}
                    onPress={() => {
                        const run = confirmCopy?.onConfirm
                        setConfirmAction(null)
                        run?.()
                    }}
                >
                    {confirmCopy?.cta}
                </Button>
            </div>
        </ModalShell>
    )

    // ── the shared WORK-SURFACE HEADER BAND ────────────────────────────────
    // The full-bleed interview is a focused work surface, so it has NO PageHeader;
    // instead this one aligned top band IS its header — back-link ("Thoát"), the
    // StarCi identity, the question/phase counter, the timer, and (Q&A) the tools
    // toggle, with a full-width progress meter as its bottom edge. One band spans
    // the whole surface so the two panes share an aligned top (fixes the old
    // ragged HUD-in-the-left-column look). Sticky under the navbar.
    const renderWorkHeader = (opts: {
        counter: React.ReactNode
        total: number
        current: number
        rightSlot?: React.ReactNode
    }) => (
        <div className="sticky top-16 z-10 border-b border-default bg-surface">
            <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
                <BackLink label={t("mockInterview.leaveInterview")} onPress={leaveInterview} />
                <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                <span className="flex min-w-0 items-center gap-2">
                    <img src={persona.avatarSrc} alt="" className="size-7 shrink-0 rounded-full object-cover" aria-hidden />
                    <Typography type="body-sm" weight="medium" className="hidden truncate sm:block">{persona.name}</Typography>
                </span>
                <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                <Typography type="body-sm" weight="medium" color="muted" className="whitespace-nowrap">{opts.counter}</Typography>
                <span className="flex-1" />
                <span className="flex shrink-0 items-center gap-1.5">
                    <ClockIcon className="size-4" aria-hidden focusable="false" />
                    <Typography type="body-sm" weight="medium" className="tabular-nums">{formatElapsed(elapsed)}</Typography>
                </span>
                {opts.rightSlot ? (
                    <>
                        <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                        {opts.rightSlot}
                    </>
                ) : null}
            </div>
            {/* progress meter = bottom edge, full width (goal-gradient) */}
            <div className="flex gap-1 px-4 pb-2 sm:px-6" role="presentation">
                {Array.from({ length: opts.total }, (_, position) => (
                    <span
                        key={position}
                        className={cn(
                            "h-1 flex-1 rounded-full",
                            position < opts.current ? "bg-success" : position === opts.current ? "bg-accent" : "bg-default",
                        )}
                    />
                ))}
            </div>
        </div>
    )

    // ── INTERVIEW, mode="qna" (Vòng 5 — "hỏi từng câu"): 1 câu, 1 ô trả lời ──
    // Full-bleed work surface: a shared header band on top, then the conversation as
    // a centered readable column — which expands into a first-class RIGHT workspace
    // pane on demand (a code/whiteboard question auto-opens it). No ragged in-column
    // HUD, no floating open/close links (the toggle lives in the header band).
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
            <div className={cn("flex w-full flex-col", className)}>
                <VoiceUnavailableModal
                    isOpen={voiceModalOpen}
                    onOpenChange={closeVoiceModal}
                    onRecheck={tts.recheckVoices}
                    hasLocaleVoice={tts.hasLocaleVoice}
                />
                {confirmModalNode}

                {renderWorkHeader({
                    counter: currentKind
                        ? t("mockInterview.questionCounterWithKind", {
                            index: questionIndex + 1,
                            total: totalQuestions,
                            kind: t(`mockInterview.kind.${currentKind}`),
                        })
                        : t("mockInterview.questionCounter", { index: questionIndex + 1, total: totalQuestions }),
                    total: totalQuestions,
                    current: questionIndex,
                    // tools toggle lives in the header band (not a floating link) — most Q&A
                    // answers are spoken/typed; a code/whiteboard question auto-opens the pane.
                    rightSlot: (
                        <Button
                            variant="tertiary"
                            size="sm"
                            onPress={() => {
                                // a DELIBERATE toggle either way — never auto-closed/opened
                                // again by a later question's own workspace bookkeeping
                                workspaceAutoOpenedRef.current = false
                                setWorkspaceOpen((previous) => !previous)
                            }}
                        >
                            <PenNibIcon className="size-4" aria-hidden focusable="false" />
                            {workspaceOpen ? t("mockInterview.hideArtifactToggle") : t("mockInterview.addArtifactToggle")}
                        </Button>
                    ),
                })}

                {/* body — conversation is a centered readable column until the workspace
                    opens, then the two become a first-class 2-pane split (stacked on mobile). */}
                <div
                    className={cn(
                        "px-4 py-6 sm:px-6",
                        workspaceOpen && "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
                    )}
                >
                    {/* LEFT — the conversation */}
                    <div className={cn("flex min-w-0 flex-col gap-6", !workspaceOpen && "mx-auto w-full max-w-2xl")}>
                        {errorCallout}

                        {/* interviewer presence — StarCi face + name + "đang nói" pulse + TTS
                            toggle, wrapping THIS question's streamed turn (once) as the body */}
                        <InterviewerPresence
                            persona={persona}
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
                                <div className="flex flex-col gap-2">
                                    <div className="text-sm font-medium text-foreground">
                                        <MarkdownContent markdown={currentQuestionTurn.content} />
                                    </div>
                                    {currentQuestionTurn.artifactHint === "code" ? (
                                        <Chip size="sm" className="w-fit bg-accent/10 text-accent">
                                            <CodeIcon className="size-4" aria-hidden focusable="false" />
                                            <Chip.Label>{t("mockInterview.workspace.codeLoadedHint")}</Chip.Label>
                                        </Chip>
                                    ) : null}
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

                        {/* HeroUI Button bakes `w-fit` (never stretches in a flex-col regardless of
                            align-items) — `self-center` on BOTH keeps this action cluster reading as
                            ONE centered composition continuing VoiceHero's own centered mic hero above,
                            instead of the primary button hugging left while only the tertiary one centers. */}
                        <Button
                            variant="primary"
                            size="lg"
                            className="self-center"
                            onPress={submitQnaAnswer}
                            isDisabled={answerDraft.trim().length === 0 || isAsking}
                        >
                            {isLastQuestion ? t("mockInterview.answerAndFinish") : t("mockInterview.answerAndNext")}
                            <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                        </Button>
                        {/* grade before the last question (rarely needed — auto-finishes on the last) —
                            a quiet danger LINK (not a button): it's a destructive-ish shortcut
                            (ends the interview early), not a CTA competing with the primary answer button. */}
                        <Link className="self-center text-danger" onPress={() => setConfirmAction("endEarly")} isDisabled={isAsking}>
                            {t("mockInterview.finishEarly")}
                        </Link>
                    </div>

                    {/* RIGHT — workspace pane (first-class). Kept MOUNTED (hidden when closed)
                        so an in-progress sketch/code/notes buffer survives toggling. On mobile
                        the grid stacks it under the conversation. */}
                    <div className={cn("min-w-0", !workspaceOpen && "hidden")}>
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
                </div>
            </div>
        )
    }

    // ── INTERVIEW, mode="design" (full-bleed 2-pane: conversation | tool workspace) ──
    // Same work-surface header band as Q&A; the 5-phase system-design flow is always
    // 2-pane (the whiteboard is used throughout), with the phase stepper as a status
    // list in the left pane.
    return (
        <div className={cn("flex w-full flex-col", className)}>
            <VoiceUnavailableModal
                isOpen={voiceModalOpen}
                onOpenChange={closeVoiceModal}
                onRecheck={tts.recheckVoices}
                hasLocaleVoice={tts.hasLocaleVoice}
            />
            {confirmModalNode}

            {renderWorkHeader({
                counter: (
                    <>
                        {`${phaseIndex + 1}/${PHASES.length} · `}
                        {t(`mockInterview.phase.${currentPhase}`)}
                    </>
                ),
                total: PHASES.length,
                current: phaseIndex,
            })}

            {/* body — 2-pane: conversation (presence + phase stepper + thread + composer) | workspace */}
            <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6">
                {/* LEFT — the conversation: presence + phase stepper + thread + voice composer */}
                <div className="flex min-w-0 flex-col gap-3">
                    <InterviewerPresence
                        persona={persona}
                        speaking={isAsking}
                        speakingLabel={t("mockInterview.interviewerSpeaking")}
                        ttsSupported={tts.supported}
                        ttsEnabled={tts.enabled}
                        onToggleTts={() => tts.setEnabled(!tts.enabled)}
                        muteLabel={t("mockInterview.muteInterviewer")}
                        unmuteLabel={t("mockInterview.unmuteInterviewer")}
                    />
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
        </div>
    )
}
