import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ArrowsClockwiseIcon,
    ChartBarIcon,
    DatabaseIcon,
    GlobeIcon,
    SparkleIcon,
    TargetIcon,
} from "@phosphor-icons/react"
import {
    OperatingLoopRail,
    type OperatingLoopRailNode,
} from "@sb-components/nivo/blocks/dashboard/OperatingLoopRail/OperatingLoopRail"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OperatingLoopRail` — the dashboard's compact read of the six-stage
 * Operating Loop (Website -> Lead -> CRM -> Workflow -> AI Agent ->
 * Dashboard): a pill per stage, lit accent for whichever the account has
 * wired up. `activeNodeIds` is the one leaf — a set rather than a single
 * active stage, since a real account can have several stages live at once.
 */
const meta: Meta<typeof OperatingLoopRail> = {
    title: "Nivo/Blocks/Dashboard/OperatingLoopRail/OperatingLoopRail",
    component: OperatingLoopRail,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OperatingLoopRail>

// Same six-stage vocabulary as the landing hero's `OperatingLoopVisual` — the
// loop end-to-end is vision framing (nivo does not sell CRM / Workflow /
// Dashboard yet); Website/Lead and the AI Agent stage are real today.
const NODES: Array<OperatingLoopRailNode> = [
    { id: "website", label: "Website", icon: GlobeIcon },
    { id: "lead", label: "Lead", icon: TargetIcon },
    { id: "crm", label: "CRM", icon: DatabaseIcon },
    { id: "workflow", label: "Workflow", icon: ArrowsClockwiseIcon },
    { id: "ai-agent", label: "AI Agent", icon: SparkleIcon },
    { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
]

const LABELS = { title: "Your operating loop" }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the card face and its skeleton mirror" },
    Cluster: { tier: "frame", role: "the wrapping pill rail, one cell per stage" },
    Chip: { tier: "atom", role: "each stage's pill — accent when the account has it wired up" },
}

/** LEAF — `activeNodeIds`: a brand-new account has none lit, a running one has several at once. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-3xl p-8">
            <BlockAnatomy
                name="OperatingLoopRail"
                tier="block"
                leaf="activeNodeIds"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. `activeNodeIds` is a SET, not one active stage — unlike the marketing hero's `OperatingLoopVisual`, a real account can have Website, Lead, and the AI Agent all live at once. CRM/Workflow/Dashboard stay unlit in every state because nivo does not sell those layers yet."
                states={[
                    {
                        name: "brand-new account — nothing wired up",
                        why: "No stage is lit: the account has not published a site, captured a lead, or activated the AI Agent yet.",
                        code: `<OperatingLoopRail
    nodes={nodes}
    activeNodeIds={[]}
    labels={{ title: "Your operating loop" }}
/>`,
                        render: <OperatingLoopRail nodes={NODES} activeNodeIds={[]} labels={LABELS} />,
                    },
                    {
                        name: "running account — three stages live",
                        why: "Website, Lead, and the AI Agent are all wired up at once — the real shape of an account that published a site and turned the agent on.",
                        code: `<OperatingLoopRail
    nodes={nodes}
    activeNodeIds={["website", "lead", "ai-agent"]}
    labels={{ title: "Your operating loop" }}
/>`,
                        render: (
                            <OperatingLoopRail
                                nodes={NODES}
                                activeNodeIds={["website", "lead", "ai-agent"]}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The rail's own first fetch hasn't resolved yet — every pill shimmers in place.",
                        code: `<OperatingLoopRail
    nodes={nodes}
    activeNodeIds={[]}
    labels={{ title: "Your operating loop" }}
    isSkeleton
/>`,
                        render: <OperatingLoopRail nodes={NODES} activeNodeIds={[]} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
