import type { Meta, StoryObj } from "@storybook/nextjs"
import { DemoFlow, type DemoFlowStep } from "@sb-components/nivo/blocks/landing/DemoFlow/DemoFlow"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DemoFlow` — the landing's "watch a lead move through nivo" preview: a
 * numbered row of demo cards, one per leg of the flow. A VISION preview
 * (nivo does not ship the full click-through walkthrough yet), so — matching
 * `SystemFlow`/`SystemStoryCard` — that honesty lives in `intro`, never a
 * badge this block draws itself. Feeding a shorter list proves the grid
 * reflows on real data, not a fixed four-card layout.
 */
const meta: Meta<typeof DemoFlow> = {
    title: "Nivo/Blocks/Landing/DemoFlow/DemoFlow",
    component: DemoFlow,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DemoFlow>

const NOOP = () => {}

const COPY = {
    eyebrow: "Demo",
    title: "See how a lead flows through nivo.",
    intro: "A preview of the full walkthrough — nivo sells the first two legs today; watch how the rest of the loop connects.",
}

// The four real legs from the approved prototype: Website→CRM, CRM Pipeline,
// Workflow follow-up, AI Sales Assistant.
const FOUR_STEPS: Array<DemoFlowStep> = [
    { key: "website-crm", stepNumber: 1, name: "Website → CRM", ctaLabel: "Watch this step", onPress: NOOP },
    { key: "crm-pipeline", stepNumber: 2, name: "CRM Pipeline", ctaLabel: "Watch this step", onPress: NOOP },
    { key: "workflow", stepNumber: 3, name: "Workflow follow-up", ctaLabel: "Watch this step", onPress: NOOP },
    { key: "ai-agent", stepNumber: 4, name: "AI Sales Assistant", ctaLabel: "Watch this step", onPress: NOOP },
]

// A shorter, two-leg preview — the grid reflows on real DATA, not a fixed four-card shape.
const TWO_STEPS: Array<DemoFlowStep> = FOUR_STEPS.slice(0, 2)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SectionHeading: { tier: "block", role: "the centered eyebrow / title / intro header", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    SurfaceCardPressableGroup: { tier: "composite", role: "the whole-card press grid, one tile per demo leg" },
    StackV: { tier: "frame", role: "the header/grid rhythm, and each card's badge / name / CTA stack" },
    StepBadge: { tier: "atom", role: "each card's leading step number" },
    Typography: { tier: "atom", role: "each card's name and play-CTA line" },
}

/** LEAF — `steps`: the four demo legs; a shorter list proves the grid is driven by data, not a fixed count. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DemoFlow"
                tier="block"
                leaf="steps"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Every step's number, name, and CTA label arrive as data, and the whole card fires one callback — this block invents no destination of its own, only the numbered-card arrangement. Feeding a shorter list reflows the same grid instead of leaving empty cells, proving the count comes from `steps.length`."
                states={[
                    {
                        name: "four legs (the grounded default)",
                        why: "The real four-leg walkthrough from the approved prototype: a lead's website capture, its CRM pipeline, an automated follow-up, then the AI Sales Assistant.",
                        code: `<DemoFlow
    eyebrow="Demo"
    title="See how a lead flows through nivo."
    intro={intro}
    steps={[
        { key: "website-crm", stepNumber: 1, name: "Website → CRM", ctaLabel: "Watch this step", onPress: openDemo },
        { key: "crm-pipeline", stepNumber: 2, name: "CRM Pipeline", ctaLabel: "Watch this step", onPress: openDemo },
        { key: "workflow", stepNumber: 3, name: "Workflow follow-up", ctaLabel: "Watch this step", onPress: openDemo },
        { key: "ai-agent", stepNumber: 4, name: "AI Sales Assistant", ctaLabel: "Watch this step", onPress: openDemo },
    ]}
/>`,
                        render: <DemoFlow {...COPY} steps={FOUR_STEPS} />,
                    },
                    {
                        name: "two legs",
                        why: "A shorter preview still lays out cleanly — the grid reflows from real data instead of assuming a fixed four-card shape.",
                        code: `<DemoFlow {...copy} steps={fourSteps.slice(0, 2)} />`,
                        render: <DemoFlow {...COPY} steps={TWO_STEPS} />,
                    },
                ]}
            />
        </div>
    ),
}
