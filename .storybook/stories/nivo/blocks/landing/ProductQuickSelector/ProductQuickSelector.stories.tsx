import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProductQuickSelector, type ProductQuickSelectorItem } from "@sb-components/nivo/blocks/landing/ProductQuickSelector/ProductQuickSelector"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ProductQuickSelector` — the "where do you want to start?" intent grid.
 * Each card routes to a real product or, honestly, to the Lead-Leakage Audit
 * when the need names a roadmap layer. Feeding a shorter list proves the grid
 * reflows on real data, not a fixed six-card layout.
 */
const meta: Meta<typeof ProductQuickSelector> = {
    title: "Nivo/Blocks/Landing/ProductQuickSelector/ProductQuickSelector",
    component: ProductQuickSelector,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProductQuickSelector>

const NOOP = () => {}

// The six real needs this grid is grounded in: two map straight to the two
// buyable products, one to a general AI-Agent use, two are honestly flagged
// roadmap (CRM/Workflow, Dashboard), and the last always offers the audit.
const SIX_NEEDS: Array<ProductQuickSelectorItem> = [
    { key: "site", need: "I need to build a website or academy", mapsToLabel: "→ AI Academy", ctaLabel: "See Academy plans", onPress: NOOP },
    { key: "support", need: "I need AI to handle customers 24/7", mapsToLabel: "→ nivo AI Agent", ctaLabel: "See AI Agent plans", onPress: NOOP },
    { key: "leads", need: "I need to capture and nurture leads", mapsToLabel: "→ CRM · Workflow (roadmap)", isRoadmap: true, ctaLabel: "Take the Lead Audit", onPress: NOOP },
    { key: "content", need: "I need AI to help with content or sales", mapsToLabel: "→ nivo AI Agent", ctaLabel: "Try AI Agent", onPress: NOOP },
    { key: "growth", need: "I need to see my growth numbers", mapsToLabel: "→ Dashboard (roadmap)", isRoadmap: true, ctaLabel: "See a sample dashboard", onPress: NOOP },
    { key: "unsure", need: "I'm not sure where to start", mapsToLabel: "→ Lead Leakage Audit", ctaLabel: "Take the audit", onPress: NOOP },
]

// A shorter list (three needs) — the grid reflows on real DATA, not a fixed six-card shape.
const THREE_NEEDS: Array<ProductQuickSelectorItem> = SIX_NEEDS.slice(0, 3)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCardPressableGroup: { tier: "composite", role: "the whole-card press grid, one tile per need" },
    StackV: { tier: "frame", role: "each card's need / maps-to line / CTA line" },
    Typography: { tier: "atom", role: "the need, the maps-to line (warning-toned when roadmap), and the CTA line" },
}

/** LEAF — `items`: the six need cards; a shorter list proves the grid is driven by data, not a fixed count. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProductQuickSelector"
                tier="block"
                leaf="items"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Whether a need's `mapsToLabel` reads as a real product or a roadmap layer is DATA (`isRoadmap`) — a roadmap need still routes somewhere honest (the audit), never to a product that doesn't exist yet. Feeding fewer items reflows the same grid instead of leaving four empty cells, proving the count comes from `items.length`."
                states={[
                    {
                        name: "six needs (the grounded default)",
                        why: "The real six-need grid: two route straight to the two buyable products, one to a general AI-Agent use, two are honestly roadmap-flagged, and the last always offers the audit.",
                        code: `<ProductQuickSelector
    items={[
        { key: "site", need: "I need to build a website or academy", mapsToLabel: "→ AI Academy", ctaLabel: "See Academy plans", onPress: openAcademy },
        { key: "support", need: "I need AI to handle customers 24/7", mapsToLabel: "→ nivo AI Agent", ctaLabel: "See AI Agent plans", onPress: openAgent },
        { key: "leads", need: "I need to capture and nurture leads", mapsToLabel: "→ CRM · Workflow (roadmap)", isRoadmap: true, ctaLabel: "Take the Lead Audit", onPress: openAudit },
        // …
    ]}
/>`,
                        render: <ProductQuickSelector items={SIX_NEEDS} />,
                    },
                    {
                        name: "three needs",
                        why: "A shorter catalog of needs still lays out cleanly — the grid reflows from real data instead of assuming a fixed six-card shape.",
                        code: `<ProductQuickSelector items={sixNeeds.slice(0, 3)} />`,
                        render: <ProductQuickSelector items={THREE_NEEDS} />,
                    },
                ]}
            />
        </div>
    ),
}
