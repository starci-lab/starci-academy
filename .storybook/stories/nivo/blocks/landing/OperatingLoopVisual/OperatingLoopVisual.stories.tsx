import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ArrowsClockwiseIcon,
    ChartBarIcon,
    DatabaseIcon,
    GlobeIcon,
    SparkleIcon,
    TargetIcon,
} from "@phosphor-icons/react"
import { OperatingLoopVisual, type OperatingLoopVisualNode } from "@sb-components/nivo/blocks/landing/OperatingLoopVisual/OperatingLoopVisual"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OperatingLoopVisual` — the hero's six-stage flow rail (Website -> Lead -> CRM
 * -> Workflow -> AI Agent -> Dashboard). Which stage glows crimson is the one
 * leaf, so the story renders all six.
 */
const meta: Meta<typeof OperatingLoopVisual> = {
    title: "Nivo/Blocks/Landing/OperatingLoopVisual/OperatingLoopVisual",
    component: OperatingLoopVisual,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OperatingLoopVisual>

const NODES: Array<OperatingLoopVisualNode> = [
    { id: "website", label: "Website", icon: GlobeIcon },
    { id: "lead", label: "Lead", icon: TargetIcon },
    { id: "crm", label: "CRM", icon: DatabaseIcon },
    { id: "workflow", label: "Workflow", icon: ArrowsClockwiseIcon },
    { id: "ai-agent", label: "AI Agent", icon: SparkleIcon, isAi: true },
    { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Cluster: { tier: "frame", role: "the wrapping flow rail, one cell per stage" },
    StackV: { tier: "frame", role: "each stage's icon-over-label column" },
    IconTile: { tier: "atom", role: "each stage's icon, lit accent while active" },
    Typography: { tier: "atom", role: "each stage's label" },
    Chip: { tier: "atom", role: "the small AI marker under the AI Agent stage" },
}

/** LEAF — `activeNodeId`: every stage id is a value it can take. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OperatingLoopVisual"
                tier="block"
                leaf="activeNodeId"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Exactly one stage glows crimson at a time — `activeNodeId` is the one thing that varies, and every stage id is a value it can take, so all six render as states. The rail itself is vision framing (nivo does not sell CRM / Workflow / Dashboard yet); Website/Lead and the AI Agent stage are real today."
                states={NODES.map((node) => ({
                    name: node.id,
                    why: `The rail with "${node.label}" as the active stage — the crimson glow sits on whichever step the surrounding narrative is talking about.`,
                    code: `<OperatingLoopVisual nodes={nodes} activeNodeId="${node.id}" />`,
                    render: <OperatingLoopVisual nodes={NODES} activeNodeId={node.id} />,
                }))}
            />
        </div>
    ),
}
