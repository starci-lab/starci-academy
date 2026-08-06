import { ArrowRightIcon, CheckIcon, StorefrontIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Container } from "@sb-components/frames/Container/Container"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

/**
 * `ProductShowcase` — the landing's "start here" section: the two REAL catalog
 * products side by side (category, tagline, checked feature list, from-price,
 * plan count, CTA), under a derived-count hook chip + section heading. Three
 * DATA states of the one shape: `content`, `empty` (defensive), `isSkeleton`.
 * Grounded in the real `CatalogItemEntity`.
 */

/** One product panel — a subset of `CatalogItemEntity` with its features pre-resolved. */
export interface ProductShowcaseRow {
    /** Catalog item id — the React key and the CTA argument. */
    id: string
    /** Already-localized category label (`CatalogItemEntity.category`). */
    categoryLabel: string
    /** Display name (`CatalogItemEntity.name`). */
    name: string
    /** One-line positioning copy, or null (`CatalogItemEntity.tagline`). */
    tagline?: string | null
    /** 3–4 already-resolved feature labels (derived from `CatalogItemEntity.featureFlags`). */
    features: Array<string>
    /** Entry ("from") price in VND — the lowest tier's price, or null when free/unpriced. */
    basePriceVnd?: number | null
    /** Already-resolved, pre-pluralized plan-count copy (e.g. "3 plans"). */
    planCountLabel: string
    /** Already-resolved, per-product CTA label (e.g. "Choose an AI Academy plan"). */
    ctaLabel: string
}

/** The already-resolved copy the block renders. */
export interface ProductShowcaseLabels {
    /**
     * The section's derived-count hook (e.g. "2 products · 6 plans — ready to
     * buy today"), computed by the caller from the SAME `products` array so it
     * can never drift from what is actually sold.
     */
    hookLabel: string
    /** Accent eyebrow above the section title. */
    eyebrow: string
    /** The section title. */
    title: string
    /** Supporting intro line under the title. */
    intro: string
    /** Prefix before the entry price (e.g. "from"). */
    fromLabel: string
    /** Suffix after a monthly price (e.g. "/ month"). */
    perMonthLabel: string
    /** Text shown in place of a price when the product has no listed base price. */
    freeLabel: string
    /** Empty-state title, shown only if the catalog ever returns zero products. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
    /** Empty-state CTA label, routing to the full pricing page. */
    emptyCtaLabel: string
}

/** Props for {@link ProductShowcase}. */
export interface ProductShowcaseProps {
    /** The real catalog products, in display order. */
    products: Array<ProductShowcaseRow>
    /** Fired with a product's id when its CTA is pressed — the caller routes into pricing. */
    onSelectProduct: (productId: string) => void
    /** Fired from the defensive empty branch — the caller routes to the full pricing page. */
    onExploreAll: () => void
    /**
     * `true` → the catalog's own first fetch is in flight: the section keeps
     * its heading and its two-panel shape while every line shimmers and both
     * CTAs stop accepting presses (§12b). Threaded straight down — never fed
     * to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ProductShowcaseLabels
}

/** Money is a raw VND `Int`; the block owns the grouping + suffix. */
const formatVnd = (amountVnd: number) => `${amountVnd.toLocaleString("en-US")} VND`

/** How many placeholder panels the loading mirror draws while `products` hasn't landed yet. */
const SKELETON_PRODUCT_COUNT = 2

/** Placeholder panels — sized like a real panel so the shimmer mirrors the loaded shape. */
const SKELETON_PRODUCTS: Array<ProductShowcaseRow> = Array.from({ length: SKELETON_PRODUCT_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    categoryLabel: "Category",
    name: "Product name",
    tagline: "A short positioning line for this product.",
    features: ["Feature one", "Feature two", "Feature three"],
    basePriceVnd: 0,
    planCountLabel: "N plans",
    ctaLabel: "See plans",
}))

/**
 * One product panel — category, name, tagline, checked feature list, price +
 * plan count, and the per-product CTA. The SAME shape drives the loaded and
 * the loading panels; `isSkeleton` threads down so a loading panel is the
 * loaded panel with its content nodes shimmering.
 */
const ProductPanel = ({ product, onSelectProduct, labels, isSkeleton }: {
    product: ProductShowcaseRow
    onSelectProduct: (productId: string) => void
    labels: ProductShowcaseLabels
    isSkeleton: boolean
}) => {
    const priceText = product.basePriceVnd == null || product.basePriceVnd === 0
        ? labels.freeLabel
        : `${labels.fromLabel} ${formatVnd(product.basePriceVnd)} ${labels.perMonthLabel}`

    return (
        <SurfaceCard
            padding={3}
            isSkeleton={isSkeleton}
            body={() => (
                <StackV
                    gap={3}
                    isSkeleton={isSkeleton}
                    principle="sibling-stack"
                    items={[
                        () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={product.categoryLabel} />,
                        () => <Typography size="lg" weight="bold" isSkeleton={isSkeleton} text={product.name} />,
                        ...(isSkeleton || product.tagline
                            ? [() => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={product.tagline ?? ""} />]
                            : []),
                        () => (
                            <StackV
                                gap={2}
                                isSkeleton={isSkeleton}
                                items={product.features.map((feature) => () => (
                                    <Typography size="sm" prefixIcon={CheckIcon} color="success" isSkeleton={isSkeleton} text={feature} />
                                ))}
                            />
                        ),
                        () => (
                            <StackH
                                gap={3}
                                align="center"
                                justify="between"
                                isSkeleton={isSkeleton}
                                principle="value-row"
                                items={[
                                    () => <Typography size="sm" weight="medium" color="accent" isSkeleton={isSkeleton} text={priceText} />,
                                    () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={product.planCountLabel} />,
                                ]}
                            />
                        ),
                        () => (
                            <Button
                                variant="primary"
                                size="sm"
                                label={product.ctaLabel}
                                suffixIcon={ArrowRightIcon}
                                iconSlide={!isSkeleton}
                                onPress={() => onSelectProduct(product.id)}
                                isSkeleton={isSkeleton}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}

/**
 * The product showcase section. See the file header for why empty vs content
 * are states of one shape, and how `isSkeleton` mirrors the loaded panels.
 *
 * @param props - {@link ProductShowcaseProps}
 */
const ProductShowcase = ({ products, onSelectProduct, onExploreAll, isSkeleton = false, labels }: ProductShowcaseProps) => {
    const isEmpty = !isSkeleton && products.length === 0
    const rows = isSkeleton ? SKELETON_PRODUCTS : products

    return (
        <section data-tier="block" data-component="ProductShowcase" className="px-6 py-16">
            <Container
                size="xl"
                padding={1}
                body={() => (
                    <StackV
                        gap={8}
                        principle="marketing-beat"
                        items={[
                            () => (
                                <StackV
                                    gap={3}
                                    align="center"
                                    principle="sibling-stack"
                                    items={[
                                        () => <Chip tone="accent" icon={StorefrontIcon} isSkeleton={isSkeleton} text={labels.hookLabel} />,
                                        () => <SectionHeading eyebrow={labels.eyebrow} title={labels.title} intro={labels.intro} align="center" />,
                                    ]}
                                />
                            ),
                            () =>
                                isEmpty ? (
                                    <EmptyState
                                        icon={StorefrontIcon}
                                        title={labels.emptyTitle}
                                        description={labels.emptyDescription}
                                        action={() => <Button variant="secondary" label={labels.emptyCtaLabel} onPress={onExploreAll} />}
                                    />
                                ) : (
                                    <Grid
                                        columns={{ base: 1, lg: 2 }}
                                        principle="block-boundary"
                                        items={rows.map((product) => ({
                                            key: product.id,
                                            content: () => (
                                                <ProductPanel product={product} onSelectProduct={onSelectProduct} labels={labels} isSkeleton={isSkeleton} />
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

export { ProductShowcase }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ProductShowcase" } as const
