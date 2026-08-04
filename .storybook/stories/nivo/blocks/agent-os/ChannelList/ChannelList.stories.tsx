import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ChannelList,
    type ChannelListItem,
    type ChannelListLabels,
} from "@sb-components/nivo/blocks/agent-os/ChannelList/ChannelList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ChannelList` — the pod's connected platforms with a "connect a channel"
 * trigger. Two DATA states of the single shape: `empty` and `with-rows`; a
 * failed channel's trailing action swaps from "view" to "reconnect".
 */
const meta: Meta<typeof ChannelList> = {
    title: "Nivo/Blocks/AgentOs/ChannelList/ChannelList",
    component: ChannelList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChannelList>

const LABELS: ChannelListLabels = {
    title: "Connected channels",
    connectLabel: "Connect channel",
    channelOptions: { zalo: "Zalo", telegram: "Telegram", whatsapp: "WhatsApp" },
    statusOptions: { connected: "Connected", disconnected: "Not connected", error: "Token expired" },
    viewLabel: "View conversations",
    reconnectLabel: "Reconnect",
    emptyTitle: "No channels connected yet",
    emptyDescription: "Connect Zalo, Telegram, or WhatsApp so agents can start answering customers.",
}

const CHANNELS: Array<ChannelListItem> = [
    { id: "ch-1", kind: "zalo", name: "Zalo OA — Nivo Sales", status: "connected" },
    { id: "ch-2", kind: "telegram", name: "Telegram Bot — @nivo_support_bot", status: "connected" },
    { id: "ch-3", kind: "whatsapp", name: "WhatsApp Business", status: "connected" },
    { id: "ch-4", kind: "zalo", name: "Zalo OA — Nivo Accounting", status: "error" },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card (with the connect button), and one nested row per channel" },
    IconTile: { tier: "atom", role: "the channel's platform glyph, toned by its connection health" },
    EmptyState: { tier: "composite", role: "the empty branch when no channel is connected" },
    Button: { tier: "atom", role: "the header connect trigger, and each row's view/reconnect action" },
    Typography: { tier: "atom", role: "the channel name and its status line" },
}

/** LEAF — the list has one shape; empty vs with-rows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChannelList"
                tier="block"
                leaf="Channel list"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the list owns the pod's channels entity, so empty vs with-rows are states of one shape. Each row's trailing action follows its OWN status — a healthy channel opens its inbox, a failed one reconnects — so the row never shows an action that would fail."
                states={[
                    {
                        name: "channels = []",
                        why: "No channel connected yet. The card keeps its title and the connect button, reading as an intentional empty state rather than a blank panel.",
                        code: `<ChannelList
    channels={[]}
    onViewChannel={view}
    onReconnectChannel={reconnect}
    onConnectNew={connect}
    labels={labels}
/>`,
                        render: <ChannelList channels={[]} onViewChannel={NOOP} onReconnectChannel={NOOP} onConnectNew={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "channels populated (one token-expired)",
                        why: "Three healthy channels show \"View conversations\"; the fourth failed re-authenticating and shows \"Reconnect\" instead, tinted danger — the SAME row shape, driven entirely by `status`.",
                        code: "<ChannelList channels={channels} onViewChannel={view} onReconnectChannel={reconnect} … />",
                        render: <ChannelList channels={CHANNELS} onViewChannel={NOOP} onReconnectChannel={NOOP} onConnectNew={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The list's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of channel-shaped rows — icon tile, name, and status line all shimmering — matching the loaded row so nothing jumps when the channels land.",
                        code: `<ChannelList
    channels={[]}
    onViewChannel={view}
    onReconnectChannel={reconnect}
    onConnectNew={connect}
    labels={labels}
    isSkeleton
/>`,
                        render: <ChannelList channels={[]} onViewChannel={NOOP} onReconnectChannel={NOOP} onConnectNew={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
