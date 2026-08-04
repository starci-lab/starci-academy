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
    OperatingLoopHero,
    type OperatingLoopHeroMetric,
    type OperatingLoopHeroTrustPoint,
} from "@sb-components/nivo/blocks/landing/OperatingLoopHero/OperatingLoopHero"
import type { OperatingLoopVisualNode } from "@sb-components/nivo/blocks/landing/OperatingLoopVisual/OperatingLoopVisual"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OperatingLoopHero` — the V2 landing's dark, premium full-fold hero: the
 * Big-Idea headline, three CTAs, the {@link OperatingLoopVisual} flow rail,
 * and a floating Cloud-White mini dashboard card. It has one resting shape —
 * all three CTAs always show — so the one leaf renders that default.
 */
const meta: Meta<typeof OperatingLoopHero> = {
    title: "Nivo/Blocks/Landing/OperatingLoopHero/OperatingLoopHero",
    component: OperatingLoopHero,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OperatingLoopHero>

const NOOP = () => {}

const FLOW_NODES: Array<OperatingLoopVisualNode> = [
    { id: "website", label: "Website", icon: GlobeIcon },
    { id: "lead", label: "Lead", icon: TargetIcon },
    { id: "crm", label: "CRM", icon: DatabaseIcon },
    { id: "workflow", label: "Workflow", icon: ArrowsClockwiseIcon },
    { id: "ai-agent", label: "AI Agent", icon: SparkleIcon, isAi: true },
    { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
]

const TRUST_POINTS: Array<OperatingLoopHeroTrustPoint> = [
    { id: "rollout", label: "Rolled out by industry" },
    { id: "onboarding", label: "A clear onboarding path" },
    { id: "accountability", label: "AI supports, people stay accountable" },
]

const DASHBOARD_METRICS: Array<OperatingLoopHeroMetric> = [
    { id: "leads", label: "Leads this week", value: "—" },
    { id: "in-progress", label: "Being nurtured", value: "—" },
    { id: "conversion", label: "Conversion", value: "▲ —" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Container: { tier: "frame", role: "the centered, width-capped hero column" },
    Grid: { tier: "frame", role: "the text half beside the visual half, stacking below `lg`" },
    StackV: { tier: "frame", role: "the copy rhythm and the visual-half rhythm" },
    StackH: { tier: "frame", role: "the mini dashboard card's title-beside-badge header" },
    Cluster: { tier: "frame", role: "the 3-CTA row, the trust-microcopy row, and the dashboard's KPI row" },
    Typography: { tier: "atom", role: "the eyebrow, headline, description, trust microcopy, and KPI text" },
    Button: { tier: "atom", role: "the primary, secondary, and ghost CTAs" },
    Chip: { tier: "atom", role: "the mini dashboard card's AI-insight badge" },
    SurfaceCard: { tier: "composite", role: "the floating Cloud-White mini dashboard card" },
    OperatingLoopVisual: { tier: "block", role: "the six-stage flow rail", storyId: "nivo-blocks-landing-operatingloopvisual-operatingloopvisual--default" },
}

/** LEAF — the hero has one resting shape: all three CTAs always show. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OperatingLoopHero"
                tier="block"
                leaf="OperatingLoopHero"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. The brand's site-wide hero contract keeps all three CTAs live together — one north-star primary into the catalog, a secondary into the Lead-Leakage audit, and a quiet ghost link to the demo — so the shape does not vary; the one leaf renders that resting default. The section forces `dark` regardless of the shell's own theme (this hero is always the premium dark fold), and the mini dashboard card forces `light` back on itself so it reads as a real floating product surface, not a themed panel."
                states={[
                    {
                        name: "default",
                        why: "The V2 landing hero as a guest sees it: the Big-Idea headline, three CTAs, the flow rail, and the illustrative Growth Dashboard card.",
                        code: `<OperatingLoopHero
    eyebrow="AI-First business infrastructure for SMEs"
    headline="Start from one platform product. Grow into an AI-First business system."
    description="nivo helps SMEs build the system from Website -> Lead -> CRM -> Workflow -> AI Agent -> Dashboard, so no lead falls through, follow-up stays consistent, and growth is easy to see."
    primaryCta={{ label: "Choose a plan to start", onPress: openCatalog }}
    secondaryCta={{ label: "Run a Lead Leakage Audit", onPress: openAudit }}
    tertiaryCta={{ label: "See the system demo", onPress: scrollToDemo }}
    trustPoints={trustPoints}
    flowNodes={flowNodes}
    activeFlowNodeId="ai-agent"
    dashboardTitle="Growth Dashboard"
    dashboardBadgeLabel="AI insight"
    dashboardMetrics={dashboardMetrics}
/>`,
                        render: (
                            <OperatingLoopHero
                                eyebrow="AI-First business infrastructure for SMEs"
                                headline="Start from one platform product. Grow into an AI-First business system."
                                description="nivo helps SMEs build the system from Website -> Lead -> CRM -> Workflow -> AI Agent -> Dashboard, so no lead falls through, follow-up stays consistent, and growth is easy to see."
                                primaryCta={{ label: "Choose a plan to start", onPress: NOOP }}
                                secondaryCta={{ label: "Run a Lead Leakage Audit", onPress: NOOP }}
                                tertiaryCta={{ label: "See the system demo", onPress: NOOP }}
                                trustPoints={TRUST_POINTS}
                                flowNodes={FLOW_NODES}
                                activeFlowNodeId="ai-agent"
                                dashboardTitle="Growth Dashboard"
                                dashboardBadgeLabel="AI insight"
                                dashboardMetrics={DASHBOARD_METRICS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
