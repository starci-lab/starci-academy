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
 * `MockInterviewPage` — the screen for getting ready for a mock interview, working
 * through it live, then reading the debrief. It composes blocks in frames and hands
 * each typed data, drawing no shape of its own.
 *
 * Three phases, never two at once: `setup` (the green room, identity via
 * `PlaygroundSetupHeader` + `MockInterviewSetup`), `live` (`WorkSessionHeader` +
 * `InterviewerPresence` + `VoiceHero` + `MockInterviewAnswerAction`, in one
 * reading-width column), `result` (identity via `SubmissionResultHeader` +
 * `MockInterviewScorecard`). `isSkeleton` reaches only the blocks that can mirror
 * themselves (the setup and result headers/bodies).
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
    /** Setup screen title, e.g. "Mock interview". */
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
    /** Where the candidate is, already worded — e.g. "Question 3 / 5". */
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
    /** Status text shown while `speaking`, e.g. "Reading the question". */
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
    /** Back-link label, e.g. "Back to mock interview". */
    resultBackLabel: string
    /** Fired when the candidate leaves the debrief. */
    onResultBack: () => void
    /** Debrief title, e.g. "Interview result". */
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

}

/**
 * The mock interview screen. See the file header for the phase model and the
 * three marked GAPs (confirm dialog, "Customize" config, docked workspace pane).
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
}: MockInterviewPageProps) => {
    const setupSection = (
        <>
            <PlaygroundSetupHeader

                breadcrumbLabel={setupBackLabel}
                onBack={onSetupBack}
                title={setupTitle}
                description={setupDescription}
                isSkeleton={isSkeleton}

            />
            <MockInterviewSetup

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

            />
        </>
    )

    const liveSection = (
        <>
            <WorkSessionHeader

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

            />
            <InterviewerPresence

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

            />
            <VoiceHero

                sttSupported={sttSupported}
                listening={listening}
                interimTranscript={interimTranscript}
                value={answerValue}
                onValueChange={onAnswerValueChange}
                onToggleListen={onToggleListen}
                answerMode={answerMode}
                labels={voiceLabels}

            />
            <MockInterviewAnswerAction

                isLastQuestion={isLastQuestion}
                onSubmit={onAnswerSubmit}
                isDisabled={isAnswerSubmitDisabled}
                isPending={isAnswerSubmitPending}

            />
        </>
    )

    const resultSection = (
        <>
            <SubmissionResultHeader

                backLabel={resultBackLabel}
                onBack={onResultBack}
                title={resultTitle}
                description={resultDescription}
                isSkeleton={isResultSkeleton}

            />
            <MockInterviewScorecard

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

            />
        </>
    )

    const interviewPhases = (
        <>
            {phase === "setup" ? (
                <StackV gap={6} isSkeleton={isSkeleton} items={[() => setupSection]} />
            ) : null}

            {phase === "live" ? (
                <StackV gap={6} items={[() => liveSection]} />
            ) : null}

            {phase === "result" ? (
                <StackV gap={6} isSkeleton={isResultSkeleton} items={[() => resultSection]} />
            ) : null}
        </>
    )

    const interviewBody = <StackV gap={7} items={[() => interviewPhases]} />

    return <Container size="md" padding={6} body={interviewBody} />
}

export { MockInterviewPage }
