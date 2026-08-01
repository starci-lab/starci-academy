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
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `QuizPage`: drill yourself against written questions, one run at a
 * time. Set the run up, work through it, then look back over every card.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. Every node below is one of the
 * EIGHT blocks the catalog already had (seven reused, one new — `QuizProgressPanel`) —
 * this file draws no shape of its own.
 *
 * ⭐ THREE PHASES, ONE SCREEN, NEVER TWO AT ONCE. `phase` decides which cluster of
 * blocks is on screen — `setup` (choose + look back), `active` (answer one
 * question at a time), `recap` (self-grade the whole run). The phases don't
 * overlay each other: `FlashcardModeSwitch` belongs to `setup` alone and is gone
 * the moment a run starts, same reasoning `ContentModeNav`'s file header gives for
 * disappearing rather than disabling — a disabled mode row still says "you could
 * switch", and mid-run that would be a lie.
 *
 * ⭐ SETUP HAS ITS OWN STRUCTURAL FORK. A learner who has not enrolled sees
 * `FlashcardModeSwitch` + `QuizEnrollGate` and NOTHING else — no setup form, no
 * progress panel, because there is nothing to preview (see `QuizEnrollGate`'s own
 * header). An enrolled learner sees `FlashcardModeSwitch` + `QuizSetup` +
 * `QuizProgressPanel` side by side: `QuizSetup` starts the next run,
 * `QuizProgressPanel` looks back at every run before it.
 *
 * ⭐ `WorkSessionHeader` IS SHARED BETWEEN `active` AND `recap`, WITH DIFFERENT
 * DATA. Both phases are "inside a session" in the sense the header cares about —
 * a way out, a position, a rail — so the same block is called twice rather than
 * invented twice. The screen hands each phase its OWN counter/total/current, it
 * does not try to make one session band serve both at once.
 *
 * ⛔ NO BREADCRUMB / "WHERE AM I" ROW (§B3 SCOPE). The planner's tree asked for
 * one; no block in the catalog draws it (the one candidate, `QuizBrief`, does not
 * exist), and inventing a ninth block to fill one row is exactly the reach the
 * corrected `ContentModeNav` warns against. Left as a marked gap rather than a
 * bare `div` standing in for it.
 *
 * ⛔ NO "LEVEL RAN OUT OF QUESTIONS" LEAF EITHER, for the same reason. The
 * planner's tree wanted the screen to swap `QuizQuestion` for a raw
 * `EmptyState` composite mid-`active`-phase — but §0's import boundary is
 * exact: a screen calls blocks and frames, never a composite directly (the one
 * documented exception, `CourseContents`'s `AsyncContentEmpty`, replaces the
 * ENTIRE screen, not one phase's one node). There is no block in today's catalog
 * that wraps that state for a mid-session swap, so building it here would mean
 * either breaking the import boundary or inventing a ninth block outside this
 * run's actual scope (the task's own tally stops at eight). Left as a marked gap;
 * a stub that renders is worse than an absence that does not (§B3).
 *
 * ⛔ `isSkeleton` REACHES ONLY THE BLOCKS THAT CAN MIRROR THEMSELVES —
 * `QuizSetup`, `QuizProgressPanel`, `QuizQuestion`. `FlashcardModeSwitch`,
 * `QuizEnrollGate`, `WorkSessionHeader` and `QuizRecapList` carry no such prop by
 * design (their own file headers say why: chrome known ahead of any request, or a
 * gate/recap with nothing to preview before its data exists), so the flag is not
 * threaded to them.
 * ─────────────────────────────────────────────────────────────────────────────
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

    /** When on, every composed block emits `data-anat-part` for a BlockAnatomy panel. */
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
