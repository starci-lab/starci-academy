import type { Meta, StoryObj } from "@storybook/nextjs"
import { GlobeIcon, TargetIcon, AddressBookIcon, ArrowClockwiseIcon, SparkleIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { SystemFlow, type SystemFlowLayer } from "@sb-components/nivo/blocks/landing/SystemFlow/SystemFlow"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SystemFlow` — the "a lead should not stop at the form" roadmap narrative:
 * six layers of the operating loop read as one connected system. Exactly one
 * layer (AI Agent) carries the standout emphasis in the real loop, and that
 * emphasis is DATA — feeding the same six layers with no layer flagged proves
 * the highlight is never hardcoded to a position.
 */
const meta: Meta<typeof SystemFlow> = {
    title: "Nivo/Blocks/Landing/SystemFlow/SystemFlow",
    component: SystemFlow,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SystemFlow>

const COPY = {
    eyebrow: "How nivo works",
    title: "A lead should not stop at the form.",
    intro: "The layers connect into one operating loop. nivo sells the first two today; the rest is the system you grow into as you're ready.",
}

const LAYERS_AI_HIGHLIGHTED: Array<SystemFlowLayer> = [
    { key: "website", icon: GlobeIcon, name: "Website", description: "Captures the lead", isHighlighted: false },
    { key: "lead", icon: TargetIcon, name: "Lead", description: "Gathers into one place", isHighlighted: false },
    { key: "crm", icon: AddressBookIcon, name: "CRM", description: "Owner and stage", isHighlighted: false },
    { key: "workflow", icon: ArrowClockwiseIcon, name: "Workflow", description: "Reminds at the right time", isHighlighted: false },
    { key: "ai-agent", icon: SparkleIcon, name: "AI Agent", description: "Supports the team", isHighlighted: true },
    { key: "dashboard", icon: ChartLineUpIcon, name: "Dashboard", description: "Measures growth", isHighlighted: false },
]

const LAYERS_NO_HIGHLIGHT: Array<SystemFlowLayer> = LAYERS_AI_HIGHLIGHTED.map((layer) => ({ ...layer, isHighlighted: false }))

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SectionHeading: { tier: "block", role: "the centered eyebrow / title / intro header", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    Grid: { tier: "frame", role: "the six layer tiles, 3 columns from `lg`" },
    SurfaceCard: { tier: "composite", role: "each layer's tile, one accent-ringed when highlighted" },
    StackV: { tier: "frame", role: "the header/grid rhythm, and each tile's icon / name / description stack" },
    IconTile: { tier: "atom", role: "each layer's icon" },
    Typography: { tier: "atom", role: "each layer's name and description" },
}

/** LEAF — `isHighlighted`: full coverage of both members of the per-layer boolean. */
export const AiEmphasis: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SystemFlow"
                tier="block"
                leaf="isHighlighted"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Every layer's icon, name, and description arrive as data, and so does which ONE layer carries the standout emphasis — the block never hardcodes a position as `the AI layer`. Feeding the same six layers with the flag cleared everywhere proves the highlight is optional per-layer data, not baked into the tile at a fixed index."
                states={[
                    {
                        name: "AI Agent layer isHighlighted",
                        why: "The real operating loop: the AI Agent layer carries the one standout ring among the six tiles, matching the brand's AI emphasis.",
                        code: `<SystemFlow
    eyebrow="How nivo works"
    title="A lead should not stop at the form."
    intro={intro}
    layers={[
        { key: "website", icon: GlobeIcon, name: "Website", description: "Captures the lead" },
        { key: "lead", icon: TargetIcon, name: "Lead", description: "Gathers into one place" },
        { key: "crm", icon: AddressBookIcon, name: "CRM", description: "Owner and stage" },
        { key: "workflow", icon: ArrowClockwiseIcon, name: "Workflow", description: "Reminds at the right time" },
        { key: "ai-agent", icon: SparkleIcon, name: "AI Agent", description: "Supports the team", isHighlighted: true },
        { key: "dashboard", icon: ChartLineUpIcon, name: "Dashboard", description: "Measures growth" },
    ]}
/>`,
                        render: <SystemFlow {...COPY} layers={LAYERS_AI_HIGHLIGHTED} />,
                    },
                    {
                        name: "isHighlighted unset on every layer",
                        why: "No layer stands out — the same six tiles read as equal peers, proving the emphasis is a per-layer flag the caller controls rather than a fixed fifth-tile rule.",
                        code: "<SystemFlow {...copy} layers={sixLayersWithNoHighlight} />",
                        render: <SystemFlow {...COPY} layers={LAYERS_NO_HIGHLIGHT} />,
                    },
                ]}
            />
        </div>
    ),
}
