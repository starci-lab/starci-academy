import type { Meta, StoryObj } from "@storybook/nextjs"
import { MilestoneUpNextCard } from "@sb-components/starci/blocks/learn/MilestoneUpNextCard/MilestoneUpNextCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `MilestoneUpNextCard`: the passed-attempt handoff to the NEXT
 * unlocked milestone task on a capstone track. Distinct from the challenge
 * flow (no such fixed handoff exists there) — see the component file header.
 *
 * 📐 TWO LEAVES (§14d.2). `showCheck` and `isSkeleton` only toggle a glyph or
 * mirror the existing shape — neither changes what is composed, so both are
 * STATES of `Default`. `isHighlight` is different: it adds/removes the
 * highlight streak, a real DOM node, so its two values are the `Default`
 * (highlighted, the milestone screen's original shape) and `Plain` (reused by
 * `ContentPage`'s mobile/tablet nudge — see that component's file header for
 * why the default doesn't fit there) leaves.
 */
const meta: Meta<typeof MilestoneUpNextCard> = {
    title: "StarCi/Blocks/Learn/MilestoneUpNextCard/MilestoneUpNextCard",
    component: MilestoneUpNextCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MilestoneUpNextCard>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the card face this handoff sits on — the light streak (isHighlight) marks it as the one focal action on a milestone result screen; a plain caller (see the `Plain` leaf) omits it", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "the vertical track stacking eyebrow, title, description and CTA with one owned seam", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the eyebrow (with its optional check glyph), the task title, or the hand-off description — real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "Button": { tier: "atom", role: "the CTA into the next unlocked task, its arrow sliding on hover", storyId: "atoms-buttons-button-button--suffix-icon" },
}

/** LEAF — eyebrow → title → description → CTA, with the pass-check and skeleton states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MilestoneUpNextCard"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "showCheck = true",
                        why: "The attempt just handed off from was a PASS, so a check glyph sits beside the eyebrow — the one signal that this is a hand-off rather than a first attempt at the next task. The shape underneath is unchanged.",
                        code: `<MilestoneUpNextCard
    eyebrow="Task 2 completed"
    showCheck
    title="Task 3 · Deploy to staging"
    description="Package the service into an image and deploy it to the ready-made staging environment."
    ctaLabel="Start task 3"
/>`,
                        render: (
                            <MilestoneUpNextCard

                               
                                eyebrow="Task 2 completed"
                                showCheck
                                title="Task 3 · Deploy to staging"
                                description="Package the service into an image and deploy it to the ready-made staging environment."
                                ctaLabel="Start task 3"
                                onPress={() => {}}
                            />
                        ),
                    },
                    {
                        name: "showCheck = false",
                        why: "Some hand-offs (e.g. an admin unlocking the next task manually) carry no pass to mark, so the eyebrow reads plainly with no glyph. The row keeps its place either way.",
                        code: `<MilestoneUpNextCard
    eyebrow="Next task"
    title="Task 3 · Deploy to staging"
    description="Package the service into an image and deploy it to the ready-made staging environment."
    ctaLabel="Start task 3"
/>`,
                        render: (
                            <MilestoneUpNextCard
                                eyebrow="Next task"
                                title="Task 3 · Deploy to staging"
                                description="Package the service into an image and deploy it to the ready-made staging environment."
                                ctaLabel="Start task 3"
                                onPress={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the block composes mirrors as shimmer while the next task is still loading, holding the exact box it will hand back so nothing jumps once the real title and description land.",
                        code: "<MilestoneUpNextCard eyebrow=\"\" title=\"\" description=\"\" ctaLabel=\"\" isSkeleton />",
                        render: (
                            <MilestoneUpNextCard
                                eyebrow=""
                                title=""
                                description=""
                                ctaLabel=""
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `isHighlight = false`: a plain card, no light streak. Reused shape, not a milestone fact. */
export const Plain: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MilestoneUpNextCard"
                tier="block"
                leaf="Plain"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "isHighlight = false",
                        why: "Reused by ContentPage's mobile/tablet practice nudge, an inline aside in a scrolling reading page rather than the one focal moment of its own screen — the highlight streak would overstate it, so the caller turns it off. The eyebrow/title/description/CTA shape is otherwise identical to Default.",
                        code: `<MilestoneUpNextCard
    eyebrow="Up next"
    title="Do 3 challenges from this lesson"
    description="Practice now to remember the lesson longer."
    ctaLabel="Practice now"
    isHighlight={false}
/>`,
                        render: (
                            <MilestoneUpNextCard

                               
                                eyebrow="Up next"
                                title="Do 3 challenges from this lesson"
                                description="Practice now to remember the lesson longer."
                                ctaLabel="Practice now"
                                isHighlight={false}
                                onPress={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
