import type { Meta, StoryObj } from "@storybook/nextjs"
import { QaConversationHeader } from "@sb-components/starci/blocks/learn/QaConversationHeader/QaConversationHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `QaConversationHeader`: the top of an EXPANDED question thread —
 * collapse control, asker identity, who joined in, reply count.
 */
const meta: Meta<typeof QaConversationHeader> = {
    title: "StarCi/Blocks/Learn/QaConversationHeader/QaConversationHeader",
    component: QaConversationHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QaConversationHeader>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the root row placing collapse control, avatar, identity column, avatar group and follow toggle on one baseline", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the identity column stacking the asker's name row above the reply-count line", storyId: "frames-stack-stackv--default" },
    "Button": { tier: "atom", role: "the collapse-back control, and the optional follow toggle", storyId: "atoms-buttons-button-button--default" },
    "Avatar": { tier: "atom", role: "the asker's avatar", storyId: "atoms-display-avatar-avatar--default" },
    "AvatarGroup": { tier: "atom", role: "distinct people who have answered so far", storyId: "composites-lists-avatargroup--default" },
    "Typography": { tier: "atom", role: "asker name and the reply-count line", storyId: "atoms-text-typography-typography--overview" },
}

const ASKER = { id: "u1", displayName: "Minh Anh", avatarUrl: undefined }
const PARTICIPANTS = [
    { id: "u2", displayName: "Quang" },
    { id: "u3", displayName: "Linh" },
    { id: "u4", displayName: "Bao" },
]

/** LEAF — has replies: reply count reads as a fact, avatar group shows who joined in. */
export const HasReplies: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QaConversationHeader"
                tier="block"
                leaf="Has replies"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "replyCount = 3, isFounderAsker = true",
                        why: "Three distinct people have answered, so the avatar group renders and the count line reads as a fact rather than a nudge. The asker carries a founder badge since course founders can ask questions too.",
                        code: "<QaConversationHeader asker={asker} isFounderAsker participants={participants} replyCount={3} onCollapse={collapse} />",
                        render: (
                            <QaConversationHeader


                                asker={ASKER}
                                isFounderAsker
                                participants={PARTICIPANTS}
                                replyCount={3}
                                onCollapse={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — zero replies: the count line becomes a "be first" nudge, avatar group does not render. */
export const NoRepliesYet: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QaConversationHeader"
                tier="block"
                leaf="No replies yet"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "replyCount = 0, participants = []",
                        why: "Nobody has answered yet, so the count line swaps to a \"be first\" nudge and no avatar group renders — there is nobody to show.",
                        code: "<QaConversationHeader asker={asker} participants={[]} replyCount={0} onCollapse={collapse} />",
                        render: (
                            <QaConversationHeader
                                asker={ASKER}
                                participants={[]}
                                replyCount={0}
                                onCollapse={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
