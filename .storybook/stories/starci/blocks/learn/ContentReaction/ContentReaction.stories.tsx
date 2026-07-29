import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentReaction } from "@sb-components/starci/blocks/learn/ContentReaction/ContentReaction"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentReaction`: say how the lesson landed. A Facebook-style
 * six-emotion picker on the left, the quiet view count on the right.
 *
 * ⭐⭐ REBUILT 2026-07-28 (thầy: "chế nhiều quá" — the first cut was a single
 * boolean like/unlike toggle; real `src`'s `ReactionBar` is a six-emotion
 * picker reused for both the content reaction and every comment). See the
 * component's own file header for the full port + why the animated 6-button
 * row lives in a separate atom (`ReactionPicker`), not hand-rolled here.
 *
 * TWO WEIGHTS, ON PURPOSE. Reacting is an ACTION, so it is a button; the view
 * count is a FACT the reader can only observe, so it is muted text.
 *
 * COUNTS ARE DATA, THE VOCABULARY IS NOT (§14d.1). The caller hands over
 * `counts` (one entry per emotion actually reacted); the block owns the six
 * fixed labels/emoji and does the sort/cap/total work itself.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Which emotion is picked, whether the summary
 * is empty, and waiting for the server all keep the same two-slot shape ⇒
 * states. The caller flipping `isSkeleton` is its own leaf.
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
    "StackH": { tier: "frame", role: "the row frame pushing the reaction control to one end and the view-count fact to the other", storyId: "frames-stack-stackh--default" },
    "ReactionButton": { tier: "block", role: "the pill trigger + six-emotion picker + summary — shared verbatim with each comment row in ContentDiscussion", storyId: "starci-blocks-learn-reactionbutton-reactionbutton--full" },
    "Typography": { tier: "atom", role: "the muted view count with its eye glyph, or its skeleton mirror while the summary is still loading", storyId: "atoms-text-typography-typography--plain" },
}

const COUNTS = [
    { type: "like" as const, count: 80 },
    { type: "love" as const, count: 32 },
    { type: "haha" as const, count: 16 },
]

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
                        name: "myReaction = null, counts = 3 kinds",
                        why: "Other readers have reacted but this one hasn't — the trigger reads as a neutral invitation, and the summary stacks the three busiest emotions with the total beside them. Opening the trigger reveals the full six-emotion picker.",
                        code: `<ContentReaction
    counts={[{ type: "like", count: 80 }, { type: "love", count: 32 }, { type: "haha", count: 16 }]}
    viewCount={2481}
    onReact={react}
/>`,
                        render: (
                            <ContentReaction
                                anatPart="ContentReaction"
                                showAnatomy
                                counts={COUNTS}
                                viewCount={2481}
                                onReact={() => {}}
                            />
                        ),
                    },
                    {
                        name: "myReaction = 'love'",
                        why: "The reader picked \"Yêu thích\" — the trigger swaps its emoji and label to that pick and switches to its secondary (on) skin. Picking the same emotion again removes it.",
                        code: "<ContentReaction myReaction=\"love\" counts={[...]} viewCount={2481} onReact={react} />",
                        render: (
                            <ContentReaction
                                myReaction="love"
                                counts={COUNTS.map((c) => (c.type === "love" ? { ...c, count: c.count + 1 } : c))}
                                viewCount={2481}
                                onReact={() => {}}
                            />
                        ),
                    },
                    {
                        name: "counts = []",
                        why: "Nobody has reacted yet, so the summary is dropped entirely rather than showing a zero, and the trigger reads as a plain invitation — a zero here would look like a verdict on the lesson rather than an absence of reactions.",
                        code: "<ContentReaction viewCount={12} onReact={react} />",
                        render: (
                            <ContentReaction viewCount={12} onReact={() => {}} />
                        ),
                    },
                    {
                        name: "isPending = true",
                        why: "A reaction is in flight, so the trigger disables itself and the row keeps its exact shape while the server answers. Nothing else moves, which is what stops a double press from feeling like a lost click.",
                        code: "<ContentReaction counts={[...]} viewCount={2481} isPending onReact={react} />",
                        render: (
                            <ContentReaction
                                counts={COUNTS}
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
                        why: "Both slots shimmer while the reaction summary is still being fetched. Without this branch the row would render a truthful-looking empty state for the length of the request and then jump when the real summary lands, which reads as the count changing rather than arriving.",
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
