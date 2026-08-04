import { ChartLineUpIcon } from "@phosphor-icons/react"
import { ProgressBar } from "@sb-components/atoms/display/Progress/Progress"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { MetricCard } from "@sb-components/composites/stats/MetricCard/MetricCard"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ExpertDashboardOverview` — the expert's business overview: three metric tiles
 * (members, paid orders, revenue) above a per-course completion funnel. The three
 * pictures — `loading`, `content`, `empty` — are DATA, so they are STATES of the
 * single shape. Grounded in the real `dashboardStats` and `completionFunnel`
 * (`learners` → `started` → `completed`).
 */

/** One headline metric tile — already resolved by the connected layer. */
export interface MetricView {
    /** The large value (e.g. "12,500,000 VND", "1,204"). */
    value: string
    /** What the value measures (e.g. "Members"). */
    label: string
    /** Optional quiet footnote (e.g. "38 active"). */
    hint?: string
}

/** The three headline tiles, from `dashboardStats`. */
export interface DashboardMetrics {
    /** Total members + active-members hint (`totalMembers` / `activeMembers`). */
    members: MetricView
    /** Paid orders (`paidOrders`). */
    paidOrders: MetricView
    /** Revenue, formatted in VND (`revenueVnd`). */
    revenue: MetricView
}

/** One course's completion funnel — a `completionFunnel` point. */
export interface FunnelCourseView {
    /** Course slug (`CompletionFunnelPoint.slug`). */
    slug: string
    /** Course title (`CompletionFunnelPoint.title`). */
    title: string
    /** Enrolled learners — the funnel's base (`CompletionFunnelPoint.learners`). */
    learners: number
    /** Learners who started at least one lesson (`CompletionFunnelPoint.started`). */
    started: number
    /** Learners who completed the course (`CompletionFunnelPoint.completed`). */
    completed: number
}

/** Props for {@link ExpertDashboardOverview}. */
export interface ExpertDashboardOverviewProps {
    /** The three headline tiles. */
    metrics: DashboardMetrics
    /** Per-course completion funnel. Empty is the `empty` state. */
    funnel: Array<FunnelCourseView>
    /** `true` → the overview's own first fetch is in flight: every tile and the funnel draw their skeleton mirror (§12b), threaded down. */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ExpertDashboardOverviewLabels
}

/** The already-resolved copy the block renders. */
export interface ExpertDashboardOverviewLabels {
    /** Funnel section title (e.g. "Completion funnel"). */
    funnelTitle: string
    /** Suffix after a course's learner count (e.g. "learners"). */
    learnersSuffix: string
    /** The three funnel-stage labels, keyed by stage. */
    stageLabels: { learners: string; started: string; completed: string }
    /** Empty-state title when there are no courses to funnel. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** How many placeholder cards the funnel skeleton draws. */
const SKELETON_FUNNEL_COUNT = 2

/** The three funnel stages, in descending order — read off the point in place. */
const STAGES = ["learners", "started", "completed"] as const

/**
 * The expert dashboard overview. See the file header for why the three pictures are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link ExpertDashboardOverviewProps}
 */
const ExpertDashboardOverview = ({ metrics, funnel, isSkeleton = false, labels }: ExpertDashboardOverviewProps) => {
    /** The three headline tiles, in a reflowing grid. */
    const MetricsGrid = () => (
        <Grid
            columns={{ base: 1, sm: 3 }}
            gap={4}
            items={[
                {
                    key: "members",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={metrics.members.value} label={metrics.members.label} hint={metrics.members.hint} />
                        ),
                },
                {
                    key: "paidOrders",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={metrics.paidOrders.value} label={metrics.paidOrders.label} hint={metrics.paidOrders.hint} />
                        ),
                },
                {
                    key: "revenue",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={metrics.revenue.value} label={metrics.revenue.label} hint={metrics.revenue.hint} />
                        ),
                },
            ]}
        />
    )

    /** One funnel stage — its label + count/percent, then a bar filled to its share of `learners`. */
    const Stage = (course: FunnelCourseView, stage: (typeof STAGES)[number]) => {
        const value = course[stage]
        const pct = course.learners > 0 ? Math.round((value / course.learners) * 100) : 0
        return (
            <StackV
                gap={1}
                items={[
                    () => (
                        <StackH
                            gap={3}
                            justify="between"
                            align="center"
                            items={[
                                () => <Typography size="sm" text={labels.stageLabels[stage]} />,
                                () => <Typography size="xs" color="muted" text={`${value} · ${pct}%`} />,
                            ]}
                        />
                    ),
                    () => (
                        <ProgressBar
                            value={value}
                            max={course.learners > 0 ? course.learners : 1}
                            color={stage === "completed" ? "success" : "accent"}
                            ariaLabel={`${course.title} — ${labels.stageLabels[stage]}`}
                        />
                    ),
                ]}
            />
        )
    }

    /** One course's funnel card — its header, then the three descending stages. */
    const CourseFunnel = (course: FunnelCourseView) => (
        <SurfaceCard
            variant="nested"
            padding={3}
            body={() => (
                <StackV
                    gap={3}
                    items={[
                        () => (
                            <StackH
                                gap={3}
                                justify="between"
                                align="center"
                                items={[
                                    () => <Typography size="base" weight="semibold" text={course.title} />,
                                    () => <Typography size="xs" color="muted" text={`${course.learners} ${labels.learnersSuffix}`} />,
                                ]}
                            />
                        ),
                        () => <StackV gap={3} items={STAGES.map((stage) => () => Stage(course, stage))} />,
                    ]}
                />
            )}
        />
    )

    /** The funnel section body — skeleton mirror, empty state, or the course cards. */
    const FunnelBody = () => {
        if (isSkeleton) {
            return (
                <StackV
                    gap={3}
                    items={Array.from({ length: SKELETON_FUNNEL_COUNT }, () => () => (
                        <SurfaceCard
                            variant="nested"
                            padding={3}
                            body={() => (
                                <StackV
                                    gap={3}
                                    items={[
                                        () => <Typography size="base" isSkeleton classNames={["w-1/3"]} />,
                                        () => <StackV gap={3} items={STAGES.map(() => () => <ProgressBar isSkeleton />)} />,
                                    ]}
                                />
                            )}
                        />
                    ))}
                />
            )
        }
        if (funnel.length === 0) {
            return <EmptyState icon={ChartLineUpIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
        }
        return <StackV gap={3} items={funnel.map((course) => () => CourseFunnel(course))} />
    }

    return (
        <div data-tier="block" data-component="ExpertDashboardOverview">
            <StackV
                gap={4}
                items={[
                    () => <MetricsGrid />,
                    () => <SurfaceCard padding={3} label={labels.funnelTitle} body={() => <FunnelBody />} />,
                ]}
            />
        </div>
    )
}

export { ExpertDashboardOverview }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ExpertDashboardOverview" } as const
