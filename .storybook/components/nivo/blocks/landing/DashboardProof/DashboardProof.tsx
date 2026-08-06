import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { StatGridCard } from "@sb-components/composites/stats/StatGridCard/StatGridCard"
import { StatPair } from "@sb-components/composites/stats/StatPair/StatPair"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

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

/** One KPI cell in the dashboard mockup. */
export interface DashboardProofMetric {
    /** Stable React key. */
    key: string
    /** The headline value (e.g. "Web · Zalo · Ads"). Illustrative, never a real count. */
    value: string
    /** What the value stands for (e.g. "Leads by source"). */
    label: string
}

/** One bar of the illustrative activity chart. */
export interface DashboardProofActivityBar {
    /** Stable React key. */
    key: string
    /** Illustrative bar fill, 0–100 — a mockup shape, never a real day's count. */
    heightPercent: number
}

/** One stage row of the illustrative pipeline. */
export interface DashboardProofPipelineStage {
    /** Stable React key. */
    key: string
    /** Stage name (e.g. "New lead"). */
    label: string
    /** Illustrative fill, 0–100 — a mockup shape, never a real conversion rate. */
    percent: number
}

/** Props for {@link DashboardProof}. */
export interface DashboardProofProps {
    /** Accent-toned kicker above the title (e.g. "Data proof"). */
    eyebrow?: string
    /** The beat's headline (e.g. "Founders need to see the bottleneck — not just hear about it."). */
    title: string
    /** The mockup's own window-chrome title (e.g. "nivo · Growth Dashboard"). */
    panelLabel: string
    /** Trailing chip text on the mockup's top bar (e.g. "AI insight"). */
    insightLabel: string
    /** The two KPI cells. */
    metrics: Array<DashboardProofMetric>
    /** Accessible label for the activity chart (e.g. "Illustrative weekly lead activity"). */
    activityAriaLabel: string
    /** The activity chart's bars, in order. */
    activityBars: Array<DashboardProofActivityBar>
    /** Small header above the pipeline list (e.g. "Pipeline by stage"). */
    pipelineLabel: string
    /** The pipeline's stages, in funnel order. */
    pipelineStages: Array<DashboardProofPipelineStage>
    /** Required honesty note under the mockup (e.g. "Mockup of the nivo dashboard UI — illustrative figures, not real customer data."). */
    disclaimer: string
}

/** The mockup's own window-chrome top bar: decorative traffic dots, the panel title, and a trailing insight chip. */
const TopBar = ({ panelLabel, insightLabel }: { panelLabel: string; insightLabel: string }) => (
    <StackH
        gap={4}
        justify="between"
        align="center"
        principle="content-row"
        items={[
            () => (
                <StackH
                    gap={3}
                    align="center"
                    principle="sibling-stack"
                    items={[
                        () => (
                            <span aria-hidden className="flex shrink-0 items-center gap-2">
                                <span className="size-2 rounded-full bg-default" />
                                <span className="size-2 rounded-full bg-default" />
                                <span className="size-2 rounded-full bg-default" />
                            </span>
                        ),
                        () => <Typography size="xs" weight="semibold" color="muted" text={panelLabel} />,
                    ]}
                />
            ),
            () => <Chip tone="accent" text={insightLabel} />,
        ]}
    />
)

/**
 * The illustrative activity chart: a flex row of bars whose heights are the
 * ONLY data this leaf draws from. See the file header for why this stays a
 * plain div track rather than a vendor chart.
 */
const ActivityChart = ({ ariaLabel, bars }: { ariaLabel: string; bars: Array<DashboardProofActivityBar> }) => (
    <div role="img" aria-label={ariaLabel} className="flex h-24 items-end gap-2 rounded-2xl bg-default p-3">
        {bars.map((bar) => (
            <div
                key={bar.key}
                aria-hidden
                className="min-w-0 flex-1 rounded-t-md bg-accent"
                style={{ height: `${bar.heightPercent}%` }}
            />
        ))}
    </div>
)

/**
 * The dashboard UI mockup. See the file header for why every figure it draws
 * is illustrative and the disclaimer is required, never optional.
 *
 * @param props - {@link DashboardProofProps}
 */
const DashboardProof = ({
    eyebrow,
    title,
    panelLabel,
    insightLabel,
    metrics,
    activityAriaLabel,
    activityBars,
    pipelineLabel,
    pipelineStages,
    disclaimer,
}: DashboardProofProps) => {
    const panelBodyItems = [
        () => <TopBar panelLabel={panelLabel} insightLabel={insightLabel} />,
        () => (
            <Grid
                columns={{ base: 1, lg: 2 }}
                principle="content-row"
                items={[
                    {
                        key: "activity",
                        content: () => (
                            <StackV
                                gap={3}
                                items={[
                                    () => (
                                        <StatGridCard
                                            items={metrics.map((metric) => ({
                                                key: metric.key,
                                                content: () => <StatPair value={metric.value} label={metric.label} />,
                                            }))}
                                        />
                                    ),
                                    () => <ActivityChart ariaLabel={activityAriaLabel} bars={activityBars} />,
                                ]}
                            />
                        ),
                    },
                    {
                        key: "pipeline",
                        content: () => (
                            <StackV
                                gap={3}
                                items={[
                                    () => <Typography size="xs" weight="semibold" color="muted" text={pipelineLabel} />,
                                    () => (
                                        <StackV
                                            gap={3}
                                            items={pipelineStages.map((stage) => () => (
                                                <ProgressMeter label={stage.label} value={stage.percent} />
                                            ))}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    },
                ]}
            />
        ),
    ]

    return (
        <div data-tier="block" data-component="DashboardProof">
            <StackV
                gap={6}
                principle="block-boundary"
                items={[
                    () => <SectionHeading eyebrow={eyebrow} title={title} align="center" />,
                    () => (
                        <SurfaceCard
                            padding={4}
                            body={() => (
                                <StackV gap={4} items={panelBodyItems} />
                            )}
                        />
                    ),
                    () => <Typography size="xs" color="muted" align="center" text={disclaimer} />,
                ]}
            />
        </div>
    )
}

export { DashboardProof }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "DashboardProof" } as const
