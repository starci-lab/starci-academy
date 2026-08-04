import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertDashboardOverview,
    type DashboardMetrics,
    type ExpertDashboardOverviewLabels,
    type FunnelCourseView,
} from "@sb-components/nivoexpert/blocks/dashboard/ExpertDashboardOverview/ExpertDashboardOverview"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertDashboardOverview` — the expert's business overview: three metric tiles
 * (members, paid orders, revenue) above a per-course completion funnel. The three
 * pictures — `loading`, `content`, `empty` — are DATA, so they are STATES of the
 * single shape. Grounded in the real `dashboardStats` and `completionFunnel`
 * (`learners` → `started` → `completed`).
 */
const meta: Meta<typeof ExpertDashboardOverview> = {
    title: "NivoExpert/Blocks/Dashboard/ExpertDashboardOverview/ExpertDashboardOverview",
    component: ExpertDashboardOverview,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertDashboardOverview>

const LABELS: ExpertDashboardOverviewLabels = {
    funnelTitle: "Completion funnel",
    learnersSuffix: "learners",
    stageLabels: { learners: "Learners", started: "Started", completed: "Completed" },
    emptyTitle: "No courses to funnel yet",
    emptyDescription: "Publish a course and enrol your first learners — the funnel fills in as they progress.",
}

const METRICS: DashboardMetrics = {
    members: { value: "1,204", label: "Members", hint: "38 active this week" },
    paidOrders: { value: "312", label: "Paid orders", hint: "9 this week" },
    revenue: { value: "468,000,000 VND", label: "Revenue", hint: "312 paid orders" },
}

/** A new account: nothing sold, nobody enrolled. */
const EMPTY_METRICS: DashboardMetrics = {
    members: { value: "0", label: "Members", hint: "0 active this week" },
    paidOrders: { value: "0", label: "Paid orders", hint: "0 this week" },
    revenue: { value: "0 VND", label: "Revenue", hint: "0 paid orders" },
}

const FUNNEL: Array<FunnelCourseView> = [
    { slug: "ship-your-first-ai-agent", title: "Ship Your First AI Agent", learners: 420, started: 318, completed: 176 },
    { slug: "rag-in-a-weekend", title: "RAG in a Weekend", learners: 260, started: 141, completed: 54 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    MetricCard: { tier: "composite", role: "each headline tile — members, paid orders, revenue" },
    SurfaceCard: { tier: "composite", role: "the funnel section card and each course's nested funnel" },
    ProgressBar: { tier: "atom", role: "one bar per funnel stage, filled to its share of learners" },
    EmptyState: { tier: "composite", role: "shown for a new account with no courses" },
    Typography: { tier: "atom", role: "the funnel titles and each stage's count and percent" },
}

/** LEAF — one shape; the three pictures are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertDashboardOverview"
                tier="block"
                leaf="Overview"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Blocks take no `className`: the block owns the dashboard stats and funnel, so its pictures are states of one shape. Money and counts arrive already formatted from the connected layer (`revenueVnd` becomes a VND string). Each funnel stage's percent is the stage's share of `learners`, computed here from the raw counts."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The overview is still fetching: every tile and each funnel card draws its skeleton mirror, matching the resolved layout so nothing jumps when the data lands.",
                        code: "<ExpertDashboardOverview {...props} isSkeleton />",
                        render: <ExpertDashboardOverview metrics={METRICS} funnel={FUNNEL} isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "metrics + funnel present",
                        why: "The resolved overview: the three headline tiles, then two courses each funnelled learners -> started -> completed, every stage a share of its learner base.",
                        code: "<ExpertDashboardOverview metrics={metrics} funnel={funnel} labels={labels} />",
                        render: <ExpertDashboardOverview metrics={METRICS} funnel={FUNNEL} labels={LABELS} />,
                    },
                    {
                        name: "funnel = [] (new account)",
                        why: "A brand-new account: the tiles read zero and the funnel section shows its own empty state, because a course with no learners cannot be funnelled.",
                        code: "<ExpertDashboardOverview metrics={zeroMetrics} funnel={[]} labels={labels} />",
                        render: <ExpertDashboardOverview metrics={EMPTY_METRICS} funnel={[]} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
