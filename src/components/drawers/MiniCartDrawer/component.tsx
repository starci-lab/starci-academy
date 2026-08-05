import React from "react"
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { DrawerShell } from "@/components/composites/layout/DrawerShell"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { CartLine } from "@/components/features/cart/CartView/CartLine"
import type { CartItemEntity } from "@/modules/api/graphql/queries/types/my-cart"
import type { CoursesCheckoutPreviewLine } from "@/modules/api/graphql/queries/types/courses-checkout-preview"

/** All display text, already localized by the connected `MiniCartDrawer`; a story passes i18n keys. */
export interface MiniCartDrawerLabels {
    /** `"${cart.title} · ${cart.itemsCount}"`, already interpolated with `count`. */
    header: string
    emptyTitle: string
    emptyDescription: string
    browseCourses: string
    errorTitle: string
    retry: string
    /** `cart.comboActive`/`cart.comboStart`, already picked+interpolated for the current `bundlePercent`. */
    comboLabel: string
    /** `cart.bundleBonus`, already interpolated — only shown while `bundlePercent > 0`. */
    bundleBonusChip: string
    /** `cart.comboNextHint`/`cart.comboMaxHint`, already picked+interpolated for `nextTierPercent`. */
    comboHint: string
    total: string
    /** `cart.savings`, already interpolated — only shown while `savingsVnd > 0`. */
    savings: string
    /** `cart.installmentHint`, already interpolated — only shown while `cheapestMonthlyVnd` is set. */
    installmentHint: string
    checkout: string
    viewFullCart: string
}

/** Props for {@link _MiniCartDrawer} — presentational; all data resolved, no fetch/store/i18n. */
export interface MiniCartDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    /** Slide-in edge. `true` on mobile → bottom sheet. */
    isMobile: boolean
    /** First load, nothing in hand → the cart-list zone shimmers in place (co-located). */
    isSkeleton?: boolean
    /** Settled with zero lines → the empty message replaces the list. */
    isEmpty?: boolean
    /** Truthy → the cart-list zone falls to the error message (beats loading + empty). */
    error?: unknown
    onRetry?: () => void
    onBrowseCourses?: () => void
    items?: Array<CartItemEntity>
    /** courseId → the real checkout-preview line, for per-line pricing. */
    previewByCourse?: Map<string, CoursesCheckoutPreviewLine>
    isMutating?: boolean
    onRemove: (courseId: string) => void
    /** Combo-meter fill (0..3). */
    itemCount?: number
    /** Whether the current bundle tier is above zero — gates the bonus chip. */
    bundlePercent?: number
    /** First load of the checkout preview, cart already settled → the footer summary shimmers. */
    isPreviewSkeleton?: boolean
    /** The real checkout preview — total/savings/installments. `undefined` while pending or on error. */
    preview?: { totalChargedVnd: number; totalListVnd: number; savingsVnd: number }
    /** `true` → the preview fetch settled with an error; falls back to `fallbackTotalVnd`. */
    previewError?: boolean
    /** Sum of entity display prices — shown only when the preview failed to load. */
    fallbackTotalVnd?: number
    /** Cheapest installment monthly amount, already formatted. `null` → no installment plans exist. */
    cheapestMonthlyLabel?: string | null
    onCheckout?: () => void
    onViewFullCart?: () => void
    labels: MiniCartDrawerLabels
}

/**
 * Mini-cart drawer — the presentational half of {@link _MiniCartDrawer}'s connected
 * `MiniCartDrawer` (`index.tsx`): the slide-out cart confirmation + combo meter,
 * right on desktop / bottom-sheet on mobile. Composed on `DrawerShell` (the shared
 * panel-scaffold composite): a bordered `SurfaceListCard` reusing {@link CartLine}
 * (the SAME row the `/cart` page uses), a bundle-discount `ProgressMeter`, and a
 * footer with the real charged total + saving, a primary "Checkout" and a text
 * link to the full cart page. `error`/`isEmpty` fall to the shared
 * `AsyncContentError` / `AsyncContentEmpty` composites; otherwise the tree renders
 * with `isSkeleton` threaded down so the shimmer mirrors the loaded shape
 * (loading-and-skeleton.md). See `tiers/split.md` — the connected `index.tsx` owns
 * the fetch, the stores, and the i18n.
 *
 * @param props - {@link MiniCartDrawerProps}
 */
export const _MiniCartDrawer = ({
    isOpen,
    onOpenChange,
    isMobile,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    onBrowseCourses,
    items = [],
    previewByCourse,
    isMutating = false,
    onRemove,
    itemCount = 0,
    bundlePercent = 0,
    isPreviewSkeleton = false,
    preview,
    previewError = false,
    fallbackTotalVnd = 0,
    cheapestMonthlyLabel = null,
    onCheckout,
    onViewFullCart,
    labels,
}: MiniCartDrawerProps) => {
    // Combo-discount meter — StarCi's bundle differentiator: label + bonus chip row,
    // the meter, and a hint line. `ProgressMeter` (block) has no co-located skeleton
    // of its own, so this leaf mirrors it by hand with `Skeleton.ProgressBar` while
    // the rest of the row threads `isSkeleton` straight down (loading-and-skeleton.md §1).
    const comboMeterSection: ComponentTypeWithSkeleton = () => (
        <StackV
            gap={3}
            items={[
                () => (
                    <StackH
                        gap={3}
                        align="center"
                        justify="between"
                        items={[
                            () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={labels.comboLabel} />,
                            ...(isSkeleton
                                ? [() => <Chip isSkeleton tone="accent" />]
                                : bundlePercent > 0
                                    ? [() => <Chip tone="accent" text={labels.bundleBonusChip} />]
                                    : []),
                        ]}
                    />
                ),
                () => (isSkeleton ? <Skeleton.ProgressBar /> : <ProgressMeter value={itemCount} max={3} />),
                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.comboHint} />,
            ]}
        />
    )

    // Line list — reuses the SAME `CartLine` as the `/cart` page. `bordered`: this
    // list is NESTED inside the drawer surface, where `shadow-surface` renders
    // invisible against the parent (dark mode) — nested cards need a border to
    // delineate (`card.md` §surface-in-surface). The `/cart` PAGE keeps it
    // un-bordered (top-level on `bg-background`, shadow shows). `CartLine` has no
    // co-located skeleton of its own, so the loading rows are mirrored by hand,
    // same shape (leading tile · two text lines · trailing action).
    const cartListSection: ComponentTypeWithSkeleton = () => (
        <SurfaceListCard bordered>
            {isSkeleton
                ? Array.from({ length: 2 }).map((_row, index) => (
                    <StackH
                        key={index}
                        gap={4}
                        align="center"
                        padding={5}
                        items={[
                            () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                            () => (
                                <StackV
                                    gap={3}
                                    classNames={["min-w-0", "flex-1"]}
                                    items={[
                                        () => <Skeleton className="h-4 w-1/2 rounded-lg" />,
                                        () => <Skeleton className="h-4 w-24 rounded-lg" />,
                                    ]}
                                />
                            ),
                            () => <Skeleton className="size-9 shrink-0 rounded-lg" />,
                        ]}
                    />
                ))
                : items.map((item) => (
                    <CartLine
                        key={item.id}
                        item={item}
                        previewLine={previewByCourse?.get(item.courseId)}
                        onRemove={onRemove}
                        isMutating={isMutating}
                    />
                ))}
        </SurfaceListCard>
    )

    // Body — error → skeleton → empty → content (BLOCK-8): the empty and error
    // surfaces are the shared `AsyncContent*` composites dropped in as their own
    // states; otherwise the ONE tree renders, with `isSkeleton` threaded down so
    // the shimmer mirrors the loaded shape.
    const cartBody: ComponentTypeWithSkeleton = () => {
        if (error) {
            return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
        }
        if (!isSkeleton && isEmpty) {
            return (
                <AsyncContentEmpty
                    icon={ShoppingCartIcon}
                    title={labels.emptyTitle}
                    description={labels.emptyDescription}
                    onRetry={onBrowseCourses}
                    retryLabel={labels.browseCourses}
                />
            )
        }
        return <StackV gap={6} isSkeleton={isSkeleton} items={[comboMeterSection, cartListSection]} />
    }

    // Footer — real charged total + saving; falls back to the plain list total on
    // preview error. Total + price grouped on the LEFT (not spread edge-to-edge) so
    // the whole summary stack — total · saving · installment — reads as one
    // left-aligned column, per teacher feedback.
    const footerSection: ComponentTypeWithSkeleton = () => (
        <StackV
            gap={4}
            items={[
                () => (
                    isPreviewSkeleton ? (
                        <StackH
                            gap={4}
                            align="center"
                            items={[
                                () => <Skeleton className="h-5 w-20 rounded-lg" />,
                                () => <Skeleton className="h-7 w-32 rounded-lg" />,
                            ]}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            items={[
                                () => (
                                    <StackH
                                        gap={4}
                                        align="center"
                                        items={[
                                            () => <Typography size="base" weight="semibold" text={labels.total} />,
                                            ...(preview
                                                ? [() => (
                                                    <PriceTag
                                                        discounted={preview.totalChargedVnd}
                                                        original={preview.totalListVnd}
                                                        currency="VND"
                                                        size="md"
                                                    />
                                                )]
                                                // preview failed to load — fall back to the plain list
                                                // total (no bundle discount known) so the total is never blank.
                                                : previewError
                                                    ? [() => <PriceTag discounted={fallbackTotalVnd} currency="VND" size="md" />]
                                                    : []),
                                        ]}
                                    />
                                ),
                                ...(preview && preview.savingsVnd > 0
                                    ? [() => <Typography size="sm" color="success-soft" text={labels.savings} />]
                                    : []),
                                ...(cheapestMonthlyLabel != null
                                    ? [() => <Typography size="xs" color="muted" text={labels.installmentHint} />]
                                    : []),
                            ]}
                        />
                    )
                ),
                () => (
                    <Button
                        variant="primary"
                        size="lg"
                        suffixIcon={ArrowRightIcon}
                        isDisabled={isMutating}
                        onPress={onCheckout}
                        label={labels.checkout}
                        classNames={["w-full"]}
                    />
                ),
                () => (
                    <Button
                        variant="tertiary"
                        onPress={onViewFullCart}
                        label={labels.viewFullCart}
                        classNames={["w-full"]}
                    />
                ),
            ]}
        />
    )

    return (
        <DrawerShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={isMobile ? "bottom" : "right"}
            title={labels.header}
            dialogClassName="sm:max-w-md"
            isSkeleton={isSkeleton}
            body={cartBody}
            footer={items.length > 0 ? footerSection : undefined}
            // HeroUI's `.drawer__footer` hard-codes `flex-row items-center justify-end
            // gap-2` (drawer.css) — this footer needs a vertical stack (summary above
            // full-width buttons), so every conflicting axis is forced with the trailing
            // `!` important modifier, same technique `DrawerShell` itself uses for `mt-0!`.
            footerClassName="flex-col! items-stretch! justify-start! gap-3! border-t"
            identity={{ tier: "overlay", component: "MiniCartDrawer" }}
        />
    )
}
