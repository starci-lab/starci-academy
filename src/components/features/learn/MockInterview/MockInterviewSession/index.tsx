"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    Button,
    Chip,
    Label,
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
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { ModalShell } from "@/components/blocks/layout/ModalShell"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { GradeModelDropdown, type GradeModelSelection } from "@/components/blocks/grading/GradeModelDropdown"
import { GradeCreditCaption } from "@/components/blocks/grading/GradeCreditCaption"
import { WorkSessionHeader } from "@/components/blocks/navigation/WorkSessionHeader"
import { pathConfig } from "@/resources/path"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
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
import { DEFAULT_PROGRAMMING_LANGUAGES, resolveActiveProgrammingLang } from "@/modules/types/utils/programming-language"
import { getLanguageLabel } from "@/modules/utils/language"
import {
    MOCK_INTERVIEW_CODE_STATE_DEFAULT,
    MockInterviewWorkspace,
    type MockInterviewCodeState,
} from "../MockInterviewWorkspace"
import { serializeMockInterviewDiagram } from "../MockInterviewDiagram/serialize"
import { MockInterviewHistory } from "../MockInterviewHistory"
import { MockInterviewStats } from "../MockInterviewStats"
import { MockInterviewTrackSnapshot } from "../MockInterviewTrackSnapshot"
import { InterviewerPresence } from "../InterviewerPresence"
import { MockInterviewSessionSkeleton } from "../MockInterviewSessionSkeleton"
import { VoiceHero } from "../VoiceHero"
import { VoiceUnavailableModal } from "../VoiceUnavailableModal"
import { personaFor } from "../interviewPersona"
import type {
    MockInterviewDiagramEdgeSnapshot,
    MockInterviewDiagramNodeSnapshot,
} from "../MockInterviewDiagram"
import type {
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

// "scorecard" was a 4th phase rendered inline here; the just-graded and the
// resume-finds-a-finished-session paths both now `router.replace` to the
// dedicated `.result()` route instead (2026-07-13) — see `finishAndGrade`'s
// own comment for why. `MockInterviewResult` renders the scorecard there.
/** The three screens {@link MockInterviewSession} itself still renders. */
type MockInterviewPhase = "setup" | "interview" | "grading"

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
 * Whether the CURRENT question has ANYTHING to submit from the code/whiteboard
 * workspace — `mode="design"` always does (its answer IS the architecture
 * diagram); `qna` only when this question ships given code (debug/review/
 * optimize). A plain theory/reasoning/scenario question has nothing to draw
 * or edit there — its answer is spoken/typed — so the workspace toggle is
 * disabled entirely rather than opening an empty, purposeless pane
 * (2026-07-09 feedback: a blank "Bảng vẽ kiến trúc" for a theory question).
 */
const questionHasWorkspaceTool = (isDesignMode: boolean, givenCodes: Array<{ lang: string, code: string }> | undefined): boolean =>
    isDesignMode || Boolean(givenCodes && givenCodes.length > 0)

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

/**
 * Resolve which authored language variant a debug/review/optimize question
 * opens on — reuses `resolveActiveProgrammingLang` (same helper `ChallengeView`
 * uses for its own 4-language step content): TypeScript wins if authored,
 * else whichever language IS authored, in `DEFAULT_PROGRAMMING_LANGUAGES`
 * order. Mock Interview has no cross-session "last picked language" memory
 * (unlike Challenge's `storedLang`, sourced from past submission history) —
 * each debug question just opens on the first authored language.
 */
const resolveOpeningGivenCode = (
    givenCodes: Array<{ lang: string, code: string }>,
): { lang: string, code: string } | null => {
    if (givenCodes.length === 0) {
        return null
    }
    const openLang = resolveActiveProgrammingLang(null, givenCodes.map((variant) => variant.lang))
    return givenCodes.find((variant) => variant.lang === openLang) ?? givenCodes[0]
}

/** Format elapsed seconds as mm:ss. */
const formatElapsed = (seconds: number): string => {
    const mm = Math.floor(seconds / 60)
    const ss = seconds % 60
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
}

/** Below this many seconds remaining, the HUD countdown turns warning-colored (session time limit, real urgency — not fake scarcity). */
const TIME_LIMIT_WARNING_SECONDS = 5 * 60

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
 * right-pane workspace ({@link MockInterviewWorkspace}) renders straight to
 * whichever tool the current question needs (whiteboard for design, code for a
 * debug/review/optimize question) — its artifact is folded into the
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
    const runGraphQL = useGraphQLWithToast()
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
    // which setup tab is active ("Bắt đầu" / "Lịch sử" / "Thống kê") — setup phase only.
    // Seeded from `?tab=` so a shared/refreshed link lands back on the same tab (mirrors
    // the `?phase=` sync below, and `layouts/dashboard-hub.md`'s own "?tab= must be
    // shareable" precedent) — "begin" is the implicit default, never written to the URL.
    const [setupTab, setSetupTab] = useState<"begin" | "history" | "stats">(() => {
        const initial = searchParams.get("tab")
        return initial === "history" || initial === "stats" ? initial : "begin"
    })
    const [tier, setTier] = useState<MockInterviewTier>("trung")
    // programming language chosen ONCE at setup (like tier) — a code question
    // (debug/review/optimize) is then rendered AND graded in this language: the
    // server hands back that language's own prompt + given code and grades against
    // its own ideal answer. No-code questions ignore it. Defaults to TypeScript.
    const [interviewLang, setInterviewLang] = useState<ProgrammingLanguage>(ProgrammingLanguage.TypeScript)
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
    // set when grading throws/fails — surfaced back on the interview screen so nothing is lost
    const [gradeError, setGradeError] = useState<string | null>(null)
    // true when the LAST grading failure was specifically the AI credit pool being
    // exhausted — shown as a distinct upsell card instead of the generic error box
    const [gradeQuotaExceeded, setGradeQuotaExceeded] = useState(false)
    // client-generated run id (groups this session's attempt in history)
    const sessionId = useRef<string | null>(null)
    // "session time limit" (2026-07-08): server-authoritative ISO deadline for
    // this session's ask loop (createdAt + 1h), from startSession's/resume's
    // own response — the countdown below is DERIVED from this, never from a
    // local clock start; the server independently re-enforces the SAME
    // deadline at ask-time (see useMockInterviewTurnStream's SESSION_EXPIRED).
    const [deadlineAt, setDeadlineAt] = useState<string | null>(null)
    // true once the session has hit its 1-hour deadline (detected by the
    // client tick below reaching 0, OR by an ask coming back
    // `error==="SESSION_EXPIRED"` — whichever happens first) — drives the
    // one-shot auto-grade effect + the Grading screen's "hết giờ" banner.
    const [timedOut, setTimedOut] = useState(false)
    // guards the auto-grade-on-timeout effect to fire at most once
    const timedOutGradedRef = useRef(false)
    // seconds left until `deadlineAt` (updated by the same tick that checks
    // `timedOut`) — drives the HUD's countdown display; null until the
    // deadline is known (setup / grading / scorecard, or before the first tick).
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
    // forces the setup screen's resume-card countdown to recompute every 30s —
    // a coarse, minutes-level tick (unlike the live interview's per-second
    // deadline tick above) is proportionate for a static "come back" card.
    const [, setResumeCountdownTick] = useState(0)
    // live text of the interviewer's turn currently streaming in ("" once started, null when idle)
    const [streamingText, setStreamingText] = useState<string | null>(null)
    // mirrors streamingText but read synchronously from the onDelta callback (avoids stale closures)
    const streamingRef = useRef<string>("")
    // true while an interviewer turn is in flight — gates submitAnswer/advancePhase/finishAndGrade
    // so a second `ask()` never overwrites the single in-flight stream tracked by the socket hook
    const [isAsking, setIsAsking] = useState(false)

    // right-pane workspace — which tool renders, driven ENTIRELY by the current
    // question (2026-07-09: dropped the candidate-facing Whiteboard/Code/Notes tab
    // bar + the Notes tool itself — "render thẳng công cụ", no manual picking).
    // "design" always renders the whiteboard (its capstones are architecture
    // systems); "qna" renders code only for a debug/review/optimize question.
    const [workspaceTool, setWorkspaceTool] = useState<"whiteboard" | "code">("whiteboard")
    const diagramRef = useRef<{
        nodes: Array<MockInterviewDiagramNodeSnapshot>
        edges: Array<MockInterviewDiagramEdgeSnapshot>
    }>({ nodes: [], edges: [] })
    const [codeState, setCodeState] = useState<MockInterviewCodeState>(MOCK_INTERVIEW_CODE_STATE_DEFAULT)
    // mode="qna" only — the single answer field's typed draft. Voice input mirrors into
    // this same value (see the effect below) so gõ/nói land in ONE editable field
    // instead of the old mic-only flow with nowhere to type.
    const [answerDraft, setAnswerDraft] = useState("")
    // whether the CURRENT question has a workspace tool to show. Reset to
    // `questionHasWorkspaceTool(...)` at every question/phase transition — no
    // manual toggle anymore (2026-07-13, thầy: "câu nào cần công cụ thì phải
    // hiện... không thì render empty card"): the right pane is ALWAYS visible,
    // it just renders the tool when this is true or an `EmptyState` when false.
    // Stays MOUNTED when true (never `hidden`) so an in-progress sketch/code
    // buffer is never lost.
    const [workspaceOpen, setWorkspaceOpen] = useState(false)
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

    // "session time limit" — tick every second while in the interview,
    // comparing against the SERVER-issued `deadlineAt` (never a local clock
    // start); flips `timedOut` once the deadline passes. A DEFENSIVE check
    // (the server independently re-enforces the same deadline at ask-time),
    // so a session with no in-flight ask at the exact moment of expiry still
    // ends promptly instead of waiting for the next `askNextTurn`.
    useEffect(() => {
        if (phase !== "interview" || !deadlineAt || timedOut) {
            return
        }
        const deadlineMs = new Date(deadlineAt).getTime()
        const tick = () => {
            const msLeft = deadlineMs - Date.now()
            if (msLeft <= 0) {
                setRemainingSeconds(0)
                setTimedOut(true)
                return
            }
            setRemainingSeconds(Math.ceil(msLeft / 1000))
        }
        tick()
        const id = window.setInterval(tick, 1000)
        return () => window.clearInterval(id)
    }, [phase, deadlineAt, timedOut])

    // resume-card countdown (setup screen) — coarse 30s tick, only while there's
    // an actual resumable session to show a deadline for. HONEST urgency: the
    // countdown is derived from the SAME server `deadlineAt` the live interview
    // enforces, never a fabricated number (principles/persuasion-psychology).
    useEffect(() => {
        if (phase !== "setup" || !inProgressSessionSwr.data) {
            return
        }
        const id = window.setInterval(() => setResumeCountdownTick((previous) => previous + 1), 30_000)
        return () => window.clearInterval(id)
    }, [phase, inProgressSessionSwr.data])

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

    // mirror the setup tab into the URL (`?tab=history` / `?tab=stats`) — same technique
    // as the `phase` mirror above, so "Lịch sử"/"Thống kê" are shareable/refresh-safe
    // links. "begin" (the default) is never written, keeping the common-case URL clean.
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
                sessionId: sessionId.current ?? "",
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
                    // "session time limit" — the server rejected this ask because the
                    // 1-hour deadline already passed (catches the case where the
                    // client-side countdown tick was throttled/the tab was backgrounded);
                    // the dedicated timedOut effect takes it from here (auto-grade).
                    if (error === "SESSION_EXPIRED") {
                        setTimedOut(true)
                        return
                    }
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

    // reset the right-pane workspace (code buffer + which tool renders + open/closed)
    // for a topic change — a debug/review/optimize question ships GIVEN code → seed it
    // into the editable Code tool + surface it; a voice-only topic resets the code
    // buffer to the blank whiteboard default so the previous question's code never
    // lingers into — or is graded against — the next one. Shared by
    // `deliverStaticQuestion` (static-bank questions) AND `submitQnaAnswer`'s
    // AI-generated branch (`askNextTurn`), which previously left the workspace
    // untouched across a question change (2026-07-14 fix).
    const resetWorkspaceForTopic = useCallback((
        isDesignMode: boolean,
        topic: MockInterviewSeedTopic | undefined,
    ): void => {
        const openingGivenCode = resolveOpeningGivenCode(topic?.givenCodes ?? [])
        if (openingGivenCode) {
            setCodeState({ lang: mapGivenLangToProgrammingLanguage(openingGivenCode.lang), code: openingGivenCode.code })
            setWorkspaceTool("code")
        } else {
            setCodeState(MOCK_INTERVIEW_CODE_STATE_DEFAULT)
            setWorkspaceTool("whiteboard")
        }
        // this question either HAS a tool to submit from (open by default, no manual
        // step) or has NOTHING to submit there (the toggle is disabled — see the
        // header button — so there is no "candidate manually opened it" state to
        // preserve across questions anymore).
        setWorkspaceOpen(questionHasWorkspaceTool(isDesignMode, topic?.givenCodes))
    }, [])

    // deliver a PRE-AUTHORED interview-bank question with NO AI call — the
    // question is fully written in `.mount`, so the interviewer just reads it
    // (rendered as-is, incl. any folded diagram/code) and speaks it aloud (TTS).
    // Only grading needs AI; asking a static question does not.
    //
    // Does NOT call resetWorkspaceForTopic itself — both callers already reset the
    // workspace for this exact topic before invoking this function (submitQnaAnswer
    // resets once up front for whichever branch follows; the resume/rehydrate path
    // seeds it manually for the in-progress question). Calling it a third time here
    // was a harmless but redundant no-op (2026-07-14 cleanup).
    const deliverStaticQuestion = useCallback((index: number, prompt: DrawnMockInterviewPrompt) => {
        const topic = prompt.seedTopics[index]
        const questionText = topic?.title ?? ""
        if (questionText.length === 0) {
            return
        }
        const openingGivenCode = resolveOpeningGivenCode(topic?.givenCodes ?? [])
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
                artifactHint: openingGivenCode ? "code" : undefined,
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
                lang: interviewLang,
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
            setDeadlineAt(payload.data.deadlineAt)
            setTimedOut(false)
            timedOutGradedRef.current = false
            setSelectedPrompt(drawn)
            setTurns([])
            setPhaseIndex(0)
            setQuestionIndex(0)
            setGradeError(null)
            setGradeQuotaExceeded(false)
            diagramRef.current = { nodes: [], edges: [] }
            setCodeState(MOCK_INTERVIEW_CODE_STATE_DEFAULT)
            setAnswerDraft("")
            setWorkspaceTool("whiteboard")
            // design mode's whiteboard is always the tool; a qna question's own
            // given-code check (if any) runs right below via `deliverStaticQuestion`
            // and overrides this for question 0 when it applies.
            setWorkspaceOpen(nextMode === "design")
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
    }, [courseId, courseDisplayId, currentLevel, mode, configMode, interviewLang, questionCount, selectedKinds, startSessionSwr, inProgressSessionSwr, router, locale, t])

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
            // no longer `in_progress` — the session might still be valid, just
            // GRADED already (finished normally, or auto-graded on the 1-hour
            // timeout). Redirect to the dedicated result URL instead of fetching
            // the attempt here and rendering the scorecard inline: the result
            // route owns that fetch + the not-found fallback now (single source
            // of "is this really graded, or truly gone", 2026-07-13 — mirrors
            // `flashcards().quiz(sessionId).result()`'s own fix for this class of
            // bug, see `pathConfig`'s `.result()` doc).
            router.replace(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .mockInterview()
                    .interview(resumeSessionId)
                    .result()
                    .build(),
            )
            return
        }
        const nextMode: MockInterviewMode = data.mode === "design" ? "design" : "qna"
        const nextTier = (data.level && LEVEL_TO_TIER[data.level]) || "trung"
        const seedTopics: Array<MockInterviewSeedTopic> = (data.seedQuestions ?? []).map((question) => ({
            cardId: question.cardId,
            kind: question.kind,
            title: question.title,
            givenCodes: question.givenCodes ?? [],
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
        setDeadlineAt(data.deadlineAt)
        setTimedOut(false)
        timedOutGradedRef.current = false
        setMode(nextMode)
        setTier(nextTier)
        setSelectedPrompt(drawn)
        setTurns(rehydratedTurns)
        setQuestionIndex(data.questionIndex)
        setPhaseIndex(data.phaseIndex)
        setGradeError(null)
        setGradeQuotaExceeded(false)
        setStartError(null)
        diagramRef.current = { nodes: [], edges: [] }
        setCodeState(MOCK_INTERVIEW_CODE_STATE_DEFAULT)
        setAnswerDraft("")
        setWorkspaceTool("whiteboard")
        // re-seed the Code workspace for a debug/review/optimize question the
        // learner was ALREADY on when they left — `deliverStaticQuestion` below
        // only fires for a brand-new question (turns.length === 0), so a resume
        // mid-question would otherwise leave the given code out of the editor
        // even though the question text still asks to read/fix it.
        const currentTopic = nextMode === "qna" && isStaticBankPrompt(drawn) ? drawn.seedTopics[data.questionIndex] : undefined
        const currentGivenCode = resolveOpeningGivenCode(currentTopic?.givenCodes ?? [])
        if (currentGivenCode) {
            setCodeState({ lang: mapGivenLangToProgrammingLanguage(currentGivenCode.lang), code: currentGivenCode.code })
            setWorkspaceTool("code")
        }
        setWorkspaceOpen(questionHasWorkspaceTool(nextMode === "design", currentTopic?.givenCodes))
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
    }, [resumeSessionId, courseId, authCheckSwr.isLoading, inProgressSessionSwr.isLoading, inProgressSessionSwr.data, askNextTurn, deliverStaticQuestion, t, router, locale, courseDisplayId])

    // best-effort, fire-and-forget persistence of the transcript-so-far — fires whenever
    // the turn list (or the current question/phase pointer) changes while live, so it
    // covers every append site (interviewer turns from `askNextTurn`/`deliverStaticQuestion`,
    // candidate turns from `submitAnswer`/`submitQnaAnswer`) without sprinkling a trigger
    // call at each one. Never awaited by the caller; still routed through `runGraphQL`
    // (toast on failure, no success toast) rather than a silent catch (thầy 2026-07-11:
    // "fe không nuốt lỗi, dùng runGraphQL đi") — a failed sync only degrades resumability
    // (`myInProgressMockInterviewSession`), it never blocks the live interview, but the
    // candidate should still see it.
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
        const syncingSessionId = sessionId.current
        void runGraphQL(
            async () => {
                const result = await syncTurnsTrigger({
                    sessionId: syncingSessionId,
                    turns: turnsForSync,
                    questionIndex,
                    phaseIndex,
                })
                return (
                    result.data?.syncMockInterviewSessionTurns ?? {
                        success: false,
                        message: t("mockInterview.syncError"),
                    }
                )
            },
            { showSuccessToast: false },
        )
        // `syncTurnsTrigger` (not the whole `syncTurnsSwr` object) is the dep — `useSWRMutation`
        // returns a freshly-constructed wrapper object on every render (only `trigger`/`reset`
        // are individually memoized), so depending on the object itself re-fires this effect on
        // every unrelated re-render during the live interview (streaming deltas, the once-a-second
        // elapsed timer) — spamming the sync mutation far more than "the transcript changed".
    }, [phase, turns, questionIndex, phaseIndex, syncTurnsTrigger, runGraphQL, t])

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
            // Navigate to the dedicated result route instead of computing/rendering
            // the scorecard inline here — `MockInterviewResult` re-fetches the just-
            // graded attempt fresh by session id, so "done" is answered by the URL,
            // not a local `phase` transition that would leave the URL stranded on
            // `/interview/[id]` (2026-07-13, mirrors flashcard quiz's own
            // `.result()` redirect — see `pathConfig`'s doc for root cause).
            router.replace(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .mockInterview()
                    .interview(sessionId.current as string)
                    .result()
                    .build(),
            )
        } catch {
            // thrown (network/GraphQL) error — not a typed backend failure, so no fresh
            // quota re-check is meaningful here; treat as the generic failure
            setGradeQuotaExceeded(false)
            setGradeError(t("mockInterview.gradingFailed"))
            setPhase("interview")
        }
    }, [courseId, selectedPrompt, isAsking, currentLevel, turns, currentPhase, isQna, questionIndex, codeState, selection, gradeSwr, aiQuotaSwr, t, router, locale, courseDisplayId])

    // "session time limit" — react to `timedOut` (flipped by either the client
    // countdown tick or a server SESSION_EXPIRED ask rejection) by auto-grading
    // with whatever transcript exists so far — the candidate's answer in
    // progress (not yet submitted) is dropped, matching the "chấm những gì đã
    // có, bỏ câu dở" ruling (no grace period). Guarded to fire at most once.
    useEffect(() => {
        if (!timedOut || timedOutGradedRef.current || phase !== "interview") {
            return
        }
        timedOutGradedRef.current = true
        void finishAndGrade()
    }, [timedOut, phase, finishAndGrade])

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
        // reset the right-pane workspace for the UPCOMING question before either
        // branch below — `deliverStaticQuestion` already resets it itself (via the
        // shared helper), but the AI-generated branch (`askNextTurn`) never touched
        // codeState/workspaceTool/workspaceOpen on a question change, so a debug
        // question's leftover code (or open pane) could linger into the next plain
        // theory/reasoning/scenario question. mode="qna" only → isDesignMode=false.
        resetWorkspaceForTopic(false, selectedPrompt.seedTopics[next])
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
    }, [answerDraft, isAsking, selectedPrompt, listening, stop, turns, currentPhase, questionIndex, reset, isLastQuestion, finishAndGrade, askNextTurn, deliverStaticQuestion, codeState, resetWorkspaceForTopic])

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
        },
        [],
    )

    // ── the shared WORK-SURFACE HEADER BAND ────────────────────────────────
    // The full-bleed interview is a focused work surface, so it has NO PageHeader;
    // instead this one aligned top band IS its header — back-link ("Thoát"), the
    // StarCi identity, the question/phase counter, the timer, and (Q&A) the tools
    // toggle, with a full-width progress meter as its bottom edge. One band spans
    // the whole surface so the two panes share an aligned top (fixes the old
    // ragged HUD-in-the-left-column look). Sticky under the navbar. Defined here
    // (not just above the `qna`/`design` returns) so `grading` can reuse the EXACT
    // same chrome as the just-finished interview instead of switching to a
    // headerless centered card (2026-07-12, mirrors the same correction made for
    // Flashcards Quiz/Review: "ý là bỏ màu đen vào màu đỏ" — keep the active
    // phase's header through the brief loading hand-off, don't swap early).
    const renderWorkHeader = (opts: {
        counter: React.ReactNode
        total: number
        current: number
        rightSlot?: React.ReactNode
        onFinish?: () => void
        finishLabel?: React.ReactNode
    }) => {
        // "session time limit" — counts DOWN to the server deadline (never a
        // local clock start); turns warning-colored under 5 minutes left (real
        // urgency, backed by an actual server-enforced deadline).
        const timer = (
            <span
                className={cn(
                    "flex shrink-0 items-center gap-2",
                    remainingSeconds !== null && remainingSeconds <= TIME_LIMIT_WARNING_SECONDS && "text-warning",
                )}
            >
                <ClockIcon className="size-4" aria-hidden focusable="false" />
                <Typography type="body-sm" weight="medium" className="tabular-nums">{formatElapsed(remainingSeconds ?? 0)}</Typography>
            </span>
        )
        return (
            <WorkSessionHeader
                backLabel={t("mockInterview.leaveInterview")}
                onBack={leaveInterview}
                title={t("mockInterview.title")}
                counter={opts.counter}
                total={opts.total}
                current={opts.current}
                onFinish={opts.onFinish}
                finishLabel={opts.finishLabel}
                rightSlot={
                    <span className="flex shrink-0 items-center gap-3">
                        {timer}
                        {opts.rightSlot ? (
                            <>
                                <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                                {opts.rightSlot}
                            </>
                        ) : null}
                    </span>
                }
            />
        )
    }

    // ── RESUMING (dedicated /interview/[sessionId] route) ─────────────────
    // `resumeSessionId` always lands here in the "interview" phase eventually — the
    // rehydrate effect above flips `phase` once `authCheckSwr`/`inProgressSessionSwr`
    // settle, guarded by `resumeAttemptedRef` so it fires once. Until then `phase` is
    // still its initial "setup" value; without this gate the setup green-room screen
    // would flash for a frame before jumping to the live interview surface. Show a
    // skeleton that mirrors the FINAL interview surface instead of the wrong screen.
    if (resumeSessionId && phase === "setup" && !resumeAttemptedRef.current) {
        return <MockInterviewSessionSkeleton className={className} />
    }

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
            // "session time limit" — HONEST urgency: minutes left derived from the
            // SAME server `deadlineAt` the live interview enforces (never a made-up
            // countdown). The 24h resume-window query doesn't itself check the 1h
            // ask-loop deadline, so a session past its OWN hour can still surface
            // here — `resumeExpired` branches the copy so it never reads as "still
            // answerable" when it isn't. Clicking through still works (the interview
            // screen's own deadline tick immediately auto-grades with whatever was
            // synced) — this is deliberately NOT hidden, just labeled honestly.
            const resumeRemainingMinutes = Math.max(0, Math.ceil((new Date(resumeSession.deadlineAt).getTime() - Date.now()) / 60_000))
            const resumeExpired = resumeRemainingMinutes <= 0
            const resumeUrgent = resumeExpired || resumeRemainingMinutes <= 15
            return (
                <ContinueCard
                    title={resumeSession.promptTitle}
                    subtitle={resumeExpired
                        ? t("mockInterview.resumeSubtitleExpired", {
                            progress: progressLabel,
                            tier: t(`mockInterview.tier.${resumeTier}`),
                        })
                        : t("mockInterview.resumeSubtitleWithDeadline", {
                            progress: progressLabel,
                            tier: t(`mockInterview.tier.${resumeTier}`),
                            minutes: resumeRemainingMinutes,
                        })}
                    urgent={resumeUrgent}
                    value={resumeValue}
                    max={resumeMax}
                    ctaLabel={resumeExpired ? t("mockInterview.resumeCtaExpired") : t("mockInterview.resumeCta")}
                    ctaVariant="chip"
                    accented
                    onPress={() => router.push(pathConfig()
                        .locale(locale)
                        .course(courseDisplayId)
                        .learn()
                        .mockInterview()
                        .interview(resumeSession.sessionId)
                        .build())}
                />
            )
        })() : null

        return (
            <div className={cn("flex w-full flex-col gap-6", className)}>
                {/* page-FEATURE tabs (switches the ENTIRE setup panel, not an in-page content
                    filter) → variant="primary": full-width, evenly-stretched segmented pill
                    (fe/components/tabs.md §0b) — NOT the default "secondary" underline, which
                    hugs its own label width and is meant for in-page filters. */}
                <TabsCard
                    variant="primary"
                    leftTabs={{
                        items: [
                            { key: "begin", label: t("mockInterview.setupTabBegin") },
                            { key: "history", label: t("mockInterview.setupTabHistory") },
                            { key: "stats", label: t("mockInterview.setupTabStats") },
                        ],
                        selectedKey: setupTab,
                        ariaLabel: t("mockInterview.setupTabBegin"),
                        onSelectionChange: (key) => setSetupTab(key as "begin" | "history" | "stats"),
                    }}
                />

                {setupTab === "history" ? (
                    <MockInterviewHistory courseId={courseId} courseDisplayId={courseDisplayId} onStartInterview={() => setSetupTab("begin")} />
                ) : setupTab === "stats" ? (
                    <MockInterviewStats courseId={courseId} courseDisplayId={courseDisplayId} onStartInterview={() => setSetupTab("begin")} />
                ) : (
                    <>
                        {/* Zone 0 — resume: a session left in progress (24h TTL) deep-links straight
                    back into it, ABOVE every other zone (mirrors Flashcard Quiz's own resume
                    placement, 2026-07-09 — sibling features read as one system). Demotes the
                    green room's primary CTA to secondary below so this reads as the screen's
                    primary action while it's shown. */}
                        {resumeCard}

                        {/* A3 — "where you stand" snapshot before starting a new run (retention hook).
                    Self-hides when the viewer has no track/interview attempt yet. */}
                        <MockInterviewTrackSnapshot courseId={courseId} />

                        {/* green room — a calm pre-interview waiting room: the interviewer you're
                    about to meet, what's ahead, and the ONE way in. Config is tucked away
                    (collapsed) so this reads as an occasion, not a settings form. */}
                        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-surface">
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
                                {/* demoted to secondary while a resumable session is shown (Zone 0
                                    above) — that ContinueCard reads as the screen's primary action then,
                                    mirrors Flashcard Quiz's own resume-demote (2026-07-09). */}
                                <Button
                                    variant={resumeSession ? "secondary" : "primary"}
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
                                className="group flex w-fit cursor-pointer items-center gap-2 text-muted hover:text-foreground"
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
                                    <div className="flex flex-col gap-3">
                                        <Label>{t("mockInterview.modeToggleLabel")}</Label>
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
                                            <div className="flex flex-col gap-3">
                                                <Label>{t("mockInterview.questionCountLabel")}</Label>
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

                                            <div className="flex flex-col gap-3">
                                                <Label>{t("mockInterview.kindPickerLabel")}</Label>
                                                <div role="group" aria-label={t("mockInterview.kindPickerLabel")} className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        type="button"
                                                        aria-pressed={selectedKinds.length === 0}
                                                        onClick={() => setSelectedKinds([])}
                                                        className={cn(
                                                            "cursor-pointer rounded-full border px-3 py-2 text-sm font-medium transition-colors",
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
                                                                    "cursor-pointer rounded-full border px-3 py-2 text-sm font-medium transition-colors",
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

                                            <div className="flex flex-col gap-3">
                                                <Label>{t("mockInterview.answerModeLabel")}</Label>
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

                                    <div className="flex flex-col gap-3">
                                        <Label>{t("mockInterview.tierLabel")}</Label>
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

                                    {/* Programming language — chosen ONCE here (like the tier). A code
                        question (debug/review/optimize) is then rendered AND graded in this
                        language: the server returns that language's own prompt + given code
                        and grades against its own ideal answer. No-code questions ignore it. */}
                                    <div className="flex flex-col gap-3">
                                        <Label>{t("mockInterview.langLabel")}</Label>
                                        <FlexWrapButtonRadio
                                            ariaLabel={t("mockInterview.langLabel")}
                                            value={interviewLang}
                                            onChange={setInterviewLang}
                                            items={DEFAULT_PROGRAMMING_LANGUAGES.map((value) => ({
                                                value,
                                                content: getLanguageLabel(value),
                                            }))}
                                        />
                                        <Typography type="body-xs" color="muted">
                                            {t("mockInterview.langCaption")}
                                        </Typography>
                                    </div>

                                    {/* grading model — `isButton` trigger (real `Button variant="tertiary"`)
                        so it reads as a button among its siblings (the kind-picker toggles),
                        not a bare inline link. `isDropdown` (bordered Select-style field) stays
                        reserved for surfaces mirroring a REAL adjacent Select (e.g. the CV
                        editor's language field) — this card has none. The Auto lane ALWAYS
                        carries its weekly credit beside it (unified-pool concept). */}
                                    <div className="flex flex-col gap-3">
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
                    </>
                )}
            </div>
        )
    }

    // ── GRADING (debrief opening) ────────────────────────────────────────
    if (phase === "grading") {
        return (
            // KEEP the interview's own `WorkSessionHeader` chrome through this
            // brief grading hand-off (2026-07-12) — single segment, fully "done".
            // Route stays `fullBleed` through this phase (see `learn/layout.tsx`
            // `isMockInterviewLive`), so this screen owns its own page padding.
            <div className={cn("flex w-full flex-col", className)}>
                {renderWorkHeader({ counter: t("mockInterview.grading"), total: 1, current: 1 })}
                <div className="px-4 pb-6 pt-10 sm:px-6">
                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                        {/* "session time limit" — HONEST: never let a timeout-triggered grade
                            read as a random/silent cutoff. Only shown when THIS grade was
                            auto-triggered by the 1-hour deadline, not a manual "Kết thúc sớm". */}
                        {timedOut ? (
                            <Callout status="warning" title={t("mockInterview.sessionExpiredBanner")} />
                        ) : null}
                        <div className="flex w-full flex-col items-center gap-3 rounded-2xl bg-surface p-8 shadow-surface">
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
                    </div>
                </div>
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
            bodyClassName="gap-3"
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
            <Callout status="danger" title={gradeError} />
        ) : null

        return (
            // h-[calc(100dvh-4rem)]: lock to the viewport below the 4rem navbar — same
            // convention as the other fullBleed surfaces (MindMap, PlaygroundSession).
            // Needed so the 2-pane grid below can `flex-1` into the REMAINING height
            // (under the sticky WorkSessionHeader) instead of only being as tall as its
            // own content — otherwise the pane divider stops short of "full" (2026-07-13,
            // thầy: "divider kéo dài full ấy").
            <div className={cn("flex h-[calc(100dvh-4rem)] w-full flex-col", className)}>
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
                    // grade before the last question (rarely needed — auto-finishes on the
                    // last) — pinned to the header's right edge (WorkSessionHeader's own
                    // "Kết thúc" affordance) instead of a floating link under the mic.
                    onFinish: () => setConfirmAction("endEarly"),
                    finishLabel: t("mockInterview.finishEarly"),
                })}

                {/* body — conversation is a centered readable column until the workspace
                    opens, then the two become a first-class 2-pane split (stacked on mobile).
                    `flex-1 min-h-0` fills the remaining height under the sticky header;
                    `overflow-y-auto` lets THIS pane scroll internally instead of the whole
                    page ([[full-bleed-work-surface]] "mỗi pane cuộn riêng"). No divider between
                    the 2 panes (2026-07-13, thầy: "bỏ divider đi") — whitespace (`gap-6`) alone
                    separates them, back to [[whitespace-over-dividers]]'s default now that
                    neither pane has a card frame to clash against. */}
                <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    {/* LEFT — the conversation */}
                    <div className="flex min-w-0 flex-col gap-6">
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

                        {/* self-center: HeroUI Button bakes `w-fit` (never stretches in a
                            flex-col regardless of align-items) — keeps it reading as ONE
                            centered composition continuing VoiceHero's own centered mic hero
                            above. The "end early" shortcut moved to the header's own
                            `onFinish` (WorkSessionHeader) — no longer a floating link here. */}
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
                    </div>

                    {/* RIGHT — workspace pane, ALWAYS visible now (2026-07-13, no more manual
                        toggle): the tool when this question has one, else an EmptyState so the
                        pane never just vanishes. Tool stays MOUNTED once shown so an in-progress
                        sketch/code buffer survives a question switch. No card frame, no divider —
                        just the grid's own `gap-6` separates it from the conversation pane. On
                        mobile the grid stacks this under the conversation. */}
                    <div className="min-w-0">
                        {workspaceOpen ? (
                            <MockInterviewWorkspace
                                tool={workspaceTool}
                                onDiagramChange={handleDiagramChange}
                                codeState={codeState}
                                onCodeStateChange={setCodeState}
                                givenCodeVariants={currentSeedTopic?.givenCodes ?? []}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <EmptyState
                                    icon={<PenNibIcon aria-hidden focusable="false" />}
                                    title={t("mockInterview.workspace.emptyTitle")}
                                    description={t("mockInterview.workspace.emptyDescription")}
                                />
                            </div>
                        )}
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
                        <Callout status="danger" title={gradeError} />
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

                {/* RIGHT — the candidate tool workspace: renders straight to the whiteboard
                (design mode is always architecture systems). Its artifact is folded
                into the transcript as a labeled turn at grade time. */}
                <MockInterviewWorkspace
                    tool={workspaceTool}
                    onDiagramChange={handleDiagramChange}
                    codeState={codeState}
                    onCodeStateChange={setCodeState}
                />
            </div>
        </div>
    )
}
