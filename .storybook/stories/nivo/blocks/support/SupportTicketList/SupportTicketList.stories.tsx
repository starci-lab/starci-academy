import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    SupportTicketList,
    type SupportTicketListLabels,
    type SupportTicketRow,
} from "@sb-components/nivo/blocks/support/SupportTicketList/SupportTicketList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SupportTicketList` — the user's support tickets, each openable into its thread,
 * plus a header new-ticket trigger. Two DATA states of the single shape: `empty`
 * and `with-rows`. Grounded in the real `SupportTicketEntity`.
 */
const meta: Meta<typeof SupportTicketList> = {
    title: "Nivo/Blocks/Support/SupportTicketList/SupportTicketList",
    component: SupportTicketList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SupportTicketList>

const LABELS: SupportTicketListLabels = {
    title: "Support",
    newLabel: "New ticket",
    statusOptions: { open: "Open", answered: "Answered", closed: "Closed" },
    openAriaLabel: "Open ticket",
    emptyTitle: "No tickets yet",
    emptyDescription: "Open a ticket and our team will get back to you here.",
}

const TICKETS: Array<SupportTicketRow> = [
    { id: "tkt-1", subject: "Custom domain won't verify", status: "open", dateLabel: "01/08/2026" },
    { id: "tkt-2", subject: "How do I export my academy?", status: "answered", dateLabel: "28/07/2026" },
    { id: "tkt-3", subject: "Invoice receipt request", status: "closed", dateLabel: "19/07/2026" },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card (with the new-ticket button), and one pressable nested card per ticket" },
    EmptyState: { tier: "composite", role: "the empty branch when no tickets exist" },
    Chip: { tier: "atom", role: "the ticket's status, toned by who it's waiting on (open accent, answered success, closed muted)" },
    Button: { tier: "atom", role: "the header new-ticket trigger" },
    Typography: { tier: "atom", role: "the subject and the last-activity date" },
}

/** LEAF — the list has one shape; empty vs with-rows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SupportTicketList"
                tier="block"
                leaf="Ticket list"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the tickets entity, so empty vs with-rows are states of one shape. Each row is the whole press target (opens the thread), and the new-ticket trigger lives in the header so a user with no tickets can still open their first."
                states={[
                    {
                        name: "tickets = []",
                        why: "No tickets opened yet. The card keeps its title and the new-ticket button, and reads as an intentional empty state inviting the user to open their first rather than showing a blank panel.",
                        code: `<SupportTicketList
    tickets={[]}
    onOpenTicket={open}
    onNewTicket={create}
    labels={labels}
/>`,
                        render: <SupportTicketList tickets={[]} onOpenTicket={NOOP} onNewTicket={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "tickets populated",
                        why: "Three tickets across all three statuses — open (accent, waiting on us), answered (success, waiting on the user), closed (muted). Each row presses through to its thread; the header new-ticket button stays above.",
                        code: "<SupportTicketList tickets={tickets} onOpenTicket={open} … />",
                        render: <SupportTicketList tickets={TICKETS} onOpenTicket={NOOP} onNewTicket={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The list's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of ticket-shaped rows — subject, date and status chip all shimmering — matching the loaded row so nothing jumps when the tickets land.",
                        code: `<SupportTicketList
    tickets={[]}
    onOpenTicket={open}
    onNewTicket={create}
    labels={labels}
    isSkeleton
/>`,
                        render: <SupportTicketList tickets={[]} onOpenTicket={NOOP} onNewTicket={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
