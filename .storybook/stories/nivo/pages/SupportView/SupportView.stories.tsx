import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    SupportView,
    type SupportViewLabels,
    type SupportViewTicket,
} from "@sb-components/nivo/pages/SupportView/SupportView"
import type { SupportTicketRow } from "@sb-components/nivo/blocks/support/SupportTicketList/SupportTicketList"
import type { TicketThreadMessage } from "@sb-components/nivo/blocks/support/TicketThread/TicketThread"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SupportView` — the PAGE at `/support`: the ticket list, opened into one
 * ticket's thread. `view` NAMES which sub-view is on screen — `list` or
 * `thread`. The NEW-TICKET MODAL is a separate overlay this page never mounts
 * itself — see `NewTicketModal`'s own story. A page's story is one complete
 * STATE per story — `loading`, `list-empty`, `list-populated`, `thread` — not
 * a leaf-per-prop map. Grounded in the real `SupportTicketEntity` +
 * `TicketMessageEntity`.
 */
const meta: Meta<typeof SupportView> = {
    title: "Nivo/Pages/SupportView/SupportView",
    component: SupportView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SupportView>

const NOOP = () => {}

const LABELS: SupportViewLabels = {
    list: {
        title: "Support",
        newLabel: "New ticket",
        statusOptions: { open: "Open", answered: "Answered", closed: "Closed" },
        openAriaLabel: "Open ticket",
        emptyTitle: "No tickets yet",
        emptyDescription: "Open a ticket and our team will get back to you here — usually within 24 hours.",
    },
    thread: {
        statusOptions: { open: "Open", answered: "Answered", closed: "Closed" },
        authorOptions: { user: "You", staff: "Support" },
        replyPlaceholder: "Write a reply…",
        sendLabel: "Send reply",
        replyAriaLabel: "Reply to this ticket",
        closedLabel: "This ticket is closed.",
    },
    backToList: "Back to tickets",
}

const TICKETS: Array<SupportTicketRow> = [
    { id: "tkt-1", subject: "Custom domain won't verify", status: "open", dateLabel: "01/08/2026" },
    { id: "tkt-2", subject: "How do I export my academy?", status: "answered", dateLabel: "28/07/2026" },
]

const TICKET: SupportViewTicket = {
    subject: "How do I export my academy?",
    status: "answered",
}

const MESSAGES: Array<TicketThreadMessage> = [
    {
        id: "msg-1",
        authorRole: "user",
        body: "Is there a way to export my whole academy — courses, students, everything — before I cancel?",
        dateLabel: "28/07/2026 14:20",
    },
    {
        id: "msg-2",
        authorRole: "staff",
        body: "Yes — from Overview, use \"Export academy\" for a full ZIP. It includes every course and enrollment record.",
        dateLabel: "28/07/2026 15:03",
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "the page's vertical rhythm above an opened thread" },
    LinkBack: { tier: "atom", role: "the back link up to the ticket list" },
    SupportTicketList: {
        tier: "block",
        role: "every ticket, plus the header new-ticket trigger this page bubbles up rather than handling itself",
        storyId: "nivo-blocks-support-supportticketlist-supportticketlist--default",
    },
    TicketThread: {
        tier: "block",
        role: "one ticket opened up — messages plus the reply composer",
        storyId: "nivo-blocks-support-ticketthread-ticketthread--default",
    },
}

/** STATE — the page is still loading; the skeleton mirrors the `list` shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SupportView"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. Before the first fetch resolves the page has no `view` to discriminate on yet, so it mirrors the landing `list` shape."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Support is still fetching. The ticket list draws its resting shape — a fixed count of ticket-shaped rows shimmering — matching the loaded list exactly.",
                        code: "<SupportView isSkeleton labels={labels} />",
                        render: <SupportView isSkeleton labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a brand-new account with zero tickets. */
export const ListEmpty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SupportView"
                tier="screen"
                leaf="List — empty"
                annotate={ANNOTATE}
                reason="The critical new-account case: no tickets exist yet. The page doesn't special-case emptiness itself — `SupportTicketList` owns that branch, and its header new-ticket trigger stays present so there is always a way onward."
                states={[
                    {
                        name: "view = \"list\", tickets = []",
                        why: "A fresh account. The card keeps its title and the new-ticket button, reading as an intentional invitation rather than a blank panel.",
                        code: `<SupportView
    view="list"
    tickets={[]}
    onOpenTicket={open}
    onNewTicket={create}
    labels={labels}
/>`,
                        render: <SupportView view="list" tickets={[]} onOpenTicket={NOOP} onNewTicket={NOOP} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved list with tickets across statuses. */
export const ListPopulated: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SupportView"
                tier="screen"
                leaf="List — populated"
                annotate={ANNOTATE}
                reason="Two tickets across two statuses. The page names `SupportTicketList`, fed the tickets and the two callbacks, and draws no row shape of its own."
                states={[
                    {
                        name: "view = \"list\", tickets populated",
                        why: "The landing sub-view: every ticket, newest first, each pressable into its own thread, with the header new-ticket trigger above.",
                        code: "<SupportView view=\"list\" tickets={tickets} onOpenTicket={open} onNewTicket={create} labels={labels} />",
                        render: <SupportView view="list" tickets={TICKETS} onOpenTicket={NOOP} onNewTicket={NOOP} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — one ticket opened into its thread. */
export const Thread: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SupportView"
                tier="screen"
                leaf="Thread"
                annotate={ANNOTATE}
                reason="Opening a ticket swaps `view` to `thread`: a `LinkBack` up to the list sits above the ticket's own `TicketThread`, which owns the message bubbles and the reply composer."
                states={[
                    {
                        name: "view = \"thread\"",
                        why: "The user pressed a row on the list — the page shows that ticket's subject, status, and full message history, with a reply composer ready below.",
                        code: `<SupportView
    view="thread"
    ticket={ticket}
    messages={messages}
    replyValue=""
    onReplyChange={change}
    onSendReply={send}
    onBack={backToList}
    labels={labels}
/>`,
                        render: (
                            <SupportView
                                view="thread"
                                ticket={TICKET}
                                messages={MESSAGES}
                                replyValue=""
                                onReplyChange={NOOP}
                                onSendReply={NOOP}
                                onBack={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
