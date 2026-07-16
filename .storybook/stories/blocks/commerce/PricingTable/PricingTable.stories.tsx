import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { PricingTable } from "@/components/blocks/commerce/PricingTable"
import { threeTiers } from "./components"

const meta: Meta<typeof PricingTable> = {
    title: "Features/Commerce/PricingTable",
    component: PricingTable,
}
export default meta
type Story = StoryObj<typeof PricingTable>

/** Use when you need to compare 2–3 plans side by side — each column has a plan name, price and billing period, a feature list with checks or dashes, an action button, and one highlighted plan with a "popular" ribbon. */
export const Default: Story = {
    parameters: {
        usage: "Use it on a pricing page or an upgrade step — comparing 2–3 plans side by side. Each plan holds its own pre-formatted price as a string; keep the feature labels the same across plans so they line up. Turn on isHighlighted for the middle plan to get the popular ribbon and an emphasized frame.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Three plans, middle one highlighted</Label>
                <Typography type="body-sm" color="muted">
                    The three columns share one feature set so the labels line up; the middle Professional plan is emphasized with the popular ribbon and an emphasized frame.
                </Typography>
            </div>
            <PricingTable tiers={threeTiers} onSelectTier={() => {}} />
        </div>
    ),
}

/** Use to check the layout when there are only two plans and none is emphasized — the two columns still stretch evenly and the buttons line up. */
export const TwoTiersNoHighlight: Story = {
    parameters: {
        usage: "Use when there are only two plans and you don't want to emphasize either — the two columns stretch evenly, with action buttons aligned at the bottom. Without isHighlighted, no column gets a ribbon.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Two plans, no highlight</Label>
                <Typography type="body-sm" color="muted">
                    When there are only two plans and none is emphasized, the two columns still stretch evenly and the action buttons line up at the bottom.
                </Typography>
            </div>
            <PricingTable
                tiers={threeTiers.slice(0, 2).map((tier) => ({ ...tier, isHighlighted: false }))}
                onSelectTier={() => {}}
            />
        </div>
    ),
}
