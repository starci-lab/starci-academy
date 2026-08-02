import React from "react"
import { FlashcardModeSwitch, type FlashcardMode } from "@sb-components/starci/blocks/learn/FlashcardModeSwitch/FlashcardModeSwitch"
import { QuizEnrollGate } from "@sb-components/starci/blocks/learn/QuizEnrollGate/QuizEnrollGate"
import { QuizSetup, type QuizLength, type QuizLevel, type QuizResumable } from "@sb-components/starci/blocks/learn/QuizSetup/QuizSetup"
import { QuizProgressPanel, type QuizProgressView, type QuizProgressStat, type QuizProgressSession } from "@sb-components/starci/blocks/learn/QuizProgressPanel/QuizProgressPanel"
import { QuizQuestion, type QuizVerdict } from "@sb-components/starci/blocks/learn/QuizQuestion/QuizQuestion"
import { QuizRecapList, type QuizRecapCard } from "@sb-components/starci/blocks/learn/QuizRecapList/QuizRecapList"
import { WorkSessionHeader } from "@sb-components/starci/blocks/navigation/WorkSessionHeader/WorkSessionHeader"
import { type RatingOption } from "@sb-components/starci/blocks/learn/RatingBar/RatingBar"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `QuizPage` — the screen for drilling against written questions one run at a time:
 * set the run up, work through it, then look back over every card. It composes blocks
 * in frames and hands each typed data, drawing no shape of its own.
 *
 * Three phases, never two at once: `setup` (a mode switch plus either `QuizEnrollGate`
 * when not enrolled, or `QuizSetup` + `QuizProgressPanel` when enrolled), `active`
 * (answer one question at a time), `recap` (self-grade the whole run).
 * `WorkSessionHeader` is shared between `active` and `recap` with its own data each
 * time; the mode switch is absent once a run starts. `isSkeleton` reaches only
 * `QuizSetup`, `QuizProgressPanel`, and `QuizQuestion`.
 */

/** Which part of a drill the learner is in. */
export type QuizPagePhase = "setup" | "active" | "recap"

/** Props for {@link QuizPage}. */
export interface QuizPageProps {
    /** Which cluster of blocks is on screen right now. */
    phase: QuizPagePhase

    // ── setup: mode switch (study cards vs. drill), shown for the whole setup phase ──
    /** Which way to work the deck. */
    flashcardMode: FlashcardMode
    /** Fired with the mode the learner picked. */
    onFlashcardModeChange: (mode: FlashcardMode) => void
    /** Accessible name for the mode row. */
    flashcardModeAriaLabel: string

    // ── setup: the structural fork — enrolled or not ──
    /** `false` → the setup form and progress panel are replaced by one enroll gate. */
    isEnrolled: boolean
    /** Enroll-gate headline, shown only when `isEnrolled` is `false`. */
    enrollTitle: string
    /** Enroll-gate description. */
    enrollDescription?: string
    /** Enroll-gate action label. */
    enrollCtaLabel: string
    /** Fired when the learner enrolls from the gate. */
    onEnroll: () => void

    // ── setup: the drill setup form, shown only once enrolled ──
    /** Section label above the setup card. */
    setupLabel: string
    /** Current run name. */
    setupName: string
    /** Fired as the learner types a run name. */
    onSetupNameChange: (value: string) => void
    /** Chosen run length. */
    setupLength: QuizLength
    /** Fired when the learner picks a length. */
    onSetupLengthChange: (length: QuizLength) => void
    /** Chosen seniority. */
    setupLevel: QuizLevel
    /** Fired when the learner picks a seniority. */
    onSetupLevelChange: (level: QuizLevel) => void
    /** Fired when the learner starts a new run. */
    onSetupStart: () => void
    /** A run the learner left unfinished. Present → the resume strip leads the setup card. */
    setupResumable?: QuizResumable
    /** `true` → the draw is in flight. */
    isSetupPending?: boolean
    /** Set → the draw failed. */
    setupErrorMessage?: string

    // ── setup: the progress panel, shown only once enrolled ──
    /** Section label above the progress card. */
    progressLabel: string
    /** Which half of the panel is showing — lifetime stats or run history. */
    progressView: QuizProgressView
    /** Fired with the view the learner picked. */
    onProgressViewChange: (view: QuizProgressView) => void
    /** Accessible name for the stats/history switch. */
    progressViewAriaLabel: string
    /** Lifetime numbers for the stats view. */
    progressStats: Array<QuizProgressStat>
    /** Past runs for the history view, most recent first. */
    progressSessions: Array<QuizProgressSession>

    /**
     * `true` → `QuizSetup` and `QuizProgressPanel` mirror themselves while setup
     * data loads (see the file header for why the flag stops there).
     */
    isSkeleton?: boolean

    // ── active: the session band ──
    /** Back-link label — leave, run stays resumable. */
    activeBackLabel: string
    /** Fired when the learner leaves without ending the run. */
    onActiveBack: () => void
    /** Session title, e.g. "Quick quiz". */
    activeTitle?: string
    /** Where the learner is, already worded — e.g. "Question 3 / 10". */
    activeCounter: string
    /** Time remaining, e.g. "2:14". Omitted → the run is untimed. */
    activeTimeLeft?: string
    /** How many questions this run has. */
    activeTotal: number
    /** Which question is being viewed, 1-based. */
    activeCurrent: number
    /** Questions already graded, 1-based. */
    activeDoneSteps?: Array<number>
    /** Fired with a 1-based step when the learner taps the rail. */
    onActiveStepPress?: (step: number) => void
    /** Finish-now label. Present with `onActiveFinish` → the end-now control shows. */
    activeFinishLabel?: string
    /** Fired when the learner ends the run early and goes to the results. */
    onActiveFinish?: () => void

    // ── active: the question itself ──
    /** The question, as authored markdown. */
    question: string
    /** Seniority this question aims at, already localized. */
    questionLevelLabel?: string
    /** What the learner has typed. */
    answer: string
    /** Fired as the learner types. Ignored once graded. */
    onAnswerChange: (value: string) => void
    /** Fired when the learner submits for grading. */
    onAnswerSubmit: () => void
    /** Set → the answer has been judged. */
    verdict?: QuizVerdict
    /** The expected answer, as markdown. Shown only after grading. */
    expectedAnswer?: string
    /** Why the answer was judged that way, as markdown. Shown only after grading. */
    explanation?: string
    /** Submit-control label. */
    answerSubmitLabel: string
    /** Move-on control label, shown after grading. */
    answerNextLabel: string
    /** Fired when the learner moves to the next question. */
    onAnswerNext: () => void
    /** `true` → grading is in flight. */
    isAnswerPending?: boolean

    // ── recap: the session band, same shape as `active`'s but its own data ──
    /** Back-link label for the recap session band. */
    recapBackLabel: string
    /** Fired when the learner leaves the recap. */
    onRecapBack: () => void
    /** Recap session title. */
    recapTitle?: string
    /** Where the learner is in the recap, already worded. */
    recapCounter: string
    /** How many cards the recap has. */
    recapTotal: number
    /** Which card is being viewed, 1-based. */
    recapCurrent: number
    /** Cards already self-rated, 1-based. */
    recapDoneSteps?: Array<number>
    /** Finish label for the recap band. Present with `onRecapFinish` → the control shows. */
    recapFinishLabel?: string
    /** Fired when the learner ends the recap. */
    onRecapFinish?: () => void

    // ── recap: the answered cards ──
    /** The answered cards, in the order they were asked. */
    recapCards: Array<QuizRecapCard>
    /** Recall grades offered per card. */
    recapRatingOptions: Array<RatingOption>
    /** Fired with the card key and the grade the learner picked. */
    onRecapRate: (cardKey: string, grade: number) => void
    /** Accessible name for each card's rating group. */
    recapRatingAriaLabel: string

}

/**
 * The quiz screen. See the file header for the phase model and the two GAPs.
 *
 * @param props - {@link QuizPageProps}
 */
const QuizPage = ({
    phase,
    flashcardMode,
    onFlashcardModeChange,
    flashcardModeAriaLabel,
    isEnrolled,
    enrollTitle,
    enrollDescription,
    enrollCtaLabel,
    onEnroll,
    setupLabel,
    setupName,
    onSetupNameChange,
    setupLength,
    onSetupLengthChange,
    setupLevel,
    onSetupLevelChange,
    onSetupStart,
    setupResumable,
    isSetupPending,
    setupErrorMessage,
    progressLabel,
    progressView,
    onProgressViewChange,
    progressViewAriaLabel,
    progressStats,
    progressSessions,
    isSkeleton = false,
    activeBackLabel,
    onActiveBack,
    activeTitle,
    activeCounter,
    activeTimeLeft,
    activeTotal,
    activeCurrent,
    activeDoneSteps,
    onActiveStepPress,
    activeFinishLabel,
    onActiveFinish,
    question,
    questionLevelLabel,
    answer,
    onAnswerChange,
    onAnswerSubmit,
    verdict,
    expectedAnswer,
    explanation,
    answerSubmitLabel,
    answerNextLabel,
    onAnswerNext,
    isAnswerPending,
    recapBackLabel,
    onRecapBack,
    recapTitle,
    recapCounter,
    recapTotal,
    recapCurrent,
    recapDoneSteps,
    recapFinishLabel,
    onRecapFinish,
    recapCards,
    recapRatingOptions,
    onRecapRate,
    recapRatingAriaLabel,
}: QuizPageProps) => {
    const setupSection = (
        <>
            <FlashcardModeSwitch

                mode={flashcardMode}
                onModeChange={onFlashcardModeChange}
                ariaLabel={flashcardModeAriaLabel}

            />
            {!isEnrolled ? (
                <QuizEnrollGate

                    title={enrollTitle}
                    description={enrollDescription}
                    ctaLabel={enrollCtaLabel}
                    onEnroll={onEnroll}

                />
            ) : (
                <>
                    <QuizSetup

                        label={setupLabel}
                        name={setupName}
                        onNameChange={onSetupNameChange}
                        length={setupLength}
                        onLengthChange={onSetupLengthChange}
                        level={setupLevel}
                        onLevelChange={onSetupLevelChange}
                        onStart={onSetupStart}
                        resumable={setupResumable}
                        isPending={isSetupPending}
                        errorMessage={setupErrorMessage}
                        isSkeleton={isSkeleton}

                    />
                    <QuizProgressPanel

                        label={progressLabel}
                        view={progressView}
                        onViewChange={onProgressViewChange}
                        viewAriaLabel={progressViewAriaLabel}
                        stats={progressStats}
                        sessions={progressSessions}
                        isSkeleton={isSkeleton}

                    />
                </>
            )}
        </>
    )

    const activeSection = (
        <>
            <WorkSessionHeader

                backLabel={activeBackLabel}
                onBack={onActiveBack}
                title={activeTitle}
                counter={activeCounter}
                timeLeft={activeTimeLeft}
                total={activeTotal}
                current={activeCurrent}
                doneSteps={activeDoneSteps}
                onStepPress={onActiveStepPress}
                finishLabel={activeFinishLabel}
                onFinish={onActiveFinish}

            />
            <QuizQuestion

                question={question}
                levelLabel={questionLevelLabel}
                answer={answer}
                onAnswerChange={onAnswerChange}
                onSubmit={onAnswerSubmit}
                verdict={verdict}
                expectedAnswer={expectedAnswer}
                explanation={explanation}
                submitLabel={answerSubmitLabel}
                nextLabel={answerNextLabel}
                onNext={onAnswerNext}
                isPending={isAnswerPending}
                isSkeleton={isSkeleton}

            />
        </>
    )

    const recapSection = (
        <>
            <WorkSessionHeader

                backLabel={recapBackLabel}
                onBack={onRecapBack}
                title={recapTitle}
                counter={recapCounter}
                total={recapTotal}
                current={recapCurrent}
                doneSteps={recapDoneSteps}
                finishLabel={recapFinishLabel}
                onFinish={onRecapFinish}

            />
            <QuizRecapList

                cards={recapCards}
                ratingOptions={recapRatingOptions}
                onRate={onRecapRate}
                ratingAriaLabel={recapRatingAriaLabel}

            />
        </>
    )

    const quizPhases = (
        <>
            {phase === "setup" ? (
                <StackV gap={6} body={setupSection} />
            ) : null}

            {phase === "active" ? (
                <StackV gap={6} body={activeSection} />
            ) : null}

            {phase === "recap" ? (
                <StackV gap={6} body={recapSection} />
            ) : null}
        </>
    )

    const quizBody = <StackV gap={7} body={quizPhases} />

    return <Container size="md" padding={6} body={quizBody} />
}

export { QuizPage }
