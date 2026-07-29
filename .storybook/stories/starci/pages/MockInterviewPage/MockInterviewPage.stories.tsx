import type { Meta, StoryObj } from "@storybook/nextjs"
import { MockInterviewPage } from "@sb-components/starci/pages/MockInterviewPage/MockInterviewPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `MockInterviewPage`: get ready for a mock interview, work through
 * it live, then read the debrief. See the component's own file header for the
 * full phase model and the three marked GAPs it leaves rather than fakes
 * (the confirm dialog on leave/end-early, the "Tùy chỉnh" config body, and the
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
    name: "Chị Hà Vy",
    role: "Senior Backend @ ngân hàng số",
    avatarSrc: undefined,
}

const VOICE_LABELS = {
    pushToTalk: "Nhấn để trả lời",
    listening: "Đang nghe...",
    typeInstead: "Gõ thay vì nói",
    useVoice: "Dùng giọng nói",
    placeholder: "Nhập câu trả lời của bạn",
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
        <div className="p-8">
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
    setupBackLabel="Học phần"
    onSetupBack={back}
    setupTitle="Phỏng vấn thử"
    setupDescription="Luyện trả lời như một buổi phỏng vấn thật"
    setupLabel="Chuẩn bị phỏng vấn"
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
                                showAnatomy
                                phase="setup"
                                setupBackLabel="Học phần"
                                onSetupBack={() => {}}
                                setupTitle="Phỏng vấn thử"
                                setupDescription="Luyện trả lời như một buổi phỏng vấn thật"
                                setupLabel="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Vòng 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Thoát"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Đang đọc câu hỏi"
                                muteLabel="Tắt tiếng"
                                unmuteLabel="Bật tiếng"
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
                                resultBackLabel="Quay lại phỏng vấn thử"
                                onResultBack={() => {}}
                                resultTitle="Kết quả phỏng vấn"
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
    resumable={{ name: "Vòng 1 - Backend", progressLabel: "Đang dở câu 3", onResume: resume }}
    …
/>`,
                        render: (
                            <MockInterviewPage
                                phase="setup"
                                setupBackLabel="Học phần"
                                onSetupBack={() => {}}
                                setupTitle="Phỏng vấn thử"
                                setupDescription="Luyện trả lời như một buổi phỏng vấn thật"
                                setupLabel="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Thiết kế hệ thống rút gọn URL"
                                onSessionNameChange={() => {}}
                                tier="senior"
                                onTierChange={() => {}}
                                isDesignAvailable
                                onStartQna={() => {}}
                                onStartDesign={() => {}}
                                resumable={{ name: "Vòng 1 - Backend", progressLabel: "Đang dở câu 3", onResume: () => {} }}
                                liveBackLabel="Thoát"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Đang đọc câu hỏi"
                                muteLabel="Tắt tiếng"
                                unmuteLabel="Bật tiếng"
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
                                resultBackLabel="Quay lại phỏng vấn thử"
                                onResultBack={() => {}}
                                resultTitle="Kết quả phỏng vấn"
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
                                setupBackLabel="Học phần"
                                onSetupBack={() => {}}
                                setupTitle="Phỏng vấn thử"
                                setupLabel="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName=""
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                isSkeleton
                                liveBackLabel="Thoát"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Đang đọc câu hỏi"
                                muteLabel="Tắt tiếng"
                                unmuteLabel="Bật tiếng"
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
                                resultBackLabel="Quay lại phỏng vấn thử"
                                onResultBack={() => {}}
                                resultTitle="Kết quả phỏng vấn"
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
        <div className="p-8">
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
    liveBackLabel="Thoát"
    onLiveBack={leave}
    liveTitle="Vòng 1 - Backend"
    liveCounter="Câu 2 / 5"
    liveTotal={5}
    liveCurrent={2}
    liveDoneSteps={[1]}
    liveFinishLabel="Kết thúc"
    onLiveFinish={finishEarly}
    interviewerPersona={persona}
    speaking={false}
    speakingLabel="Đang đọc câu hỏi"
    muteLabel="Tắt tiếng"
    unmuteLabel="Bật tiếng"
    ttsSupported
    ttsEnabled
    onToggleTts={toggleTts}
    questionMarkdown="Bạn thiết kế cache cho API đọc nhiều hơn ghi như thế nào?"
    sttSupported
    listening
    interimTranscript="Mình sẽ dùng Redis làm cache tầng..."
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
                                showAnatomy
                                phase="live"
                                setupBackLabel="Học phần"
                                onSetupBack={() => {}}
                                setupTitle="Phỏng vấn thử"
                                setupLabel="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Vòng 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Thoát"
                                onLiveBack={() => {}}
                                liveTitle="Vòng 1 - Backend"
                                liveCounter="Câu 2 / 5"
                                liveTotal={5}
                                liveCurrent={2}
                                liveDoneSteps={[1]}
                                onLiveStepPress={() => {}}
                                liveFinishLabel="Kết thúc"
                                onLiveFinish={() => {}}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Đang đọc câu hỏi"
                                ttsSupported
                                ttsEnabled
                                onToggleTts={() => {}}
                                muteLabel="Tắt tiếng"
                                unmuteLabel="Bật tiếng"
                                questionMarkdown="Bạn thiết kế cache cho API đọc nhiều hơn ghi như thế nào?"
                                sttSupported
                                listening
                                interimTranscript="Mình sẽ dùng Redis làm cache tầng..."
                                answerValue=""
                                onAnswerValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                voiceLabels={VOICE_LABELS}
                                isLastQuestion={false}
                                onAnswerSubmit={() => {}}
                                isAnswerSubmitDisabled
                                resultBackLabel="Quay lại phỏng vấn thử"
                                onResultBack={() => {}}
                                resultTitle="Kết quả phỏng vấn"
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
    liveCounter="Câu 5 / 5"
    liveCurrent={5}
    liveDoneSteps={[1, 2, 3, 4]}
    isAsking
    questionMarkdown="Trade-off giữa..."
    answerValue="Em sẽ ưu tiên..."
    isLastQuestion
    …
/>`,
                        render: (
                            <MockInterviewPage
                                phase="live"
                                setupBackLabel="Học phần"
                                onSetupBack={() => {}}
                                setupTitle="Phỏng vấn thử"
                                setupLabel="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Vòng 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Thoát"
                                onLiveBack={() => {}}
                                liveTitle="Vòng 1 - Backend"
                                liveCounter="Câu 5 / 5"
                                liveTotal={5}
                                liveCurrent={5}
                                liveDoneSteps={[1, 2, 3, 4]}
                                onLiveStepPress={() => {}}
                                liveFinishLabel="Kết thúc"
                                onLiveFinish={() => {}}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Đang đọc câu hỏi"
                                muteLabel="Tắt tiếng"
                                unmuteLabel="Bật tiếng"
                                questionMarkdown="Trade-off giữa consistency và availability trong hệ thống bạn vừa vẽ là gì?"
                                isAsking
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                answerValue="Em sẽ ưu tiên availability cho API đọc, còn ghi thì..."
                                onAnswerValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                voiceLabels={VOICE_LABELS}
                                isLastQuestion
                                onAnswerSubmit={() => {}}
                                resultBackLabel="Quay lại phỏng vấn thử"
                                onResultBack={() => {}}
                                resultTitle="Kết quả phỏng vấn"
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
        <div className="p-8">
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
    resultBackLabel="Quay lại phỏng vấn thử"
    onResultBack={back}
    resultTitle="Kết quả phỏng vấn"
    verdict="borderline"
    overallScore={68}
    phaseOrQuestionScores={scores}
    attributeScores={attributes}
    strengths={strengths}
    gaps={gaps}
    weakAreaLabel="Thiết kế cache"
    onStudyWeakArea={studyWeakArea}
    onCapstone={capstone}
    onRetry={retry}
    …
/>`,
                        render: (
                            <MockInterviewPage
                                showAnatomy
                                phase="result"
                                setupBackLabel="Học phần"
                                onSetupBack={() => {}}
                                setupTitle="Phỏng vấn thử"
                                setupLabel="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Vòng 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Thoát"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Đang đọc câu hỏi"
                                muteLabel="Tắt tiếng"
                                unmuteLabel="Bật tiếng"
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
                                resultBackLabel="Quay lại phỏng vấn thử"
                                onResultBack={() => {}}
                                resultTitle="Kết quả phỏng vấn"
                                resultDescription="Vòng 1 - Backend · Trung cấp"
                                verdict="borderline"
                                overallScore={68}
                                phaseOrQuestionScores={[
                                    { key: "q1", label: "Câu 1", score: 16, max: 20 },
                                    { key: "q2", label: "Câu 2", score: 12, max: 20 },
                                    { key: "q3", label: "Câu 3", score: 18, max: 20 },
                                ]}
                                attributeScores={[
                                    { key: "communication", label: "Giao tiếp", score: 74 },
                                    { key: "structure", label: "Tư duy có cấu trúc", score: 58 },
                                ]}
                                strengths={["Giải thích rõ ràng luồng dữ liệu"]}
                                gaps={["Chưa nêu được cách xử lý cache invalidation"]}
                                followUpQuestion="Nếu cache bị lệch dữ liệu với DB thì bạn phát hiện bằng cách nào?"
                                weakAreaLabel="Thiết kế cache"
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                                onRetry={() => {}}
                                promptTitle="Thiết kế hệ thống rút gọn URL"
                                createdAt="28 thg 7, 2026 · 14:32"
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
                                setupBackLabel="Học phần"
                                onSetupBack={() => {}}
                                setupTitle="Phỏng vấn thử"
                                setupLabel="Chuẩn bị phỏng vấn"
                                persona={PERSONA}
                                sessionName="Vòng 1 - Backend"
                                onSessionNameChange={() => {}}
                                tier="mid"
                                onTierChange={() => {}}
                                isDesignAvailable={false}
                                onStartQna={() => {}}
                                liveBackLabel="Thoát"
                                onLiveBack={() => {}}
                                liveCounter=""
                                liveTotal={0}
                                liveCurrent={0}
                                interviewerPersona={PERSONA}
                                speaking={false}
                                speakingLabel="Đang đọc câu hỏi"
                                muteLabel="Tắt tiếng"
                                unmuteLabel="Bật tiếng"
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
                                resultBackLabel="Quay lại phỏng vấn thử"
                                onResultBack={() => {}}
                                resultTitle="Kết quả phỏng vấn"
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
