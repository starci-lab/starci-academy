import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    OpsEventTable,
    type OpsEventFeedRow,
    type OpsEventTableLabels,
} from "@sb-components/nivo/blocks/agent-os/OpsEventTable/OpsEventTable"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OpsEventTable` — the Agent OS pod's timestamped activity feed: one event
 * per row (time · what happened · result). Two DATA states of the single
 * shape: `empty` and `with-events`. A fresh, pod-scoped, dark-shell block —
 * unrelated to the nivoexpert fixed platform-events reference table of the
 * same family name.
 */
const meta: Meta<typeof OpsEventTable> = {
    title: "Nivo/Blocks/AgentOs/OpsEventTable/OpsEventTable",
    component: OpsEventTable,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OpsEventTable>

const LABELS: OpsEventTableLabels = {
    title: "Recent events",
    description: "Activity from this pod's agents, channels, and workflows, newest first.",
    timeColumn: "Time",
    eventColumn: "Event",
    resultColumn: "Result",
    resultOptions: { success: "Success", info: "Info", failure: "Failed" },
    tableAriaLabel: "Agent OS recent events",
    emptyTitle: "No events yet",
    emptyDescription: "Activity from your agents, channels, and workflows will show up here.",
}

const EVENTS: Array<OpsEventFeedRow> = [
    { id: "ev-1", timeLabel: "09:41", description: "Agent \"Sales — Mai\" replied to a customer on Zalo", result: "success" },
    { id: "ev-2", timeLabel: "09:22", description: "Workflow \"Sync orders → Sheet\" ran", result: "success" },
    { id: "ev-3", timeLabel: "08:55", description: "WhatsApp Business channel reconnected", result: "success" },
    { id: "ev-4", timeLabel: "08:10", description: "Agent \"Accounting — Ha\" was paused by an admin", result: "info" },
    { id: "ev-5", timeLabel: "07:30", description: "Workflow \"Remind unpaid customers\" failed to send", result: "failure" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the titled card wrapping the events table" },
    Table: { tier: "composite", role: "one row per event — time, description, and result" },
    EmptyState: { tier: "composite", role: "shown when the pod has no activity yet" },
    Chip: { tier: "atom", role: "the event's result — success, info, or failed" },
    Typography: { tier: "atom", role: "the timestamps and event descriptions" },
}

/** LEAF — one shape; empty vs with-events are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OpsEventTable"
                tier="block"
                leaf="Events"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Blocks take no `className`: the block owns the pod's event stream, so empty vs with-events are states of one shape. Unbounded volume (proposal: 'ops events grow unbounded') makes this a table the console paginates around, not a fixed reference list."
                states={[
                    {
                        name: "events = [] (empty)",
                        why: "No activity yet — a freshly provisioned pod with no agent replies, workflow runs, or channel events. The empty state points at where activity will show up.",
                        code: "<OpsEventTable events={[]} labels={labels} />",
                        render: <OpsEventTable events={[]} labels={LABELS} />,
                    },
                    {
                        name: "with events",
                        why: "Five events across all three results — an agent reply and a workflow run (success), a channel reconnect (success), an admin pausing an agent (info), and a failed workflow send (failed) — so a glance at the feed shows what's healthy and what needs attention.",
                        code: "<OpsEventTable events={events} labels={labels} />",
                        render: <OpsEventTable events={EVENTS} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The first fetch hasn't resolved, so the card keeps its title and draws a fixed count of event-shaped rows — time, description, and result chip all shimmering — so nothing jumps when events land.",
                        code: "<OpsEventTable events={[]} labels={labels} isSkeleton />",
                        render: <OpsEventTable events={[]} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
