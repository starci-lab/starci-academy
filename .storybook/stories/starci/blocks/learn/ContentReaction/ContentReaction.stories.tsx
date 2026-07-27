import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentReaction } from "@sb-components/starci/blocks/learn/ContentReaction/ContentReaction"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentReaction`: say how the lesson landed. A reaction control on
 * the left, the quiet view count on the right.
 *
 * ⚠️ TWO WEIGHTS, ON PURPOSE. Reacting is an ACTION, so it is a button; the view
 * count is a FACT the reader can only observe, so it is muted text. Giving both
 * the same weight would ask the reader to choose between a control and a number.
 *
 * COUNTS ARE DATA, THE WORDING IS NOT (§14d.1). The caller hands over numbers
 * and the block adds the unit and the thousands separator, so two callers cannot
 * drift apart on how a count reads.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Reacting, waiting for the server, and having
 * nobody react yet all keep the same two slots ⇒ states. The caller flipping
 * `isSkeleton` is a leaf.
 */
const meta: Meta<typeof ContentReaction> = {
    title: "StarCi/Blocks/Learn/ContentReaction/ContentReaction",
    component: ContentReaction,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentReaction>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the row frame pushing the action to one end and the fact to the other, owning the seam between them", storyId: "frames-stack-stackh--default" },
    "Button": { tier: "atom", role: "the reaction control, owning its own pressed and busy skins; the block only decides the word and whether it reads as on", storyId: "atoms-buttons-button-button--default" },
    "Typography": { tier: "atom", role: "the muted view count with its eye glyph, or its skeleton mirror while the summary is still loading", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the reaction row under a lesson. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentReaction"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "reactionCount = 128, hasReacted = false",
                        why: "Other readers have reacted but this one has not, so the control shows the running count and stays in its resting skin. The count sits on the button rather than beside it, which keeps the row to one action and one fact.",
                        code: "<ContentReaction reactionCount={128} viewCount={2481} onReact={react} />",
                        render: (
                            <ContentReaction
                                anatPart="ContentReaction"
                                showAnatomy
                                reactionCount={128}
                                viewCount={2481}
                                onReact={() => {}}
                            />
                        ),
                    },
                    {
                        name: "hasReacted = true",
                        why: "The reader has reacted, so the control switches to its on skin and the count includes them. Pressing again takes the reaction back, which is why this is one toggle rather than a separate undo.",
                        code: "<ContentReaction reactionCount={129} viewCount={2481} hasReacted onReact={react} />",
                        render: (
                            <ContentReaction
                                reactionCount={129}
                                viewCount={2481}
                                hasReacted
                                onReact={() => {}}
                            />
                        ),
                    },
                    {
                        name: "reactionCount = 0",
                        why: "Nobody has reacted yet, so the count is dropped and the button reads as an invitation instead of reporting a score of nil. A zero here would look like a verdict on the lesson rather than an absence of votes.",
                        code: "<ContentReaction viewCount={12} onReact={react} />",
                        render: (
                            <ContentReaction viewCount={12} onReact={() => {}} />
                        ),
                    },
                    {
                        name: "isPending = true",
                        why: "The reaction is in flight, so the button carries the busy affordance itself and the row keeps its exact width while the server answers. Nothing else moves, which is what stops a double press from feeling like a lost click.",
                        code: "<ContentReaction reactionCount={128} viewCount={2481} isPending onReact={react} />",
                        render: (
                            <ContentReaction
                                reactionCount={128}
                                viewCount={2481}
                                isPending
                                onReact={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so both slots mirror their own shape. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentReaction"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Both slots shimmer while the reaction summary is still being fetched. Without this branch the row would render a truthful-looking zero for the length of the request and then jump when the real number lands, which reads as the count changing rather than arriving.",
                        code: "<ContentReaction isSkeleton onReact={react} />",
                        render: (
                            <ContentReaction
                                anatPart="ContentReaction"
                                showAnatomy
                                isSkeleton
                                onReact={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
