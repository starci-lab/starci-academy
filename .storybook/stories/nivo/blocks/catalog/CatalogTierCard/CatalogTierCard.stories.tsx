import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CatalogTierCard,
    type CatalogTierCardLabels,
    type CatalogTierRow,
} from "@sb-components/nivo/blocks/catalog/CatalogTierCard/CatalogTierCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CatalogTierCard` — one price tier of a tiered product. The variations are all
 * DATA states of the single shape: `default`, `recommended` (accent highlight +
 * badge), `owned` (CTA → current-plan chip), and `disabled` (CTA blocked + reason).
 * Grounded in the real streamlined AI Academy tiers.
 */
const meta: Meta<typeof CatalogTierCard> = {
    title: "Nivo/Blocks/Catalog/CatalogTierCard/CatalogTierCard",
    component: CatalogTierCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CatalogTierCard>

const LABELS: CatalogTierCardLabels = {
    selectLabel: "Choose",
    recommendedLabel: "Recommended",
    ownedLabel: "Current plan",
    perMonthLabel: "/ month",
    freeLabel: "Free",
}

const STARTER: CatalogTierRow = {
    id: "academy_start",
    name: "Starter",
    description: "Academy site at your slug + one course + community + basic lead capture.",
    priceMonthlyVnd: 0,
    priceOneTimeVnd: null,
    features: ["Academy site on nivo.vn", "1 course", "Community", "Basic lead capture"],
    isRecommended: false,
    isOwned: false,
    disabledReason: null,
}

const PROFESSIONAL: CatalogTierRow = {
    id: "academy_pro",
    name: "Professional",
    description: "Custom domain + unlimited courses + tuition collection + AI tutor + certificates.",
    priceMonthlyVnd: 299000,
    priceOneTimeVnd: null,
    features: ["Custom domain", "Unlimited courses", "Tuition payments (SePay/PayOS)", "AI tutor", "Certificates"],
    isRecommended: true,
    isOwned: false,
    disabledReason: null,
}

const BUSINESS_OWNED: CatalogTierRow = {
    id: "academy_business",
    name: "Business",
    description: "Multiple experts + affiliate + Docker export / self-host + priority SLA support.",
    priceMonthlyVnd: 899000,
    priceOneTimeVnd: null,
    features: ["Multiple experts", "Affiliate program", "Docker export / self-host", "Priority support (SLA)"],
    isRecommended: false,
    isOwned: true,
    disabledReason: null,
}

const STARTER_DISABLED: CatalogTierRow = {
    ...STARTER,
    isOwned: false,
    disabledReason: "You can't downgrade to the free tier while on a paid plan.",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the tier card; the accent highlight sweep marks the recommended tier" },
    Chip: { tier: "atom", role: "the recommended badge and the owned (current-plan) marker" },
    Button: { tier: "atom", role: "the choose CTA — blocked when a disabled reason is set" },
    Typography: { tier: "atom", role: "the name, price, description, checked feature list, and disabled reason" },
}

/** LEAF — the tier has one shape; default / recommended / owned / disabled are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CatalogTierCard"
                tier="block"
                leaf="Tier card"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Blocks take no `className`: recommended / owned / disabled are all DATA about one tier, so they are states of one shape. `isRecommended` uses `SurfaceCard`'s real highlight sweep plus a badge chip; `isOwned` replaces the choose CTA with a current-plan chip; a `disabledReason` blocks the CTA and shows the reason. The `featureFlags` jsonb is resolved to labels by the connected layer, so the block renders a plain checked list."
                states={[
                    {
                        name: "default (Starter)",
                        why: "A plain, choosable tier: the free Starter plan, no badge, an enabled Choose button. This is the resting look every tier shares before any positioning or ownership state applies.",
                        code: "<CatalogTierCard tier={starter} onSelect={select} labels={labels} />",
                        render: <CatalogTierCard tier={STARTER} onSelect={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isRecommended (Professional)",
                        why: "The positioned tier: `isRecommended` lights the accent highlight sweep and shows a Recommended badge, and its Choose button steps up to the primary variant. At most one tier per product carries this.",
                        code: "<CatalogTierCard tier={pro /* isRecommended */} … />",
                        render: <CatalogTierCard tier={PROFESSIONAL} onSelect={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isOwned (Business)",
                        why: "The tier the user is already on: the choose CTA is gone and a success current-plan chip stands in its place, so there is nothing to buy twice.",
                        code: "<CatalogTierCard tier={business /* isOwned */} … />",
                        render: <CatalogTierCard tier={BUSINESS_OWNED} onSelect={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "disabledReason set (Starter)",
                        why: "A tier that exists but can't be chosen right now — here a downgrade to free while on a paid plan. The Choose button is blocked and the reason reads directly beneath it rather than failing silently on click.",
                        code: "<CatalogTierCard tier={{ ...starter, disabledReason }} … />",
                        render: <CatalogTierCard tier={STARTER_DISABLED} onSelect={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch hasn't resolved, so the same tier card keeps its shape — badge, name, price, description, checked features and the Choose CTA all shimmering — matching the loaded tier so nothing jumps when it lands.",
                        code: `<CatalogTierCard
    tier={pro}
    onSelect={select}
    labels={labels}
    isSkeleton
/>`,
                        render: <CatalogTierCard tier={PROFESSIONAL} onSelect={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
