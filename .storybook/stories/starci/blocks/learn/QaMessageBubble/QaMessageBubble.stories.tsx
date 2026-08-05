import type { Meta, StoryObj } from "@storybook/nextjs"
import { QaMessageBubble, type QaMessageBubbleAnswer } from "@sb-components/starci/blocks/learn/QaMessageBubble/QaMessageBubble"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `QaMessageBubble`: one answer (plus its flattened replies) in a Q&A
 * conversation — author line, chat bubble body, an accept toggle (asker
 * only, top-level only), a reaction bar, and every reply beneath it,
 * read-only (see the component's own file header for why).
 */
const meta: Meta<typeof QaMessageBubble> = {
    title: "StarCi/Blocks/Learn/QaMessageBubble/QaMessageBubble",
    component: QaMessageBubble,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QaMessageBubble>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the outer column (top answer + its replies), and each message row's own author-line-over-bubble column", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the author line (avatar + name + time + accepted badge), and the reaction-bar/accept-toggle row beneath the top-level bubble", storyId: "frames-stack-stackh--default" },
    "Avatar": { tier: "atom", role: "the message author's avatar", storyId: "atoms-display-avatar-avatar--default" },
    "Typography": { tier: "atom", role: "author name and the relative-time fact on the author line", storyId: "atoms-text-typography-typography--overview" },
    "MarkdownContent": { tier: "composite", role: "the answer body, inside the chat bubble", storyId: "composites-viewers-markdowncontent--compact" },
    "QaChatBubble": { tier: "block", role: "the message surface itself", storyId: "starci-blocks-learn-qachatbubble-qachatbubble--roles" },
    "QaReactionBar": { tier: "block", role: "like-and-count toggle under the top-level answer only", storyId: "starci-blocks-learn-qareactionbar-qareactionbar--default" },
    "Chip": { tier: "atom", role: "the accepted-answer badge", storyId: "atoms-chips-chip-chip--tones" },
    "Button": { tier: "atom", role: "the accept/un-accept toggle, asker-only", storyId: "atoms-buttons-button-button--default" },
    "Skeleton": { tier: "heroui", role: "the author-line + bubble-shaped shimmer standing in for a not-yet-loaded answer" },
}

const BASE_ANSWER: QaMessageBubbleAnswer = {
    id: "a1",
    body: "Double-check your DATABASE_URL environment variable — I ran into this exact same error last week.",
    author: { id: "u2", displayName: "Quang" },
    createdTimeAgo: "1 hour ago",
    reactionCount: 2,
    myReaction: null,
}

/** LEAF — a plain top-level answer, viewer is NOT the asker so no accept toggle renders. */
export const PlainAnswer: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QaMessageBubble"
                tier="block"
                leaf="Plain answer"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "canAccept = false",
                        why: "The viewer isn't the asker of this question, so only the reaction bar renders beside the bubble — the accept toggle is the asker's alone.",
                        code: "<QaMessageBubble answer={answer} currentUserId=\"viewer\" canAccept={false} onAcceptAnswer={accept} onReact={react} />",
                        render: (
                            <QaMessageBubble


                                answer={BASE_ANSWER}
                                currentUserId="viewer"
                                canAccept={false}
                                onAcceptAnswer={() => {}}
                                onReact={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — asker viewing: the accept toggle appears; accepted state swaps its label and adds the badge. */
export const AskerCanAccept: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-4 p-8">
            <BlockAnatomy
                name="QaMessageBubble"
                tier="block"
                leaf="Asker can accept"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "canAccept = true, isAcceptedAnswer = false",
                        why: "The viewer IS the asker, so the accept toggle renders — labeled to invite the action, not yet showing the accepted badge.",
                        code: "<QaMessageBubble answer={answer} currentUserId=\"asker\" canAccept onAcceptAnswer={accept} onReact={react} />",
                        render: (
                            <QaMessageBubble
                                answer={BASE_ANSWER}
                                currentUserId="asker"
                                canAccept
                                onAcceptAnswer={() => {}}
                                onReact={() => {}}
                            />
                        ),
                    },
                    {
                        name: "canAccept = true, isAcceptedAnswer = true, replies = 1",
                        why: "This answer was accepted — the badge appears beside the author line and the toggle label flips to \"un-accept\". A flattened reply renders beneath it, indented and read-only (no reaction bar, no accept toggle of its own).",
                        code: "<QaMessageBubble answer={{ ...answer, isAcceptedAnswer: true, replies: [reply] }} currentUserId=\"asker\" canAccept onAcceptAnswer={accept} onReact={react} />",
                        render: (
                            <QaMessageBubble
                                answer={{
                                    ...BASE_ANSWER,
                                    isAcceptedAnswer: true,
                                    replies: [
                                        {
                                            id: "r1",
                                            body: "Thanks, it really was the environment variable!",
                                            author: { id: "u3", displayName: "Bao" },
                                            createdTimeAgo: "40 minutes ago",
                                            reactionCount: 0,
                                            myReaction: null,
                                        },
                                    ],
                                }}
                                currentUserId="asker"
                                canAccept
                                onAcceptAnswer={() => {}}
                                onReact={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; an avatar + two author-line bars + one bubble-shaped bar stand in for an answer that hasn't loaded yet — `answer` isn't required in this branch of the union (§12g.0a). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QaMessageBubble"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Before an answer streams in, the block mirrors its own shape rather than a generic bar: avatar circle, two short bars for the name and relative-time facts, and one bubble-shaped bar for the body — no reaction bar or accept toggle, since there's no real answer yet to react to or accept.",
                        code: "<QaMessageBubble isSkeleton currentUserId={null} canAccept={false} onAcceptAnswer={() => {}} onReact={() => {}} />",
                        render: (
                            <QaMessageBubble
                                isSkeleton


                                currentUserId={null}
                                canAccept={false}
                                onAcceptAnswer={() => {}}
                                onReact={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
