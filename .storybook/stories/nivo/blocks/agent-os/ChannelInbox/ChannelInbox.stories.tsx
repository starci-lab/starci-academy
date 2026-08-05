import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ChannelInbox,
    type ChannelInboxLabels,
    type ChannelInboxThread,
} from "@sb-components/nivo/blocks/agent-os/ChannelInbox/ChannelInbox"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ChannelInbox` — the pod's conversation threads across every connected
 * channel, the VOLUME region of Agent OS: a paged list, each row opening into
 * `ThreadDrawer`. Two DATA states of the single shape: `empty` and
 * `with-rows`, client-paged the same way `SubmissionAttemptsDrawer` is.
 */
const meta: Meta<typeof ChannelInbox> = {
    title: "Nivo/Blocks/AgentOs/ChannelInbox/ChannelInbox",
    component: ChannelInbox,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChannelInbox>

const LABELS: ChannelInboxLabels = {
    title: "Conversations",
    openAriaLabel: "Open conversation",
    pagerAriaLabel: "Conversations pagination",
    emptyTitle: "No conversations yet",
    emptyDescription: "Once a customer messages a connected channel, the thread shows up here.",
}

const THREADS: Array<ChannelInboxThread> = [
    { id: "th-1", customerName: "Tran Thi Mai", channel: "zalo", previewText: "Can you tell me the Pro plan price? Any discount right now?", timeLabel: "2 minutes ago", hasUnread: true },
    { id: "th-2", customerName: "Le Van Hung", channel: "telegram", previewText: "Thanks, I already received the order", timeLabel: "25 minutes ago", hasUnread: false },
    { id: "th-3", customerName: "Pham Thu Ha", channel: "zalo", previewText: "Do you issue a VAT invoice?", timeLabel: "1 hour ago", hasUnread: true },
    { id: "th-4", customerName: "Do Quang Minh", channel: "whatsapp", previewText: "How many days does shipping to Can Tho take?", timeLabel: "3 hours ago", hasUnread: false },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card, and one nested row per thread" },
    Avatar: { tier: "atom", role: "the customer's initials fallback" },
    Badge: { tier: "atom", role: "the unread dot, standalone (no anchor child)" },
    EmptyState: { tier: "composite", role: "the empty branch when there is no conversation yet" },
    Pagination: { tier: "atom", role: "the page nav — only reachable once there is more than one page" },
    Typography: { tier: "atom", role: "the customer name, the preview line, and the relative time" },
}

/** A controlled wrapper so the page-nav leaf demonstrates a real client-paged flip. */
type ControlledChannelInboxProps = {
    threads: Array<ChannelInboxThread>
    isSkeleton?: boolean
}
const ControlledChannelInbox = ({ threads, isSkeleton }: ControlledChannelInboxProps) => {
    const [page, setPage] = useState(1)
    const pageSize = 2
    const totalPages = Math.max(1, Math.ceil(threads.length / pageSize))
    const paged = threads.slice((page - 1) * pageSize, page * pageSize)
    return (
        <ChannelInbox
            threads={paged}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onOpenThread={NOOP}
            labels={LABELS}
            isSkeleton={isSkeleton}
        />
    )
}

/** LEAF — the inbox has one shape; empty vs with-rows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChannelInbox"
                tier="block"
                leaf="Conversation inbox"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the inbox owns the pod's thread entity, so empty vs with-rows are states of one shape. Threads are the ONE region in Agent OS that grows unbounded — the pager lives inside this block, sliced client-side, so the caller only hands over one page of threads."
                states={[
                    {
                        name: "threads = []",
                        why: "No customer has messaged a connected channel yet — the card keeps its title and reads as an intentional empty state.",
                        code: `<ChannelInbox
    threads={[]}
    currentPage={1}
    totalPages={1}
    onPageChange={setPage}
    onOpenThread={open}
    labels={labels}
/>`,
                        render: <ChannelInbox threads={[]} currentPage={1} totalPages={1} onPageChange={NOOP} onOpenThread={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "threads populated, paged 2-at-a-time",
                        why: "Four threads over a 2-per-page window — the pager flips between them; unread threads (a live accent dot) sit alongside already-read ones.",
                        code: "<ChannelInbox threads={pagedThreads} currentPage={page} totalPages={totalPages} onPageChange={setPage} onOpenThread={open} … />",
                        render: <ControlledChannelInbox threads={THREADS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The inbox's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of thread-shaped rows — avatar, name, preview, and time all shimmering — and the pager is dropped until a real page count exists.",
                        code: `<ChannelInbox
    threads={[]}
    currentPage={1}
    totalPages={1}
    onPageChange={setPage}
    onOpenThread={open}
    labels={labels}
    isSkeleton
/>`,
                        render: <ControlledChannelInbox threads={[]} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
