import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProblemStatement } from "@sb-components/nivo/blocks/landing/ProblemStatement/ProblemStatement"
import type { LeadLeakageMapStage } from "@sb-components/nivo/blocks/landing/LeadLeakageMap/LeadLeakageMap"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ProblemStatement` — the landing's core message: "SMEs don't lack tools.
 * SMEs lack a system," paired with the `LeadLeakageMap` as its concrete
 * proof. Feeding the map different stage data shows the pairing recompute
 * together, since this block composes the map directly rather than the page
 * arranging them separately (`nivo-landing.proposal.md` §5).
 */
const meta: Meta<typeof ProblemStatement> = {
    title: "Nivo/Blocks/Landing/ProblemStatement/ProblemStatement",
    component: ProblemStatement,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProblemStatement>

const NOOP = () => {}

const LEAKY_STAGES: Array<LeadLeakageMapStage> = [
    { key: "visit", label: "Visitor lands on the website" },
    { key: "no-cta", label: "No clear CTA or form", isLeak: true, leakLabel: "LEAK" },
    { key: "left-info", label: "Leaves their info" },
    { key: "no-owner", label: "No one is assigned to follow up", isLeak: true, leakLabel: "LEAK" },
    { key: "forgot", label: "Follow-up gets forgotten", isLeak: true, leakLabel: "LEAK" },
    { key: "no-visibility", label: "Founder can't see the numbers" },
]

const HEALTHY_STAGES: Array<LeadLeakageMapStage> = [
    { key: "visit", label: "Visitor lands on the website" },
    { key: "cta", label: "Clear CTA captures the visitor" },
    { key: "left-info", label: "Leaves their info" },
    { key: "owner", label: "Sales owner assigned instantly" },
    { key: "followup", label: "Follow-up reminder fires on time" },
    { key: "visibility", label: "Founder sees the numbers live" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Grid: { tier: "frame", role: "the copy column beside the composed map" },
    StackV: { tier: "frame", role: "the eyebrow / two-line headline / description / CTA stack" },
    Typography: { tier: "atom", role: "the eyebrow, two-tone headline, and description" },
    Button: { tier: "atom", role: "the secondary audit CTA" },
    LeadLeakageMap: { tier: "block", role: "the map proving the claim, composed directly by this block", storyId: "nivo-blocks-landing-leadleakagemap-leadleakagemap--default" },
}

/** LEAF — `leakMapStages`: the composed map's own data, proving it recolors as a unit with this block. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProblemStatement"
                tier="block"
                leaf="leakMapStages"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. This message is a REAL, buyable-today claim, but the CTA stays SECONDARY — the landing keeps its one primary in the hero and repeats it at the close (proposal §4). The map is composed directly (not left to the page) because the proposal names the pairing as one section brief; feeding different `leakMapStages` shows the two halves recompute together."
                states={[
                    {
                        name: "grounded funnel (three leak points)",
                        why: "The real lead journey this beat is grounded in — a visitor's info gets captured, then falls through at three concrete points.",
                        code: `<ProblemStatement
    eyebrow="The problem"
    headlineLead="SMEs don't lack tools."
    headlineAccent="SMEs lack a system."
    description={description}
    ctaLabel="Check your lead-leakage points"
    onCtaPress={openAudit}
    leakMapTitle="Where does a lead usually leak?"
    leakMapStages={leakyStages}
/>`,
                        render: (
                            <ProblemStatement
                                eyebrow="The problem"
                                headlineLead="SMEs don't lack tools."
                                headlineAccent="SMEs lack a system."
                                description="Website, Zalo, spreadsheets, a chatbot — each lives in its own corner. A lead leaves their info and falls through the cracks; sales forgets to follow up; the founder has to ask everyone just to find out what's happening."
                                ctaLabel="Check your lead-leakage points"
                                onCtaPress={NOOP}
                                leakMapTitle="Where does a lead usually leak?"
                                leakMapStages={LEAKY_STAGES}
                            />
                        ),
                    },
                    {
                        name: "healthy funnel (zero leaks)",
                        why: "A fully instrumented funnel recomputes to zero leak markers — the same beat, proving the map's highlighting is never hardcoded into this block's own copy.",
                        code: `<ProblemStatement leakMapStages={healthyStages} /* narrative props unchanged */ />`,
                        render: (
                            <ProblemStatement
                                eyebrow="The problem"
                                headlineLead="SMEs don't lack tools."
                                headlineAccent="SMEs lack a system."
                                description="Website, Zalo, spreadsheets, a chatbot — each lives in its own corner. A lead leaves their info and falls through the cracks; sales forgets to follow up; the founder has to ask everyone just to find out what's happening."
                                ctaLabel="Check your lead-leakage points"
                                onCtaPress={NOOP}
                                leakMapTitle="Where does a lead usually leak?"
                                leakMapStages={HEALTHY_STAGES}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
