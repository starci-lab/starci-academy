import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    TicketThread,
    type TicketThreadLabels,
    type TicketThreadMessage,
} from "@sb-components/nivo/blocks/support/TicketThread/TicketThread"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `TicketThread` — one ticket opened up: status header, message bubbles by author,
 * and a reply composer. The variations are DATA states of the single shape:
 * `open`, `sending`, and `closed` (composer replaced by a closed line). Grounded
 * in the real `SupportTicketEntity` + `TicketMessageEntity`.
 */
const meta: Meta<typeof TicketThread> = {
    title: "Nivo/Blocks/Support/TicketThread/TicketThread",
    component: TicketThread,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof TicketThread>

const LABELS: TicketThreadLabels = {
    statusOptions: { open: "Open", answered: "Answered", closed: "Closed" },
    authorOptions: { user: "You", staff: "Support" },
    replyPlaceholder: "Write a reply…",
    sendLabel: "Send reply",
    replyAriaLabel: "Reply to this ticket",
    closedLabel: "This ticket is closed.",
}

const MESSAGES: Array<TicketThreadMessage> = [
    {
        id: "msg-1",
        authorRole: "user",
        body: "My custom domain academy.lequang.vn won't verify — the DNS record looks right to me.",
        dateLabel: "01/08/2026 09:14",
    },
    {
        id: "msg-2",
        authorRole: "staff",
        body: "Thanks for the details! DNS can take up to an hour to propagate. I can see the CNAME now — try again and it should verify.",
        dateLabel: "01/08/2026 10:02",
    },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the thread card, and one nested bubble per message" },
    Chip: { tier: "atom", role: "the ticket status in the header" },
    InputTextarea: { tier: "atom", role: "the reply composer (hidden once the ticket is closed)" },
    Button: { tier: "atom", role: "the send-reply action; busy while sending" },
    Typography: { tier: "atom", role: "the subject, author labels, message bodies, dates, and the closed line" },
}

/** LEAF — the thread has one shape; open / sending / closed are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TicketThread"
                tier="block"
                leaf="Ticket thread"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the ticket's status and the send-in-flight flag are DATA, so open / sending / closed are states of one shape. Messages align by `authorRole` (the user on the end in accent, staff on the start in muted) via the frame's `justify`, not hand-written classes. A closed ticket swaps the composer for a closed line so there is nothing to type into a thread no one will answer."
                states={[
                    {
                        name: "status = open",
                        why: "A live ticket: the user's opening message on the right, staff's reply on the left, and an empty composer ready below. This is the working shape the user reads and replies in.",
                        code: `<TicketThread
    subject="Custom domain won't verify"
    status="open"
    messages={messages}
    replyValue=""
    onReplyChange={change}
    onSendReply={send}
    labels={labels}
/>`,
                        render: (
                            <TicketThread
                                subject="Custom domain won't verify"
                                status="open"
                                messages={MESSAGES}
                                replyValue=""
                                onReplyChange={NOOP}
                                onSendReply={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSending = true",
                        why: "A reply is in flight: the composer holds the drafted text but locks, and the send button shows its busy state so the user can't double-send while the mutation runs.",
                        code: "<TicketThread status=\"open\" replyValue={draft} isSending … />",
                        render: (
                            <TicketThread
                                subject="Custom domain won't verify"
                                status="open"
                                messages={MESSAGES}
                                replyValue="Just tried again — it verified, thank you!"
                                onReplyChange={NOOP}
                                onSendReply={NOOP}
                                isSending
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = closed",
                        why: "A resolved ticket: the thread stays readable but the composer is gone, replaced by a muted closed line — a closed ticket takes no more replies.",
                        code: "<TicketThread status=\"closed\" messages={messages} … />",
                        render: (
                            <TicketThread
                                subject="Invoice receipt request"
                                status="closed"
                                messages={MESSAGES}
                                replyValue=""
                                onReplyChange={NOOP}
                                onSendReply={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The thread's own first fetch hasn't resolved yet, so the same shape stays put — the subject and status chip, a fixed count of message-shaped bubbles, and the composer all shimmer — matching the loaded thread so nothing jumps when the messages land.",
                        code: `<TicketThread
    subject="Custom domain won't verify"
    status="open"
    messages={[]}
    replyValue=""
    onReplyChange={change}
    onSendReply={send}
    labels={labels}
    isSkeleton
/>`,
                        render: (
                            <TicketThread
                                subject="Custom domain won't verify"
                                status="open"
                                messages={[]}
                                replyValue=""
                                onReplyChange={NOOP}
                                onSendReply={NOOP}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
