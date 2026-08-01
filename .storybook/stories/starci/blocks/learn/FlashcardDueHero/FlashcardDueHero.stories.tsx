import type { Meta, StoryObj } from "@storybook/nextjs"
import { FlashcardDueHero } from "@sb-components/starci/blocks/learn/FlashcardDueHero/FlashcardDueHero"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FlashcardDueHero`: the flashcard landing's single focal card — how
 * many cards are due today, the primary Start CTA, and — when a batch was
 * left mid-way — the resume card instead. See the component's own file
 * header for why each shape below is its own LEAF rather than one shape with
 * flags, and why `EmptyState` joined the reuse list beyond what this run
 * was handed.
 *
 * 📐 THREE LEAVES BY STRUCTURE (§14d.2): "No resume in progress" (due count +
 * Start button), "Resume in progress" (the whole card becomes
 * `ContinueCardHero`), "Nothing due" (the due count + button vanish, an empty
 * message takes their place). `isSkeleton` stays a STATE inside the first
 * leaf — before data lands the caller doesn't know which of the other two
 * leaves it will be, so the block always shimmers the base shape.
 */
const meta: Meta<typeof FlashcardDueHero> = {
    title: "StarCi/Blocks/Learn/FlashcardDueHero/FlashcardDueHero",
    component: FlashcardDueHero,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FlashcardDueHero>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the labelled section frame (\"Review today\"); it stays put across the 'No resume' and 'Nothing due' leaves so the section never disappears just because today is empty", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "StackV": { tier: "frame", role: "the vertical track holding the due-count text cluster above the Start button, and — one level in — the tighter track grouping the three text lines together", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the due-count headline, its \"cards due today\" caption, or the review/new breakdown — real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "the primary Start CTA, only present when there is no paused batch to resume instead", storyId: "atoms-buttons-button-button--default" },
    "ContinueCardHero": { tier: "block", role: "the resume card — replaces the whole due-count cluster once a batch is mid-way, same reasoning ContinueLearningBase already applies to a paused lesson", storyId: "starci-blocks-learn-continuecard-hero-progress--not-urgent" },
    "EmptyState": { tier: "composite", role: "the caught-up message that takes the due-count cluster's place once nothing is left to review, with no action since there is nothing left to start", storyId: "composites-feedback-emptystate-emptystate--icon-and-title" },
}

/** LEAF — no paused batch: due-count cluster + primary Start button. */
export const NoResume: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardDueHero"
                tier="block"
                leaf="No resume in progress"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "dueCount = 12, resume = undefined",
                        why: "Twelve cards are waiting across the reader's enrolled courses, so the card shows the count, its review/new split, and one Start button. This is the resting shape every learner sees on a normal day with cards outstanding and nothing paused.",
                        code: `<FlashcardDueHero
    dueCount={12}
    dueReviewCount={8}
    newCount={4}
    onStart={handleStart}
/>`,
                        render: (
                            <FlashcardDueHero

                               
                                dueCount={12}
                                dueReviewCount={8}
                                newCount={4}
                                onStart={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Every text line and the Start button switch to their own shimmer while the due count is still loading, on the exact same composition as the loaded state. isSkeleton flips a state rather than the structure, which is why this state reuses the loaded leaf's shape instead of a hand-rolled placeholder.",
                        code: `<FlashcardDueHero
    dueCount={0}
    dueReviewCount={0}
    newCount={0}
    onStart={handleStart}
    isSkeleton
/>`,
                        render: (
                            <FlashcardDueHero
                                dueCount={0}
                                dueReviewCount={0}
                                newCount={0}
                                onStart={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a due batch was started earlier and never finished: the whole card becomes `ContinueCardHero`. */
export const Resume: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardDueHero"
                tier="block"
                leaf="Resume in progress"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "resume = { current: 5, total: 12 }",
                        why: "Five of the twelve cards in today's paused batch are already answered, so the whole card becomes ContinueCardHero with a progress bar instead of showing the due-count cluster next to a Start button. Finishing what was already started is the one thing left to do, so nothing here competes with it for attention.",
                        code: `<FlashcardDueHero
    dueCount={12}
    dueReviewCount={8}
    newCount={4}
    resume={{ current: 5, total: 12, onPress: handleResume }}
    onStart={handleStart}
/>`,
                        render: (
                            <FlashcardDueHero

                               
                                dueCount={12}
                                dueReviewCount={8}
                                newCount={4}
                                resume={{ current: 5, total: 12, onPress: () => {} }}
                                onStart={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — every due card has been reviewed: the due-count cluster and Start button both vanish. */
export const NothingDue: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardDueHero"
                tier="block"
                leaf="Nothing due"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "dueCount = 0, resume = undefined",
                        why: "Nothing is due today and no batch was left unfinished, so the section frame stays but its body becomes a caught-up message with no action underneath it. A zero due count is not an error, so the card says so plainly instead of showing an empty number next to a button with nothing to start.",
                        code: `<FlashcardDueHero
    dueCount={0}
    dueReviewCount={0}
    newCount={0}
    onStart={handleStart}
/>`,
                        render: (
                            <FlashcardDueHero

                               
                                dueCount={0}
                                dueReviewCount={0}
                                newCount={0}
                                onStart={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
