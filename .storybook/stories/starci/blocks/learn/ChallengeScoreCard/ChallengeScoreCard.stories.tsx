import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeScoreCard } from "@sb-components/starci/blocks/learn/ChallengeScoreCard/ChallengeScoreCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ChallengeScoreCard`: "Your result" — the aggregate earned/max
 * score for a finished challenge attempt, read against the pass line.
 *
 * SIBLING OF `ChallengeDeliverableList`, NOT PART OF IT. The deliverable list
 * owns one row per requirement; this card owns the roll-up across all of them —
 * a small, single-fact block kept deliberately separate so the list's rows never
 * have to make room for a total that is not one of them.
 *
 * COMPOSED, NOT REBUILT: the card face is `SurfaceCard` (labeled variant, its
 * `description` slot carrying the fixed pass-condition caption), the bar is
 * `ProgressMeter` with its `target` prop for the pass line.
 *
 * 📐 ONE LEAF (§14d.2). `earnedScore` / `maxScore` / `passThreshold` only ever
 * change the NUMBERS inside the same score row + meter + caption, never the
 * shape of the tree — so every combination, including `isSkeleton`, is a STATE
 * of the one leaf below, not a family of leaves.
 */
const meta: Meta<typeof ChallengeScoreCard> = {
    title: "StarCi/Blocks/Learn/ChallengeScoreCard/ChallengeScoreCard",
    component: ChallengeScoreCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChallengeScoreCard>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the labeled card face, drawing the \"Your result\" label above it and the fixed pass-condition caption below it", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "StackV": { tier: "frame", role: "the vertical frame inside the card, stacking the score row above the meter", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the score row, holding the earned score and its \"/ max points\" unit on one baseline", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the earned score, or the muted \"/ max points\" riding beside it", storyId: "atoms-text-typography-typography--plain" },
    "ProgressMeter": { tier: "composite", role: "the score bar, marking the pass line via its own target tick", storyId: "composites-stats-progressmeter--target-below" },
    "Skeleton": { tier: "heroui", role: "the loading mirror standing in for the meter — `ProgressMeter` has no `isSkeleton` shape of its own yet, so this block builds the shimmer bar directly, matching the real track's height" },
}

/** LEAF — the aggregate score card, real and loading. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengeScoreCard"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "earnedScore ≥ passThreshold × maxScore",
                        why: "The learner cleared the pass line, so the meter's fill runs past its own target tick. This is the shape a passing attempt shows, and the caption stays put as a reminder that a total past the line is not the same thing as every requirement being met.",
                        code: `<ChallengeScoreCard
    earnedScore={9}
    maxScore={10}
    passThreshold={0.8}
/>`,
                        render: (
                            <ChallengeScoreCard
                                anatPart="ChallengeScoreCard"
                                showAnatomy
                                earnedScore={9}
                                maxScore={10}
                                passThreshold={0.8}
                            />
                        ),
                    },
                    {
                        name: "earnedScore < passThreshold × maxScore",
                        why: "The fill falls short of the target tick, so the same card reads as \"not yet\" without any wording change — the meter alone carries the verdict. Worth seeing next to the passing state because nothing but the two numbers differs.",
                        code: `<ChallengeScoreCard
    earnedScore={6}
    maxScore={10}
    passThreshold={0.8}
/>`,
                        render: (
                            <ChallengeScoreCard
                                earnedScore={6}
                                maxScore={10}
                                passThreshold={0.8}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The attempt is still being graded, so the label, the score row and the meter each swap to their own shimmer while the caption underneath keeps its place. The flag reaches the real atoms rather than a parallel skeleton tree, which is why nothing reflows when the score lands.",
                        code: `<ChallengeScoreCard
    earnedScore={0}
    maxScore={10}
    passThreshold={0.8}
    isSkeleton
/>`,
                        render: (
                            <ChallengeScoreCard
                                earnedScore={0}
                                maxScore={10}
                                passThreshold={0.8}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
