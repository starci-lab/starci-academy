import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    RevenueSummary,
    type RevenueSummaryMetrics,
} from "@sb-components/nivoexpert/blocks/revenue/RevenueSummary/RevenueSummary"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `RevenueSummary` — the four headline tiles atop the revenue dashboard: this
 * month's revenue, order count, coupons redeemed, and installment plans still
 * running. The only state is `isSkeleton` (§12b) — the shape never otherwise
 * changes. Grounded in the real `PaymentModule` order ledger, `CouponEntity`
 * redemptions, and the `InstallmentPlanEntity` rows still mid-schedule.
 */
const meta: Meta<typeof RevenueSummary> = {
    title: "NivoExpert/Blocks/Revenue/RevenueSummary/RevenueSummary",
    component: RevenueSummary,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof RevenueSummary>

const METRICS: RevenueSummaryMetrics = {
    monthlyRevenue: { value: "$4,820", label: "Revenue this month", hint: "+12% vs last month" },
    orders: { value: "690", label: "Orders" },
    couponsRedeemed: { value: "54", label: "Coupons redeemed" },
    installmentsInProgress: { value: "37", label: "Installment plans running" },
}

/** A brand-new academy: no orders booked yet. */
const EMPTY_METRICS: RevenueSummaryMetrics = {
    monthlyRevenue: { value: "$0", label: "Revenue this month", hint: "no orders yet" },
    orders: { value: "0", label: "Orders" },
    couponsRedeemed: { value: "0", label: "Coupons redeemed" },
    installmentsInProgress: { value: "0", label: "Installment plans running" },
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    MetricCard: { tier: "composite", role: "each headline tile — revenue, orders, coupons redeemed, installments running" },
}

/** LEAF — one shape; `isSkeleton` is the only state. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RevenueSummary"
                tier="block"
                leaf="Summary tiles"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                reason="Blocks take no `className`: the block owns four counts already resolved by the connected layer (this month's revenue, order count, coupon redemptions, and installment plans still running). The tiles never change shape, so `isSkeleton` is the whole state set — there is no empty leaf, because a brand-new academy still has four tiles, each reading zero."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The dashboard's own first fetch is in flight: all four tiles draw their skeleton mirror, matching the resolved layout so nothing jumps when the counts land.",
                        code: "<RevenueSummary metrics={metrics} isSkeleton />",
                        render: <RevenueSummary metrics={METRICS} isSkeleton />,
                    },
                    {
                        name: "metrics present",
                        why: "The resolved summary: $4,820 booked this month (up 12%), 690 orders, 54 coupon redemptions, and 37 installment plans still mid-schedule.",
                        code: "<RevenueSummary metrics={metrics} />",
                        render: <RevenueSummary metrics={METRICS} />,
                    },
                    {
                        name: "metrics = all-zero (new academy)",
                        why: "A brand-new academy: no orders booked yet — the tiles read zero rather than the section disappearing, because there is always something to report.",
                        code: "<RevenueSummary metrics={emptyMetrics} />",
                        render: <RevenueSummary metrics={EMPTY_METRICS} />,
                    },
                ]}
            />
        </div>
    ),
}
