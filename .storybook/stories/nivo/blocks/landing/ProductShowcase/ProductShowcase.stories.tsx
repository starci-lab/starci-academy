import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ProductShowcase,
    type ProductShowcaseLabels,
    type ProductShowcaseRow,
} from "@sb-components/nivo/blocks/landing/ProductShowcase/ProductShowcase"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ProductShowcase` — the landing's "start here" section: the two REAL catalog
 * products side by side (category, tagline, checked feature list, from-price,
 * plan count, CTA), under a derived-count hook chip + section heading. Three
 * DATA states of the one shape: `content`, `empty` (defensive), `isSkeleton`.
 * Grounded in the real `CatalogItemEntity`.
 */
const meta: Meta<typeof ProductShowcase> = {
    title: "Nivo/Blocks/Landing/ProductShowcase/ProductShowcase",
    component: ProductShowcase,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProductShowcase>

const LABELS: ProductShowcaseLabels = {
    hookLabel: "2 products · 6 plans — ready to buy today",
    eyebrow: "Ready to buy today",
    title: "Start from the first two pieces of the system",
    intro: "Two platform products you can pick a plan for and run right now — no account needed to look.",
    fromLabel: "from",
    perMonthLabel: "/ month",
    freeLabel: "Free to start",
    emptyTitle: "No products listed yet",
    emptyDescription: "The catalog is being restocked. See the full pricing page for the latest plans.",
    emptyCtaLabel: "See pricing",
}

const ACADEMY: ProductShowcaseRow = {
    id: "nivo-ai-academy",
    categoryLabel: "Site from template",
    name: "AI Academy",
    tagline: "Spin up your own academy site + courses from a template — tuition collection and an AI tutor built in.",
    features: [
        "<slug>.nivo.vn site + courses + community",
        "Tuition collection (SePay / PayOS)",
        "AI tutor + certificates",
    ],
    basePriceVnd: 0,
    planCountLabel: "3 plans (Starter / Professional / Business)",
    ctaLabel: "Choose an AI Academy plan",
}

const AGENT: ProductShowcaseRow = {
    id: "nivo-ai-agent",
    categoryLabel: "Multi-agent AI assistant",
    name: "nivo AI Agent",
    tagline: "A multi-agent AI team on Zalo / Telegram / WhatsApp for sales, marketing, accounting, and ops.",
    features: [
        "Zalo + Telegram + WhatsApp",
        "1 → several agents by tier",
        "Knowledge base (RAG) + playground",
    ],
    basePriceVnd: 490000,
    planCountLabel: "3 plans (Basic / Pro / Scale)",
    ctaLabel: "Choose an AI Agent plan",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SectionHeading: { tier: "block", role: "the eyebrow/title/intro header", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    Chip: { tier: "atom", role: "the derived-count hook, computed by the caller from the same products array" },
    SurfaceCard: { tier: "composite", role: "one panel per real product" },
    EmptyState: { tier: "composite", role: "the defensive empty branch — the seeder makes this effectively impossible" },
    Typography: { tier: "atom", role: "category, name, tagline, checked features, price, and plan count" },
    Button: { tier: "atom", role: "the per-product CTA into that product's pricing" },
}

/** LEAF — the section has one shape; content / empty / isSkeleton are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProductShowcase"
                tier="block"
                leaf="Product showcase"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-5xl"
                reason="Blocks take no `className`: the block owns the two real catalog products, so which ones show and whether the catalog came back empty are states of one shape, not separate components. Two peers sit SIDE BY SIDE (a 2-column grid), never behind a tab — hiding one of two products behind a tab would defeat the comparison this section exists for. The header's hook chip carries a number the CALLER derives from this same `products` array (the same discipline `ProofStrip` uses elsewhere on the page), so the count can never drift from what is actually sold."
                states={[
                    {
                        name: "content (2 real products)",
                        why: "The two real catalog products, side by side: AI Academy (free entry tier) and nivo AI Agent (490,000 VND entry tier). Each panel carries its own checked feature list, from-price, plan count, and a CTA that names the product it routes to.",
                        code: `<ProductShowcase
    products={[academy, agent]}
    onSelectProduct={selectProduct}
    onExploreAll={exploreAll}
    labels={labels}
/>`,
                        render: <ProductShowcase products={[ACADEMY, AGENT]} onSelectProduct={NOOP} onExploreAll={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "products = [] (defensive empty)",
                        why: "The catalog seeder makes zero products effectively impossible, but the section still needs an honest floor rather than crashing or rendering a bare gap: it collapses to editorial copy and a link into the full pricing page.",
                        code: "<ProductShowcase products={[]} onSelectProduct={selectProduct} onExploreAll={exploreAll} labels={labels} />",
                        render: <ProductShowcase products={[]} onSelectProduct={NOOP} onExploreAll={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch hasn't resolved, so the same two-panel grid keeps its shape — category, name, tagline, features, price and plan count all shimmering and both CTAs blocked — matching the loaded panels so nothing jumps when the products land.",
                        code: `<ProductShowcase
    products={[academy, agent]}
    onSelectProduct={selectProduct}
    onExploreAll={exploreAll}
    labels={labels}
    isSkeleton
/>`,
                        render: <ProductShowcase products={[ACADEMY, AGENT]} onSelectProduct={NOOP} onExploreAll={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
