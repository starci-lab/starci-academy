import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PricingTierCard,
    type PricingTierCardLabels,
    type PricingTierRow,
} from "@sb-components/nivo/blocks/agent-os/PricingTierCard/PricingTierCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PricingTierCard` — one Agent OS monthly tier: name, price, what it unlocks,
 * and a select action. One composition; `isSelected` is the only DATA state of
 * the shape — the card's accent ring plus a stepped-up primary CTA. Grounded in
 * the real `nivo-ai-agent` SKU's three monthly tiers (Basic 490,000 / Pro
 * 990,000 / Scale 2,400,000 VND, `catalog-seeder.service.ts`).
 */
const meta: Meta<typeof PricingTierCard> = {
    title: "Nivo/Blocks/AgentOs/PricingTierCard/PricingTierCard",
    component: PricingTierCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PricingTierCard>

const LABELS: PricingTierCardLabels = {
    perMonthLabel: "/ month",
    selectLabel: "Select",
}

const BASIC: PricingTierRow = {
    id: "agent_os_basic",
    name: "Basic",
    priceMonthlyVnd: 490000,
    unlocks: ["1 agent", "Zalo + Telegram", "1,000 messages / month", "Industry script templates"],
}

const PRO: PricingTierRow = {
    id: "agent_os_pro",
    name: "Pro",
    priceMonthlyVnd: 990000,
    unlocks: ["3 agents", "Every channel (adds WhatsApp)", "5,000 messages / month", "Knowledge base (RAG)", "Playground"],
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the tier card face; the accent ring marks the selected tier" },
    Typography: { tier: "atom", role: "the name, price, checked unlock list" },
    Button: { tier: "atom", role: "the select CTA — steps up to primary once this tier is selected" },
}

/** LEAF — the tier card has one shape; `isSelected` is DATA ⇒ a state. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PricingTierCard"
                tier="block"
                leaf="Tier card"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Blocks take no `className`: `isSelected` is DATA about which of several tier cards is currently chosen in a single-select chooser, so it is a state of one shape rather than a different composition. Selecting draws `SurfaceCard`'s own accent ring and steps the CTA up to the primary variant, so the choice reads at a glance without a separate radio glyph."
                states={[
                    {
                        name: "default (Basic, not selected)",
                        why: "The resting look every tier card shares before it is chosen — a secondary CTA, no ring.",
                        code: "<PricingTierCard tier={basic} isSelected={false} onSelect={select} labels={labels} />",
                        render: <PricingTierCard tier={BASIC} isSelected={false} onSelect={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSelected (Pro)",
                        why: "The chosen tier in a chooser of several — an accent ring around the face plus a primary CTA, so the buyer sees exactly what they are about to rent.",
                        code: "<PricingTierCard tier={pro} isSelected onSelect={select} labels={labels} />",
                        render: <PricingTierCard tier={PRO} isSelected onSelect={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The tier list's own first fetch hasn't resolved, so the same card keeps its shape — name, price, unlock list, and CTA all shimmering — matching the loaded tier so nothing jumps when it lands.",
                        code: `<PricingTierCard
    tier={pro}
    isSelected={false}
    onSelect={select}
    labels={labels}
    isSkeleton
/>`,
                        render: <PricingTierCard tier={PRO} isSelected={false} onSelect={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
