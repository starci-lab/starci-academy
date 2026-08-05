import type { ReactNode } from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    BuyConfirmModal,
    type BuyConfirmModalLabels,
    type BuyConfirmModalOrder,
} from "@sb-components/nivo/blocks/catalog/BuyConfirmModal/BuyConfirmModal"
import {
    CatalogProductCard,
    type CatalogProductCardLabels,
} from "@sb-components/nivo/blocks/catalog/CatalogProductCard/CatalogProductCard"
import {
    CatalogTierCard,
    type CatalogTierCardLabels,
} from "@sb-components/nivo/blocks/catalog/CatalogTierCard/CatalogTierCard"
import {
    MyOrdersList,
    type MyOrderRow,
    type MyOrdersListLabels,
} from "@sb-components/nivo/blocks/catalog/MyOrdersList/MyOrdersList"

/**
 * `CatalogView` — the PAGE at `/catalog`: the two real, publicly-priced
 * products (AI Academy, nivo AI Agent), each with its tiers directly visible —
 * no tier-chooser sub-screen — above the buyer's own `MyOrdersList`, plus the
 * `BuyConfirmModal` that a tier's Choose action opens. A page is a list of
 * functions: this one NAMES `CatalogProductCard` + a `Grid` of `CatalogTierCard`
 * per product, then `MyOrdersList`, then `BuyConfirmModal` — nothing drawn
 * inline beyond the layout frames and the section heading. Grounded in the real
 * `CatalogItemEntity` (2 rows: `site_from_template`/`ai_academy`, `ai_agent`) +
 * `CatalogTierEntity` (3 tiers each) + `CatalogOrderEntity`; prices are the real
 * public numbers (Academy 0 / 299,000 / 899,000 VND per month; AI Agent
 * 490,000 / 990,000 / 2,400,000 VND per month).
 *
 * `BuyConfirmModal` is composed HERE, not left for a caller to mount elsewhere
 * — unlike `AgentOsConsole`'s overlays (opened outside the page), this page's
 * one modal is short-lived and its own tier grid is the only thing that opens
 * it, so keeping it in the same tree keeps the open/selection state next to
 * what drives it. The modal's own `isOpen`/`order` still arrive as PROPS (never
 * local state) — the connected layer (or a story's `Controlled` wrapper) owns
 * them, so this file stays a pure function of its props.
 *
 * A page's story is one complete STATE per story — `loading`, `no-orders-yet`
 * (a brand-new account, the critical case — a tier is always one press away),
 * `with-orders` — not a leaf-per-prop map.
 */

/** One tier of a {@link CatalogViewProduct} — a subset of `CatalogTierEntity`. */
export interface CatalogViewTier {
    /** Tier id (`CatalogTierEntity.id`). */
    id: string
    /** Display name (`CatalogTierEntity.name`). */
    name: string
    /** Short positioning copy, or null (`CatalogTierEntity.description`). */
    description?: string | null
    /** Monthly price in VND, or null (`CatalogTierEntity.priceMonthlyVnd`). */
    priceMonthlyVnd?: number | null
    /** One-time price in VND, or null (`CatalogTierEntity.priceOneTimeVnd`). */
    priceOneTimeVnd?: number | null
    /** Already-resolved feature labels (`CatalogTierEntity.featureFlags`). */
    features: Array<string>
    /** Positioning flag (`CatalogTierEntity.isRecommended`) — at most one true per product. */
    isRecommended: boolean
    /** `true` → the user is already on this tier. */
    isOwned: boolean
    /** Reason the tier cannot be chosen right now, or null. */
    disabledReason?: string | null
}

/** One product and its tiers — a subset of `CatalogItemEntity` plus its `tiers`. */
export interface CatalogViewProduct {
    /** Catalog item id (`CatalogItemEntity.id`). */
    id: string
    /** Display name (`CatalogItemEntity.name`, e.g. "AI Academy"). */
    name: string
    /** Already-localized category label (`CatalogItemEntity.category`). */
    categoryLabel: string
    /** One-line positioning copy, or null (`CatalogItemEntity.tagline`). */
    tagline?: string | null
    /** Whether the real order path is wired end-to-end (`CatalogItemEntity.isOrderWired`). */
    isOrderWired: boolean
    /** The product's price tiers, in display order (`CatalogTierEntity.orderIndex`). */
    tiers: Array<CatalogViewTier>
}

/** Already-localized copy for every region this page arranges. */
export interface CatalogViewLabels {
    /** Page heading (e.g. "Catalog"). */
    title: string
    /** Subtitle under the heading. */
    subtitle: string
    /** Forwarded to each `CatalogProductCard`. */
    productCard: CatalogProductCardLabels
    /** Forwarded to each `CatalogTierCard`. */
    tierCard: CatalogTierCardLabels
    /** Forwarded to `MyOrdersList`. */
    myOrders: MyOrdersListLabels
    /** Forwarded to `BuyConfirmModal`. */
    buyConfirm: BuyConfirmModalLabels
}

/** The `BuyConfirmModal` region — its own props minus `labels`, which the page forwards from `labels.buyConfirm`. */
export interface CatalogViewBuyConfirm {
    /** Whether the modal is open. */
    isOpen: boolean
    /** The product + tier selected, or null before any tier has been chosen. */
    order: BuyConfirmModalOrder | null
    /** The user's wallet balance in VND — the only payment method. */
    walletBalanceVnd: number
    /** Open-state change handler. */
    onOpenChange: (open: boolean) => void
    /** Place the order. */
    onConfirm: () => void
    /** `true` → the order is being placed. */
    isConfirming?: boolean
}

/** Props for {@link CatalogView}. */
export interface CatalogViewProps {
    /** The two real products, each with its tiers. */
    products: Array<CatalogViewProduct>
    /** The buyer's own catalog orders, newest first. */
    orders: Array<MyOrderRow>
    /** Choose a tier — the connected layer populates `buyConfirm.order` and opens it. */
    onSelectTier: (productId: string, tierId: string) => void
    /** The buy-confirmation modal's own state. */
    buyConfirm: CatalogViewBuyConfirm
    /** Already-localized copy. */
    labels: CatalogViewLabels
    /** `true` → the page is still loading; the skeleton mirror is shown. */
    isSkeleton?: boolean
}

/** How many placeholder product sections the skeleton draws. */
const SKELETON_PRODUCT_COUNT = 2

/** How many placeholder tiers per skeleton product section. */
const SKELETON_TIER_COUNT = 3

/** Derives the entry (lowest) price shown on a product's own summary card from its tiers. */
const basePriceVndOf = (tiers: Array<CatalogViewTier>): number | null => {
    const prices = tiers
        .map((tier) => tier.priceMonthlyVnd ?? tier.priceOneTimeVnd)
        .filter((price): price is number => price != null)
    return prices.length > 0 ? Math.min(...prices) : null
}

/** The tier a product's own summary card quick-selects — its recommended tier, or its first tier otherwise. */
const defaultTierOf = (product: CatalogViewProduct): CatalogViewTier | undefined =>
    product.tiers.find((tier) => tier.isRecommended) ?? product.tiers[0]

/**
 * The catalog page. See the file header for why tiers render inline (no
 * tier-chooser sub-screen) and why the modal is composed here.
 *
 * @param props - {@link CatalogViewProps}
 */
const CatalogView = ({ products, orders, onSelectTier, buyConfirm, labels, isSkeleton = false }: CatalogViewProps) => {
    const shell = (children: ReactNode) => (
        <div data-tier="page" data-component="CatalogView" className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
            {children}
        </div>
    )

    const heading = (
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            items={[
                () => <Typography size="h2" weight="bold" isSkeleton={isSkeleton} text={labels.title} />,
                () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.subtitle} />,
            ]}
        />
    )

    // ── LOADING: two placeholder product sections, each with its three-tier grid.
    if (isSkeleton) {
        return shell(
            <StackV
                gap={8}
                items={[
                    () => heading,
                    ...Array.from({ length: SKELETON_PRODUCT_COUNT }, (_unused, productIndex) => () => (
                        <StackV
                            gap={4}
                            isSkeleton
                            items={[
                                () => (
                                    <CatalogProductCard
                                        product={{ id: `s-${productIndex}`, name: "Product", categoryLabel: "Category", basePriceVnd: 0, isOrderWired: true }}
                                        onOrder={() => {}}
                                        labels={labels.productCard}
                                        isSkeleton
                                    />
                                ),
                                () => (
                                    <Grid
                                        columns={{ base: 1, sm: 2, lg: 3 }}
                                        gap={4}
                                        isSkeleton
                                        items={Array.from({ length: SKELETON_TIER_COUNT }, (_unused2, tierIndex) => ({
                                            key: `s-${productIndex}-${tierIndex}`,
                                            content: ({ isSkeleton: skeleton }: SkeletonProps) => (
                                                <CatalogTierCard
                                                    tier={{ id: `s-${productIndex}-${tierIndex}`, name: "Tier", features: [], isRecommended: false, isOwned: false }}
                                                    onSelect={() => {}}
                                                    labels={labels.tierCard}
                                                    isSkeleton={skeleton}
                                                />
                                            ),
                                        }))}
                                    />
                                ),
                            ]}
                        />
                    )),
                    () => <MyOrdersList orders={[]} labels={labels.myOrders} isSkeleton />,
                ]}
            />,
        )
    }

    return shell(
        <>
            <StackV
                gap={8}
                items={[
                    () => heading,
                    ...products.map((product) => () => (
                        <StackV
                            key={product.id}
                            gap={4}
                            items={[
                                () => (
                                    <CatalogProductCard
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            categoryLabel: product.categoryLabel,
                                            tagline: product.tagline,
                                            basePriceVnd: basePriceVndOf(product.tiers),
                                            isOrderWired: product.isOrderWired,
                                        }}
                                        onOrder={() => {
                                            const fallback = defaultTierOf(product)
                                            if (fallback) {
                                                onSelectTier(product.id, fallback.id)
                                            }
                                        }}
                                        labels={labels.productCard}
                                    />
                                ),
                                () => (
                                    <Grid
                                        columns={{ base: 1, sm: 2, lg: 3 }}
                                        gap={4}
                                        items={product.tiers.map((tier) => ({
                                            key: tier.id,
                                            content: () => (
                                                <CatalogTierCard
                                                    tier={tier}
                                                    onSelect={(tierId) => onSelectTier(product.id, tierId)}
                                                    labels={labels.tierCard}
                                                />
                                            ),
                                        }))}
                                    />
                                ),
                            ]}
                        />
                    )),
                    () => <MyOrdersList orders={orders} labels={labels.myOrders} />,
                ]}
            />
            <BuyConfirmModal
                isOpen={buyConfirm.isOpen}
                onOpenChange={buyConfirm.onOpenChange}
                order={buyConfirm.order}
                walletBalanceVnd={buyConfirm.walletBalanceVnd}
                onConfirm={buyConfirm.onConfirm}
                isConfirming={buyConfirm.isConfirming}
                labels={labels.buyConfirm}
            />
        </>,
    )
}

export { CatalogView }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "CatalogView" } as const
