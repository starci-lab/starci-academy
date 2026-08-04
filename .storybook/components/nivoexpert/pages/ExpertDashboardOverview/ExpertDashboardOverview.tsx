import type { ComponentType, SVGProps } from "react"
import { cn } from "@heroui/react"
import { ChartLineUpIcon, ChatCircleIcon, ReceiptIcon, TargetIcon, TrophyIcon } from "@phosphor-icons/react"
import { ProgressBar } from "@sb-components/atoms/display/Progress/Progress"
import { Typography, type TypographyColor } from "@sb-components/atoms/text/Typography/Typography"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Box } from "@sb-components/frames/Box/Box"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ExpertDashboardOverview` — the PAGE an expert lands on inside
 * `ExpertDashboardShell`: four headline KPI tiles, a six-month revenue chart
 * beside the site-wide learner funnel (landing → registered → purchased →
 * completed), then the cross-domain recent-activity feed. A page's story is
 * one complete STATE per story — `Loading`, `Content`, `NewAccount` — not a
 * leaf-per-prop map.
 */

/** An icon component (e.g. a phosphor `*Icon`), not JSX — the tile scales it itself. */
export type ExpertKpiIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** How a KPI tile's own delta note reads — the DATA decides the tone, never a caller guess. */
export type ExpertKpiDeltaTone = "positive" | "negative" | "neutral"

/** One headline KPI tile — already resolved (formatted value + optional trend note) by the connected layer. */
export interface ExpertDashboardKpi {
    /** Stable key. */
    key: string
    /** The tile's icon. */
    icon: ExpertKpiIcon
    /** What the value measures (e.g. "Members", "Revenue this month"). */
    label: string
    /** The large value, already formatted (e.g. "1,284", "48,200,000 VND", "61%"). */
    value: string
    /** Optional trend note under the value (e.g. "+32 this week", "-3% vs last month"). Omit when there is nothing to compare against yet. */
    delta?: { text: string; tone: ExpertKpiDeltaTone }
}

/** One month of the revenue trend — the connected layer supplies the raw amount, this page derives the bar heights. */
export interface RevenueTrendPoint {
    /** Stable key. */
    key: string
    /** Short month label (e.g. "Mar"). */
    monthLabel: string
    /** Revenue for that month, in VND. */
    amountVnd: number
}

/** The four stages of the site-wide learner funnel, top to bottom. */
export type LearnerFunnelStageKey = "visited" | "registered" | "purchased" | "completed"

/** One funnel stage's raw count — this page derives each stage's share of the first (`visited`) stage. */
export interface LearnerFunnelStagePoint {
    /** Which stage this point is. */
    key: LearnerFunnelStageKey
    /** Raw count at this stage. */
    count: number
}

/** The four activity sources folded into one feed. */
export type ExpertActivityKind = "completion" | "order" | "community" | "lead"

/** One activity entry — already resolved to a single display line + a relative time. */
export interface ExpertDashboardActivityItem {
    /** Stable id. */
    id: string
    /** Which domain source this entry came from — decides the leading icon. */
    kind: ExpertActivityKind
    /** The already-resolved display line (e.g. "A learner completed \"Advanced React\""). */
    message: string
    /** Already-formatted relative time (e.g. "2 minutes ago"). */
    timeLabel: string
}

/** Props for {@link ExpertDashboardOverview}. */
export interface ExpertDashboardOverviewProps {
    /** The headline KPI tiles, in reading order. */
    kpis: Array<ExpertDashboardKpi>
    /** The six-month revenue trend, oldest first. */
    revenueTrend: Array<RevenueTrendPoint>
    /** The site-wide learner funnel, `visited` first. Empty is the funnel's own empty state. */
    funnel: Array<LearnerFunnelStagePoint>
    /** The cross-domain activity feed, newest first. Empty is the feed's own empty state. */
    activity: Array<ExpertDashboardActivityItem>
    /** `true` → the overview's own first fetch is in flight: every section draws its skeleton mirror, threaded down. */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ExpertDashboardOverviewLabels
}

/** The already-resolved copy the page renders. */
export interface ExpertDashboardOverviewLabels {
    /** Revenue chart section title. */
    revenueTitle: string
    /** Funnel section title. */
    funnelTitle: string
    /** The four funnel-stage labels, keyed by stage. */
    funnelStageLabels: Record<LearnerFunnelStageKey, string>
    /** Empty-state title when there is no funnel data yet. */
    funnelEmptyTitle: string
    /** Empty-state supporting line for the funnel. */
    funnelEmptyDescription: string
    /** Activity feed section title. */
    activityTitle: string
    /** Empty-state title when there is no activity yet. */
    activityEmptyTitle: string
    /** Empty-state supporting line for the activity feed. */
    activityEmptyDescription: string
}

/** The four funnel stages, top to bottom — read off a point in place. */
const FUNNEL_STAGES: ReadonlyArray<LearnerFunnelStageKey> = ["visited", "registered", "purchased", "completed"]

/** How many placeholder KPI tiles / funnel rows / activity rows the skeleton draws. */
const SKELETON_KPI_COUNT = 4
const SKELETON_ACTIVITY_COUNT = 4

/** Delta tone → the `Typography` color it renders in. */
const DELTA_COLOR: Record<ExpertKpiDeltaTone, TypographyColor> = {
    positive: "success",
    negative: "danger",
    neutral: "muted",
}

/** `kind` -> leading icon. A lookup, not a caller choice — the feed owns what each source means. */
const ACTIVITY_ICON: Record<ExpertActivityKind, typeof ReceiptIcon> = {
    completion: TrophyIcon,
    order: ReceiptIcon,
    community: ChatCircleIcon,
    lead: TargetIcon,
}

/** Placeholder KPI tiles — sized like a real tile so the shimmer mirrors the loaded shape. */
const SKELETON_KPIS: Array<ExpertDashboardKpi> = Array.from({ length: SKELETON_KPI_COUNT }, (_unused, index) => ({
    key: `skeleton-kpi-${index}`,
    icon: ChartLineUpIcon,
    label: "",
    value: "",
}))

/**
 * The expert dashboard overview. See the file header for why loading /
 * content / new-account are states of one shape rather than separate leaves.
 *
 * @param props - {@link ExpertDashboardOverviewProps}
 */
const ExpertDashboardOverview = ({ kpis, revenueTrend, funnel, activity, isSkeleton = false, labels }: ExpertDashboardOverviewProps) => {
    /** The four headline tiles, in a reflowing grid — same column steps `nivo/blocks/dashboard/KpiRow` uses. */
    const KpiRow = () => (
        <Grid
            columns={{ base: 1, sm: 2, lg: 4 }}
            gap={4}
            isSkeleton={isSkeleton}
            items={(isSkeleton ? SKELETON_KPIS : kpis).map((kpi) => ({
                key: kpi.key,
                content: () => (
                    <SurfaceCard
                        padding={3}
                        isSkeleton={isSkeleton}
                        body={() => (
                            <StackV
                                gap={3}
                                isSkeleton={isSkeleton}
                                items={[
                                    () => (
                                        <StackH
                                            gap={3}
                                            justify="between"
                                            isSkeleton={isSkeleton}
                                            items={[
                                                () => <Typography size="xs" weight="bold" color="muted" isSkeleton={isSkeleton} text={kpi.label} />,
                                                () => <IconTile icon={kpi.icon} tone="accent" size="sm" isSkeleton={isSkeleton} />,
                                            ]}
                                        />
                                    ),
                                    () => <Typography size="h3" weight="bold" tabularNums isSkeleton={isSkeleton} text={kpi.value} />,
                                    ...(kpi.delta != null || isSkeleton ? [() => (
                                        <Typography size="xs" color={kpi.delta != null ? DELTA_COLOR[kpi.delta.tone] : "muted"} isSkeleton={isSkeleton} text={kpi.delta?.text} />
                                    )] : []),
                                ]}
                            />
                        )}
                    />
                ),
            }))}
        />
    )

    /** Six vertical bars, each a share of the trend's own peak month — never a fabricated axis. */
    const RevenueChart = () => {
        const points = isSkeleton
            ? Array.from({ length: 6 }, (_unused, index) => ({ key: `skeleton-month-${index}`, monthLabel: "", amountVnd: 0 }))
            : revenueTrend
        const peak = Math.max(1, ...points.map((point) => point.amountVnd))
        return (
            <div className="flex h-36 items-stretch gap-3">
                {points.map((point) => (
                    <div key={point.key} className="flex flex-1 flex-col items-center justify-end gap-2">
                        <Box
                            className={cn("w-full max-w-9 rounded-t-md", isSkeleton ? "animate-pulse bg-default" : "bg-accent")}
                            style={{ height: `${isSkeleton ? 35 : Math.max(4, Math.round((point.amountVnd / peak) * 100))}%` }}
                        />
                        <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={point.monthLabel} />
                    </div>
                ))}
            </div>
        )
    }

    /** One funnel stage — its label + count, then a bar filled to its share of the top (`visited`) stage. */
    const FunnelStageRow = (stage: LearnerFunnelStagePoint, baseline: number) => (
        <StackV
            gap={1}
            items={[
                () => (
                    <StackH
                        gap={3}
                        justify="between"
                        align="center"
                        items={[
                            () => <Typography size="sm" text={labels.funnelStageLabels[stage.key]} />,
                            () => <Typography size="xs" color="muted" text={`${stage.count.toLocaleString("en-US")}`} />,
                        ]}
                    />
                ),
                () => (
                    <ProgressBar
                        value={stage.count}
                        max={baseline}
                        color={stage.key === "completed" ? "success" : "accent"}
                        ariaLabel={`${labels.funnelTitle} — ${labels.funnelStageLabels[stage.key]}`}
                    />
                ),
            ]}
        />
    )

    /** The funnel section body — skeleton mirror, empty state, or the four stage rows. */
    const FunnelBody = () => {
        if (isSkeleton) {
            return (
                <StackV
                    gap={3}
                    items={FUNNEL_STAGES.map(() => () => (
                        <StackV
                            gap={1}
                            items={[
                                () => <Typography size="sm" isSkeleton classNames={["w-1/3"]} />,
                                () => <ProgressBar isSkeleton />,
                            ]}
                        />
                    ))}
                />
            )
        }
        if (funnel.length === 0) {
            return <EmptyState icon={ChartLineUpIcon} title={labels.funnelEmptyTitle} description={labels.funnelEmptyDescription} />
        }
        const baseline = funnel[0]?.count > 0 ? funnel[0].count : 1
        return <StackV gap={3} items={funnel.map((stage) => () => FunnelStageRow(stage, baseline))} />
    }

    /** The recent-activity feed — a bounded surface list, same idiom `nivo/blocks/dashboard/RecentActivityCard` uses. */
    const ActivityList = () => {
        const rows = isSkeleton
            ? Array.from({ length: SKELETON_ACTIVITY_COUNT }, (_unused, index) => ({ id: `skeleton-activity-${index}`, kind: "order" as const, message: "", timeLabel: "" }))
            : activity
        const items: Array<SurfaceCardListItem> = rows.map((item) => ({
            key: item.id,
            leadingIcon: ACTIVITY_ICON[item.kind],
            title: item.message,
            trailing: () => <Typography size="xs" color="muted" text={item.timeLabel} />,
        }))
        return (
            <SurfaceCardList
                label={labels.activityTitle}
                isSkeleton={isSkeleton}
                items={items}
                emptyState={() => (
                    <EmptyState icon={ReceiptIcon} title={labels.activityEmptyTitle} description={labels.activityEmptyDescription} />
                )}
            />
        )
    }

    return (
        <div data-tier="page" data-component="ExpertDashboardOverview" className="flex w-full flex-col gap-6">
            <KpiRow />
            <Grid
                columns={{ base: 1, lg: 2 }}
                gap={4}
                isSkeleton={isSkeleton}
                items={[
                    { key: "revenue", content: () => <SurfaceCard padding={3} isSkeleton={isSkeleton} label={labels.revenueTitle} body={() => <RevenueChart />} /> },
                    { key: "funnel", content: () => <SurfaceCard padding={3} isSkeleton={isSkeleton} label={labels.funnelTitle} body={() => <FunnelBody />} /> },
                ]}
            />
            <ActivityList />
        </div>
    )
}

export { ExpertDashboardOverview }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "ExpertDashboardOverview" } as const
