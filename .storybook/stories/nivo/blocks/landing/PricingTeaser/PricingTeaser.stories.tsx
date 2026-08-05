import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PricingTeaser,
    type PricingTeaserLabels,
    type PricingTeaserMode,
    type PricingTeaserProductRow,
} from "@sb-components/nivo/blocks/landing/PricingTeaser/PricingTeaser"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PricingTeaser` — the landing's pricing section: a product/solution toggle
 * over a 2-product / 6-tier pill strip (each product card: name + tier pills,
 * the recommended one marked, + a "see all plans" CTA). The product tab is
 * REAL catalog pricing; the solution tab is a roadmap card routing to the
 * Lead-Leakage Audit. Grounded in the real `CatalogTierEntity` rows.
 */
const meta: Meta<typeof PricingTeaser> = {
    title: "Nivo/Blocks/Landing/PricingTeaser/PricingTeaser",
    component: PricingTeaser,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PricingTeaser>

const LABELS: PricingTeaserLabels = {
    eyebrow: "Pricing",
    title: "Choose how you start with nivo",
    intro: "Public pricing — no account needed to look. Platform products are ready to buy now; industry solutions need a conversation first.",
    productModeLabel: "Platform products",
    solutionModeLabel: "Industry solutions",
    modeAriaLabel: "Pricing mode",
    recommendedMarker: "*",
    solutionBadgeLabel: "Roadmap",
    solutionTitle: "Industry systems need a conversation first",
    solutionDescription: "CRM · Workflow · Dashboard · the AI-First Business OS are on the roadmap. For a complex problem, start with an audit of where it actually leaks.",
    solutionCtaLabel: "Do a Lead-Leakage Audit",
    emptyTitle: "No pricing listed yet",
    emptyDescription: "The catalog is being restocked. Check back shortly for the current plans.",
    emptyCtaLabel: "See pricing",
}

const ACADEMY: PricingTeaserProductRow = {
    id: "nivo-ai-academy",
    name: "AI Academy",
    tiers: [
        { id: "academy_start", name: "Starter", priceLabel: "Free", isRecommended: false },
        { id: "academy_pro", name: "Professional", priceLabel: "299,000 VND", isRecommended: true },
        { id: "academy_business", name: "Business", priceLabel: "899,000 VND", isRecommended: false },
    ],
    ctaLabel: "See all 3 plans",
}

const AGENT: PricingTeaserProductRow = {
    id: "nivo-ai-agent",
    name: "nivo AI Agent",
    tiers: [
        { id: "agent_basic", name: "Basic", priceLabel: "490,000 VND", isRecommended: false },
        { id: "agent_pro", name: "Pro", priceLabel: "990,000 VND", isRecommended: true },
        { id: "agent_scale", name: "Scale", priceLabel: "2,400,000 VND", isRecommended: false },
    ],
    ctaLabel: "See all 3 plans",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SectionHeading: { tier: "block", role: "the eyebrow/title/intro header", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    Tabs: { tier: "atom", role: "the product/solution mode toggle — static chrome, so it stays interactive during load", storyId: "atoms-navigation-tabs-tabs--default" },
    SurfaceCard: { tier: "composite", role: "one pricing card per real product, or the single roadmap solution card" },
    Chip: { tier: "atom", role: "each tier pill (name + price), the recommended marker, and the solution roadmap badge" },
    EmptyState: { tier: "composite", role: "the defensive empty branch on the product tab" },
    Typography: { tier: "atom", role: "each product's name and the solution card's copy" },
    Button: { tier: "atom", role: "each product's see-all-plans CTA and the solution card's audit CTA" },
}

/** Props for the local {@link Controlled} story wrapper. */
interface ControlledProps {
    /** The mode the fixture opens in. */
    initialMode: PricingTeaserMode
    /** The fixture products. */
    products: Array<PricingTeaserProductRow>
    /** Forwarded straight to {@link PricingTeaser}. */
    isSkeleton?: boolean
}

/** Controlled wrapper — the mode toggle is real interactive state, not a fixture constant. */
const Controlled = ({ initialMode, ...rest }: ControlledProps) => {
    const [mode, setMode] = useState<PricingTeaserMode>(initialMode)
    return (
        <PricingTeaser
            {...rest}
            activeMode={mode}
            onModeChange={setMode}
            onViewPlans={NOOP}
            onSolutionCta={NOOP}
            onExploreAll={NOOP}
            labels={LABELS}
        />
    )
}

/** LEAF — the section has one shape; product / solution / empty / isSkeleton are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PricingTeaser"
                tier="block"
                leaf="Pricing teaser"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                reason="Blocks take no `className`: which half of the toggle shows (`activeMode`) is DATA, so it is a state of one shape, not a second component. The product tab shows the REAL 6 tiers across the 2 real products; the solution tab is vision-only — industry systems aren't buyable, so that card carries no price and routes to the Lead-Leakage Audit instead of a checkout. The mode toggle is static chrome (not catalog data), so it stays interactive even while the product tab is `isSkeleton` — onward is never blocked."
                states={[
                    {
                        name: "activeMode = \"product\" (2 real products)",
                        why: "The default view: both real products' tier pills, the recommended tier of each starred, each card's own see-all-plans CTA.",
                        code: `<PricingTeaser
    products={[academy, agent]}
    activeMode="product"
    onModeChange={setMode}
    onViewPlans={viewPlans}
    onSolutionCta={solutionCta}
    onExploreAll={exploreAll}
    labels={labels}
/>`,
                        render: <Controlled initialMode="product" products={[ACADEMY, AGENT]} />,
                    },
                    {
                        name: "activeMode = \"solution\" (roadmap)",
                        why: "Industry systems (CRM, Workflow, Dashboard, the AI-First Business OS) are not buyable yet, so this tab carries no price grid at all — a single roadmap card routes the reader to the Lead-Leakage Audit instead of a checkout.",
                        code: "<PricingTeaser activeMode=\"solution\" … />",
                        render: <Controlled initialMode="solution" products={[ACADEMY, AGENT]} />,
                    },
                    {
                        name: "products = [] (defensive empty)",
                        why: "The catalog seeder makes zero products effectively impossible, but the product tab still needs an honest floor: it collapses to editorial copy and a link into the full pricing page rather than a bare gap.",
                        code: "<PricingTeaser products={[]} activeMode=\"product\" … />",
                        render: <Controlled initialMode="product" products={[]} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch hasn't resolved, so the product tab keeps its two-card shape — name and every tier pill shimmering, both CTAs blocked — matching the loaded cards so nothing jumps when pricing lands. The toggle itself stays interactive throughout.",
                        code: `<PricingTeaser
    products={[academy, agent]}
    activeMode="product"
    onModeChange={setMode}
    onViewPlans={viewPlans}
    onSolutionCta={solutionCta}
    onExploreAll={exploreAll}
    labels={labels}
    isSkeleton
/>`,
                        render: <Controlled initialMode="product" products={[ACADEMY, AGENT]} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
