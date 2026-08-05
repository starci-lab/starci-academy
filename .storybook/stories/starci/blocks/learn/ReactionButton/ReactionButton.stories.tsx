import type { Meta, StoryObj } from "@storybook/nextjs"
import { ReactionButton } from "@sb-components/starci/blocks/learn/ReactionButton/ReactionButton"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ReactionButton`: the Facebook-style six-emotion reaction control —
 * pill trigger + Popover picker + compact summary. Shared verbatim between
 * `ContentReaction` (the lesson-level reaction) and each comment row in
 * `ContentDiscussion`'s thread — the SAME control real `src`'s `ReactionBar`
 * is, reused between `InteractionBar` and `CommentItem`.
 *
 * [layout] LEAF by STRUCTURE (§14d.2). Which emotion is picked and whether the
 * summary is empty keep the same two-part shape ⇒ states. The caller
 * flipping `isSkeleton` is its own leaf.
 */
const meta: Meta<typeof ReactionButton> = {
    title: "StarCi/Blocks/Learn/ReactionButton/ReactionButton",
    component: ReactionButton,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ReactionButton>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the row pinning the trigger beside its summary (or the trigger alone, when there's nothing to summarize)", storyId: "frames-stack-stackh--default" },
    "Button": { tier: "heroui", role: "the pill trigger — HeroUI's own Button, raw (the constrained atom's chrome doesn't fit a custom emoji+label trigger)" },
    "Popover.Content": { tier: "heroui", role: "the rounded picker panel — HeroUI's own Popover, raw (the constrained atom forces w-64 + a muted-text wrapper, wrong shape for a button row)" },
    "Typography": { tier: "atom", role: "the summary total count", storyId: "atoms-text-typography-typography--overview" },
}

const COUNTS = [
    { type: "like" as const, count: 80 },
    { type: "love" as const, count: 32 },
    { type: "haha" as const, count: 16 },
]

/** LEAF — the reaction control on its own. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ReactionButton"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "myReaction = null, counts = 3 kinds",
                        why: "Others have reacted but this viewer hasn't — the trigger reads as a neutral invitation, and the summary stacks the three busiest emotions with the total beside them.",
                        code: "<ReactionButton counts={[{ type: \"like\", count: 80 }, { type: \"love\", count: 32 }, { type: \"haha\", count: 16 }]} onReact={react} />",
                        render: <ReactionButton counts={COUNTS} onReact={() => {}} />,
                    },
                    {
                        name: "myReaction = 'love'",
                        why: "The viewer picked \"Love\" — the trigger swaps its emoji and label to that pick. Picking the same emotion again removes it.",
                        code: "<ReactionButton myReaction=\"love\" counts={[...]} onReact={react} />",
                        render: <ReactionButton myReaction="love" counts={COUNTS.map((c) => (c.type === "love" ? { ...c, count: c.count + 1 } : c))} onReact={() => {}} />,
                    },
                    {
                        name: "counts = []",
                        why: "Nobody has reacted yet, so the summary is dropped entirely rather than showing a zero.",
                        code: "<ReactionButton onReact={react} />",
                        render: <ReactionButton onReact={() => {}} />,
                    },
                    {
                        name: "isPending = true",
                        why: "A reaction is in flight, so the trigger disables itself while the server answers.",
                        code: "<ReactionButton counts={[...]} isPending onReact={react} />",
                        render: <ReactionButton counts={COUNTS} isPending onReact={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ReactionButton"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The trigger shimmers while the reaction summary is still being fetched.",
                        code: "<ReactionButton isSkeleton onReact={react} />",
                        render: <ReactionButton isSkeleton onReact={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}
