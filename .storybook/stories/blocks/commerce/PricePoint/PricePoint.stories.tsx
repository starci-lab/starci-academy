import type { Meta, StoryObj } from "@storybook/nextjs"
import { PricePoint } from "./PricePoint"

/**
 * PRIMITIVE — a tier/subscription price as ONE unit: amount + optional struck
 * original + optional billing period. Use this instead of hand-rolling three raw
 * Typography. (For discounted PRODUCT prices with a breakdown popover, see the
 * separate `commerce/PriceTag`.)
 */
const meta: Meta<typeof PricePoint> = {
    title: "Primitives/Commerce/PricePoint",
    component: PricePoint,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof PricePoint>

const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** DEFAULT — amount only (e.g. a one-off or free tier). */
export const Default: Story = {
    render: () => shell(<PricePoint amount="0đ" />),
}

/** WITH PERIOD — a subscription tier: amount + billing period. */
export const WithPeriod: Story = {
    render: () => shell(<PricePoint amount="299.000đ" period="/tháng" />),
}

/** DISCOUNTED — amount + struck original + period. */
export const Discounted: Story = {
    render: () => shell(<PricePoint amount="199.000đ" original="299.000đ" period="/tháng" />),
}

/** SIZES — sm (h4) · md (h3, default) · lg (h2). */
export const Sizes: Story = {
    render: () => shell(
        <div className="flex flex-col gap-6">
            <PricePoint amount="299.000đ" period="/tháng" size="sm" />
            <PricePoint amount="299.000đ" period="/tháng" size="md" />
            <PricePoint amount="299.000đ" period="/tháng" size="lg" />
        </div>,
    ),
}

/** SKELETON — the loading mirror (amount + period placeholders). */
export const Skeleton: Story = {
    render: () => shell(<PricePoint amount="" period="/tháng" isSkeleton />),
}
