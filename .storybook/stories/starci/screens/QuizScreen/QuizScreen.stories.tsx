import type { Meta, StoryObj } from "@storybook/nextjs"
import { CardsIcon, FlameIcon, TargetIcon, TrophyIcon } from "@phosphor-icons/react"
import { QuizScreen } from "@sb-components/starci/screens/QuizScreen/QuizScreen"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `QuizScreen`: drill yourself against written questions, one run at a
 * time. Set the run up, work through it, then look back over every card.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. Eight blocks — seven
 * reused, one new (`QuizProgressPanel`) — arranged by `phase`; see the
 * component's own file header for the full contract and the two GAPs it leaves
 * marked rather than fakes (the breadcrumb row, and a mid-`active`-phase
 * "level ran out of questions" swap that would have required either breaking the
 * screen import boundary or inventing a ninth block outside this run's scope).
 *
 * ⚠️ THREE OF THE EIGHT BLOCKS HAVE NO STORY YET — `QuizEnrollGate`, `QuizSetup`,
 * `QuizQuestion` were built before this run but never got a `.stories.tsx`
 * (`node scripts/check-story-ids.mjs --list` confirms no id exists for any of the
 * three). §"every storyId must be REAL" means those three parts are left OUT of
 * `ANNOTATE` below rather than pointed at a made-up id — a badge with no entry is
 * an honest "not linked yet", a fabricated `storyId` is a silently broken one.
 * They still carry `anatPart` so the DOM keeps its badge; only the Deps LINK is
 * missing.
 *
 * 📐 FIVE LEAVES, matching the two structural forks (`isEnrolled`, `phase`) plus
 * the one prop-flip (`isSkeleton`) that only the setup phase can show:
 *   `SetupEnrolled` · `SetupTrial` (enroll gate replaces setup+progress) ·
 *   `SetupLoading` (prop flip) · `Active` · `Recap`.
 */
const meta: Meta<typeof QuizScreen> = {
    title: "StarCi/Screens/QuizScreen/QuizScreen",
    component: QuizScreen,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QuizScreen>

// Reused verbatim from `QuizProgressPanel`'s own story so the two trees agree on
// what "this learner's history" looks like.
const PROGRESS_STATS = [
    { key: "accuracy", icon: TargetIcon, label: "Độ chính xác", value: "82%" },
    { key: "streak", icon: FlameIcon, label: "Chuỗi ngày", value: "7 ngày" },
    { key: "total", icon: CardsIcon, label: "Tổng câu đã làm", value: "126" },
    { key: "avgScore", icon: TrophyIcon, label: "Điểm trung bình", value: "7.4/10" },
]

const PROGRESS_SESSIONS = [
    { key: "run3", name: "Ôn Docker trước phỏng vấn", dateLabel: "Hôm qua", scoreLabel: "8/10 đúng", onPress: () => {} },
    { key: "run2", name: "Drill nhanh CI/CD", dateLabel: "3 ngày trước", scoreLabel: "6/10 đúng", onPress: () => {} },
    { key: "run1", name: "Ôn Kubernetes", dateLabel: "Tuần trước", scoreLabel: "9/10 đúng", onPress: () => {} },
]

// Reused verbatim from `QuizRecapList`'s own story, same reasoning.
const RECAP_RATING_OPTIONS = [
    { grade: 0, label: "Quên", hint: "Gặp lại hôm nay" },
    { grade: 1, label: "Khó", hint: "Gặp lại sau 1 ngày" },
    { grade: 2, label: "Được", hint: "Gặp lại sau 4 ngày" },
    { grade: 3, label: "Dễ", hint: "Gặp lại sau 10 ngày" },
]

const RECAP_CARDS = [
    {
        key: "layer",
        question: "Vì sao xoá file ở layer sau không làm image nhẹ đi?",
        expectedAnswer: "Layer **cộng dồn**: layer sau chỉ ghi đè, chỗ đã chiếm ở layer trước vẫn nằm trong image.",
        givenAnswer: "Vì layer trước vẫn còn file đó, xoá ở sau chỉ là ghi đè thôi.",
        wasCorrect: true,
    },
    {
        key: "cache",
        question: "Đặt `COPY . .` trước `npm ci` thì hỏng chuyện gì?",
        expectedAnswer: "Mọi thay đổi code làm **vỡ cache** của bước cài phụ thuộc, nên lần build nào cũng cài lại từ đầu.",
        givenAnswer: "Em nghĩ là image nặng hơn.",
        wasCorrect: false,
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame owning the seam between the screen's own page-level wrapper and whichever phase cluster is on screen, or between the blocks inside that cluster", storyId: "frames-stack-stackv--default" },
    "FlashcardModeSwitch": { tier: "block", role: "study-vs-drill switch, shown only in the setup phase and gone the moment a run starts", storyId: "starci-blocks-learn-flashcardmodeswitch-flashcardmodeswitch--full" },
    "QuizProgressPanel": { tier: "block", role: "lifetime numbers and run history, sitting beside setup once the learner is enrolled", storyId: "starci-blocks-learn-quizprogresspanel-quizprogresspanel--content" },
    "WorkSessionHeader": { tier: "block", role: "the session band — a way out, a position, a rail — reused with its own data for both the active phase and the recap phase", storyId: "starci-blocks-navigation-worksessionheader-worksessionheader--full" },
    "QuizRecapList": { tier: "block", role: "the answered cards, self-graded one by one once a run ends", storyId: "starci-blocks-learn-quizrecaplist-quizrecaplist--full" },
    // `QuizEnrollGate`, `QuizSetup`, `QuizQuestion` are deliberately absent — no story
    // exists for any of the three yet (see the file header). They still render and
    // carry `anatPart`, they simply have no Deps link to point at.
}

/** LEAF — enrolled: the setup form and the progress panel side by side. */
export const SetupEnrolled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="QuizScreen"
                tier="screen"
                leaf="Setup — enrolled"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "progressView = \"stats\"",
                        why: "An enrolled learner sees three blocks: the mode switch, the setup form to start the next run, and the progress panel open on lifetime numbers. This is the shape the setup phase opens to — everything needed to look back AND start again, without a run in progress yet.",
                        code: `<QuizScreen
    phase="setup"
    flashcardMode="quiz"
    onFlashcardModeChange={setMode}
    flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
    isEnrolled
    setupLabel="Dựng phiên"
    setupName={name}
    onSetupNameChange={setName}
    setupLength="quick"
    onSetupLengthChange={setLength}
    setupLevel="middle"
    onSetupLevelChange={setLevel}
    onSetupStart={start}
    progressLabel="Đã luyện thế nào"
    progressView="stats"
    onProgressViewChange={setView}
    progressViewAriaLabel="Chọn xem thống kê hay lịch sử"
    progressStats={stats}
    progressSessions={sessions}
    …
/>`,
                        render: (
                            <QuizScreen
                                showAnatomy
                                phase="setup"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                isEnrolled
                                enrollTitle="Ghi danh để luyện hỏi nhanh"
                                enrollCtaLabel="Ghi danh ngay"
                                onEnroll={() => {}}
                                setupLabel="Dựng phiên"
                                setupName="Ôn Docker trước phỏng vấn"
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="Đã luyện thế nào"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Chọn xem thống kê hay lịch sử"
                                progressStats={PROGRESS_STATS}
                                progressSessions={PROGRESS_SESSIONS}
                                activeBackLabel="Thoát"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Chấm điểm"
                                answerNextLabel="Câu tiếp theo"
                                onAnswerNext={() => {}}
                                recapBackLabel="Thoát"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="Bạn nhớ tới đâu"
                            />
                        ),
                    },
                    {
                        name: "progressView = \"history\"",
                        why: "The learner flipped the progress panel to its history half; the setup form beside it does not move or resize, because the switch is a filter on one card, not a navigation away from it.",
                        code: `<QuizScreen
    phase="setup"
    isEnrolled
    progressView="history"
    …
/>`,
                        render: (
                            <QuizScreen
                                phase="setup"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                isEnrolled
                                enrollTitle="Ghi danh để luyện hỏi nhanh"
                                enrollCtaLabel="Ghi danh ngay"
                                onEnroll={() => {}}
                                setupLabel="Dựng phiên"
                                setupName="Ôn Docker trước phỏng vấn"
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="Đã luyện thế nào"
                                progressView="history"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Chọn xem thống kê hay lịch sử"
                                progressStats={PROGRESS_STATS}
                                progressSessions={PROGRESS_SESSIONS}
                                activeBackLabel="Thoát"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Chấm điểm"
                                answerNextLabel="Câu tiếp theo"
                                onAnswerNext={() => {}}
                                recapBackLabel="Thoát"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="Bạn nhớ tới đâu"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — trial, not enrolled ⇒ **loses** the setup form AND the progress panel, replaced by one gate. */
export const SetupTrial: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="QuizScreen"
                tier="screen"
                leaf="Setup — not enrolled"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isEnrolled = false",
                        why: "Two blocks disappear at once — QuizSetup and QuizProgressPanel — and QuizEnrollGate takes their place. There is nothing to preview for someone who has not enrolled: a disabled setup form would show a shape with nothing real in it, so the whole pane becomes one gate with one action.",
                        code: `<QuizScreen
    phase="setup"
    isEnrolled={false}
    enrollTitle="Ghi danh để luyện hỏi nhanh"
    enrollDescription="Trả lời câu hỏi tự luận và được chấm ngay — mở khi bạn ghi danh khoá học."
    enrollCtaLabel="Ghi danh ngay"
    onEnroll={enroll}
    …
/>`,
                        render: (
                            <QuizScreen
                                showAnatomy
                                phase="setup"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                isEnrolled={false}
                                enrollTitle="Ghi danh để luyện hỏi nhanh"
                                enrollDescription="Trả lời câu hỏi tự luận và được chấm ngay — mở khi bạn ghi danh khoá học."
                                enrollCtaLabel="Ghi danh ngay"
                                onEnroll={() => {}}
                                setupLabel="Dựng phiên"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="Đã luyện thế nào"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Chọn xem thống kê hay lịch sử"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Thoát"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Chấm điểm"
                                answerNextLabel="Câu tiếp theo"
                                onAnswerNext={() => {}}
                                recapBackLabel="Thoát"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="Bạn nhớ tới đâu"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; only the two blocks that can mirror themselves do. */
export const SetupLoading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="QuizScreen"
                tier="screen"
                leaf="Setup — loading"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "QuizSetup and QuizProgressPanel mirror their own eventual shape while setup data loads. FlashcardModeSwitch does not shimmer — it is known before any request lands, same reasoning ContentModeNav gives for staying static — so the mode row paints immediately while the two data-backed cards beside it are still loading.",
                        code: `<QuizScreen
    phase="setup"
    isEnrolled
    isSkeleton
    setupName=""
    progressStats={[]}
    progressSessions={[]}
    …
/>`,
                        render: (
                            <QuizScreen
                                showAnatomy
                                phase="setup"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                isEnrolled
                                enrollTitle="Ghi danh để luyện hỏi nhanh"
                                enrollCtaLabel="Ghi danh ngay"
                                onEnroll={() => {}}
                                setupLabel="Dựng phiên"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="Đã luyện thế nào"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Chọn xem thống kê hay lịch sử"
                                progressStats={[]}
                                progressSessions={[]}
                                isSkeleton
                                activeBackLabel="Thoát"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Chấm điểm"
                                answerNextLabel="Câu tiếp theo"
                                onAnswerNext={() => {}}
                                recapBackLabel="Thoát"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="Bạn nhớ tới đâu"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — active: the session band plus one question, the mode switch gone. */
export const Active: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="QuizScreen"
                tier="screen"
                leaf="Active"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "verdict = undefined (chưa chấm)",
                        why: "The learner is on question 3 of 5, still typing — FlashcardModeSwitch is entirely gone (switching mode mid-run would throw the answer away), and the session band's rail shows two graded steps with the third standing taller. This is the shape most of a run looks like.",
                        code: `<QuizScreen
    phase="active"
    activeBackLabel="Thoát"
    onActiveBack={leave}
    activeTitle="Hỏi nhanh"
    activeCounter="Câu 3 / 5"
    activeTimeLeft="2:14"
    activeTotal={5}
    activeCurrent={3}
    activeDoneSteps={[1, 2]}
    activeFinishLabel="Kết thúc"
    onActiveFinish={finish}
    question={question}
    questionLevelLabel="Middle"
    answer={answer}
    onAnswerChange={setAnswer}
    onAnswerSubmit={grade}
    answerSubmitLabel="Chấm điểm"
    answerNextLabel="Câu tiếp theo"
    onAnswerNext={next}
    …
/>`,
                        render: (
                            <QuizScreen
                                showAnatomy
                                phase="active"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                isEnrolled
                                enrollTitle="Ghi danh để luyện hỏi nhanh"
                                enrollCtaLabel="Ghi danh ngay"
                                onEnroll={() => {}}
                                setupLabel="Dựng phiên"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="Đã luyện thế nào"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Chọn xem thống kê hay lịch sử"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Thoát"
                                onActiveBack={() => {}}
                                activeTitle="Hỏi nhanh"
                                activeCounter="Câu 3 / 5"
                                activeTimeLeft="2:14"
                                activeTotal={5}
                                activeCurrent={3}
                                activeDoneSteps={[1, 2]}
                                onActiveStepPress={() => {}}
                                activeFinishLabel="Kết thúc"
                                onActiveFinish={() => {}}
                                question="Vì sao đặt `COPY . .` trước `npm ci` lại làm hỏng cache của Dockerfile?"
                                questionLevelLabel="Middle"
                                answer="Em nghĩ là image nặng hơn."
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Chấm điểm"
                                answerNextLabel="Câu tiếp theo"
                                onAnswerNext={() => {}}
                                recapBackLabel="Thoát"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="Bạn nhớ tới đâu"
                            />
                        ),
                    },
                    {
                        name: "verdict = \"correct\" (đã chấm)",
                        why: "The same question, now graded: the answer field locks read-only rather than clearing (comparing what was typed with what was expected is the whole point, and clearing the field removes that at the exact moment it becomes useful), and the expected answer plus explanation appear below the verdict chip.",
                        code: `<QuizScreen
    phase="active"
    verdict="correct"
    expectedAnswer={expected}
    explanation={why}
    …
/>`,
                        render: (
                            <QuizScreen
                                phase="active"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                isEnrolled
                                enrollTitle="Ghi danh để luyện hỏi nhanh"
                                enrollCtaLabel="Ghi danh ngay"
                                onEnroll={() => {}}
                                setupLabel="Dựng phiên"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="Đã luyện thế nào"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Chọn xem thống kê hay lịch sử"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Thoát"
                                onActiveBack={() => {}}
                                activeTitle="Hỏi nhanh"
                                activeCounter="Câu 2 / 5"
                                activeTimeLeft="1:48"
                                activeTotal={5}
                                activeCurrent={2}
                                activeDoneSteps={[1, 2]}
                                onActiveStepPress={() => {}}
                                activeFinishLabel="Kết thúc"
                                onActiveFinish={() => {}}
                                question="Đặt `COPY . .` trước `npm ci` thì hỏng chuyện gì?"
                                questionLevelLabel="Middle"
                                answer="Vì layer trước vẫn còn file đó, xoá ở sau chỉ là ghi đè thôi."
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                verdict="correct"
                                expectedAnswer="Mọi thay đổi code làm **vỡ cache** của bước cài phụ thuộc, nên lần build nào cũng cài lại từ đầu."
                                explanation="COPY sớm khiến Docker coi bước cài phụ thuộc là đã đổi mỗi lần code đổi, nên nó luôn build lại từ bước đó."
                                answerSubmitLabel="Chấm điểm"
                                answerNextLabel="Câu tiếp theo"
                                onAnswerNext={() => {}}
                                recapBackLabel="Thoát"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="Bạn nhớ tới đâu"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — recap: the session band plus every answered card, self-graded. */
export const Recap: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="QuizScreen"
                tier="screen"
                leaf="Recap"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "recapDoneSteps = [] (chưa tự chấm câu nào)",
                        why: "The run just ended, so the session band's rail carries no filled segments yet — it is now tracking the learner's OWN recall grade for each card, not the run's automatic verdict, which is why it resets even though every card was already answered.",
                        code: `<QuizScreen
    phase="recap"
    recapBackLabel="Thoát"
    onRecapBack={leave}
    recapTitle="Hỏi nhanh"
    recapCounter="Xem lại 2 câu"
    recapTotal={2}
    recapCurrent={2}
    recapDoneSteps={[]}
    recapFinishLabel="Xong"
    onRecapFinish={finish}
    recapCards={cards}
    recapRatingOptions={ratingOptions}
    onRecapRate={rate}
    recapRatingAriaLabel="Bạn nhớ tới đâu"
    …
/>`,
                        render: (
                            <QuizScreen
                                showAnatomy
                                phase="recap"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                isEnrolled
                                enrollTitle="Ghi danh để luyện hỏi nhanh"
                                enrollCtaLabel="Ghi danh ngay"
                                onEnroll={() => {}}
                                setupLabel="Dựng phiên"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="Đã luyện thế nào"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Chọn xem thống kê hay lịch sử"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Thoát"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Chấm điểm"
                                answerNextLabel="Câu tiếp theo"
                                onAnswerNext={() => {}}
                                recapBackLabel="Thoát"
                                onRecapBack={() => {}}
                                recapTitle="Hỏi nhanh"
                                recapCounter="Xem lại 2 câu"
                                recapTotal={2}
                                recapCurrent={2}
                                recapDoneSteps={[]}
                                recapFinishLabel="Xong"
                                onRecapFinish={() => {}}
                                recapCards={RECAP_CARDS}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="Bạn nhớ tới đâu"
                            />
                        ),
                    },
                    {
                        name: "recapDoneSteps = [1, 2] (đã tự chấm hết)",
                        why: "Every card has been self-rated, so the rail is fully filled — the counter line inside QuizRecapList itself switches from what is left to what is done, and nothing in the list locks: someone reading back over a finished recap is allowed to change their mind about a card.",
                        code: `<QuizScreen
    phase="recap"
    recapDoneSteps={[1, 2]}
    recapCards={cards.map((c, i) => ({ ...c, rating: i }))}
    …
/>`,
                        render: (
                            <QuizScreen
                                phase="recap"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Chế độ thẻ ghi nhớ"
                                isEnrolled
                                enrollTitle="Ghi danh để luyện hỏi nhanh"
                                enrollCtaLabel="Ghi danh ngay"
                                onEnroll={() => {}}
                                setupLabel="Dựng phiên"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="Đã luyện thế nào"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Chọn xem thống kê hay lịch sử"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Thoát"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Chấm điểm"
                                answerNextLabel="Câu tiếp theo"
                                onAnswerNext={() => {}}
                                recapBackLabel="Thoát"
                                onRecapBack={() => {}}
                                recapTitle="Hỏi nhanh"
                                recapCounter="Đã tự chấm đủ 2 câu"
                                recapTotal={2}
                                recapCurrent={2}
                                recapDoneSteps={[1, 2]}
                                recapFinishLabel="Xong"
                                onRecapFinish={() => {}}
                                recapCards={RECAP_CARDS.map((card, index) => ({ ...card, rating: index }))}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="Bạn nhớ tới đâu"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
