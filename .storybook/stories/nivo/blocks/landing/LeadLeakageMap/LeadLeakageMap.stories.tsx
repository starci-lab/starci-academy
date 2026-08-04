import type { Meta, StoryObj } from "@storybook/nextjs"
import { LeadLeakageMap, type LeadLeakageMapStage } from "@sb-components/nivo/blocks/landing/LeadLeakageMap/LeadLeakageMap"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeadLeakageMap` — the honest stage list showing where a lead's journey
 * usually breaks down. Feeding different `stages` arrays proves the leak
 * highlighting is derived from data, never hardcoded into the block.
 */
const meta: Meta<typeof LeadLeakageMap> = {
    title: "Nivo/Blocks/Landing/LeadLeakageMap/LeadLeakageMap",
    component: LeadLeakageMap,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeadLeakageMap>

// The real six-stage funnel this block is grounded in — three leak points,
// matching the approved `nivo-landing.proposal.md` prototype.
const LEAKY_STAGES: Array<LeadLeakageMapStage> = [
    { key: "visit", label: "Visitor lands on the website" },
    { key: "no-cta", label: "No clear CTA or form", isLeak: true, leakLabel: "LEAK" },
    { key: "left-info", label: "Leaves their info" },
    { key: "no-owner", label: "No one is assigned to follow up", isLeak: true, leakLabel: "LEAK" },
    { key: "forgot", label: "Follow-up gets forgotten", isLeak: true, leakLabel: "LEAK" },
    { key: "no-visibility", label: "Founder can't see the numbers" },
]

// A hypothetical fully-healthy funnel — zero leaks — proves every dot/label pair
// recolors from the data instead of a hardcoded "middle stages leak" assumption.
const HEALTHY_STAGES: Array<LeadLeakageMapStage> = [
    { key: "visit", label: "Visitor lands on the website" },
    { key: "cta", label: "Clear CTA captures the visitor" },
    { key: "left-info", label: "Leaves their info" },
    { key: "owner", label: "Sales owner assigned instantly" },
    { key: "followup", label: "Follow-up reminder fires on time" },
    { key: "visibility", label: "Founder sees the numbers live" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the light card the stage list sits in" },
    StackV: { tier: "frame", role: "the stage column" },
    StackH: { tier: "frame", role: "each stage row (dot + label beside the leak callout)" },
    DotLabel: { tier: "composite", role: "the colored dot + stage label" },
    Typography: { tier: "atom", role: "the map's own title and each leak callout" },
}

/** LEAF — `stages`: which points leak is DATA, so recoloring the whole map is a state, not a separate prop. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeadLeakageMap"
                tier="block"
                leaf="stages"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Blocks take no `className`. Every stage's leak flag and its trailing callout text arrive as data — the block never decides on its own which stage in a funnel is the weak point. Feeding a fully-healthy funnel recolors every dot and drops every callout, proving the highlighting is computed from `stages`, not baked into the block's own layout."
                states={[
                    {
                        name: "grounded funnel (three leak points)",
                        why: "The real lead journey this block is grounded in: a visitor's info gets captured, then falls through at three concrete points — no CTA, no assigned owner, a forgotten follow-up.",
                        code: `<LeadLeakageMap
    title="Where does a lead usually leak?"
    stages={[
        { key: "visit", label: "Visitor lands on the website" },
        { key: "no-cta", label: "No clear CTA or form", isLeak: true, leakLabel: "LEAK" },
        { key: "left-info", label: "Leaves their info" },
        { key: "no-owner", label: "No one is assigned to follow up", isLeak: true, leakLabel: "LEAK" },
        { key: "forgot", label: "Follow-up gets forgotten", isLeak: true, leakLabel: "LEAK" },
        { key: "no-visibility", label: "Founder can't see the numbers" },
    ]}
/>`,
                        render: <LeadLeakageMap title="Where does a lead usually leak?" stages={LEAKY_STAGES} />,
                    },
                    {
                        name: "healthy funnel (zero leaks)",
                        why: "A fully instrumented funnel — every stage holds — proves the leak markers are computed from the data, not a hardcoded \"middle stages always leak\" shape.",
                        code: `<LeadLeakageMap title="Where does a lead usually leak?" stages={[/* no stage has isLeak */]} />`,
                        render: <LeadLeakageMap title="Where does a lead usually leak?" stages={HEALTHY_STAGES} />,
                    },
                ]}
            />
        </div>
    ),
}
