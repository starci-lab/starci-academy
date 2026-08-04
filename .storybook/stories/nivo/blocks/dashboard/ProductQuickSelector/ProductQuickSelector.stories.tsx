import type { Meta, StoryObj } from "@storybook/nextjs"
import { RocketLaunchIcon, SparkleIcon, StorefrontIcon } from "@phosphor-icons/react"
import {
    ProductQuickSelector,
    type ProductQuickSelectorItem,
} from "@sb-components/nivo/blocks/dashboard/ProductQuickSelector/ProductQuickSelector"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ProductQuickSelector` (dashboard) — the "where do you want to start?"
 * onward path for a brand-new account: three cards, each routing to a real,
 * buyable destination. Narrower than the landing page's own
 * `ProductQuickSelector` — every card here maps to something the account can
 * act on today, so there is no roadmap flag to model.
 */
const meta: Meta<typeof ProductQuickSelector> = {
    title: "Nivo/Blocks/Dashboard/ProductQuickSelector/ProductQuickSelector",
    component: ProductQuickSelector,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProductQuickSelector>

const NOOP = () => {}

// The three real onward destinations for a brand-new account.
const ITEMS: Array<ProductQuickSelectorItem> = [
    { key: "expert-site", icon: RocketLaunchIcon, label: "Build an expert site", ctaLabel: "Create your site for free", onPress: NOOP },
    { key: "ai-agent", icon: SparkleIcon, label: "Hire an AI Agent for customer chat", ctaLabel: "See the 3 plans", onPress: NOOP },
    { key: "catalog", icon: StorefrontIcon, label: "Browse the full catalog", ctaLabel: "Open the catalog", onPress: NOOP },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCardPressableGroup: { tier: "composite", role: "the whole-card press grid, one tile per destination" },
    StackV: { tier: "frame", role: "each card's destination line and CTA line" },
    Typography: { tier: "atom", role: "the destination label and the accent CTA line" },
}

/** LEAF — `items`: the three real onward destinations for a brand-new account. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProductQuickSelector"
                tier="block"
                leaf="items"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Every card here routes to something real and buyable today — unlike the landing page's own `ProductQuickSelector`, this grid carries no `isRoadmap` flag, because a signed-in account with nothing provisioned yet is only ever pointed at a destination it can act on right now."
                states={[
                    {
                        name: "the three real destinations",
                        why: "A brand-new account's onward path: build the expert site, hire the AI Agent, or browse the whole catalog.",
                        code: `<ProductQuickSelector
    items={[
        { key: "expert-site", icon: RocketLaunchIcon, label: "Build an expert site", ctaLabel: "Create your site for free", onPress: openExpertSite },
        { key: "ai-agent", icon: SparkleIcon, label: "Hire an AI Agent for customer chat", ctaLabel: "See the 3 plans", onPress: openAgent },
        { key: "catalog", icon: StorefrontIcon, label: "Browse the full catalog", ctaLabel: "Open the catalog", onPress: openCatalog },
    ]}
/>`,
                        render: <ProductQuickSelector items={ITEMS} />,
                    },
                ]}
            />
        </div>
    ),
}
