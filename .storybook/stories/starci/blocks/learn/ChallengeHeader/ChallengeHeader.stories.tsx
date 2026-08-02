import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeHeader } from "@sb-components/starci/blocks/learn/ChallengeHeader/ChallengeHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ChallengeHeader` — the challenge-identity cluster atop the solve page: back
 * link, title, optional description, and a meta row carrying score, difficulty,
 * and the learner's pass-fail status. A `PageHeader` cluster. Two chips on
 * purpose — `difficulty` (a property of the challenge) and `status` (a property
 * of the attempt) are separate axes. Whether the status chip draws, and loading,
 * are data.
 */
const meta: Meta<typeof ChallengeHeader> = {
    title: "StarCi/Blocks/Learn/ChallengeHeader/ChallengeHeader",
    component: ChallengeHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChallengeHeader>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the back link, title, description and meta row, owning the type scale for all four", storyId: "composites-layout-page-pageheader--full" },
    "LinkBack": { tier: "atom", role: "the single back affordance to the owning lesson, or its skeleton mirror while loading", storyId: "atoms-navigation-link-linkback--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the title, or the quiet score fact — real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "RichText": { tier: "composite", role: "the one-sentence summary, small-richtext tier not a bare Typography, and its own skeleton bar", storyId: "composites-viewers-richtext--plain-text" },
    "StackH": { tier: "frame", role: "the horizontal frame holding the meta row, so the score text and both chips sit on one baseline with one seam", storyId: "frames-stack-stackh--default" },
    "EnumChip": { tier: "composite", role: "an enum-to-soft-chip delegate — difficulty always, status only once the learner has an attempt", storyId: "composites-chips-enumchip--overview" },
}

/** LEAF — `ChallengeHeader`: back link → title → description → meta row (score · difficulty · status). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengeHeader"
                tier="block"
                leaf="ChallengeHeader"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "status = completed",
                        why: "The learner has already passed this challenge, so the meta row carries all three facts: the score the challenge is worth, the fixed difficulty tier, and the attempt's own pass chip. This is the shape a returning solver sees when they come back to review a challenge they already cleared.",
                        code: `<ChallengeHeader
    onBackPress={goBack}
    title="Balance a binary search tree"
    description="Write a function that checks whether a BST is height-balanced."
    scoreValue={100}
    difficulty="hard"
    status="completed"
/>`,
                        render: (
                            <ChallengeHeader

                               
                                onBackPress={() => {}}
                                title="Balance a binary search tree"
                                description="Write a function that checks whether a BST is height-balanced."
                                scoreValue={100}
                                difficulty="hard"
                                status="completed"
                            />
                        ),
                    },
                    {
                        name: "status = failed",
                        why: "The chip swaps to the danger tone in place, without disturbing the score or difficulty beside it — status is the one fact in this row that can flip on a retry, and the row keeps its shape while it does.",
                        code: `<ChallengeHeader
    onBackPress={goBack}
    title="Balance a binary search tree"
    description="Write a function that checks whether a BST is height-balanced."
    scoreValue={100}
    difficulty="hard"
    status="failed"
/>`,
                        render: (
                            <ChallengeHeader
                                onBackPress={() => {}}
                                title="Balance a binary search tree"
                                description="Write a function that checks whether a BST is height-balanced."
                                scoreValue={100}
                                difficulty="hard"
                                status="failed"
                            />
                        ),
                    },
                    {
                        name: "status = undefined",
                        why: "The learner has never attempted this challenge, so there is no outcome to show yet — the status chip is simply not drawn, and difficulty carries the meta row alone. This is the first-visit shape, not an empty or a \"not started\" chip nobody asked for.",
                        code: `<ChallengeHeader
    onBackPress={goBack}
    title="Breadth-first graph traversal"
    description="Implement BFS on an unweighted graph, returning the shortest distance to every vertex."
    scoreValue={80}
    difficulty="medium"
/>`,
                        render: (
                            <ChallengeHeader
                                onBackPress={() => {}}
                                title="Breadth-first graph traversal"
                                description="Implement BFS on an unweighted graph, returning the shortest distance to every vertex."
                                scoreValue={80}
                                difficulty="medium"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the block composes swaps to its own shimmer while the challenge is still loading, including a text mirror standing in for the back link, which has no skeleton mode of its own. The row reserves the full three-piece meta shape so nothing resizes once the data lands.",
                        code: "<ChallengeHeader onBackPress={goBack} title=\"\" difficulty=\"easy\" isSkeleton />",
                        render: (
                            <ChallengeHeader
                                onBackPress={() => {}}
                                title=""
                                difficulty="easy"
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
