import { Grid } from "@sb-components/frames/Grid/Grid"
import { MetricCard } from "@sb-components/composites/stats/MetricCard/MetricCard"

/**
 * `RevenueSummary` -- the four headline tiles atop the revenue dashboard: this
 * month's revenue, order count, coupons redeemed, and installment plans still
 * running. The only state is `isSkeleton` (§12b) -- the shape never otherwise
 * changes. Grounded in the real `PaymentModule` order ledger, `CouponEntity`
 * redemptions, and the `InstallmentPlanEntity` rows still mid-schedule.
 */

/** One headline tile -- already resolved by the connected layer. */
export interface RevenueMetricView {
    /** The large value (e.g. "$4,820", "690", "54"). */
    value: string
    /** What the value measures (e.g. "Revenue this month"). */
    label: string
    /** Optional quiet footnote (e.g. "+12% vs last month"). */
    hint?: string
}

/** The four headline tiles this block renders. */
export interface RevenueSummaryMetrics {
    /** Revenue booked this calendar month (`PaymentModule`'s paid orders, summed). */
    monthlyRevenue: RevenueMetricView
    /** Total orders this month, across every gateway and plan. */
    orders: RevenueMetricView
    /** How many orders redeemed a coupon this month (`CouponEntity` redemptions). */
    couponsRedeemed: RevenueMetricView
    /** Installment plans still mid-schedule (`InstallmentPlanEntity` rows not yet fully paid). */
    installmentsInProgress: RevenueMetricView
}

/** Props for {@link RevenueSummary}. */
export interface RevenueSummaryProps {
    /** The four headline tiles. */
    metrics: RevenueSummaryMetrics
    /**
     * `true` -> the dashboard's own first fetch is in flight: all four tiles draw
     * their skeleton mirror (§12b), threaded straight down -- never fed to a
     * separate skeleton tree.
     */
    isSkeleton?: boolean
}

/**
 * The revenue summary tiles. See the file header for why the only state is
 * `isSkeleton` rather than a set of separate leaves.
 *
 * @param props - {@link RevenueSummaryProps}
 */
const RevenueSummary = ({ metrics, isSkeleton = false }: RevenueSummaryProps) => (
    <div data-tier="block" data-component="RevenueSummary">
        <Grid
            columns={{ base: 1, sm: 2, lg: 4 }}
            gap={4}
            items={[
                {
                    key: "monthlyRevenue",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={metrics.monthlyRevenue.value} label={metrics.monthlyRevenue.label} hint={metrics.monthlyRevenue.hint} />
                        ),
                },
                {
                    key: "orders",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={metrics.orders.value} label={metrics.orders.label} hint={metrics.orders.hint} />
                        ),
                },
                {
                    key: "couponsRedeemed",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={metrics.couponsRedeemed.value} label={metrics.couponsRedeemed.label} hint={metrics.couponsRedeemed.hint} />
                        ),
                },
                {
                    key: "installmentsInProgress",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard
                                value={metrics.installmentsInProgress.value}
                                label={metrics.installmentsInProgress.label}
                                hint={metrics.installmentsInProgress.hint}
                            />
                        ),
                },
            ]}
        />
    </div>
)

export { RevenueSummary }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "RevenueSummary" } as const
