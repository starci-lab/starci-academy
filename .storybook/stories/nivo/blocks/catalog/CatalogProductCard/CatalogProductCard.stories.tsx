import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CatalogProductCard,
    type CatalogProductCardLabels,
    type CatalogProductRow,
} from "@sb-components/nivo/blocks/catalog/CatalogProductCard/CatalogProductCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CatalogProductCard` — one product in the streamlined catalog. The whole card is
 * the order target. Two DATA states of the single shape: `orderable` and
 * `coming-soon` (`!isOrderWired` dims the card and swaps the affordance for a
 * chip). Grounded in the real `CatalogItemEntity`.
 */
const meta: Meta<typeof CatalogProductCard> = {
    title: "Nivo/Blocks/Catalog/CatalogProductCard/CatalogProductCard",
    component: CatalogProductCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CatalogProductCard>

const LABELS: CatalogProductCardLabels = {
    orderLabel: "See plans",
    comingSoonLabel: "Coming soon",
    fromLabel: "from",
    perMonthLabel: "/ month",
    freeLabel: "Free to start",
    orderAriaLabel: "See plans for this product",
}

const ACADEMY: CatalogProductRow = {
    id: "nivo-ai-academy",
    name: "AI Academy",
    categoryLabel: "Site from template",
    tagline: "Spin up your own academy site + courses from a template — tuition collection and an AI tutor built in.",
    basePriceVnd: 299000,
    isOrderWired: true,
}

const AGENT: CatalogProductRow = {
    id: "nivo-ai-agent",
    name: "nivo AI Agent",
    categoryLabel: "AI Agent",
    tagline: "A multi-agent AI team on Zalo/Telegram/WhatsApp for sales, marketing, accounting, and ops.",
    basePriceVnd: 490000,
    isOrderWired: false,
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the whole-card order target; dims + blocks the press when coming-soon" },
    Chip: { tier: "atom", role: "the coming-soon marker, shown in place of the see-plans affordance" },
    Typography: { tier: "atom", role: "the category, name, tagline, price, and the see-plans affordance" },
}

/** LEAF — the card has one shape; orderable vs coming-soon are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CatalogProductCard"
                tier="block"
                leaf="Product card"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Blocks take no `className`: whether a product is orderable is DATA, so it is a state of one shape. Rather than hand-composing a dim, the whole card is the order target and `!isOrderWired` uses `SurfaceCard`'s real disabled-press dim — which also blocks the press — and swaps the see-plans affordance for a coming-soon chip. The price is the entry (`from`) tier price; the block owns the VND grouping."
                states={[
                    {
                        name: "isOrderWired = true",
                        why: "AI Academy, fully wired: the card presses through to the tier chooser, shows its `from` price (the free/entry tier climbs to a paid one), and carries a sliding see-plans affordance.",
                        code: `<CatalogProductCard
    product={academy /* isOrderWired */}
    onOrder={order}
    labels={labels}
/>`,
                        render: <CatalogProductCard product={ACADEMY} onOrder={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isOrderWired = false",
                        why: "nivo AI Agent, catalog-listed ahead of its order path being built: the whole card dims, the press is blocked, and a muted coming-soon chip stands in for the affordance — the product is visible but not yet buyable.",
                        code: "<CatalogProductCard product={agent /* !isOrderWired */} … />",
                        render: <CatalogProductCard product={AGENT} onOrder={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch hasn't resolved, so the same card keeps its shape — category, name, tagline, price and see-plans line all shimmering and the whole-card press blocked — matching the loaded card so nothing jumps when the product lands.",
                        code: `<CatalogProductCard
    product={academy}
    onOrder={order}
    labels={labels}
    isSkeleton
/>`,
                        render: <CatalogProductCard product={ACADEMY} onOrder={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
