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
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `FlashcardReviewPage`: browse decks and clear today's due queue, one
 * card at a time. Two phases, `overview` (pick what to study) and `session` (work
 * through one deck or the due queue) — never both on screen together.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. Every node below is one of the
 * SIX blocks the catalog already had (two reused — `FlashcardModeSwitch`,
 * `WorkSessionHeader` — four new this run) — this file draws no shape of its own,
 * following `QuizPage`'s own precedent exactly (same phase-cluster pattern,
 * same session band reused across phases with its own data each time).
 *
 * ⭐ `overview` HAS THREE BLOCKS, NOT ONE, AND THEY ANSWER DIFFERENT QUESTIONS.
 * `FlashcardDueHero` answers "what do I owe today, across every enrolled
 * course"; `FlashcardMasteryStrip` answers "how much of THIS deck do I actually
 * own"; `FlashcardDeckList` answers "which deck do I open". None of the three
 * subsumes another — collapsing them would either bury the due-today number
 * inside a deck list row (losing the cross-course total) or drop the mastery
 * readout into the hero (which the block's own file header already rejected,
 * since a due count and a mastery percentage are different questions).
 *
 * ⭐ `session` IS ONE SHAPE FOR TWO STARTING POINTS. Pressing "Bắt đầu ôn tập" on
 * the due hero, resuming a paused batch, or opening a deck from the deck list all
 * land on the identical `WorkSessionHeader` + `FlashcardStudyCard` pair — the
 * screen does not fork on `kind: "due" | "deck"` because nothing about the two
 * blocks' shape or props changes between them; the difference is only which cards
 * the CALLER queued up before switching `phase`, which is state this screen does
 * not own.
 *
 * ⭐ THE MODE SWITCH DISAPPEARS THE MOMENT A SESSION STARTS, same reasoning as
 * `QuizPage`'s `FlashcardModeSwitch` and its own file header's "it disappears
 * once a session starts" note: switching between "Học thẻ"/"Hỏi nhanh" mid-run
 * would abandon the run in progress, so the row is absent rather than disabled —
 * an absent control says the question is closed, a disabled one still invites
 * the tap.
 *
 * ⛔ NO CONFIRM DIALOG WIRED HERE, though the planner's tree asked for
 * `FeedbackConfirm` directly inside `session` (leave/end-early). §0's import
 * boundary is exact — a screen calls blocks and frames, never a composite
 * directly — and `QuizPage`'s own file header already burned down the identical
 * question for its "ran out of questions" gap: the one documented exception
 * (`CourseContents`'s `AsyncContentEmpty`) replaces the ENTIRE screen body, not
 * one phase's one dialog. No block in today's catalog wraps a confirm shell, and
 * inventing a seventh block to hold one dialog is exactly the reach this run's
 * own brief (`ContentModeNav`'s file header) warns against. Left as a marked gap:
 * `WorkSessionHeader`'s back link already fires `onSessionBack` — whatever the
 * real screen does with that event (including opening a confirm dialog) is a
 * decision the CALLER makes above this component, not something faked here with
 * a bare composite import.
 *
 * ⛔ NO `FlashcardStudyRail`, confirmed dead code before this run started (see the
 * task brief) — the live mode/view navigation is `FlashcardModeSwitch` (session
 * picker) and the view toggle already living inside `FlashcardDeckList`.
 *
 * ⛔ `isSessionSkeleton` REACHES ONLY `FlashcardStudyCard`. `WorkSessionHeader`
 * carries no `isSkeleton` by design (its own file header: the band's shape — a
 * back link, a counter, a rail — is known before any card loads), so the flag is
 * not threaded to it, mirroring exactly how `QuizPage` stops `isSkeleton` short
 * of `WorkSessionHeader` and `QuizRecapList` for the same reason.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** Session title, e.g. "Ôn tập hôm nay" or the deck's own name. */
    sessionTitle?: string
    /** Where the learner is, already worded by the caller, e.g. "Thẻ 3 / 10". */
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

    /** When on, every composed block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
    showAnatomy = false,
}: FlashcardReviewPageProps) => {
    const overviewDeck = (
        <>
            <FlashcardDueHero
                anatPart="FlashcardDueHero"
                dueCount={dueCount}
                dueReviewCount={dueReviewCount}
                newCount={dueNewCount}
                resume={dueResume}
                onStart={onDueStart}
                isStarting={isDueStarting}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <FlashcardMasteryStrip
                anatPart="FlashcardMasteryStrip"
                mastered={masteryMastered}
                total={masteryTotal}
                learning={masteryLearning}
                newCount={masteryNewCount}
                streak={masteryStreak}
                retention={masteryRetention}
                totalReviewed={masteryTotalReviewed}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <FlashcardDeckList
                anatPart="FlashcardDeckList"
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
                showAnatomy={showAnatomy}
            />
        </>
    )

    const overviewSection = (
        <>
            <FlashcardModeSwitch
                anatPart="FlashcardModeSwitch"
                mode={flashcardMode}
                onModeChange={onFlashcardModeChange}
                ariaLabel={flashcardModeAriaLabel}
                showAnatomy={showAnatomy}
            />
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} body={overviewDeck} />
        </>
    )

    const sessionSection = (
        <>
            <WorkSessionHeader
                anatPart="WorkSessionHeader"
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
                showAnatomy={showAnatomy}
            />
            <FlashcardStudyCard
                anatPart="FlashcardStudyCard"
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
                showAnatomy={showAnatomy}
            />
        </>
    )

    const reviewPhases = (
        <>
            {phase === "overview" ? (
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} body={overviewSection} />
            ) : null}

            {phase === "session" ? (
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} body={sessionSection} />
            ) : null}
        </>
    )

    const reviewBody = <StackV gap="page" anatPart={showAnatomy ? "StackV" : undefined} body={reviewPhases} />

    return <Container size="md" padding="roomy" body={reviewBody} />
}

export { FlashcardReviewPage }
