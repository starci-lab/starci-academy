import { TagIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Tabs } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { Container } from "@sb-components/frames/Container/Container"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

/**
 * `PricingTeaser` — the landing's pricing section: a product/solution toggle
 * over a 2-product / 6-tier pill strip (each product card: name + tier pills,
 * the recommended one marked, + a "see all plans" CTA). The product tab is
 * REAL catalog pricing; the solution tab is a roadmap card routing to the
 * Lead-Leakage Audit. Grounded in the real `CatalogTierEntity` rows.
 */

/** Which half of the toggle is showing. */
export type PricingTeaserMode = "product" | "solution"

/** One tier pill — a subset of `CatalogTierEntity` with its price pre-formatted. */
export interface PricingTeaserTierPill {
    /** Tier id. */
    id: string
    /** Display name (`CatalogTierEntity.name`). */
    name: string
    /** Already-formatted price (e.g. "299,000 VND / month", or a free label). */
    priceLabel: string
    /** Positioning flag (`CatalogTierEntity.isRecommended`) — at most one true per product. */
    isRecommended: boolean
}

/** One product's pricing row — a subset of `CatalogItemEntity` with its tiers resolved. */
export interface PricingTeaserProductRow {
    /** Catalog item id — the React key and the CTA argument. */
    id: string
    /** Display name (`CatalogItemEntity.name`). */
    name: string
    /** This product's tiers, in display order (the real catalog carries three each). */
    tiers: Array<PricingTeaserTierPill>
    /** Already-resolved CTA label (e.g. "See all 3 plans"). */
    ctaLabel: string
}

/** The already-resolved copy the block renders. */
export interface PricingTeaserLabels {
    /** Accent eyebrow above the section title. */
    eyebrow: string
    /** The section title. */
    title: string
    /** Supporting intro line under the title. */
    intro: string
    /** Toggle label for the real-products tab. */
    productModeLabel: string
    /** Toggle label for the roadmap solutions tab. */
    solutionModeLabel: string
    /** Accessible name for the mode toggle. */
    modeAriaLabel: string
    /** Marker appended to a recommended tier's pill (e.g. "★"). */
    recommendedMarker: string
    /** Badge text on the solution card (e.g. "Roadmap"). */
    solutionBadgeLabel: string
    /** The solution card's title. */
    solutionTitle: string
    /** The solution card's supporting copy. */
    solutionDescription: string
    /** The solution card's CTA label, routing to the Lead-Leakage Audit. */
    solutionCtaLabel: string
    /** Empty-state title, shown only if the catalog ever returns zero products. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
    /** Empty-state CTA label, routing to the full pricing page. */
    emptyCtaLabel: string
}

/** Props for {@link PricingTeaser}. */
export interface PricingTeaserProps {
    /** The real catalog products, in display order. */
    products: Array<PricingTeaserProductRow>
    /** Which half of the toggle is showing (controlled). */
    activeMode: PricingTeaserMode
    /** Fired with the newly chosen mode. */
    onModeChange: (mode: PricingTeaserMode) => void
    /** Fired with a product's id when its "see all plans" CTA is pressed. */
    onViewPlans: (productId: string) => void
    /** Fired by the solution card's CTA — the caller routes to the Lead-Leakage Audit. */
    onSolutionCta: () => void
    /** Fired from the defensive empty branch — the caller routes to the full pricing page. */
    onExploreAll: () => void
    /**
     * `true` → the catalog's own first fetch is in flight: the product tab
     * keeps its two-card shape while every pill shimmers and both CTAs stop
     * accepting presses (§12b). Threaded straight down — never fed to a
     * separate skeleton tree. Has no effect on the (static) solution tab.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: PricingTeaserLabels
}

/** How many placeholder tier pills each skeleton product card draws. */
const SKELETON_TIER_COUNT = 3

/** How many placeholder product cards the loading mirror draws while `products` hasn't landed yet. */
const SKELETON_PRODUCT_COUNT = 2

/** Placeholder products — sized like a real card so the shimmer mirrors the loaded shape. */
const SKELETON_PRODUCTS: Array<PricingTeaserProductRow> = Array.from({ length: SKELETON_PRODUCT_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    name: "Product name",
    tiers: Array.from({ length: SKELETON_TIER_COUNT }, (_unusedTier, tierIndex) => ({
        id: `skeleton-${index}-${tierIndex}`,
        name: "Tier",
        priceLabel: "Price",
        isRecommended: false,
    })),
    ctaLabel: "See all plans",
}))

/**
 * One product's pricing card — name + its tier pills (the recommended one
 * marked) + a "see all plans" CTA. The SAME shape drives the loaded and the
 * loading cards; `isSkeleton` threads down so a loading card is the loaded
 * card with its content nodes shimmering.
 */
const PricingProductCard = ({ product, onViewPlans, labels, isSkeleton }: {
    product: PricingTeaserProductRow
    onViewPlans: (productId: string) => void
    labels: PricingTeaserLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        padding={3}
        isHighlight={!isSkeleton && product.tiers.some((tier) => tier.isRecommended)}
        isSkeleton={isSkeleton}
        body={() => (
            <StackV
                gap={3}
                isSkeleton={isSkeleton}
                items={[
                    () => <Typography size="lg" weight="bold" isSkeleton={isSkeleton} text={product.name} />,
                    () => (
                        <Cluster
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={product.tiers.map((tier) => () => (
                                <Chip
                                    tone={tier.isRecommended ? "accent" : "default"}
                                    isSkeleton={isSkeleton}
                                    text={`${tier.name} · ${tier.priceLabel}${tier.isRecommended ? ` ${labels.recommendedMarker}` : ""}`}
                                />
                            ))}
                        />
                    ),
                    () => (
                        <Button
                            variant="primary"
                            size="sm"
                            label={product.ctaLabel}
                            onPress={() => onViewPlans(product.id)}
                            isSkeleton={isSkeleton}
                        />
                    ),
                ]}
            />
        )}
    />
)

/** Props for the local {@link SolutionCard} helper. */
interface SolutionCardProps {
    /** Already-localized copy — reuses the parent's label set. */
    labels: PricingTeaserLabels
    /** Fired by the card's CTA — the caller routes to the Lead-Leakage Audit. */
    onSolutionCta: () => void
}

/**
 * The roadmap solution card — shown on the solution tab in place of the real
 * product grid. Static copy: industry systems are vision, not buyable, so this
 * card carries no price and routes to the audit instead of a checkout.
 */
const SolutionCard = ({ labels, onSolutionCta }: SolutionCardProps) => (
    <Container
        size="sm"
        padding={1}
        body={() => (
            <SurfaceCard
                padding={3}
                body={() => (
                    <StackV
                        gap={3}
                        align="center"
                        items={[
                            () => <Chip tone="default" text={labels.solutionBadgeLabel} />,
                            () => <Typography size="lg" weight="bold" align="center" text={labels.solutionTitle} />,
                            () => <Typography size="sm" color="muted" align="center" text={labels.solutionDescription} />,
                            () => <Button variant="secondary" size="sm" label={labels.solutionCtaLabel} onPress={onSolutionCta} />,
                        ]}
                    />
                )}
            />
        )}
    />
)

/**
 * The pricing teaser section. See the file header for why the mode toggle and
 * empty-vs-content are states of one shape, and how `isSkeleton` mirrors the
 * loaded product cards.
 *
 * @param props - {@link PricingTeaserProps}
 */
const PricingTeaser = ({
    products,
    activeMode,
    onModeChange,
    onViewPlans,
    onSolutionCta,
    onExploreAll,
    isSkeleton = false,
    labels,
}: PricingTeaserProps) => {
    const isEmpty = !isSkeleton && products.length === 0
    const rows = isSkeleton ? SKELETON_PRODUCTS : products

    return (
        <section data-tier="block" data-component="PricingTeaser" className="px-6 py-16">
            <Container
                size="lg"
                padding={1}
                body={() => (
                    <StackV
                        gap={8}
                        items={[
                            () => <SectionHeading eyebrow={labels.eyebrow} title={labels.title} intro={labels.intro} align="center" />,
                            () => (
                                <Tabs
                                    items={[
                                        { key: "product", label: labels.productModeLabel },
                                        { key: "solution", label: labels.solutionModeLabel },
                                    ]}
                                    selectedKey={activeMode}
                                    onSelectionChange={(key) => onModeChange(key as PricingTeaserMode)}
                                    ariaLabel={labels.modeAriaLabel}
                                />
                            ),
                            () =>
                                activeMode === "solution" ? (
                                    <SolutionCard labels={labels} onSolutionCta={onSolutionCta} />
                                ) : isEmpty ? (
                                    <EmptyState
                                        icon={TagIcon}
                                        title={labels.emptyTitle}
                                        description={labels.emptyDescription}
                                        action={() => <Button variant="secondary" label={labels.emptyCtaLabel} onPress={onExploreAll} />}
                                    />
                                ) : (
                                    <Grid
                                        columns={{ base: 1, md: 2 }}
                                        gap={6}
                                        items={rows.map((product) => ({
                                            key: product.id,
                                            content: () => (
                                                <PricingProductCard product={product} onViewPlans={onViewPlans} labels={labels} isSkeleton={isSkeleton} />
                                            ),
                                        }))}
                                    />
                                ),
                        ]}
                    />
                )}
            />
        </section>
    )
}

export { PricingTeaser }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PricingTeaser" } as const
