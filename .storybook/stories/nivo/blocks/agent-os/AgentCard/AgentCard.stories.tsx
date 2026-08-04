import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AgentCard,
    type AgentCardLabels,
    type AgentOsChannelKind,
} from "@sb-components/nivo/blocks/agent-os/AgentCard/AgentCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AgentCard` — one Agent OS agent, tappable into its `AgentDetailDrawer`:
 * persona name + model, its connected channels as a chip row, and a status
 * line. Two DATA states of `status` (`active` / `paused`), plus the
 * co-located `isSkeleton` loading mirror.
 */
const meta: Meta<typeof AgentCard> = {
    title: "Nivo/Blocks/AgentOs/AgentCard/AgentCard",
    component: AgentCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AgentCard>

const LABELS: AgentCardLabels = {
    statusOptions: { active: "Active", paused: "Paused" },
    channelOptions: { zalo: "Zalo", telegram: "Telegram", whatsapp: "WhatsApp" },
    openAriaLabel: "Open agent",
}

const CHANNELS: ReadonlyArray<AgentOsChannelKind> = ["zalo", "telegram"]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the whole-card press target opening the agent's detail drawer" },
    Avatar: { tier: "atom", role: "the persona's initials fallback" },
    ChipGroup: { tier: "composite", role: "the agent's connected channels" },
    Chip: { tier: "atom", role: "the status line — a neutral chip carrying a colored presence dot" },
    Typography: { tier: "atom", role: "the persona name and its model" },
}

/** LEAF — the card has one shape; active / paused are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentCard"
                tier="block"
                leaf="Agent status"
                annotate={ANNOTATE}
                renderClassName="max-w-xs"
                reason="Blocks take no `className`: the card owns one agent entity, so active vs paused is a state of one shape, not a separate component. The whole card is the press target into `AgentDetailDrawer` — there is no secondary affordance to compete with it."
                states={[
                    {
                        name: "status = active",
                        why: "The agent is answering messages on its connected channels — the common state a working pod's agent grid mostly shows.",
                        code: `<AgentCard
    name="Sales — Mai"
    model="GPT-4o mini"
    channels={["zalo", "telegram"]}
    status="active"
    onOpen={open}
    labels={labels}
/>`,
                        render: <AgentCard name="Sales — Mai" model="GPT-4o mini" channels={CHANNELS} status="active" onOpen={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "status = paused",
                        why: "An admin paused this agent — the status chip's dot goes muted so the grid reads at a glance which agents are silent.",
                        code: "<AgentCard status=\"paused\" … />",
                        render: <AgentCard name="Accounting — Ha" model="Claude Haiku" channels={["telegram"]} status="paused" onOpen={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The agent grid's own first fetch hasn't resolved yet, so the same card shape shimmers — avatar, name, model, one placeholder channel chip, and the status line — matching the loaded card so nothing jumps when the agents land.",
                        code: `<AgentCard
    name="Sales — Mai"
    model="GPT-4o mini"
    channels={["zalo", "telegram"]}
    status="active"
    onOpen={open}
    labels={labels}
    isSkeleton
/>`,
                        render: <AgentCard name="Sales — Mai" model="GPT-4o mini" channels={CHANNELS} status="active" onOpen={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
