import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CategoryTabs,
    type CategoryTab,
} from "@sb-components/nivo/blocks/catalog/CategoryTabs/CategoryTabs"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CategoryTabs` — the catalog category filter row, one tab per category with its
 * product count. `activeKey` is DATA, so which tab is lit is a state of the single
 * shape. Grounded in the real `CatalogCategory` — the streamlined catalog exposes
 * two categories.
 */
const meta: Meta<typeof CategoryTabs> = {
    title: "Nivo/Blocks/Catalog/CategoryTabs/CategoryTabs",
    component: CategoryTabs,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CategoryTabs>

const CATEGORIES: Array<CategoryTab> = [
    { key: "site_from_template", label: "AI Academy", count: 1 },
    { key: "ai_agent", label: "AI Agent", count: 1 },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Typography: { tier: "atom", role: "each tab's category label; the active label switches to the accent tone" },
}

/** LEAF — the row has one shape; which tab is active is DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CategoryTabs"
                tier="block"
                leaf="Category filter"
                annotate={ANNOTATE}
                renderClassName="w-full max-w-md"
                reason="Blocks take no `className`: which tab is active is DATA (`activeKey`), so it is a state of one shape, not a separate leaf. The block owns the category taxonomy + per-category counts — its domain data — and emits `onSelect`. The tonal active treatment (`bg-accent/10` + accent label + accent count pill) is written out per state so the block composes no class at runtime, mirroring the real `NivoSidebar` active row."
                states={[
                    {
                        name: "activeKey = site_from_template",
                        why: "The AI Academy tab is selected: it carries the accent tint, an accent label, and an accent count pill, while the AI Agent tab sits muted. This is the default landing view of the catalog.",
                        code: `<CategoryTabs
    categories={categories}
    activeKey="site_from_template"
    onSelect={select}
/>`,
                        render: <CategoryTabs categories={CATEGORIES} activeKey="site_from_template" onSelect={NOOP} />,
                    },
                    {
                        name: "activeKey = ai_agent",
                        why: "The same row after selecting AI Agent: the active treatment moves to the second tab and the first drops to muted — the proof that exactly one tab is lit and it follows `activeKey`.",
                        code: `<CategoryTabs categories={categories} activeKey="ai_agent" … />`,
                        render: <CategoryTabs categories={CATEGORIES} activeKey="ai_agent" onSelect={NOOP} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch hasn't resolved, so a fixed count of idle, non-interactive placeholder tabs render with their labels shimmering — the row holds its shape until the real categories land.",
                        code: `<CategoryTabs
    categories={categories}
    activeKey="site_from_template"
    onSelect={select}
    isSkeleton
/>`,
                        render: <CategoryTabs categories={CATEGORIES} activeKey="site_from_template" onSelect={NOOP} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
