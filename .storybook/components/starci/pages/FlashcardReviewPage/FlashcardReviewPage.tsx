import React from "react"
import { FlashcardModeSwitch, type FlashcardMode } from "@sb-components/starci/blocks/learn/FlashcardModeSwitch/FlashcardModeSwitch"
import { FlashcardDueHero, type FlashcardDueHeroResume } from "@sb-components/starci/blocks/learn/FlashcardDueHero/FlashcardDueHero"
import { FlashcardMasteryStrip } from "@sb-components/starci/blocks/learn/FlashcardMasteryStrip/FlashcardMasteryStrip"
import { FlashcardDeckList, type FlashcardDeckListDeck, type FlashcardDeckListView } from "@sb-components/starci/blocks/learn/FlashcardDeckList/FlashcardDeckList"
import { WorkSessionHeader } from "@sb-components/starci/blocks/navigation/WorkSessionHeader/WorkSessionHeader"
import { FlashcardStudyCard } from "@sb-components/starci/blocks/learn/FlashcardStudyCard/FlashcardStudyCard"
import { type RatingOption } from "@sb-components/starci/blocks/learn/RatingBar/RatingBar"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `FlashcardReviewPage` — the screen to browse decks and clear today's due
 * queue, one card at a time. A screen owns a list of functions: six blocks —
 * two reused (`FlashcardModeSwitch`, `WorkSessionHeader`), four new — arranged
 * by `phase`. Three leaves matching the `phase` fork plus the overview-only
 * `isSkeleton` prop-flip: `Overview` (resume-in-progress vs plain due queue) ·
 * `OverviewLoading` · `Session` (question vs graded).
 */

/** Which part of the flashcard flow is on screen. */
export type FlashcardReviewPagePhase = "overview" | "session"

/** Props for {@link FlashcardReviewPage}. */
export interface FlashcardReviewPageProps {
    /** Which cluster of blocks is on screen right now. */
    phase: FlashcardReviewPagePhase

    // ── shared: the mode switch, shown for the whole overview phase only ──
    /** Which way to work the deck. */
    flashcardMode: FlashcardMode
    /** Fired with the mode the learner picked. */
    onFlashcardModeChange: (mode: FlashcardMode) => void
    /** Accessible name for the mode row. */
    flashcardModeAriaLabel: string

    // ── overview: the due-today hero ──
    /** Total cards due today across every enrolled course. */
    dueCount: number
    /** Of `dueCount`, cards coming back for another review. */
    dueReviewCount: number
    /** Of `dueCount`, cards being seen for the first time. */
    dueNewCount: number
    /** A due batch the learner started earlier and never finished. Present → the hero becomes a resume card. */
    dueResume?: FlashcardDueHeroResume
    /** Fired when the learner starts a fresh due-review batch. */
    onDueStart: () => void
    /** `true` → the due hero's Start button shows its busy state. */
    isDueStarting?: boolean

    // ── overview: the mastery strip, for whichever deck is currently focused ──
    /** Cards fully mastered in the focused deck. */
    masteryMastered: number
    /** Total cards in the focused deck. */
    masteryTotal: number
    /** Cards still being learned in the focused deck. */
    masteryLearning: number
    /** Cards never reviewed in the focused deck. */
    masteryNewCount: number
    /** Current daily-study streak, in days. Omit → no streak chip. */
    masteryStreak?: number
    /** 30-day retention rate, 0–100. Only shown once `masteryTotalReviewed` clears the 5-review floor. */
    masteryRetention?: number
    /** Lifetime review count for the focused deck. */
    masteryTotalReviewed: number

    // ── overview: the deck picker ──
    /** The current page's decks, in display order. */
    decks: Array<FlashcardDeckListDeck>
    /** Current search text (controlled). */
    deckQuery: string
    /** Fired on every keystroke in the deck search field. */
    onDeckQueryChange: (query: string) => void
    /** Which shape the deck track renders as. */
    deckView: FlashcardDeckListView
    /** Fired with the shape the learner picked. */
    onDeckViewChange: (view: FlashcardDeckListView) => void
    /** 1-based current deck-list page. */
    deckPage: number
    /** Total deck-list page count. */
    deckTotalPages: number
    /** Fired with the 1-based page the learner picked. */
    onDeckPageChange: (page: number) => void
    /** Fired with a deck's id when its tile/row is pressed — this is what advances `phase` to `"session"`. */
    onSelectDeck: (id: string) => void
    /** Overrides the deck tile's default CTA wording. */
    deckCtaLabel?: string
    /** `true` → deck tiles/rows also carry the per-viewer mastery meter. */
    showDeckProgress: boolean

    /**
     * `true` → `FlashcardDueHero`, `FlashcardMasteryStrip` and `FlashcardDeckList`
     * mirror themselves while overview data loads (see the file header for why
     * `WorkSessionHeader` never receives an equivalent flag).
     */
    isSkeleton?: boolean

    // ── session: the session band ──
    /** Back-link label — leave, run stays resumable. */
    sessionBackLabel: string
    /** Fired when the learner leaves the session without ending it (see the file header's confirm-dialog gap). */
    onSessionBack: () => void
    /** Session title, e.g. "Today's review" or the deck's own name. */
    sessionTitle?: string
    /** Where the learner is, already worded by the caller, e.g. "Card 3 / 10". */
    sessionCounter: string
    /** Optional time remaining. Omitted → the session is untimed (the common case for review). */
    sessionTimeLeft?: string
    /** How many cards this session has. */
    sessionTotal: number
    /** Which card is being viewed, 1-based. */
    sessionCurrent: number
    /** Cards already graded, 1-based. */
    sessionDoneSteps?: Array<number>
    /** Fired with a 1-based step when the learner taps the rail. */
    onSessionStepPress?: (step: number) => void
    /** Finish-now label. Present with `onSessionFinish` → the end-now control shows. */
    sessionFinishLabel?: string
    /** Fired when the learner ends the session early and goes back to the overview. */
    onSessionFinish?: () => void

    // ── session: the card itself ──
    /** The question, as authored markdown. */
    cardQuestion: string
    /** Seniority/difficulty this card targets, already localized. */
    cardLevelLabel?: string
    /** Free-form tags on the card. */
    cardTags?: Array<string>
    /** `true` → the answer body (or the lock notice) is shown under the question. */
    cardRevealed: boolean
    /** Fired when the learner asks to see the answer. */
    onCardReveal: () => void
    /** The answer, as authored markdown. Shown only once `cardRevealed` and not `cardIsLocked`. */
    cardAnswer?: string
    /** Optional reasoning under the answer, as authored markdown. */
    cardExplanation?: string
    /** `true` → this card's answer is premium content the learner has not bought. */
    cardIsLocked?: boolean
    /** Fired when the learner takes the way through the lock. */
    onCardUnlock?: () => void
    /** Recall grades offered once the real answer is showing. */
    cardRatingOptions: Array<RatingOption>
    /** Fired with the grade the learner picked. */
    onCardRate: (grade: number) => void
    /** `true` → a grade is in flight. */
    isCardRatingPending?: boolean
    /** `true` → this is the first card of the run. */
    isCardFirst: boolean
    /** `true` → this is the last card of the run. */
    isCardLast: boolean
    /** Fired to step back a card, regardless of whether this one was graded. */
    onCardPrev: () => void
    /** Fired to step forward a card, regardless of whether this one was graded. */
    onCardNext: () => void
    /** `true` → the card draws its own mirror instead of the real content. */
    isSessionSkeleton?: boolean

}

/**
 * The flashcard review screen. See the file header for the phase model and the
 * two GAPs (confirm dialog, dead `FlashcardStudyRail`).
 *
 * @param props - {@link FlashcardReviewPageProps}
 */
const FlashcardReviewPage = ({
    phase,
    flashcardMode,
    onFlashcardModeChange,
    flashcardModeAriaLabel,
    dueCount,
    dueReviewCount,
    dueNewCount,
    dueResume,
    onDueStart,
    isDueStarting,
    masteryMastered,
    masteryTotal,
    masteryLearning,
    masteryNewCount,
    masteryStreak,
    masteryRetention,
    masteryTotalReviewed,
    decks,
    deckQuery,
    onDeckQueryChange,
    deckView,
    onDeckViewChange,
    deckPage,
    deckTotalPages,
    onDeckPageChange,
    onSelectDeck,
    deckCtaLabel,
    showDeckProgress,
    isSkeleton = false,
    sessionBackLabel,
    onSessionBack,
    sessionTitle,
    sessionCounter,
    sessionTimeLeft,
    sessionTotal,
    sessionCurrent,
    sessionDoneSteps,
    onSessionStepPress,
    sessionFinishLabel,
    onSessionFinish,
    cardQuestion,
    cardLevelLabel,
    cardTags,
    cardRevealed,
    onCardReveal,
    cardAnswer,
    cardExplanation,
    cardIsLocked,
    onCardUnlock,
    cardRatingOptions,
    onCardRate,
    isCardRatingPending,
    isCardFirst,
    isCardLast,
    onCardPrev,
    onCardNext,
    isSessionSkeleton = false,
}: FlashcardReviewPageProps) => {
    const reviewBody = (
        <StackV
            gap={7}
            principle="layout-split"
            explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
            isSkeleton={isSkeleton}
            items={[
                ...(phase === "overview"
                    ? [
                        () => (
                            <StackV
                                gap={6}
                                principle="block-boundary"
                                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                isSkeleton={isSkeleton}
                                items={[
                                    () => (
                                        <FlashcardModeSwitch

                                            mode={flashcardMode}
                                            onModeChange={onFlashcardModeChange}
                                            ariaLabel={flashcardModeAriaLabel}

                                        />
                                    ),
                                    () => (
                                        <StackV
                                            gap={4}
                                            isSkeleton={isSkeleton}
                                            items={[
                                                () => (
                                                    <FlashcardDueHero

                                                        dueCount={dueCount}
                                                        dueReviewCount={dueReviewCount}
                                                        newCount={dueNewCount}
                                                        resume={dueResume}
                                                        onStart={onDueStart}
                                                        isStarting={isDueStarting}
                                                        isSkeleton={isSkeleton}

                                                    />
                                                ),
                                                () => (
                                                    <FlashcardMasteryStrip

                                                        mastered={masteryMastered}
                                                        total={masteryTotal}
                                                        learning={masteryLearning}
                                                        newCount={masteryNewCount}
                                                        streak={masteryStreak}
                                                        retention={masteryRetention}
                                                        totalReviewed={masteryTotalReviewed}
                                                        isSkeleton={isSkeleton}

                                                    />
                                                ),
                                                () => (
                                                    <FlashcardDeckList

                                                        decks={decks}
                                                        query={deckQuery}
                                                        onQueryChange={onDeckQueryChange}
                                                        view={deckView}
                                                        onViewChange={onDeckViewChange}
                                                        page={deckPage}
                                                        totalPages={deckTotalPages}
                                                        onPageChange={onDeckPageChange}
                                                        onSelectDeck={onSelectDeck}
                                                        ctaLabel={deckCtaLabel}
                                                        showProgress={showDeckProgress}
                                                        isSkeleton={isSkeleton}

                                                    />
                                                ),
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]
                    : []),
                ...(phase === "session"
                    ? [
                        () => (
                            <StackV
                                gap={6}
                                principle="block-boundary"
                                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                isSkeleton={isSessionSkeleton}
                                items={[
                                    () => (
                                        <WorkSessionHeader

                                            backLabel={sessionBackLabel}
                                            onBack={onSessionBack}
                                            title={sessionTitle}
                                            counter={sessionCounter}
                                            timeLeft={sessionTimeLeft}
                                            total={sessionTotal}
                                            current={sessionCurrent}
                                            doneSteps={sessionDoneSteps}
                                            onStepPress={onSessionStepPress}
                                            finishLabel={sessionFinishLabel}
                                            onFinish={onSessionFinish}

                                        />
                                    ),
                                    () => (
                                        <FlashcardStudyCard

                                            question={cardQuestion}
                                            levelLabel={cardLevelLabel}
                                            tags={cardTags}
                                            revealed={cardRevealed}
                                            onReveal={onCardReveal}
                                            answer={cardAnswer}
                                            explanation={cardExplanation}
                                            isLocked={cardIsLocked}
                                            onUnlock={onCardUnlock}
                                            ratingOptions={cardRatingOptions}
                                            onRate={onCardRate}
                                            isRatingPending={isCardRatingPending}
                                            isFirst={isCardFirst}
                                            isLast={isCardLast}
                                            onPrev={onCardPrev}
                                            onNext={onCardNext}
                                            isSkeleton={isSessionSkeleton}

                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]
                    : []),
            ]}
        />
    )

    return (
        <Container
            size="md"
            padding={6}
            principle="page-pad"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface."
            body={() => reviewBody}
        />
    )
}

export { FlashcardReviewPage }
