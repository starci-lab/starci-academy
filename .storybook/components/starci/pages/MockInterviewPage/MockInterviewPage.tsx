import React from "react"
import {
    MockInterviewSetup,
    type MockInterviewPersona,
    type MockInterviewResumable,
    type MockInterviewTier,
    type MockInterviewStartMode,
} from "@sb-components/starci/blocks/learn/MockInterviewSetup/MockInterviewSetup"
import { PlaygroundSetupHeader } from "@sb-components/starci/blocks/learn/PlaygroundSetupHeader/PlaygroundSetupHeader"
import { WorkSessionHeader } from "@sb-components/starci/blocks/navigation/WorkSessionHeader/WorkSessionHeader"
import {
    InterviewerPresence,
    type InterviewerPresencePersona,
} from "@sb-components/starci/blocks/learn/InterviewerPresence/InterviewerPresence"
import {
    VoiceHero,
    type VoiceAnswerMode,
    type VoiceHeroLabels,
} from "@sb-components/starci/blocks/learn/VoiceHero/VoiceHero"
import { MockInterviewAnswerAction } from "@sb-components/starci/blocks/learn/MockInterviewAnswerAction/MockInterviewAnswerAction"
import { SubmissionResultHeader } from "@sb-components/starci/blocks/learn/SubmissionResultHeader/SubmissionResultHeader"
import {
    MockInterviewScorecard,
    type MockInterviewVerdict,
    type MockInterviewScoreRow,
    type MockInterviewAttributeScoreRow,
} from "@sb-components/starci/blocks/learn/MockInterviewScorecard/MockInterviewScorecard"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `MockInterviewPage`: get ready for a mock interview, work through
 * it live, then read the debrief.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own.
 *
 * THREE PHASES, ONE SCREEN, NEVER TWO AT ONCE — the same `phase` idiom
 * `QuizPage`/`FlashcardReviewPage` already use: `setup` (the green room),
 * `live` (one question at a time), `result` (the debrief). `WorkSessionHeader`
 * appears only in `live` this pass — `result` is a finished, read-only page
 * (a debrief, not a second live session), so it reuses `SubmissionResultHeader`
 * instead, the same "identity band" shape `ChallengeResultPage` already
 * reuses it for.
 *
 * SEVEN BLOCKS: three reused (`WorkSessionHeader`, and — corrected from the
 * planner's tree, see below — `PlaygroundSetupHeader`/`SubmissionResultHeader`
 * in place of a bare `PageHeader` composite), four new this run
 * (`MockInterviewSetup`, `InterviewerPresence`, `VoiceHero`,
 * `MockInterviewScorecard`), plus one more new this pass —
 * `MockInterviewAnswerAction` — built alongside this screen for the reason
 * below.
 *
 * ⭐ THE IDENTITY HEADER IS A BLOCK, NOT THE BARE `PageHeader` COMPOSITE THE
 * PLANNER'S TREE NAMED. §0's import boundary is exact: a screen calls blocks
 * and frames, never a composite directly — `ContentPage`/`ModuleHeader`'s own
 * file headers spell out why every "identity band" in this catalog is a BLOCK
 * that wraps `PageHeader`, never the composite itself reached from a screen.
 * `setup`'s identity is a single hop back to wherever Mock Interview was
 * opened from, plus a title/description — EXACTLY `PlaygroundSetupHeader`'s
 * own contract ("the IDENTITY cluster at the top of the … Setup screen …
 * a way back … no meta cluster at all" — that file header, not this one,
 * decided a Setup screen carries no chips). `result`'s identity is a back
 * link plus the graded run's own title — EXACTLY `SubmissionResultHeader`'s
 * contract, already reused cross-domain by `ChallengeResultPage` for the
 * identical shape. Reusing both beats inventing a `MockInterviewHeader` that
 * would draw the same two rows a third time.
 *
 * ⭐ `MockInterviewAnswerAction` IS A NEW BLOCK, NOT THE BARE `Button` THE
 * PLANNER'S TREE DREW DIRECTLY IN THE SCREEN. Neither `InterviewerPresence`
 * nor `VoiceHero` owns a submit action (see each file's own header) — the
 * real `src` screen fires `submitQnaAnswer` from a plain `Button` sitting
 * right in its own JSX, but a Storybook SCREEN may not import an atom
 * directly. See `MockInterviewAnswerAction`'s own file header for the full
 * reasoning (it earns its layer via the `isLastQuestion` label decision,
 * same pattern `MindMapContinueButton` already established for the course
 * mind-map's own single floating CTA).
 *
 * ⛔ NO `FeedbackConfirm` WIRED HERE, though the planner's tree asked for one
 * directly inside `live` (leave / finish-early). `FlashcardReviewPage`'s own
 * file header already burned down this exact question for its identical
 * session band: a screen may not import a composite directly, no block in
 * today's catalog wraps a confirm shell, and inventing one to hold a single
 * dialog is exactly the reach this run's own brief (`ContentModeNav`'s file
 * header) warns against. `WorkSessionHeader`'s `onBack`/`onFinish` already
 * fire; whatever the caller does with that event — including opening a
 * confirm dialog — is a decision made ABOVE this component, not faked here.
 *
 * ⛔ NO `Disclosure` WIRED HERE EITHER. `MockInterviewSetup`'s own file header
 * already scopes the "Tùy chỉnh phiên" deep-config body (languages / kinds /
 * answer mode / AI model) out of this pass as a SECOND, deferred leaf — the
 * block that would hold that `Disclosure` was never built this run, so the
 * screen has nothing real to compose it around either.
 *
 * ⛔ NO DOCKED WORKSPACE PANE (whiteboard/code) IN `live`. The planner's tree
 * wanted a two-column split with `FeedbackEmpty` chrome on the right — but
 * that is a bare composite import too, and unlike `PlaygroundSessionPage`'s
 * two-pane workspace (which has real blocks, `PlaygroundResourcePanel` +
 * `PlaygroundConnectSheet`, to put in each pane) nothing in today's catalog
 * wraps "here is where the whiteboard/code tool would sit". §B3 again: a gap
 * left clearly absent beats a stub that renders nothing real. `live` is
 * therefore ONE reading-width column — the same `Container size="md"` idiom
 * `QuizPage`'s own `active` phase already uses for its session band + one
 * live block — not the full-bleed two-pane grid the real `src` screen draws.
 * The right-pane tool itself (and the 5-phase Design-mode script, and the
 * "Tùy chỉnh" config body) stay OUT OF THIS TREE ENTIRELY, exactly as scoped
 * in this run's own brief.
 *
 * ⛔ `isSkeleton` REACHES ONLY THE BLOCKS THAT CAN MIRROR THEMSELVES —
 * `PlaygroundSetupHeader`, `MockInterviewSetup` (setup phase), and
 * `SubmissionResultHeader`, `MockInterviewScorecard` (result phase).
 * `WorkSessionHeader`, `InterviewerPresence`, `VoiceHero` and
 * `MockInterviewAnswerAction` carry no such prop by design (their own file
 * headers say why: chrome known ahead of any request, or a composer/action
 * with nothing of its own to preview), so the flag is not threaded to them —
 * same reasoning `QuizPage`'s own file header gives for stopping short of
 * `WorkSessionHeader`/`QuizRecapList`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Which part of the mock interview the candidate is in. */
export type MockInterviewPagePhase = "setup" | "live" | "result"

/** Props for {@link MockInterviewPage}. */
export interface MockInterviewPageProps {
    /** Which cluster of blocks is on screen right now. */
    phase: MockInterviewPagePhase

    // ── setup: identity header ──
    /** Label on the back link — where Mock Interview was opened from. */
    setupBackLabel: string
    /** Fired when the candidate leaves setup without starting a run. */
    onSetupBack: () => void
    /** Setup screen title, e.g. "Phỏng vấn thử". */
    setupTitle: string
    /** One-line intro to the mock interview. */
    setupDescription?: string

    // ── setup: the green-room card ──
    /** Section label above the green-room card. */
    setupLabel: string
    /** The interviewer greeting the candidate. */
    persona: MockInterviewPersona
    /** Current run name. */
    sessionName: string
    /** Fired as the candidate types a run name. */
    onSessionNameChange: (value: string) => void
    /** Chosen difficulty. */
    tier: MockInterviewTier
    /** Fired when the candidate picks a tier. */
    onTierChange: (tier: MockInterviewTier) => void
    /** `true` → this is a System-Design course, so the Design-mode start button also shows. */
    isDesignAvailable: boolean
    /** Fired when the candidate starts the Q&A round. */
    onStartQna: () => void
    /** Fired when the candidate starts the Design round. Required once `isDesignAvailable` is set. */
    onStartDesign?: () => void
    /** A run the candidate left unfinished. Present → the resume banner leads the card. */
    resumable?: MockInterviewResumable
    /** Which start action is currently in flight. */
    startingMode?: MockInterviewStartMode
    /** `true` → a start is in flight; both start buttons lock while one of them runs. */
    isSetupPending?: boolean
    /** Set → the last draw failed. */
    setupErrorMessage?: string
    /**
     * `true` → `PlaygroundSetupHeader` and `MockInterviewSetup` mirror
     * themselves while setup data loads (see the file header for why the
     * flag stops there).
     */
    isSkeleton?: boolean

    // ── live: the session band ──
    /** Back-link label — leave, run stays resumable. */
    liveBackLabel: string
    /** Fired when the candidate leaves the run without ending it (see the file header's confirm-dialog gap). */
    onLiveBack: () => void
    /** Session title, e.g. the run's own name. */
    liveTitle?: string
    /** Where the candidate is, already worded — e.g. "Câu 3 / 5". */
    liveCounter: string
    /** Time remaining, e.g. "42:10". Omitted → the run is untimed in the header (the real session's own 1h deadline still applies server-side). */
    liveTimeLeft?: string
    /** How many questions this run has. */
    liveTotal: number
    /** Which question is being viewed, 1-based. */
    liveCurrent: number
    /** Questions already answered, 1-based. */
    liveDoneSteps?: Array<number>
    /** Fired with a 1-based step when the candidate taps the rail. */
    onLiveStepPress?: (step: number) => void
    /** Finish-now label. Present with `onLiveFinish` → the end-now control shows. */
    liveFinishLabel?: string
    /** Fired when the candidate ends the run early and goes to the debrief. */
    onLiveFinish?: () => void

    // ── live: the interviewer ──
    /** Who is interviewing. */
    interviewerPersona: InterviewerPresencePersona
    /** `true` while TTS audio is actively voicing the current question. */
    speaking: boolean
    /** Status text shown while `speaking`, e.g. "Đang đọc câu hỏi". */
    speakingLabel: string
    /** `true` → this session offers a TTS toggle at all. */
    ttsSupported?: boolean
    /** Current TTS on/off state. */
    ttsEnabled?: boolean
    /** Fired when the candidate presses the TTS toggle. */
    onToggleTts?: () => void
    /** TTS toggle's accessible label for the moment it is ON. */
    muteLabel: string
    /** TTS toggle's accessible label for the moment it is OFF. */
    unmuteLabel: string
    /** The current question, as authored/streamed markdown. Absent/blank → the interviewer is between questions. */
    questionMarkdown?: string
    /** `true` while this question's text is still streaming in. */
    isAsking?: boolean

    // ── live: the answer composer ──
    /** `false` → this browser cannot do speech-to-text. */
    sttSupported: boolean
    /** `true` → the mic is actively recording. */
    listening: boolean
    /** Live, not-yet-committed transcript while `listening`. */
    interimTranscript: string
    /** The committed answer — final voice transcript, or whatever the candidate typed. */
    answerValue: string
    /** Fired as the typed field changes. */
    onAnswerValueChange: (value: string) => void
    /** Fired when the mic button is pressed. */
    onToggleListen: () => void
    /** Which input method(s) this run accepts. */
    answerMode: VoiceAnswerMode
    /** Wording for the answer composer's two leaves. */
    voiceLabels: VoiceHeroLabels

    // ── live: the submit action ──
    /** `true` → this is the run's final question. */
    isLastQuestion: boolean
    /** Fired when the candidate submits the current answer. */
    onAnswerSubmit: () => void
    /** `true` → the submit press cannot fire right now (blank answer, or the interviewer still mid-turn). */
    isAnswerSubmitDisabled?: boolean
    /** `true` → the submitted turn is in flight. */
    isAnswerSubmitPending?: boolean

    // ── result: identity header ──
    /** Back-link label, e.g. "Quay lại phỏng vấn thử". */
    resultBackLabel: string
    /** Fired when the candidate leaves the debrief. */
    onResultBack: () => void
    /** Debrief title, e.g. "Kết quả phỏng vấn". */
    resultTitle: string
    /** One-line description under the title. */
    resultDescription?: string

    // ── result: the scorecard ──
    /** Pass / borderline / fail. */
    verdict: MockInterviewVerdict
    /** Overall score, 0–100. */
    overallScore: number
    /** Per-phase or per-question score breakdown. */
    phaseOrQuestionScores: Array<MockInterviewScoreRow>
    /** Per-attribute score breakdown. */
    attributeScores: Array<MockInterviewAttributeScoreRow>
    /** Concrete things done right, as markdown. */
    strengths: Array<string>
    /** Concrete gaps, as markdown. */
    gaps: Array<string>
    /** A follow-up an interviewer would ask next, as markdown. */
    followUpQuestion?: string | null
    /** The weakest area, already resolved by this screen. */
    weakAreaLabel?: string
    /** Fired when the candidate takes the primary CTA — go study the weak area. */
    onStudyWeakArea: () => void
    /** Fired when the candidate picks the capstone hand-off CTA. */
    onCapstone: () => void
    /** Fired when the candidate wants to run the interview again. Omit → no retry action. */
    onRetry?: () => void
    /** The system/prompt this run interviewed on. */
    promptTitle?: string
    /** When this attempt was graded, already formatted/localized. */
    createdAt?: string
    /** `true` → `SubmissionResultHeader` and `MockInterviewScorecard` mirror themselves while the debrief loads. */
    isResultSkeleton?: boolean

    /** When on, every composed block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * The mock interview screen. See the file header for the phase model and the
 * three marked GAPs (confirm dialog, "Tùy chỉnh" config, docked workspace pane).
 *
 * @param props - {@link MockInterviewPageProps}
 */
const MockInterviewPage = ({
    phase,
    setupBackLabel,
    onSetupBack,
    setupTitle,
    setupDescription,
    setupLabel,
    persona,
    sessionName,
    onSessionNameChange,
    tier,
    onTierChange,
    isDesignAvailable,
    onStartQna,
    onStartDesign,
    resumable,
    startingMode,
    isSetupPending,
    setupErrorMessage,
    isSkeleton = false,
    liveBackLabel,
    onLiveBack,
    liveTitle,
    liveCounter,
    liveTimeLeft,
    liveTotal,
    liveCurrent,
    liveDoneSteps,
    onLiveStepPress,
    liveFinishLabel,
    onLiveFinish,
    interviewerPersona,
    speaking,
    speakingLabel,
    ttsSupported,
    ttsEnabled,
    onToggleTts,
    muteLabel,
    unmuteLabel,
    questionMarkdown,
    isAsking,
    sttSupported,
    listening,
    interimTranscript,
    answerValue,
    onAnswerValueChange,
    onToggleListen,
    answerMode,
    voiceLabels,
    isLastQuestion,
    onAnswerSubmit,
    isAnswerSubmitDisabled,
    isAnswerSubmitPending,
    resultBackLabel,
    onResultBack,
    resultTitle,
    resultDescription,
    verdict,
    overallScore,
    phaseOrQuestionScores,
    attributeScores,
    strengths,
    gaps,
    followUpQuestion,
    weakAreaLabel,
    onStudyWeakArea,
    onCapstone,
    onRetry,
    promptTitle,
    createdAt,
    isResultSkeleton = false,
    showAnatomy = false,
}: MockInterviewPageProps) => {
    const setupSection = (
        <>
            <PlaygroundSetupHeader
                anatPart="PlaygroundSetupHeader"
                breadcrumbLabel={setupBackLabel}
                onBack={onSetupBack}
                title={setupTitle}
                description={setupDescription}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <MockInterviewSetup
                anatPart="MockInterviewSetup"
                label={setupLabel}
                persona={persona}
                sessionName={sessionName}
                onSessionNameChange={onSessionNameChange}
                tier={tier}
                onTierChange={onTierChange}
                isDesignAvailable={isDesignAvailable}
                onStartQna={onStartQna}
                onStartDesign={onStartDesign}
                resumable={resumable}
                startingMode={startingMode}
                isPending={isSetupPending}
                errorMessage={setupErrorMessage}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
        </>
    )

    const liveSection = (
        <>
            <WorkSessionHeader
                anatPart="WorkSessionHeader"
                backLabel={liveBackLabel}
                onBack={onLiveBack}
                title={liveTitle}
                counter={liveCounter}
                timeLeft={liveTimeLeft}
                total={liveTotal}
                current={liveCurrent}
                doneSteps={liveDoneSteps}
                onStepPress={onLiveStepPress}
                finishLabel={liveFinishLabel}
                onFinish={onLiveFinish}
                showAnatomy={showAnatomy}
            />
            <InterviewerPresence
                anatPart="InterviewerPresence"
                persona={interviewerPersona}
                speaking={speaking}
                speakingLabel={speakingLabel}
                ttsSupported={ttsSupported}
                ttsEnabled={ttsEnabled}
                onToggleTts={onToggleTts}
                muteLabel={muteLabel}
                unmuteLabel={unmuteLabel}
                questionMarkdown={questionMarkdown}
                isAsking={isAsking}
                showAnatomy={showAnatomy}
            />
            <VoiceHero
                anatPart="VoiceHero"
                sttSupported={sttSupported}
                listening={listening}
                interimTranscript={interimTranscript}
                value={answerValue}
                onValueChange={onAnswerValueChange}
                onToggleListen={onToggleListen}
                answerMode={answerMode}
                labels={voiceLabels}
                showAnatomy={showAnatomy}
            />
            <MockInterviewAnswerAction
                anatPart="MockInterviewAnswerAction"
                isLastQuestion={isLastQuestion}
                onSubmit={onAnswerSubmit}
                isDisabled={isAnswerSubmitDisabled}
                isPending={isAnswerSubmitPending}
                showAnatomy={showAnatomy}
            />
        </>
    )

    const resultSection = (
        <>
            <SubmissionResultHeader
                anatPart="SubmissionResultHeader"
                backLabel={resultBackLabel}
                onBack={onResultBack}
                title={resultTitle}
                description={resultDescription}
                isSkeleton={isResultSkeleton}
                showAnatomy={showAnatomy}
            />
            <MockInterviewScorecard
                anatPart="MockInterviewScorecard"
                verdict={verdict}
                overallScore={overallScore}
                phaseOrQuestionScores={phaseOrQuestionScores}
                attributeScores={attributeScores}
                strengths={strengths}
                gaps={gaps}
                followUpQuestion={followUpQuestion}
                weakAreaLabel={weakAreaLabel}
                onStudyWeakArea={onStudyWeakArea}
                onCapstone={onCapstone}
                onRetry={onRetry}
                promptTitle={promptTitle}
                createdAt={createdAt}
                isSkeleton={isResultSkeleton}
                showAnatomy={showAnatomy}
            />
        </>
    )

    const interviewPhases = (
        <>
            {phase === "setup" ? (
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} body={setupSection} />
            ) : null}

            {phase === "live" ? (
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} body={liveSection} />
            ) : null}

            {phase === "result" ? (
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} body={resultSection} />
            ) : null}
        </>
    )

    const interviewBody = <StackV gap="page" anatPart={showAnatomy ? "StackV" : undefined} body={interviewPhases} />

    return <Container size="md" padding="roomy" body={interviewBody} />
}

export { MockInterviewPage }
