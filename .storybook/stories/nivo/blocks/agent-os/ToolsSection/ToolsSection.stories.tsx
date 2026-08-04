import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ToolsSection,
    type AgentOsToolRow,
    type ToolsSectionLabels,
} from "@sb-components/nivo/blocks/agent-os/ToolsSection/ToolsSection"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ToolsSection` — the Agent OS pod's "Tools" tab: the integrations an agent
 * can call, each switchable on/off for the whole pod. Two DATA states of the
 * single shape: `empty` and `with-rows`. A BASIC stub-section — the toggle is
 * real, per-agent tool assignment is deferred to `AgentDetailDrawer`.
 */
const meta: Meta<typeof ToolsSection> = {
    title: "Nivo/Blocks/AgentOs/ToolsSection/ToolsSection",
    component: ToolsSection,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ToolsSection>

const LABELS: ToolsSectionLabels = {
    title: "Tools",
    description: "Integrations your pod's agents can call while they work.",
    enabledLabel: "On",
    disabledLabel: "Off",
    emptyTitle: "No tools available yet",
    emptyDescription: "Tools unlock as your pod finishes provisioning.",
}

const TOOLS: Array<AgentOsToolRow> = [
    { id: "tool-1", name: "Order lookup", description: "Check an order's status by phone number or order code.", isEnabled: true },
    { id: "tool-2", name: "Send payment link", description: "Generate and send a SePay/PayOS payment link.", isEnabled: true },
    { id: "tool-3", name: "Calendar booking", description: "Offer and confirm an appointment slot.", isEnabled: false },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card, and one nested card per tool" },
    EmptyState: { tier: "composite", role: "the empty branch before the pod has any tool available" },
    ChoiceSwitch: { tier: "atom", role: "turns one tool on or off for the whole pod" },
    Typography: { tier: "atom", role: "the tool name and description" },
}

/** LEAF — one shape; empty vs with-rows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ToolsSection"
                tier="block"
                leaf="Tools"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the pod's tool list, so empty vs with-rows are states of one shape. This is a BASIC stub-section — the on/off switch is real and pod-wide; deciding WHICH agent gets WHICH tool lives in `AgentDetailDrawer`, not here."
                states={[
                    {
                        name: "tools = []",
                        why: "No tools available yet — a pod that hasn't finished provisioning. The card keeps its title and reads as an intentional empty state.",
                        code: `<ToolsSection
    tools={[]}
    onToggleTool={toggle}
    labels={labels}
/>`,
                        render: <ToolsSection tools={[]} onToggleTool={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "tools populated",
                        why: "Three tools, two on and one off — each switch fires independently to turn that tool on or off pod-wide.",
                        code: "<ToolsSection tools={tools} onToggleTool={toggle} togglingId=\"tool-2\" labels={labels} />",
                        render: <ToolsSection tools={TOOLS} onToggleTool={NOOP} togglingId="tool-2" labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The section's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of tool-shaped rows — name, description, and switch all shimmering and locked.",
                        code: `<ToolsSection
    tools={[]}
    onToggleTool={toggle}
    labels={labels}
    isSkeleton
/>`,
                        render: <ToolsSection tools={[]} onToggleTool={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
