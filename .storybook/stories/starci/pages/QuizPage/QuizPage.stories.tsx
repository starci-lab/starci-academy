import type { Meta, StoryObj } from "@storybook/nextjs"
import { CardsIcon, FlameIcon, TargetIcon, TrophyIcon } from "@phosphor-icons/react"
import { QuizPage } from "@sb-components/starci/pages/QuizPage/QuizPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `QuizPage` — the screen to drill yourself against written questions, one run
 * at a time: set the run up, work through it, then look back over every card. A
 * screen owns a list of functions: eight blocks — seven reused, one new
 * (`QuizProgressPanel`) — arranged by `phase`. Five leaves matching the two
 * structural forks (`isEnrolled`, `phase`) plus the setup-only `isSkeleton`
 * prop-flip: `SetupEnrolled` · `SetupTrial` (enroll gate replaces
 * setup+progress) · `SetupLoading` · `Active` · `Recap`.
 */
const meta: Meta<typeof QuizPage> = {
    title: "StarCi/Pages/QuizPage/QuizPage",
    component: QuizPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QuizPage>

// Reused verbatim from `QuizProgressPanel`'s own story so the two trees agree on
// what "this learner's history" looks like.
const PROGRESS_STATS = [
    { key: "accuracy", icon: TargetIcon, label: "Accuracy", value: "82%" },
    { key: "streak", icon: FlameIcon, label: "Day streak", value: "7 days" },
    { key: "total", icon: CardsIcon, label: "Total answered", value: "126" },
    { key: "avgScore", icon: TrophyIcon, label: "Average score", value: "7.4/10" },
]

const PROGRESS_SESSIONS = [
    { key: "run3", name: "Docker review before interview", dateLabel: "Yesterday", scoreLabel: "8/10 correct", onPress: () => {} },
    { key: "run2", name: "Quick CI/CD drill", dateLabel: "3 days ago", scoreLabel: "6/10 correct", onPress: () => {} },
    { key: "run1", name: "Kubernetes review", dateLabel: "Last week", scoreLabel: "9/10 correct", onPress: () => {} },
]

// Reused verbatim from `QuizRecapList`'s own story, same reasoning.
const RECAP_RATING_OPTIONS = [
    { grade: 0, label: "Forgot", hint: "See it again today" },
    { grade: 1, label: "Hard", hint: "See it again in 1 day" },
    { grade: 2, label: "Good", hint: "See it again in 4 days" },
    { grade: 3, label: "Easy", hint: "See it again in 10 days" },
]

const RECAP_CARDS = [
    {
        key: "layer",
        question: "Why doesn't deleting a file in a later layer shrink the image?",
        expectedAnswer: "Layers are **additive**: a later layer only overwrites, the space already claimed in an earlier layer still stays in the image.",
        givenAnswer: "Because the earlier layer still has the file — deleting it later is just an overwrite.",
        wasCorrect: true,
    },
    {
        key: "cache",
        question: "What breaks if you put `COPY . .` before `npm ci`?",
        expectedAnswer: "Any code change **busts the cache** of the dependency-install step, so every build reinstalls from scratch.",
        givenAnswer: "I think it makes the image heavier.",
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
    // carry they simply have no Deps link to point at.
}

/** LEAF — enrolled: the setup form and the progress panel side by side. */
export const SetupEnrolled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizPage"
                tier="screen"
                leaf="Setup — enrolled"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "progressView = \"stats\"",
                        why: "An enrolled learner sees three blocks: the mode switch, the setup form to start the next run, and the progress panel open on lifetime numbers. This is the shape the setup phase opens to — everything needed to look back AND start again, without a run in progress yet.",
                        code: `<QuizPage
    phase="setup"
    flashcardMode="quiz"
    onFlashcardModeChange={setMode}
    flashcardModeAriaLabel="Flashcard mode"
    isEnrolled
    setupLabel="Set up session"
    setupName={name}
    onSetupNameChange={setName}
    setupLength="quick"
    onSetupLengthChange={setLength}
    setupLevel="middle"
    onSetupLevelChange={setLevel}
    onSetupStart={start}
    progressLabel="How you've been doing"
    progressView="stats"
    onProgressViewChange={setView}
    progressViewAriaLabel="Choose stats or history view"
    progressStats={stats}
    progressSessions={sessions}
    …
/>`,
                        render: (
                            <QuizPage
                               
                                phase="setup"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Flashcard mode"
                                isEnrolled
                                enrollTitle="Enroll to practice quick quizzes"
                                enrollCtaLabel="Enroll now"
                                onEnroll={() => {}}
                                setupLabel="Set up session"
                                setupName="Docker review before interview"
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="How you've been doing"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Choose stats or history view"
                                progressStats={PROGRESS_STATS}
                                progressSessions={PROGRESS_SESSIONS}
                                activeBackLabel="Exit"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Grade"
                                answerNextLabel="Next question"
                                onAnswerNext={() => {}}
                                recapBackLabel="Exit"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="How well do you remember this"
                            />
                        ),
                    },
                    {
                        name: "progressView = \"history\"",
                        why: "The learner flipped the progress panel to its history half; the setup form beside it does not move or resize, because the switch is a filter on one card, not a navigation away from it.",
                        code: `<QuizPage
    phase="setup"
    isEnrolled
    progressView="history"
    …
/>`,
                        render: (
                            <QuizPage
                                phase="setup"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Flashcard mode"
                                isEnrolled
                                enrollTitle="Enroll to practice quick quizzes"
                                enrollCtaLabel="Enroll now"
                                onEnroll={() => {}}
                                setupLabel="Set up session"
                                setupName="Docker review before interview"
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="How you've been doing"
                                progressView="history"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Choose stats or history view"
                                progressStats={PROGRESS_STATS}
                                progressSessions={PROGRESS_SESSIONS}
                                activeBackLabel="Exit"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Grade"
                                answerNextLabel="Next question"
                                onAnswerNext={() => {}}
                                recapBackLabel="Exit"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="How well do you remember this"
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizPage"
                tier="screen"
                leaf="Setup — not enrolled"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isEnrolled = false",
                        why: "Two blocks disappear at once — QuizSetup and QuizProgressPanel — and QuizEnrollGate takes their place. There is nothing to preview for someone who has not enrolled: a disabled setup form would show a shape with nothing real in it, so the whole pane becomes one gate with one action.",
                        code: `<QuizPage
    phase="setup"
    isEnrolled={false}
    enrollTitle="Enroll to practice quick quizzes"
    enrollDescription="Answer free-response questions and get graded instantly — unlocked once you enroll in the course."
    enrollCtaLabel="Enroll now"
    onEnroll={enroll}
    …
/>`,
                        render: (
                            <QuizPage
                               
                                phase="setup"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Flashcard mode"
                                isEnrolled={false}
                                enrollTitle="Enroll to practice quick quizzes"
                                enrollDescription="Answer free-response questions and get graded instantly — unlocked once you enroll in the course."
                                enrollCtaLabel="Enroll now"
                                onEnroll={() => {}}
                                setupLabel="Set up session"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="How you've been doing"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Choose stats or history view"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Exit"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Grade"
                                answerNextLabel="Next question"
                                onAnswerNext={() => {}}
                                recapBackLabel="Exit"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="How well do you remember this"
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizPage"
                tier="screen"
                leaf="Setup — loading"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "QuizSetup and QuizProgressPanel mirror their own eventual shape while setup data loads. FlashcardModeSwitch does not shimmer — it is known before any request lands, same reasoning ContentModeNav gives for staying static — so the mode row paints immediately while the two data-backed cards beside it are still loading.",
                        code: `<QuizPage
    phase="setup"
    isEnrolled
    isSkeleton
    setupName=""
    progressStats={[]}
    progressSessions={[]}
    …
/>`,
                        render: (
                            <QuizPage
                               
                                phase="setup"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Flashcard mode"
                                isEnrolled
                                enrollTitle="Enroll to practice quick quizzes"
                                enrollCtaLabel="Enroll now"
                                onEnroll={() => {}}
                                setupLabel="Set up session"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="How you've been doing"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Choose stats or history view"
                                progressStats={[]}
                                progressSessions={[]}
                                isSkeleton
                                activeBackLabel="Exit"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Grade"
                                answerNextLabel="Next question"
                                onAnswerNext={() => {}}
                                recapBackLabel="Exit"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="How well do you remember this"
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizPage"
                tier="screen"
                leaf="Active"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "verdict = undefined (not graded yet)",
                        why: "The learner is on question 3 of 5, still typing — FlashcardModeSwitch is entirely gone (switching mode mid-run would throw the answer away), and the session band's rail shows two graded steps with the third standing taller. This is the shape most of a run looks like.",
                        code: `<QuizPage
    phase="active"
    activeBackLabel="Exit"
    onActiveBack={leave}
    activeTitle="Quick quiz"
    activeCounter="Question 3 / 5"
    activeTimeLeft="2:14"
    activeTotal={5}
    activeCurrent={3}
    activeDoneSteps={[1, 2]}
    activeFinishLabel="Finish"
    onActiveFinish={finish}
    question={question}
    questionLevelLabel="Middle"
    answer={answer}
    onAnswerChange={setAnswer}
    onAnswerSubmit={grade}
    answerSubmitLabel="Grade"
    answerNextLabel="Next question"
    onAnswerNext={next}
    …
/>`,
                        render: (
                            <QuizPage
                               
                                phase="active"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Flashcard mode"
                                isEnrolled
                                enrollTitle="Enroll to practice quick quizzes"
                                enrollCtaLabel="Enroll now"
                                onEnroll={() => {}}
                                setupLabel="Set up session"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="How you've been doing"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Choose stats or history view"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Exit"
                                onActiveBack={() => {}}
                                activeTitle="Quick quiz"
                                activeCounter="Question 3 / 5"
                                activeTimeLeft="2:14"
                                activeTotal={5}
                                activeCurrent={3}
                                activeDoneSteps={[1, 2]}
                                onActiveStepPress={() => {}}
                                activeFinishLabel="Finish"
                                onActiveFinish={() => {}}
                                question="Why does putting `COPY . .` before `npm ci` break the Dockerfile's cache?"
                                questionLevelLabel="Middle"
                                answer="I think it makes the image heavier."
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Grade"
                                answerNextLabel="Next question"
                                onAnswerNext={() => {}}
                                recapBackLabel="Exit"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="How well do you remember this"
                            />
                        ),
                    },
                    {
                        name: "verdict = \"correct\" (graded)",
                        why: "The same question, now graded: the answer field locks read-only rather than clearing (comparing what was typed with what was expected is the whole point, and clearing the field removes that at the exact moment it becomes useful), and the expected answer plus explanation appear below the verdict chip.",
                        code: `<QuizPage
    phase="active"
    verdict="correct"
    expectedAnswer={expected}
    explanation={why}
    …
/>`,
                        render: (
                            <QuizPage
                                phase="active"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Flashcard mode"
                                isEnrolled
                                enrollTitle="Enroll to practice quick quizzes"
                                enrollCtaLabel="Enroll now"
                                onEnroll={() => {}}
                                setupLabel="Set up session"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="How you've been doing"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Choose stats or history view"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Exit"
                                onActiveBack={() => {}}
                                activeTitle="Quick quiz"
                                activeCounter="Question 2 / 5"
                                activeTimeLeft="1:48"
                                activeTotal={5}
                                activeCurrent={2}
                                activeDoneSteps={[1, 2]}
                                onActiveStepPress={() => {}}
                                activeFinishLabel="Finish"
                                onActiveFinish={() => {}}
                                question="What breaks if you put `COPY . .` before `npm ci`?"
                                questionLevelLabel="Middle"
                                answer="Because the earlier layer still has the file — deleting it later is just an overwrite."
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                verdict="correct"
                                expectedAnswer="Any code change **busts the cache** of the dependency-install step, so every build reinstalls from scratch."
                                explanation="Copying early makes Docker treat the dependency-install step as changed every time the code changes, so it always rebuilds from that step onward."
                                answerSubmitLabel="Grade"
                                answerNextLabel="Next question"
                                onAnswerNext={() => {}}
                                recapBackLabel="Exit"
                                onRecapBack={() => {}}
                                recapCounter=""
                                recapTotal={0}
                                recapCurrent={0}
                                recapCards={[]}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="How well do you remember this"
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizPage"
                tier="screen"
                leaf="Recap"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "recapDoneSteps = [] (no self-grading yet)",
                        why: "The run just ended, so the session band's rail carries no filled segments yet — it is now tracking the learner's OWN recall grade for each card, not the run's automatic verdict, which is why it resets even though every card was already answered.",
                        code: `<QuizPage
    phase="recap"
    recapBackLabel="Exit"
    onRecapBack={leave}
    recapTitle="Quick quiz"
    recapCounter="Review 2 questions"
    recapTotal={2}
    recapCurrent={2}
    recapDoneSteps={[]}
    recapFinishLabel="Done"
    onRecapFinish={finish}
    recapCards={cards}
    recapRatingOptions={ratingOptions}
    onRecapRate={rate}
    recapRatingAriaLabel="How well do you remember this"
    …
/>`,
                        render: (
                            <QuizPage
                               
                                phase="recap"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Flashcard mode"
                                isEnrolled
                                enrollTitle="Enroll to practice quick quizzes"
                                enrollCtaLabel="Enroll now"
                                onEnroll={() => {}}
                                setupLabel="Set up session"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="How you've been doing"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Choose stats or history view"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Exit"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Grade"
                                answerNextLabel="Next question"
                                onAnswerNext={() => {}}
                                recapBackLabel="Exit"
                                onRecapBack={() => {}}
                                recapTitle="Quick quiz"
                                recapCounter="Review 2 questions"
                                recapTotal={2}
                                recapCurrent={2}
                                recapDoneSteps={[]}
                                recapFinishLabel="Done"
                                onRecapFinish={() => {}}
                                recapCards={RECAP_CARDS}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="How well do you remember this"
                            />
                        ),
                    },
                    {
                        name: "recapDoneSteps = [1, 2] (all self-graded)",
                        why: "Every card has been self-rated, so the rail is fully filled — the counter line inside QuizRecapList itself switches from what is left to what is done, and nothing in the list locks: someone reading back over a finished recap is allowed to change their mind about a card.",
                        code: `<QuizPage
    phase="recap"
    recapDoneSteps={[1, 2]}
    recapCards={cards.map((c, i) => ({ ...c, rating: i }))}
    …
/>`,
                        render: (
                            <QuizPage
                                phase="recap"
                                flashcardMode="quiz"
                                onFlashcardModeChange={() => {}}
                                flashcardModeAriaLabel="Flashcard mode"
                                isEnrolled
                                enrollTitle="Enroll to practice quick quizzes"
                                enrollCtaLabel="Enroll now"
                                onEnroll={() => {}}
                                setupLabel="Set up session"
                                setupName=""
                                onSetupNameChange={() => {}}
                                setupLength="quick"
                                onSetupLengthChange={() => {}}
                                setupLevel="middle"
                                onSetupLevelChange={() => {}}
                                onSetupStart={() => {}}
                                progressLabel="How you've been doing"
                                progressView="stats"
                                onProgressViewChange={() => {}}
                                progressViewAriaLabel="Choose stats or history view"
                                progressStats={[]}
                                progressSessions={[]}
                                activeBackLabel="Exit"
                                onActiveBack={() => {}}
                                activeCounter=""
                                activeTotal={0}
                                activeCurrent={0}
                                question=""
                                answer=""
                                onAnswerChange={() => {}}
                                onAnswerSubmit={() => {}}
                                answerSubmitLabel="Grade"
                                answerNextLabel="Next question"
                                onAnswerNext={() => {}}
                                recapBackLabel="Exit"
                                onRecapBack={() => {}}
                                recapTitle="Quick quiz"
                                recapCounter="Self-graded all 2 questions"
                                recapTotal={2}
                                recapCurrent={2}
                                recapDoneSteps={[1, 2]}
                                recapFinishLabel="Done"
                                onRecapFinish={() => {}}
                                recapCards={RECAP_CARDS.map((card, index) => ({ ...card, rating: index }))}
                                recapRatingOptions={RECAP_RATING_OPTIONS}
                                onRecapRate={() => {}}
                                recapRatingAriaLabel="How well do you remember this"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
