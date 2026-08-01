import type { Meta, StoryObj } from "@storybook/nextjs"
import { RatingBar } from "@sb-components/starci/blocks/learn/RatingBar/RatingBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `RatingBar`: how well did you remember it. Four tiles tapped after an
 * answer is revealed, feeding the spaced-repetition schedule.
 *
 * SHARED between flashcard review and quiz recap: what it knows is what a RECALL
 * GRADE is — four of them, weakest to strongest, and the answer decides when the
 * card comes back.
 *
 * ⭐ GRADING IS AN ACTION, NOT A SELECTION. Nothing stays lit after the tap: no
 * ring, no checked skin. The learner answers once and moves on rather than
 * adjusting a setting they might return to, and a persistent selected state
 * would invite them to sit and reconsider.
 *
 * ⭐ THE COLOUR RAMP IS A TIER, NOT A STATUS. Grades run rose → emerald like a
 * difficulty scale, because "I forgot" is not an ERROR and "easy" is not a
 * SUCCESS — they are positions on one axis. The status palette here would tell
 * the learner they got something wrong by being honest.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): the hint line and the pending lock are data ⇒
 * states. The caller flipping `isSkeleton` is a leaf.
 */
const meta: Meta<typeof RatingBar> = {
    title: "StarCi/Blocks/Learn/RatingBar/RatingBar",
    component: RatingBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof RatingBar>

const OPTIONS = [
    { grade: 0, label: "Forgot", hint: "See it again today" },
    { grade: 1, label: "Hard", hint: "See it again in 1 day" },
    { grade: 2, label: "Good", hint: "See it again in 4 days" },
    { grade: 3, label: "Easy", hint: "See it again in 10 days" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardPressableGroup": { tier: "composite", role: "the four pressable tiles and their grid, owning the tile box, the verdict band the block colours, and the 1-to-4 keyboard shortcut", storyId: "composites-cards-surfacecard-surfacecardpressablegroup--default" },
    "StackV": { tier: "frame", role: "the vertical frame inside one tile, stacking the label row above the interval hint", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the label row, pushing the grade name to one end and its key hint to the other", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the grade name, or the muted next-interval preview under it", storyId: "atoms-text-typography-typography--plain" },
    "Chip": { tier: "atom", role: "the keyboard shortcut — the one classifying mark on a tile, which is why the interval below it stays plain text", storyId: "atoms-chips-chip-chip--default" },
}

/** LEAF — the four grades, ready to tap. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RatingBar"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "options.length = 4, hints set",
                        why: "Four grades run weakest to strongest, each showing when the card would come back if it were chosen. Naming the consequence is what turns an opinion into a decision: the learner is not rating their feelings, they are choosing when to see this again.",
                        code: `<RatingBar
    options={options}
    ariaLabel="How well did you remember it"
    onRate={rate}
/>`,
                        render: (
                            <RatingBar
                                anatPart="RatingBar"
                                showAnatomy
                                options={OPTIONS}
                                ariaLabel="How well did you remember it"
                                onRate={() => {}}
                            />
                        ),
                    },
                    {
                        name: "no hints",
                        why: "Without an interval preview each tile is one line and the row gets shorter. This is the shape for a deck whose schedule has not been computed yet, and it is worth seeing that dropping the second line leaves the tiles even rather than ragged.",
                        code: `<RatingBar
    options={options.map(({ grade, label }) => ({ grade, label }))}
    ariaLabel="How well did you remember it"
    onRate={rate}
/>`,
                        render: (
                            <RatingBar
                                options={OPTIONS.map(({ grade, label }) => ({ grade, label }))}
                                ariaLabel="How well did you remember it"
                                onRate={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isPending = true",
                        why: "A grade is on its way to the server, so every tile stops accepting taps at once. Locking the whole row rather than the tile that was pressed is deliberate: a second grade for the same card is not a slower version of the first, it is a different answer.",
                        code: `<RatingBar
    options={options}
    ariaLabel="How well did you remember it"
    isPending
    onRate={rate}
/>`,
                        render: (
                            <RatingBar
                                options={OPTIONS}
                                ariaLabel="How well did you remember it"
                                isPending
                                onRate={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the group mirrors its own tiles. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RatingBar"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The group draws its own tile mirror while the schedule is being computed, keeping the same four boxes and the same column split. The composite that owns the tile box owns the shimmer too, so nothing shifts when the intervals arrive.",
                        code: "<RatingBar options={options} ariaLabel=\"How well did you remember it\" isSkeleton onRate={rate} />",
                        render: (
                            <RatingBar
                                anatPart="RatingBar"
                                showAnatomy
                                options={OPTIONS}
                                ariaLabel="How well did you remember it"
                                isSkeleton
                                onRate={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
