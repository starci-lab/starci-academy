import type { Meta, StoryObj } from "@storybook/nextjs"
import { FlashcardStudyCard } from "@sb-components/starci/blocks/learn/FlashcardStudyCard/FlashcardStudyCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FlashcardStudyCard` — one card of a review run, shared by both due-review and
 * deck-review. Composes `SurfaceCard`, `MarkdownContent`, `Chip`/`ChipGroup`,
 * `Button`, and the shared `RatingBar`; only the locked-premium notice is
 * hand-rolled. One chip per meta row (`starci-fe/no-adjacent-chip`): `levelLabel`
 * takes the lone chip, `tags` ride `ChipGroup`. Three leaves: `revealed` swaps
 * question-only for answer body, and within revealed `isLocked` swaps the answer
 * for a lock notice; `levelLabel`/`tags`/`explanation` stay states. Prev/next
 * never gate on grading.
 */
const meta: Meta<typeof FlashcardStudyCard> = {
    title: "StarCi/Blocks/Learn/FlashcardStudyCard/FlashcardStudyCard",
    component: FlashcardStudyCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FlashcardStudyCard>

const RATING_OPTIONS = [
    { grade: 0, label: "Forgot", hint: "See again today" },
    { grade: 1, label: "Hard", hint: "See again in 1 day" },
    { grade: 2, label: "Good", hint: "See again in 4 days" },
    { grade: 3, label: "Easy", hint: "See again in 10 days" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the card face this block draws its question/answer/nav row inside", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "the vertical frame stacking meta row, question, answer body and footer", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "a horizontal row — the meta chips, the lock notice's icon+text, or the prev/reveal/next footer", storyId: "frames-stack-stackh--default" },
    "Chip": { tier: "atom", role: "the level chip — the one classifying mark in the meta row, per `no-adjacent-chip`", storyId: "atoms-chips-chip-chip--default" },
    "ChipGroup": { tier: "atom", role: "the tag row, truncated as ONE unit instead of a second run of bare chips", storyId: "composites-chips-chipgroup--default" },
    "MarkdownContent": { tier: "composite", role: "the question, the answer, or the explanation — each an authored document this block repeats without understanding it", storyId: "composites-viewers-markdowncontent--compact" },
    "Typography": { tier: "atom", role: "a section label ('Answer'/'Explanation') or a line of the lock notice", storyId: "atoms-text-typography-typography--overview" },
    "Button": { tier: "atom", role: "reveal, unlock, or one of the prev/next nav controls", storyId: "atoms-buttons-button-button--default" },
    "RatingBar": { tier: "block", role: "the shared recall-grade row, reused unchanged from quiz recap", storyId: "starci-blocks-learn-ratingbar-ratingbar--full" },
}

/** LEAF — question only, nothing to grade yet. */
export const Unrevealed: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardStudyCard"
                tier="block"
                leaf="Unrevealed"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "levelLabel + tags set",
                        why: "The card carries a level chip and a tag row above the question, so the learner knows what they are about to be asked before they read it. This is the shape most cards in a tagged deck take.",
                        code: `<FlashcardStudyCard
    question="What is React.useMemo used for?"
    levelLabel="Middle"
    tags={["react", "performance"]}
    revealed={false}
    onReveal={reveal}
    ratingOptions={ratingOptions}
    onRate={rate}
    isFirst
    isLast={false}
    onPrev={prev}
    onNext={next}
/>`,
                        render: (
                            <FlashcardStudyCard

                               
                                question="What is `React.useMemo` used for?"
                                levelLabel="Middle"
                                tags={["react", "performance"]}
                                revealed={false}
                                onReveal={() => {}}
                                ratingOptions={RATING_OPTIONS}
                                onRate={() => {}}
                                isFirst
                                isLast={false}
                                onPrev={() => {}}
                                onNext={() => {}}
                            />
                        ),
                    },
                    {
                        name: "no level, no tags",
                        why: "A card an author never tagged draws straight from the question, no empty chip row claiming metadata that is not there. The prev control is also disabled here — this is the first card of the run, so there is nowhere to step back to.",
                        code: `<FlashcardStudyCard
    question="Name the first three SOLID principles."
    revealed={false}
    onReveal={reveal}
    ratingOptions={ratingOptions}
    onRate={rate}
    isFirst
    isLast={false}
    onPrev={prev}
    onNext={next}
/>`,
                        render: (
                            <FlashcardStudyCard
                                question="Name the first three SOLID principles."
                                revealed={false}
                                onReveal={() => {}}
                                ratingOptions={RATING_OPTIONS}
                                onRate={() => {}}
                                isFirst
                                isLast={false}
                                onPrev={() => {}}
                                onNext={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — revealed and gradable: answer under the question, `RatingBar` live. */
export const Revealed: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardStudyCard"
                tier="block"
                leaf="Revealed, gradable"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "answer + explanation",
                        why: "The full answer body: the answer itself, then the reasoning under it, then the four recall grades. Two loud signals stacked would compete, so only the grade row is interactive — the explanation is read, not tapped.",
                        code: `<FlashcardStudyCard
    question="What is React.useMemo used for?"
    levelLabel="Middle"
    revealed
    onReveal={reveal}
    answer="Caches the result of an expensive computation across renders, only recomputing when a dependency changes."
    explanation="Not every computation needs useMemo — only reach for it when the computation is genuinely expensive and the component re-renders often."
    ratingOptions={ratingOptions}
    onRate={rate}
    isFirst={false}
    isLast={false}
    onPrev={prev}
    onNext={next}
/>`,
                        render: (
                            <FlashcardStudyCard

                               
                                question="What is `React.useMemo` used for?"
                                levelLabel="Middle"
                                revealed
                                onReveal={() => {}}
                                answer="Caches the result of an expensive computation across renders, only recomputing when a dependency changes."
                                explanation="Not every computation needs `useMemo` — only reach for it when the computation is genuinely expensive and the component re-renders often."
                                ratingOptions={RATING_OPTIONS}
                                onRate={() => {}}
                                isFirst={false}
                                isLast={false}
                                onPrev={() => {}}
                                onNext={() => {}}
                            />
                        ),
                    },
                    {
                        name: "answer only, last card, grading pending",
                        why: "No explanation was authored for this card, so the answer body ends right after the answer. This is also the last card of the run — the next control is disabled — and a grade is mid-flight, so every `RatingBar` tile has stopped accepting taps.",
                        code: `<FlashcardStudyCard
    question="Name the first three SOLID principles."
    revealed
    onReveal={reveal}
    answer="Single Responsibility, Open/Closed, Liskov Substitution."
    ratingOptions={ratingOptions}
    onRate={rate}
    isRatingPending
    isFirst={false}
    isLast
    onPrev={prev}
    onNext={next}
/>`,
                        render: (
                            <FlashcardStudyCard
                                question="Name the first three SOLID principles."
                                revealed
                                onReveal={() => {}}
                                answer="Single Responsibility, Open/Closed, Liskov Substitution."
                                ratingOptions={RATING_OPTIONS}
                                onRate={() => {}}
                                isRatingPending
                                isFirst={false}
                                isLast
                                onPrev={() => {}}
                                onNext={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — revealed but locked: the answer/explanation/`RatingBar` node is replaced by a lock notice. */
export const RevealedLocked: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardStudyCard"
                tier="block"
                leaf="Revealed, locked premium"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isLocked = true",
                        why: "A deck-review learner on a trial reveals a premium card and finds a lock notice with a way through instead of the answer — the question still reads in full, only the pay-off is withheld. There is nothing to grade behind a lock, so `RatingBar` does not render.",
                        code: `<FlashcardStudyCard
    question="Explain the event loop in Node.js."
    levelLabel="Senior"
    tags={["nodejs", "internals"]}
    revealed
    onReveal={reveal}
    isLocked
    onUnlock={unlock}
    ratingOptions={ratingOptions}
    onRate={rate}
    isFirst={false}
    isLast={false}
    onPrev={prev}
    onNext={next}
/>`,
                        render: (
                            <FlashcardStudyCard

                               
                                question="Explain the event loop in Node.js."
                                levelLabel="Senior"
                                tags={["nodejs", "internals"]}
                                revealed
                                onReveal={() => {}}
                                isLocked
                                onUnlock={() => {}}
                                ratingOptions={RATING_OPTIONS}
                                onRate={() => {}}
                                isFirst={false}
                                isLast={false}
                                onPrev={() => {}}
                                onNext={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the card mirrors itself while loading. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardStudyCard"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The card draws its own mirror while the next card is still loading, keeping the same face and footprint so the layout does not jump when the real question lands.",
                        code: `<FlashcardStudyCard
    question=""
    revealed={false}
    onReveal={reveal}
    ratingOptions={ratingOptions}
    onRate={rate}
    isFirst
    isLast={false}
    onPrev={prev}
    onNext={next}
    isSkeleton
/>`,
                        render: (
                            <FlashcardStudyCard

                               
                                question=""
                                revealed={false}
                                onReveal={() => {}}
                                ratingOptions={RATING_OPTIONS}
                                onRate={() => {}}
                                isFirst
                                isLast={false}
                                onPrev={() => {}}
                                onNext={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
