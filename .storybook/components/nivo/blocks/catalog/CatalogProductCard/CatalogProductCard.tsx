import { ArrowRightIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CatalogProductCard` — one product in the streamlined catalog. The whole card is
 * the order target. Two DATA states of the single shape: `orderable` and
 * `coming-soon` (`!isOrderWired` dims the card and swaps the affordance for a
 * chip). Grounded in the real `CatalogItemEntity`.
 */

/** One product card — a subset of `CatalogItemEntity` with its category pre-labelled. */
export interface CatalogProductRow {
    /** Catalog item id. */
    id: string
    /** Display name (`CatalogItemEntity.name`). */
    name: string
    /** Already-localized category label (`CatalogItemEntity.category`). */
    categoryLabel: string
    /** One-line positioning copy, or null (`CatalogItemEntity.tagline`). */
    tagline?: string | null
    /** Entry ("from") price in VND — the lowest tier's price, or null when free/unpriced. */
    basePriceVnd?: number | null
    /** Whether the real order path is wired end-to-end (`CatalogItemEntity.isOrderWired`). */
    isOrderWired: boolean
}

/** Props for {@link CatalogProductCard}. */
export interface CatalogProductCardProps {
    /** The product to show. */
    product: CatalogProductRow
    /** Start an order for this product — the connected layer opens the tier chooser. */
    onOrder: (productId: string) => void
    /**
     * `true` → the catalog's own first fetch is in flight: the same card keeps its
     * shape while every `Typography`/`Chip` line shimmers, and the whole-card order
     * target stops accepting presses (§12b). Threaded straight down — never fed to a
     * separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: CatalogProductCardLabels
}

/** The already-resolved copy the block renders. */
export interface CatalogProductCardLabels {
    /** "See plans" affordance label, shown on an orderable product. */
    orderLabel: string
    /** Coming-soon chip text, shown when the product is not order-wired. */
    comingSoonLabel: string
    /** Prefix before the entry price (e.g. "from"). */
    fromLabel: string
    /** Suffix after a monthly price (e.g. "/ month"). */
    perMonthLabel: string
    /** Text shown in place of a price when the product has no listed base price. */
    freeLabel: string
    /** Accessible name for the whole-card order target (e.g. "Order {name}"). */
    orderAriaLabel: string
}

/** Money is a raw VND `Int`; the block owns the grouping + suffix. */
const formatVnd = (amountVnd: number) => `${amountVnd.toLocaleString("en-US")} VND`

/**
 * The product card. See the file header for why coming-soon is a state of one
 * shape rather than a separate leaf.
 *
 * @param props - {@link CatalogProductCardProps}
 */
const CatalogProductCard = ({ product, onOrder, isSkeleton = false, labels }: CatalogProductCardProps) => {
    const priceText = product.basePriceVnd == null || product.basePriceVnd === 0
        ? labels.freeLabel
        : `${labels.fromLabel} ${formatVnd(product.basePriceVnd)} ${labels.perMonthLabel}`

    return (
        <div data-tier="block" data-component="CatalogProductCard">
            <SurfaceCard
                padding={3}
                onPress={() => onOrder(product.id)}
                isDisabled={isSkeleton || !product.isOrderWired}
                ariaLabel={labels.orderAriaLabel}
                body={() => (
                    <StackV
                        gap={3}
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={product.categoryLabel} />,
                            () => <Typography size="lg" weight="bold" isSkeleton={isSkeleton} text={product.name} />,
                            ...(isSkeleton || product.tagline
                                ? [() => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={product.tagline ?? ""} />]
                                : []),
                            () => <Typography size="sm" weight="medium" color="accent" isSkeleton={isSkeleton} text={priceText} />,
                            () =>
                                isSkeleton ? (
                                    <Typography
                                        size="sm"
                                        weight="medium"
                                        color="accent"
                                        suffixIcon={ArrowRightIcon}
                                        isSkeleton={isSkeleton}
                                        text={labels.orderLabel}
                                    />
                                ) : product.isOrderWired ? (
                                    <Typography
                                        size="sm"
                                        weight="medium"
                                        color="accent"
                                        suffixIcon={ArrowRightIcon}
                                        iconSlide
                                        text={labels.orderLabel}
                                    />
                                ) : (
                                    <Chip tone="default" text={labels.comingSoonLabel} />
                                ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { CatalogProductCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CatalogProductCard" } as const
