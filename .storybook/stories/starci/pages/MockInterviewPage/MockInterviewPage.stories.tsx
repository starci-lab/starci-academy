import type { Meta, StoryObj } from "@storybook/nextjs"
import { MockInterviewPage } from "@sb-components/starci/pages/MockInterviewPage/MockInterviewPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `MockInterviewPage`: get ready for a mock interview, work through
 * it live, then read the debrief. See the component's own file header for the
 * full phase model and the three marked GAPs it leaves rather than fakes
 * (the confirm dialog on leave/end-early, the "Customize" config body, and the
 * docked whiteboard/code workspace pane).
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. Seven blocks — three
 * reused (`WorkSessionHeader`, `PlaygroundSetupHeader`, `SubmissionResultHeader`),
 * four new this run — arranged by `phase`.
 *
 * 📐 THREE LEAVES, matching the one structural fork (`phase`) — the same
 * granularity `QuizPage`/`FlashcardReviewPage`'s own stories keep:
 * `Setup` (identity header + green-room card, several data states) ·
 * `Live` (session band + interviewer + answer composer + submit action) ·
 * `Result` (debrief identity header + scorecard, pass/borderline/fail).
 */
const meta: Meta<typeof MockInterviewPage> = {
    title: "StarCi/Pages/MockInterviewPage/MockInterviewPage",
    component: MockInterviewPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MockInterviewPage>

const PERSONA = {
    name: "Ha Vy",
    role: "Senior Backend @ a digital bank",
    avatarSrc: undefined,
}

const VOICE_LABELS = {
    pushToTalk: "Press to answer",
    listening: "Listening...",
    typeInstead: "Type instead of speaking",
    useVoice: "Use voice",
    placeholder: "Type your answer",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame owning the seam between the screen's own page-level wrapper and whichever phase cluster is on screen, or between the blocks inside that cluster", storyId: "frames-stack-stackv--default" },
    "PlaygroundSetupHeader": { tier: "block", role: "setup identity — a way back to wherever Mock Interview was opened from, plus the screen's own title/description", storyId: "starci-blocks-learn-playgroundsetupheader-playgroundsetupheader--default" },
    "MockInterviewSetup": { tier: "block", role: "the green-room card — interviewer persona, run name, tier, resumable banner, start actions", storyId: "starci-blocks-learn-mockinterviewsetup-mockinterviewsetup--full" },
    "WorkSessionHeader": { tier: "block", role: "the live session band — a way out, a position, a rail — reused with this run's own data", storyId: "starci-blocks-navigation-worksessionheader-worksessionheader--full" },
    "InterviewerPresence": { tier: "block", role: "who's asking — identity, live-speaking cue, TTS toggle, the question itself", storyId: "starci-blocks-learn-interviewerpresence-interviewerpresence--full" },
    "VoiceHero": { tier: "block", role: "the answer composer — push-to-talk mic hero, or the typed fallback", storyId: "starci-blocks-learn-voicehero-voicehero--mic-hero" },
    "MockInterviewAnswerAction": { tier: "block", role: "the one submit action that sends the current answer and moves the run forward", storyId: "starci-blocks-learn-mockinterviewansweraction-mockinterviewansweraction--full" },
    "SubmissionResultHeader": { tier: "block", role: "debrief identity — a way back, plus the graded run's own title", storyId: "starci-blocks-learn-submissionresultheader-submissionresultheader--header" },
    "MockInterviewScorecard": { tier: "block", role: "the graded run — verdict, score breakdown, attributes, strengths, gaps, follow-up, CTAs", storyId: "starci-blocks-learn-mockinterviewscorecard-mockinterviewscorecard--full" },
}

/** LEAF — setup: identity header plus the green-room card, several real setup states. */
export const Setup: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MockInterviewPage"
                tier="screen"
                leaf="Setup"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "fresh setup, Q&A-only course",
                        why: "No run was left behind and the course has no Design round, so the card opens straight on the form with one start button — the plain first-visit shape most candidates see.",
                        code: `<MockInterviewPage
    phase="setup"
    setupBackLabel="Module"
    onSetupBack={back}
    setupTitle="Mock interview"
    setupDescription="Practice answering like a real interview"
    setupLabel="Prepare for the interview"
    persona={persona}
    sessionName={name}
    onSessionNameChange={setName}
    tier="mid"
    onTierChange={setTier}
    isDesignAvailable={false}
    onStartQna={startQna}
    …
/>`,
                        render: (
                            <MockInterviewPage
                               
                                phase="setup"
                                setupBackLabel="Module"
                                onSetupBack={() => {}}
                                setupTitle="Mock interview"
                                setupDescription="Practice answering like a real interview"
                                setupLabel="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Round 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Exit"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question"
                                muteLabel="Mute"
                                unmuteLabel="Unmute"
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                answerValue=""
                                onAnswerValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                voiceLabels={VOICE_LABELS}
                                isLastQuestion={false}
                                onAnswerSubmit={() => {}}
                                resultBackLabel="Back to mock interview"
                                onResultBack={() => {}}
                                resultTitle="Interview results"
                                verdict="pass"
                                overallScore={0}
                                phaseOrQuestionScores={[]}
                                attributeScores={[]}
                                strengths={[]}
                                gaps={[]}
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                            />
                        ),
                    },
                    {
                        name: "System-Design course, a run left unfinished",
                        why: "The Design start button shows beside Q&A, and the resume banner leads the card — a candidate who left mid-interview is not asked to scroll past a fresh-start button to find their own session.",
                        code: `<MockInterviewPage
    phase="setup"
    isDesignAvailable
    onStartQna={startQna}
    onStartDesign={startDesign}
    resumable={{ name: "Round 1 - Backend", progressLabel: "Stopped at question 3", onResume: resume }}
    …
/>`,
                        render: (
                            <MockInterviewPage
                                phase="setup"
                                setupBackLabel="Module"
                                onSetupBack={() => {}}
                                setupTitle="Mock interview"
                                setupDescription="Practice answering like a real interview"
                                setupLabel="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Design a URL shortener system"
                                onSessionNameChange={() => {}}
                                tier="senior"
                                onTierChange={() => {}}
                                isDesignAvailable
                                onStartQna={() => {}}
                                onStartDesign={() => {}}
                                resumable={{ name: "Round 1 - Backend", progressLabel: "Stopped at question 3", onResume: () => {} }}
                                liveBackLabel="Exit"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question"
                                muteLabel="Mute"
                                unmuteLabel="Unmute"
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                answerValue=""
                                onAnswerValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                voiceLabels={VOICE_LABELS}
                                isLastQuestion={false}
                                onAnswerSubmit={() => {}}
                                resultBackLabel="Back to mock interview"
                                onResultBack={() => {}}
                                resultTitle="Interview results"
                                verdict="pass"
                                overallScore={0}
                                phaseOrQuestionScores={[]}
                                attributeScores={[]}
                                strengths={[]}
                                gaps={[]}
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "PlaygroundSetupHeader's title/description and MockInterviewSetup's whole card mirror themselves while setup data loads — the identity header's back link stays live, matching its own file header's reasoning.",
                        code: "<MockInterviewPage phase=\"setup\" isSkeleton … />",
                        render: (
                            <MockInterviewPage
                                phase="setup"
                                setupBackLabel="Module"
                                onSetupBack={() => {}}
                                setupTitle="Mock interview"
                                setupLabel="Prepare for the interview"
                                persona={PERSONA}
                                sessionName=""
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                isSkeleton
                                liveBackLabel="Exit"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question"
                                muteLabel="Mute"
                                unmuteLabel="Unmute"
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                answerValue=""
                                onAnswerValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                voiceLabels={VOICE_LABELS}
                                isLastQuestion={false}
                                onAnswerSubmit={() => {}}
                                resultBackLabel="Back to mock interview"
                                onResultBack={() => {}}
                                resultTitle="Interview results"
                                verdict="pass"
                                overallScore={0}
                                phaseOrQuestionScores={[]}
                                attributeScores={[]}
                                strengths={[]}
                                gaps={[]}
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — live: session band, interviewer, answer composer, submit action. */
export const Live: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MockInterviewPage"
                tier="screen"
                leaf="Live"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "question delivered, candidate speaking, mid-run",
                        why: "This is not the last question, so the submit action reads \"answer & continue\". The interviewer's own pulse ring is off (TTS already finished reading), and the mic is live — the candidate's own words are still filling the answer.",
                        code: `<MockInterviewPage
    phase="live"
    liveBackLabel="Exit"
    onLiveBack={leave}
    liveTitle="Round 1 - Backend"
    liveCounter="Question 2 / 5"
    liveTotal={5}
    liveCurrent={2}
    liveDoneSteps={[1]}
    liveFinishLabel="Finish"
    onLiveFinish={finishEarly}
    interviewerPersona={persona}
    speaking={false}
    speakingLabel="Reading the question"
    muteLabel="Mute"
    unmuteLabel="Unmute"
    ttsSupported
    ttsEnabled
    onToggleTts={toggleTts}
    questionMarkdown="How would you design caching for a read-heavy API?"
    sttSupported
    listening
    interimTranscript="I will use Redis as a caching layer..."
    answerValue=""
    onAnswerValueChange={setAnswer}
    onToggleListen={toggleListen}
    answerMode="both"
    voiceLabels={voiceLabels}
    isLastQuestion={false}
    onAnswerSubmit={submit}
    isAnswerSubmitDisabled
    …
/>`,
                        render: (
                            <MockInterviewPage
                               
                                phase="live"
                                setupBackLabel="Module"
                                onSetupBack={() => {}}
                                setupTitle="Mock interview"
                                setupLabel="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Round 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Exit"
                                onLiveBack={() => {}}
                                liveTitle="Round 1 - Backend"
                                liveCounter="Question 2 / 5"
                                liveTotal={5}
                                liveCurrent={2}
                                liveDoneSteps={[1]}
                                onLiveStepPress={() => {}}
                                liveFinishLabel="Finish"
                                onLiveFinish={() => {}}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question"
                                ttsSupported
                                ttsEnabled
                                onToggleTts={() => {}}
                                muteLabel="Mute"
                                unmuteLabel="Unmute"
                                questionMarkdown="How would you design caching for a read-heavy API?"
                                sttSupported
                                listening
                                interimTranscript="I will use Redis as a caching layer..."
                                answerValue=""
                                onAnswerValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                voiceLabels={VOICE_LABELS}
                                isLastQuestion={false}
                                onAnswerSubmit={() => {}}
                                isAnswerSubmitDisabled
                                resultBackLabel="Back to mock interview"
                                onResultBack={() => {}}
                                resultTitle="Interview results"
                                verdict="pass"
                                overallScore={0}
                                phaseOrQuestionScores={[]}
                                attributeScores={[]}
                                strengths={[]}
                                gaps={[]}
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                            />
                        ),
                    },
                    {
                        name: "last question, answer ready, interviewer still streaming its text",
                        why: "isAsking drives InterviewerPresence's own typing cue while this question's words arrive; isLastQuestion swaps the submit action's label to \"answer & finish\" and the answer is non-blank, so the action is pressable.",
                        code: `<MockInterviewPage
    phase="live"
    liveCounter="Question 5 / 5"
    liveCurrent={5}
    liveDoneSteps={[1, 2, 3, 4]}
    isAsking
    questionMarkdown="Trade-off between..."
    answerValue="I would prioritize..."
    isLastQuestion
    …
/>`,
                        render: (
                            <MockInterviewPage
                                phase="live"
                                setupBackLabel="Module"
                                onSetupBack={() => {}}
                                setupTitle="Mock interview"
                                setupLabel="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Round 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Exit"
                                onLiveBack={() => {}}
                                liveTitle="Round 1 - Backend"
                                liveCounter="Question 5 / 5"
                                liveTotal={5}
                                liveCurrent={5}
                                liveDoneSteps={[1, 2, 3, 4]}
                                onLiveStepPress={() => {}}
                                liveFinishLabel="Finish"
                                onLiveFinish={() => {}}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question"
                                muteLabel="Mute"
                                unmuteLabel="Unmute"
                                questionMarkdown="What is the trade-off between consistency and availability in the system you just designed?"
                                isAsking
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                answerValue="I would prioritize availability for read APIs, while for writes..."
                                onAnswerValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                voiceLabels={VOICE_LABELS}
                                isLastQuestion
                                onAnswerSubmit={() => {}}
                                resultBackLabel="Back to mock interview"
                                onResultBack={() => {}}
                                resultTitle="Interview results"
                                verdict="pass"
                                overallScore={0}
                                phaseOrQuestionScores={[]}
                                attributeScores={[]}
                                strengths={[]}
                                gaps={[]}
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — result: debrief identity header plus the scorecard. */
export const Result: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MockInterviewPage"
                tier="screen"
                leaf="Result"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "verdict = borderline",
                        why: "A near-pass run: the scorecard's own weakest-area CTA and retry action both fire back into this screen — onRetry is how a candidate reaches setup again for another run, so no separate \"back to setup\" control is drawn beside it.",
                        code: `<MockInterviewPage
    phase="result"
    resultBackLabel="Back to mock interview"
    onResultBack={back}
    resultTitle="Interview results"
    verdict="borderline"
    overallScore={68}
    phaseOrQuestionScores={scores}
    attributeScores={attributes}
    strengths={strengths}
    gaps={gaps}
    weakAreaLabel="Cache design"
    onStudyWeakArea={studyWeakArea}
    onCapstone={capstone}
    onRetry={retry}
    …
/>`,
                        render: (
                            <MockInterviewPage
                               
                                phase="result"
                                setupBackLabel="Module"
                                onSetupBack={() => {}}
                                setupTitle="Mock interview"
                                setupLabel="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Round 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Exit"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question"
                                muteLabel="Mute"
                                unmuteLabel="Unmute"
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                answerValue=""
                                onAnswerValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                voiceLabels={VOICE_LABELS}
                                isLastQuestion={false}
                                onAnswerSubmit={() => {}}
                                resultBackLabel="Back to mock interview"
                                onResultBack={() => {}}
                                resultTitle="Interview results"
                                resultDescription="Round 1 - Backend · Mid-level"
                                verdict="borderline"
                                overallScore={68}
                                phaseOrQuestionScores={[
                                    { key: "q1", label: "Question 1", score: 16, max: 20 },
                                    { key: "q2", label: "Question 2", score: 12, max: 20 },
                                    { key: "q3", label: "Question 3", score: 18, max: 20 },
                                ]}
                                attributeScores={[
                                    { key: "communication", label: "Communication", score: 74 },
                                    { key: "structure", label: "Structured thinking", score: 58 },
                                ]}
                                strengths={["Clearly explained the data flow"]}
                                gaps={["Did not cover how to handle cache invalidation"]}
                                followUpQuestion="If the cache drifts out of sync with the DB, how would you detect it?"
                                weakAreaLabel="Cache design"
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                                onRetry={() => {}}
                                promptTitle="Design a URL shortener system"
                                createdAt="Jul 28, 2026 · 2:32 PM"
                            />
                        ),
                    },
                    {
                        name: "isResultSkeleton = true",
                        why: "SubmissionResultHeader's title/description and the whole scorecard mirror themselves while the debrief is still being graded — the back link stays live, same reasoning the header block documents.",
                        code: "<MockInterviewPage phase=\"result\" isResultSkeleton … />",
                        render: (
                            <MockInterviewPage
                                phase="result"
                                setupBackLabel="Module"
                                onSetupBack={() => {}}
                                setupTitle="Mock interview"
                                setupLabel="Prepare for the interview"
                                persona={PERSONA}
                                sessionName="Round 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Exit"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Reading the question"
                                muteLabel="Mute"
                                unmuteLabel="Unmute"
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                answerValue=""
                                onAnswerValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                voiceLabels={VOICE_LABELS}
                                isLastQuestion={false}
                                onAnswerSubmit={() => {}}
                                resultBackLabel="Back to mock interview"
                                onResultBack={() => {}}
                                resultTitle="Interview results"
                                verdict="pass"
                                overallScore={0}
                                phaseOrQuestionScores={[]}
                                attributeScores={[]}
                                strengths={[]}
                                gaps={[]}
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                                isResultSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
