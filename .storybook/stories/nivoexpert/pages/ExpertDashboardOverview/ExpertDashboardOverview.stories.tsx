import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChartLineIcon, GaugeIcon, ReceiptIcon, UsersIcon } from "@phosphor-icons/react"
import {
    ExpertDashboardOverview,
    type ExpertDashboardActivityItem,
    type ExpertDashboardKpi,
    type ExpertDashboardOverviewLabels,
    type LearnerFunnelStagePoint,
    type RevenueTrendPoint,
} from "@sb-components/nivoexpert/pages/ExpertDashboardOverview/ExpertDashboardOverview"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertDashboardOverview` — the PAGE an expert lands on inside
 * `ExpertDashboardShell`: four headline KPI tiles, a six-month revenue chart
 * beside the site-wide learner funnel (landing → registered → purchased →
 * completed), then the cross-domain recent-activity feed. A page's story is
 * one complete STATE per story — `Loading`, `Content`, `NewAccount` — not a
 * leaf-per-prop map.
 */
const meta: Meta<typeof ExpertDashboardOverview> = {
    title: "NivoExpert/Pages/ExpertDashboardOverview/ExpertDashboardOverview",
    component: ExpertDashboardOverview,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertDashboardOverview>

const LABELS: ExpertDashboardOverviewLabels = {
    revenueTitle: "Revenue (6 months)",
    funnelTitle: "Learner funnel",
    funnelStageLabels: {
        visited: "Visited landing",
        registered: "Registered",
        purchased: "Purchased a course",
        completed: "Completed a course",
    },
    funnelEmptyTitle: "No funnel data yet",
    funnelEmptyDescription: "Once the landing page starts getting visits, the funnel fills in as learners move through it.",
    activityTitle: "Recent activity",
    activityEmptyTitle: "No activity yet",
    activityEmptyDescription: "Course completions, orders, and community posts will show up here as they happen.",
}

const KPIS: Array<ExpertDashboardKpi> = [
    { key: "members", icon: UsersIcon, label: "Members", value: "1,284", delta: { text: "+32 this week", tone: "positive" } },
    { key: "revenue", icon: ChartLineIcon, label: "Revenue this month", value: "48,200,000 VND", delta: { text: "+12% vs last month", tone: "positive" } },
    { key: "open-courses", icon: ReceiptIcon, label: "Open courses", value: "7", delta: { text: "2 drafts", tone: "neutral" } },
    { key: "completion-rate", icon: GaugeIcon, label: "Completion rate", value: "61%", delta: { text: "-3% vs last month", tone: "negative" } },
]

const EMPTY_KPIS: Array<ExpertDashboardKpi> = [
    { key: "members", icon: UsersIcon, label: "Members", value: "0" },
    { key: "revenue", icon: ChartLineIcon, label: "Revenue this month", value: "0 VND" },
    { key: "open-courses", icon: ReceiptIcon, label: "Open courses", value: "0" },
    { key: "completion-rate", icon: GaugeIcon, label: "Completion rate", value: "—" },
]

const REVENUE_TREND: Array<RevenueTrendPoint> = [
    { key: "m1", monthLabel: "Mar", amountVnd: 18_000_000 },
    { key: "m2", monthLabel: "Apr", amountVnd: 24_500_000 },
    { key: "m3", monthLabel: "May", amountVnd: 21_000_000 },
    { key: "m4", monthLabel: "Jun", amountVnd: 31_000_000 },
    { key: "m5", monthLabel: "Jul", amountVnd: 37_500_000 },
    { key: "m6", monthLabel: "Aug", amountVnd: 48_200_000 },
]

const EMPTY_REVENUE_TREND: Array<RevenueTrendPoint> = REVENUE_TREND.map((point) => ({ ...point, amountVnd: 0 }))

const FUNNEL: Array<LearnerFunnelStagePoint> = [
    { key: "visited", count: 5400 },
    { key: "registered", count: 1284 },
    { key: "purchased", count: 690 },
    { key: "completed", count: 421 },
]

const ACTIVITY: Array<ExpertDashboardActivityItem> = [
    { id: "a1", kind: "completion", message: "A learner completed \"Advanced React\"", timeLabel: "2 minutes ago" },
    { id: "a2", kind: "order", message: "New order — 899,000 VND · Business plan", timeLabel: "18 minutes ago" },
    { id: "a3", kind: "community", message: "3 new community posts pending moderation", timeLabel: "1 hour ago" },
    { id: "a4", kind: "lead", message: "New lead from the landing page — hoa@company.vn", timeLabel: "2 hours ago" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Grid: { tier: "frame", role: "the KPI tile row, and the revenue-chart/funnel two-column row", storyId: "frames-grid-grid--default" },
    SurfaceCard: { tier: "composite", role: "each KPI tile, the revenue-chart card, and the funnel card" },
    IconTile: { tier: "atom", role: "each KPI tile's leading icon" },
    ProgressBar: { tier: "atom", role: "one bar per funnel stage, filled to its share of the top (visited) stage" },
    SurfaceCardList: { tier: "composite", role: "the recent-activity feed, one row per event", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
    EmptyState: { tier: "composite", role: "shown for a new account with no funnel data or no activity yet" },
    Typography: { tier: "atom", role: "every KPI value/label/delta, the chart's month labels, and the funnel's stage labels/counts" },
}

/** STATE — the page is still loading; every section draws its skeleton mirror. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertDashboardOverview"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map. The skeleton mirrors the loaded shape — four KPI tiles, the revenue chart, the funnel, and four activity rows — so nothing jumps when the data resolves."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The overview's own first fetch is in flight. Every section — the KPI grid, the revenue bars, the funnel rows, and the activity feed — shimmers in place, matching the loaded layout exactly.",
                        code: "<ExpertDashboardOverview {...props} isSkeleton />",
                        render: <ExpertDashboardOverview kpis={KPIS} revenueTrend={REVENUE_TREND} funnel={FUNNEL} activity={ACTIVITY} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved overview: KPIs, revenue trend, funnel, and activity all present. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertDashboardOverview"
                tier="screen"
                leaf="Content"
                annotate={ANNOTATE}
                reason="The resolved overview: four headline tiles, a six-month revenue trend beside the site-wide funnel (visited → registered → purchased → completed, each stage a share of the top), then the cross-domain activity feed. Money and counts arrive already formatted from the connected layer; every bar's proportion is derived here from the raw figures, never a separately hand-typed percentage."
                states={[
                    {
                        name: "kpis + revenueTrend + funnel + activity present",
                        why: "The common state: a healthy, active academy with members growing, revenue trending up, a funnel that thins at each stage, and a live activity feed.",
                        code: `<ExpertDashboardOverview
    kpis={kpis}
    revenueTrend={revenueTrend}
    funnel={funnel}
    activity={activity}
    labels={labels}
/>`,
                        render: <ExpertDashboardOverview kpis={KPIS} revenueTrend={REVENUE_TREND} funnel={FUNNEL} activity={ACTIVITY} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a brand-new academy: no members, no revenue, nobody through the funnel yet. */
export const NewAccount: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertDashboardOverview"
                tier="screen"
                leaf="New account"
                annotate={ANNOTATE}
                reason="A brand-new account: the KPI tiles read zero (no fabricated placeholder figures), the revenue chart draws its flat zero-height bars, and both the funnel and the activity feed fall to their own intentional empty states — the page doesn't special-case emptiness itself, the sections it composes own that state."
                states={[
                    {
                        name: "kpis = 0, funnel = [], activity = []",
                        why: "Nothing has happened yet: zero members and revenue, an empty funnel (nobody has visited the landing page), and no activity to report.",
                        code: "<ExpertDashboardOverview kpis={zeroKpis} revenueTrend={zeroTrend} funnel={[]} activity={[]} labels={labels} />",
                        render: <ExpertDashboardOverview kpis={EMPTY_KPIS} revenueTrend={EMPTY_REVENUE_TREND} funnel={[]} activity={[]} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
