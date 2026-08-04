import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    DashboardProof,
    type DashboardProofActivityBar,
    type DashboardProofMetric,
    type DashboardProofPipelineStage,
} from "@sb-components/nivo/blocks/landing/DashboardProof/DashboardProof"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DashboardProof` — the landing's "founders need to see the bottleneck, not
 * just hear about it" beat: a UI mockup of the nivo growth dashboard. Every
 * figure it draws is illustrative — never a real customer's metric — and
 * that honesty lives in the required `disclaimer`, matching how
 * `SystemStoryCard` already carries its own before/after honesty note.
 * Feeding a different stage balance proves the pipeline's bar lengths are
 * computed from `pipelineStages`, never a fixed "middle stage is the
 * bottleneck" shape this block assumes on its own.
 */
const meta: Meta<typeof DashboardProof> = {
    title: "Nivo/Blocks/Landing/DashboardProof/DashboardProof",
    component: DashboardProof,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DashboardProof>

const METRICS: Array<DashboardProofMetric> = [
    { key: "sources", value: "Web · Zalo · Ads", label: "Leads by source" },
    { key: "owners", value: "By owner", label: "Currently being worked" },
]

const ACTIVITY_BARS: Array<DashboardProofActivityBar> = [
    { key: "d1", heightPercent: 40 },
    { key: "d2", heightPercent: 58 },
    { key: "d3", heightPercent: 50 },
    { key: "d4", heightPercent: 72 },
    { key: "d5", heightPercent: 64 },
    { key: "d6", heightPercent: 88 },
]

const COPY = {
    eyebrow: "Data proof",
    title: "Founders need to see the bottleneck — not just hear about it.",
    panelLabel: "nivo · Growth Dashboard",
    insightLabel: "AI insight",
    metrics: METRICS,
    activityAriaLabel: "Illustrative weekly lead activity",
    activityBars: ACTIVITY_BARS,
    pipelineLabel: "Pipeline by stage",
    disclaimer: "Mockup of the nivo dashboard UI — illustrative figures, not real customer data.",
}

// The grounded default: most leads pile up at the top of the funnel, thinning
// out toward a close — matching the approved prototype's own stage widths.
const TOP_HEAVY_STAGES: Array<DashboardProofPipelineStage> = [
    { key: "new", label: "New lead", percent: 80 },
    { key: "consulting", label: "Consulting", percent: 55 },
    { key: "proposal", label: "Proposal", percent: 35 },
    { key: "closed", label: "Closed", percent: 22 },
]

// A different balance — the bottleneck sits mid-funnel instead of thinning
// steadily toward the close — proves every bar's length is computed from
// `percent`, not a hardcoded "always thins toward the end" assumption.
const MID_BOTTLENECK_STAGES: Array<DashboardProofPipelineStage> = [
    { key: "new", label: "New lead", percent: 90 },
    { key: "consulting", label: "Consulting", percent: 85 },
    { key: "proposal", label: "Proposal", percent: 20 },
    { key: "closed", label: "Closed", percent: 15 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SectionHeading: { tier: "block", role: "the centered eyebrow / title header", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    SurfaceCard: { tier: "composite", role: "the mockup's own bounded surface" },
    Grid: { tier: "frame", role: "the activity / pipeline split, stacking below `lg`" },
    StackV: { tier: "frame", role: "the header/mockup/disclaimer rhythm, and each pane's inner stack" },
    StackH: { tier: "frame", role: "the mockup's top bar — traffic dots + panel title beside the insight chip" },
    StatGridCard: { tier: "composite", role: "the two KPI cells, seamed instead of double-bordered" },
    StatPair: { tier: "composite", role: "each KPI cell's value + label" },
    ProgressMeter: { tier: "composite", role: "each pipeline stage's labeled fill" },
    Chip: { tier: "atom", role: "the top bar's trailing \"AI insight\" chip" },
    Typography: { tier: "atom", role: "the panel title, the pipeline header, and the disclaimer" },
}

/** LEAF — `pipelineStages`: the funnel's stage balance; a different shape proves the fills are computed, never fixed. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DashboardProof"
                tier="block"
                leaf="pipelineStages"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Every KPI, activity bar, and pipeline stage arrives as an illustrative mockup figure — this is a preview of the UI itself, never a real metric, and the required `disclaimer` carries that honesty (no separate 'mockup' badge). Feeding a different stage balance recomputes every fill, proving the bottleneck shown is whatever `pipelineStages` says, not a hardcoded 'thins toward the end' shape."
                states={[
                    {
                        name: "top-heavy funnel (the grounded default)",
                        why: "The real shape from the approved prototype: leads pile up at the top and thin out steadily toward a close.",
                        code: `<DashboardProof
    eyebrow="Data proof"
    title="Founders need to see the bottleneck — not just hear about it."
    panelLabel="nivo · Growth Dashboard"
    insightLabel="AI insight"
    metrics={metrics}
    activityAriaLabel="Illustrative weekly lead activity"
    activityBars={activityBars}
    pipelineLabel="Pipeline by stage"
    pipelineStages={[
        { key: "new", label: "New lead", percent: 80 },
        { key: "consulting", label: "Consulting", percent: 55 },
        { key: "proposal", label: "Proposal", percent: 35 },
        { key: "closed", label: "Closed", percent: 22 },
    ]}
    disclaimer="Mockup of the nivo dashboard UI — illustrative figures, not real customer data."
/>`,
                        render: <DashboardProof {...COPY} pipelineStages={TOP_HEAVY_STAGES} />,
                    },
                    {
                        name: "mid-funnel bottleneck",
                        why: "A different balance — the drop-off sits at the proposal stage instead of thinning steadily — proves the fills recompute from data rather than assuming the bottleneck is always the last stage.",
                        code: `<DashboardProof {...copy} pipelineStages={midBottleneckStages} />`,
                        render: <DashboardProof {...COPY} pipelineStages={MID_BOTTLENECK_STAGES} />,
                    },
                ]}
            />
        </div>
    ),
}
