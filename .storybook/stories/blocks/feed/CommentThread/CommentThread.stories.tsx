import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ChatsCircleIcon } from "@phosphor-icons/react"
import { CommentThread } from "@/components/blocks/feed/CommentThread"
import { baseComments, Controlled } from "./components"

const meta: Meta<typeof CommentThread> = {
    title: "Block/Feed/CommentThread",
    component: CommentThread,
}
export default meta
type Story = StoryObj<typeof CommentThread>

/** Use for a discussion thread that already has content, with two nested reply levels and a reaction bar on each row. */
export const Thread: Story = {
    parameters: { usage: "Use for a nested comment thread: each node is a CommunityCommentRow, replies indent one level behind a guide rail (with a depth cap), each node has a Reply button that opens an inline Composer, and a root Composer to add top-level comments." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Two-level thread</Label>
                <Typography type="body-sm" color="muted">
                    A root question, the founder's answer, and a reply nested one level deeper; click Reply on any row to open the inline composer.
                </Typography>
            </div>
            <Controlled initialComments={baseComments} />
        </div>
    ),
}

/** Use when there are no comments yet: only the root Composer remains, inviting the first comment. */
export const Empty: Story = {
    parameters: { usage: "Use when the thread has no comments: the list is empty so only the root Composer sits at the top, inviting the first comment." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>No comments</Label>
                <Typography type="body-sm" color="muted">
                    <span className="inline-flex items-center gap-1">
                        <ChatsCircleIcon aria-hidden focusable="false" className="size-4" />
                        With no nodes, only the root Composer shows; sending a comment creates the first top-level node.
                    </span>
                </Typography>
            </div>
            <Controlled initialComments={[]} />
        </div>
    ),
}
