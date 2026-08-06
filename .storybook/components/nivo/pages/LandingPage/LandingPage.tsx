"use client"

import { useState } from "react"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { AuditCta, type AuditCtaProps } from "@sb-components/nivo/blocks/landing/AuditCta/AuditCta"
import { ClosingCta } from "@sb-components/nivo/blocks/landing/ClosingCta/ClosingCta"
import { DashboardProof, type DashboardProofProps } from "@sb-components/nivo/blocks/landing/DashboardProof/DashboardProof"
import { DemoFlow, type DemoFlowProps } from "@sb-components/nivo/blocks/landing/DemoFlow/DemoFlow"
import { FaqAccordion, type FaqAccordionItem } from "@sb-components/nivo/blocks/landing/FaqAccordion/FaqAccordion"
import { HumanInTheLoop, type HumanInTheLoopProps } from "@sb-components/nivo/blocks/landing/HumanInTheLoop/HumanInTheLoop"
import {
    OperatingLoopHero,
    type OperatingLoopHeroMetric,
    type OperatingLoopHeroTrustPoint,
} from "@sb-components/nivo/blocks/landing/OperatingLoopHero/OperatingLoopHero"
import type { OperatingLoopVisualNode } from "@sb-components/nivo/blocks/landing/OperatingLoopVisual/OperatingLoopVisual"
import { PartnerStrip, type PartnerStripProps } from "@sb-components/nivo/blocks/landing/PartnerStrip/PartnerStrip"
import {
    PricingTeaser,
    type PricingTeaserLabels,
    type PricingTeaserMode,
    type PricingTeaserProductRow,
} from "@sb-components/nivo/blocks/landing/PricingTeaser/PricingTeaser"
import { ProblemStatement, type ProblemStatementProps } from "@sb-components/nivo/blocks/landing/ProblemStatement/ProblemStatement"
import {
    ProductQuickSelector,
    type ProductQuickSelectorItem,
} from "@sb-components/nivo/blocks/landing/ProductQuickSelector/ProductQuickSelector"
import {
    ProductShowcase,
    type ProductShowcaseLabels,
    type ProductShowcaseRow,
} from "@sb-components/nivo/blocks/landing/ProductShowcase/ProductShowcase"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"
import { SolutionByIndustry, type SolutionByIndustryProps } from "@sb-components/nivo/blocks/landing/SolutionByIndustry/SolutionByIndustry"
import { SystemFlow, type SystemFlowProps } from "@sb-components/nivo/blocks/landing/SystemFlow/SystemFlow"
import { SystemStoryCard, type SystemStoryCardProps } from "@sb-components/nivo/blocks/landing/SystemStoryCard/SystemStoryCard"

/**
 * `LandingPage` — the PAGE a guest lands on at `/`: the full V2 "operating
 * system" stack (brand §VII.2), reconciled to the real 2-product / 6-tier
 * catalog. A page's story is one complete STATE per story — `Content` (the
 * catalog resolved) and `Loading` (`ProductShowcase` + `PricingTeaser` in
 * their skeleton mirror; every other section is static and unaffected).
 */

/** The hero's resolved copy — {@link OperatingLoopHeroProps} minus its 3 CTA objects (labels only; `onPress` is supplied by this page's shared intents) and minus `flowNodes`'s own doc, unchanged. */
export interface LandingPageHero {
    /** Accent-toned kicker above the headline. */
    eyebrow: string
    /** The Big-Idea headline. */
    headline: string
    /** Supporting flow-sentence copy below the headline. */
    description: string
    /** Visible label for the single north-star primary CTA — into the catalog. */
    primaryLabel: string
    /** Visible label for the secondary CTA — into the Lead-Leakage Audit. */
    secondaryLabel: string
    /** Visible label for the tertiary CTA — a demo preview. */
    tertiaryLabel: string
    /** Short trust-microcopy fragments under the CTA row. */
    trustPoints: Array<OperatingLoopHeroTrustPoint>
    /** The flow rail's stages, forwarded to `OperatingLoopVisual`. */
    flowNodes: Array<OperatingLoopVisualNode>
    /** Which flow stage glows crimson. */
    activeFlowNodeId: string
    /** Mini dashboard card title. */
    dashboardTitle: string
    /** Small badge on the dashboard card. */
    dashboardBadgeLabel: string
    /** The dashboard card's KPI cells — illustrative values, never fabricated metrics. */
    dashboardMetrics: Array<OperatingLoopHeroMetric>
}

/** Resolved copy for the header above {@link ProductQuickSelector} — the block itself renders no heading. */
export interface LandingPageQuickSelectorHeading {
    /** Accent-toned kicker above the title. */
    eyebrow: string
    /** The section title (e.g. "Where do you want to start?"). */
    title: string
    /** Optional supporting intro line. */
    intro?: string
}

/** The problem beat's resolved copy — {@link ProblemStatementProps} minus the CTA callback (the page's shared `onAudit`). */
export type LandingPageProblem = Omit<ProblemStatementProps, "onCtaPress">

/** The system-flow beat — entirely static data, no callback of its own. */
export type LandingPageSystemFlow = SystemFlowProps

/** The product-showcase region's resolved rows + copy — {@link ProductShowcaseProps} minus its callbacks and `isSkeleton` (this page derives both). */
export interface LandingPageProductShowcase {
    /** The real catalog products, in display order. */
    products: Array<ProductShowcaseRow>
    /** Already-localized copy. */
    labels: ProductShowcaseLabels
}

/** The pricing-teaser region's resolved rows + copy — {@link PricingTeaserProps} minus its callbacks, controlled mode, and `isSkeleton`. */
export interface LandingPagePricing {
    /** The real catalog products, in display order. */
    products: Array<PricingTeaserProductRow>
    /** Already-localized copy. */
    labels: PricingTeaserLabels
}

/** The industry-solution matrix — entirely static data, no callback of its own. */
export type LandingPageSolutionByIndustry = SolutionByIndustryProps

/** The demo-flow card row — each step already carries its own `onPress`. */
export type LandingPageDemoFlow = DemoFlowProps

/** The human-in-the-loop beat's resolved copy — {@link HumanInTheLoopProps} minus the CTA callback (the page's shared `onDemo`). */
export type LandingPageHumanInTheLoop = Omit<HumanInTheLoopProps, "onCtaPress">

/** The dashboard UI mockup — entirely static, illustrative data. */
export type LandingPageDashboardProof = DashboardProofProps

/** The before/after case-study card — entirely static data. */
export type LandingPageSystemStory = SystemStoryCardProps

/** The audit CTA band's resolved copy — {@link AuditCtaProps} minus the CTA callback (the page's shared `onAudit`). */
export type LandingPageAuditCta = Omit<AuditCtaProps, "onCtaPress">

/** The ecosystem strip — entirely static data. */
export type LandingPagePartnerStrip = PartnerStripProps

/** Resolved copy for the FAQ section. */
export interface LandingPageFaq {
    /** Optional accent-toned kicker above the section title. */
    eyebrow?: string
    /** The section title. */
    title: string
    /** Optional supporting intro line. */
    intro?: string
    /** The FAQ entries, in display order. */
    items: Array<FaqAccordionItem>
}

/** The closing beat's resolved copy — both CTAs repeat the hero's own primary/secondary destinations. */
export interface LandingPageClosing {
    /** Optional accent-toned kicker above the title. */
    eyebrow?: string
    /** The beat's headline. */
    title: string
    /** Supporting intro line under the title. */
    description: string
    /** Visible label for the primary CTA — must read the same as the hero's. */
    primaryLabel: string
    /** Visible label for the secondary CTA — must read the same as the hero's. */
    secondaryLabel: string
}

/** Props for {@link LandingPage}. */
export interface LandingPageProps {
    /** The hero's resolved copy. */
    hero: LandingPageHero
    /** Resolved copy for the header above the quick-selector grid. */
    quickSelectorHeading: LandingPageQuickSelectorHeading
    /** The intent cards, already wired with their own `onPress`. */
    quickSelectorItems: Array<ProductQuickSelectorItem>
    /** The problem beat's resolved copy, including its composed `LeadLeakageMap`. */
    problem: LandingPageProblem
    /** The system-flow beat's resolved copy. */
    systemFlow: LandingPageSystemFlow
    /** The product-showcase region's resolved rows + copy. */
    productShowcase: LandingPageProductShowcase
    /** The pricing-teaser region's resolved rows + copy. */
    pricing: LandingPagePricing
    /** The industry-solution matrix's resolved copy. */
    solutionByIndustry: LandingPageSolutionByIndustry
    /** The demo-flow beat's resolved copy. */
    demoFlow: LandingPageDemoFlow
    /** The human-in-the-loop beat's resolved copy, including its composed `AiSuggestionCard`. */
    humanInTheLoop: LandingPageHumanInTheLoop
    /** The dashboard-proof mockup's resolved copy. */
    dashboardProof: LandingPageDashboardProof
    /** The system-story (case study) beat's resolved copy. */
    systemStory: LandingPageSystemStory
    /** The audit CTA band's resolved copy. */
    auditCta: LandingPageAuditCta
    /** The partner strip's resolved copy. */
    partnerStrip: LandingPagePartnerStrip
    /** The FAQ section's resolved copy. */
    faq: LandingPageFaq
    /** The closing beat's resolved copy. */
    closing: LandingPageClosing
    /** Fired by the hero primary, the closing primary, and the defensive "browse all" branch of both catalog-derived regions — the caller routes into the full `/catalog`. */
    onBrowseCatalog: () => void
    /** Fired by the hero secondary, the problem beat, the audit CTA band, the pricing solution tab, and the closing secondary — the caller routes to the Lead-Leakage Audit. */
    onAudit: () => void
    /** Fired by the hero tertiary and the human-in-the-loop CTA — the caller opens a live AI-Agent demo. */
    onDemo: () => void
    /** Fired with a product id from the product-showcase CTA — the caller routes into that product's pricing. */
    onSelectProduct: (productId: string) => void
    /** Fired with a product id from the pricing-teaser "see all plans" CTA — the caller routes into that product's pricing. */
    onViewPlans: (productId: string) => void
    /** `true` → the catalog's own first fetch is in flight: `ProductShowcase` and `PricingTeaser` render their skeleton mirror; every other section is static and renders straight away. */
    isSkeleton?: boolean
}

/**
 * The V2 landing page. See the file header for why exactly three shared
 * intents (`onBrowseCatalog` / `onAudit` / `onDemo`) cover every CTA on the
 * page, and why only two regions ever see `isSkeleton`.
 *
 * @param props - {@link LandingPageProps}
 */
const LandingPage = ({
    hero,
    quickSelectorHeading,
    quickSelectorItems,
    problem,
    systemFlow,
    productShowcase,
    pricing,
    solutionByIndustry,
    demoFlow,
    humanInTheLoop,
    dashboardProof,
    systemStory,
    auditCta,
    partnerStrip,
    faq,
    closing,
    onBrowseCatalog,
    onAudit,
    onDemo,
    onSelectProduct,
    onViewPlans,
    isSkeleton = false,
}: LandingPageProps) => {
    // Page-local UI state, not domain data — see the file header for why this
    // needs no connected half.
    const [pricingMode, setPricingMode] = useState<PricingTeaserMode>("product")

    return (
        <div data-tier="page" data-component="LandingPage" className="flex flex-col">
            <OperatingLoopHero
                eyebrow={hero.eyebrow}
                headline={hero.headline}
                description={hero.description}
                primaryCta={{ label: hero.primaryLabel, onPress: onBrowseCatalog }}
                secondaryCta={{ label: hero.secondaryLabel, onPress: onAudit }}
                tertiaryCta={{ label: hero.tertiaryLabel, onPress: onDemo }}
                trustPoints={hero.trustPoints}
                flowNodes={hero.flowNodes}
                activeFlowNodeId={hero.activeFlowNodeId}
                dashboardTitle={hero.dashboardTitle}
                dashboardBadgeLabel={hero.dashboardBadgeLabel}
                dashboardMetrics={hero.dashboardMetrics}
            />

            {/* Quick selector — bare block, no heading of its own. */}
            <section className="px-6 py-16">
                <Container
                    size="xl"
                    padding={1}
                    body={() => (
                        <StackV
                            gap={8}
                            principle="marketing-beat"
                            items={[
                                () => (
                                    <SectionHeading
                                        eyebrow={quickSelectorHeading.eyebrow}
                                        title={quickSelectorHeading.title}
                                        intro={quickSelectorHeading.intro}
                                        align="center"
                                    />
                                ),
                                () => <ProductQuickSelector items={quickSelectorItems} />,
                            ]}
                        />
                    )}
                />
            </section>

            {/* Problem statement — composes LeadLeakageMap internally. */}
            <section className="px-6 py-16">
                <Container size="xl" padding={1} body={() => <ProblemStatement {...problem} onCtaPress={onAudit} />} />
            </section>

            {/* System flow — VISION narrative; nav anchor "how". */}
            <section id="how" className="scroll-mt-24 px-6 py-16">
                <Container size="xl" padding={1} body={() => <SystemFlow {...systemFlow} />} />
            </section>

            {/* Product showcase — REAL, catalog-derived, self-contained section + container. */}
            <div id="products" className="scroll-mt-24">
                <ProductShowcase
                    products={productShowcase.products}
                    labels={productShowcase.labels}
                    onSelectProduct={onSelectProduct}
                    onExploreAll={onBrowseCatalog}
                    isSkeleton={isSkeleton}
                />
            </div>

            {/* Pricing teaser — REAL, catalog-derived, self-contained section + container; nav anchor "pricing". */}
            <div id="pricing" className="scroll-mt-24">
                <PricingTeaser
                    products={pricing.products}
                    labels={pricing.labels}
                    activeMode={pricingMode}
                    onModeChange={setPricingMode}
                    onViewPlans={onViewPlans}
                    onSolutionCta={onAudit}
                    onExploreAll={onBrowseCatalog}
                    isSkeleton={isSkeleton}
                />
            </div>

            {/* Solution by industry — VISION (Academy real today); nav anchor "solutions". */}
            <section id="solutions" className="scroll-mt-24 px-6 py-16">
                <Container size="xl" padding={1} body={() => <SolutionByIndustry {...solutionByIndustry} />} />
            </section>

            {/* Demo flow — VISION preview. */}
            <section className="px-6 py-16">
                <Container size="xl" padding={1} body={() => <DemoFlow {...demoFlow} />} />
            </section>

            {/* Human-in-the-loop — composes AiSuggestionCard internally. */}
            <section className="px-6 py-16">
                <Container
                    size="xl"
                    padding={1}
                    body={() => <HumanInTheLoop {...humanInTheLoop} onCtaPress={onDemo} />}
                />
            </section>

            {/* Dashboard proof — VISION UI mockup, illustrative figures only. */}
            <section className="px-6 py-16">
                <Container size="xl" padding={1} body={() => <DashboardProof {...dashboardProof} />} />
            </section>

            {/* System story (case study) — VISION before/after, no fabricated metric. */}
            <section className="px-6 py-16">
                <Container size="lg" padding={1} body={() => <SystemStoryCard {...systemStory} />} />
            </section>

            {/* Audit CTA — dark diagnostic band, self-contained. */}
            <AuditCta {...auditCta} onCtaPress={onAudit} />

            {/* Partner strip — VISION ecosystem chips. */}
            <section className="px-6 py-16">
                <Container size="lg" padding={1} body={() => <PartnerStrip {...partnerStrip} />} />
            </section>

            {/* Closing CTA — repeats the hero's own primary/secondary destinations. */}
            <ClosingCta
                eyebrow={closing.eyebrow}
                title={closing.title}
                description={closing.description}
                primaryCta={{ label: closing.primaryLabel, onPress: onBrowseCatalog }}
                secondaryCta={{ label: closing.secondaryLabel, onPress: onAudit }}
            />

            {/* FAQ — self-contained, static copy; nav anchor "faq". */}
            <div id="faq" className="scroll-mt-24">
                <FaqAccordion eyebrow={faq.eyebrow} title={faq.title} intro={faq.intro} items={faq.items} />
            </div>
        </div>
    )
}

export { LandingPage }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "LandingPage" } as const
