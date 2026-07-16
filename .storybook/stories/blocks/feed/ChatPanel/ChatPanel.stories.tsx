import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ChatCircleDotsIcon } from "@phosphor-icons/react"
import { ChatPanel } from "@/components/blocks/feed/ChatPanel"
import { baseMessages, Controlled } from "./components"

const meta: Meta<typeof ChatPanel> = {
    title: "Features/Social/ChatPanel",
    component: ChatPanel,
}
export default meta
type Story = StoryObj<typeof ChatPanel>

/** Use for an ongoing conversation: several back-and-forth turns, with one turn carrying a row of reference sources. */
export const Conversation: Story = {
    parameters: { usage: "Use for a full chat surface: a scrollable message list, each message a ChatBubble by role, the teaching assistant's turn may attach a NestedCard of related lessons, and a Composer pinned to the bottom to type the next turn." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Conversation</Label>
                <Typography type="body-sm" color="muted">
                    A few back-and-forth turns, one of which is a teaching assistant turn that attaches the list of related lessons it found.
                </Typography>
            </div>
            <Controlled initialMessages={baseMessages} />
        </div>
    ),
}

/** Use when there are no messages yet: the list area gives way to a centered empty-state slot, the composer stays ready. */
export const Empty: Story = {
    parameters: { usage: "Use when the conversation hasn't started: the list area renders a centered empty-state slot instead of sitting blank, while the Composer at the bottom stays ready for the first message." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>No messages</Label>
                <Typography type="body-sm" color="muted">
                    With no messages, the panel shows an empty-state slot in the middle of the list area, inviting the user to type the first question.
                </Typography>
            </div>
            <Controlled
                initialMessages={[]}
                emptyState={(
                    <div className="flex flex-col items-center gap-2 text-center">
                        <ChatCircleDotsIcon aria-hidden focusable="false" className="size-8 text-muted" />
                        <Typography type="body-sm" color="muted">
                            No messages yet. Ask the teaching assistant your first question.
                        </Typography>
                    </div>
                )}
            />
        </div>
    ),
}

/** Use when the teaching assistant is composing a reply: three blinking dots show on the left below the last message. */
export const Typing: Story = {
    parameters: { usage: "Use when the other party is composing a reply: a three-dot blinking indicator appears on the teaching assistant's side, below the last message; the panel auto-scrolls to keep it in view." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Composing a reply</Label>
                <Typography type="body-sm" color="muted">
                    Turn on isTyping to show the three-dot indicator on the teaching assistant's side while the answer is being generated.
                </Typography>
            </div>
            <Controlled initialMessages={baseMessages.slice(0, 3)} isTyping />
        </div>
    ),
}
