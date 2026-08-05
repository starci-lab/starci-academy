import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProofStrip, type ProofProduct, type ProofStripLabels } from "@sb-components/nivo/blocks/landing/ProofStrip/ProofStrip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ProofStrip` — the landing's one honest proof strip. Two stats are DERIVED
 * from the real catalog (product count, total plans), so the leaf shows two
 * catalog inputs to prove the numbers are computed, not hardcoded. Grounded in
 * the streamlined two-product catalog.
 */
const meta: Meta<typeof ProofStrip> = {
    title: "Nivo/Blocks/Landing/ProofStrip/ProofStrip",
    component: ProofStrip,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProofStrip>

const LABELS: ProofStripLabels = {
    productsLabel: "Products",
    plansLabel: "Pricing plans",
    infrastructureValue: "Self-hosted",
    infrastructureLabel: "Runs where you control it",
}

// The real catalog: AI Academy has 3 tiers, nivo AI Agent has 2 → 2 products, 5 plans.
const TWO_PRODUCTS: Array<ProofProduct> = [
    { id: "nivo-ai-academy", planCount: 3 },
    { id: "nivo-ai-agent", planCount: 2 },
]

// A single-product catalog → 1 product, 3 plans: proof the counts are derived.
const ONE_PRODUCT: Array<ProofProduct> = [{ id: "nivo-ai-academy", planCount: 3 }]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the bordered strip the stats sit in" },
    Grid: { tier: "frame", role: "the three stat cells" },
    StackV: { tier: "frame", role: "each stat cell (value over label)" },
    Typography: { tier: "atom", role: "each stat's value and label" },
}

/** LEAF — the catalog products; the visible counts are derived from this input. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProofStrip"
                tier="block"
                leaf="Catalog products"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. The proof strip is the only social proof the landing makes and all of it must be true, so the first two stats are DERIVED from the products it is handed — product count is the array length, plan count is the sum of each product's plans — never a hardcoded number. The third cell is a qualitative infrastructure label, not an invented uptime percentage. Feeding two different product arrays shows the counts recomputing."
                states={[
                    {
                        name: "two products (the real catalog)",
                        why: "The streamlined catalog: AI Academy (3 plans) and nivo AI Agent (2 plans) resolve to 2 products and 5 plans — the numbers the live landing shows.",
                        code: `<ProofStrip
    products={[
        { id: "nivo-ai-academy", planCount: 3 },
        { id: "nivo-ai-agent", planCount: 2 },
    ]}
    labels={labels}
/>`,
                        render: <ProofStrip products={TWO_PRODUCTS} labels={LABELS} />,
                    },
                    {
                        name: "one product",
                        why: "A single-product catalog recomputes to 1 product and 3 plans — the same block, different data, proving neither number is baked in.",
                        code: "<ProofStrip products={[{ id: \"nivo-ai-academy\", planCount: 3 }]} labels={labels} />",
                        render: <ProofStrip products={ONE_PRODUCT} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
