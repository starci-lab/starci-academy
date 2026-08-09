import React from "react"
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { DrawerShell } from "@/components/composites/layout/DrawerShell"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { IdentityTile } from "@/components/atoms/display/IdentityTile"
import { StackH, StackV } from "@/components/frames/Stack"
import { FillAvailable } from "@/components/frames/FillAvailable"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { PriceTagInline } from "@/components/blocks/commerce/PriceTag"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { CartLine } from "@/components/blocks/commerce/CartLine"
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
 * panel-scaffold composite): a nested `SurfaceCardList` reusing {@link CartLine}
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
    const comboLabelRow = [
        () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={labels.comboLabel} />,
        ...(isSkeleton
            ? [() => <Chip isSkeleton tone="accent" />]
            : bundlePercent > 0
                ? [() => <Chip tone="accent" text={labels.bundleBonusChip} />]
                : []),
    ]
    const comboMeterItems = [
        () => (
            <StackH
                gap={3}
                principle="flex-action"
                explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                align="center"
                justify="between"
                items={comboLabelRow}
            />
        ),
        () => <ProgressMeter value={itemCount} max={3} isSkeleton={isSkeleton} />,
        () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.comboHint} />,
    ]
    const comboMeterSection: ComponentTypeWithSkeleton = () => (
        <StackV
            gap={3}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            items={comboMeterItems}
        />
    )

    // Line list — reuses the SAME `CartLine` as the `/cart` page. `variant="nested"`:
    // this list is NESTED inside the drawer surface, where `shadow-surface` renders
    // invisible against the parent (dark mode) — nested cards need a border to
    // delineate (`card.md` §surface-in-surface). The `/cart` PAGE keeps the default
    // surface variant (top-level on `bg-background`, shadow shows). Loading rows
    // mirror CartLine via the same IdentityTile / FillAvailable / Button vocabulary
    // with `isSkeleton` (no hand-rolled Skeleton className bars).
    const cartLineSkeletonItems = [
        () => <IdentityTile size="sm" tone="accent" isSkeleton />,
        () => (
            <FillAvailable
                at="base"
                isSkeleton
                body={({ isSkeleton: rowSkeleton }) => (
                    <StackV
                        gap={1}
                        isSkeleton={rowSkeleton}
                        principle="name-handle"
                        explain="Title over price at the tight name-handle step — not title-subtitle, because the second line is a price control rather than a descriptive subtitle."
                        items={[
                            () => <Typography size="sm" weight="medium" truncate isSkeleton text="" />,
                            () => <PriceTagInline discounted={0} currency="VND" isSkeleton />,
                        ]}
                    />
                )}
            />
        ),
        () => (
            <Button
                isIconOnly
                isSkeleton
                variant="danger-soft"
                ariaLabel={labels.checkout}
            />
        ),
    ]
    const cartListSection: ComponentTypeWithSkeleton = () => {
        const listItems: Array<SurfaceCardListItem> = isSkeleton
            ? Array.from({ length: 2 }, (_row, index) => ({
                key: `skeleton-${index}`,
                content: () => (
                    <StackH
                        gap={3}
                        principle="flex-action"
                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                        align="center"
                        items={cartLineSkeletonItems}
                    />
                ),
            }))
            : items.map((item) => ({
                key: item.id,
                content: () => (
                    <CartLine
                        item={item}
                        previewLine={previewByCourse?.get(item.courseId)}
                        onRemove={onRemove}
                        isMutating={isMutating}
                    />
                ),
            }))
        return (
            <SurfaceCardList
                variant="nested"
                items={listItems}
                isSkeleton={isSkeleton}
            />
        )
    }

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
        return (
            <StackV
                gap={6}
                isSkeleton={isSkeleton}
                principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                items={[comboMeterSection, cartListSection]}
            />
        )
    }

    const previewSkeletonTotalRow = [
        () => <Typography size="base" weight="semibold" isSkeleton text={labels.total} />,
        () => <PriceTagInline discounted={0} currency="VND" isSkeleton />,
    ]
    const totalPriceRow = [
        () => <Typography size="base" weight="semibold" text={labels.total} />,
        ...(preview
            ? [() => (
                <PriceTagInline
                    discounted={preview.totalChargedVnd}
                    original={preview.totalListVnd}
                    currency="VND"
                />
            )]
            // preview failed to load — fall back to the plain list
            // total (no bundle discount known) so the total is never blank.
            : previewError
                ? [() => <PriceTagInline discounted={fallbackTotalVnd} currency="VND" />]
                : []),
    ]
    const totalSummaryItems = [
        () => (
            <StackH
                gap={4}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center"
                items={totalPriceRow}
            />
        ),
        ...(preview && preview.savingsVnd > 0
            ? [() => <Typography size="sm" color="success-soft" text={labels.savings} />]
            : []),
        ...(cheapestMonthlyLabel != null
            ? [() => <Typography size="xs" color="muted" text={labels.installmentHint} />]
            : []),
    ]
    const footerItems = [
        () => (
            isPreviewSkeleton ? (
                <StackH
                    gap={4}
                    principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                    align="center"
                    items={previewSkeletonTotalRow}
                />
            ) : (
                <StackV
                    gap={2}
                    principle="title-subtitle"
                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                    items={totalSummaryItems}
                />
            )
        ),
        () => (
            <StackV
                principle="center-measure"
                explain="Stretches the checkout CTA across the drawer footer so it matches peer full-width cart actions."
                items={[
                    () => (
                        <Button
                            variant="primary"
                            size="lg"
                            suffixIcon={ArrowRightIcon}
                            isDisabled={isMutating}
                            onPress={onCheckout}
                            label={labels.checkout}
                        />
                    ),
                ]}
            />
        ),
        () => (
            <StackV
                principle="center-measure"
                explain="Stretches the view-cart link across the drawer footer so it aligns with the checkout CTA above."
                items={[
                    () => (
                        <Button
                            variant="tertiary"
                            onPress={onViewFullCart}
                            label={labels.viewFullCart}
                        />
                    ),
                ]}
            />
        ),
    ]
    const footerSection: ComponentTypeWithSkeleton = () => (
        <StackV
            gap={5}
            principle="group-boundary"
            explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
            items={footerItems}
        />
    )

    return (
        <DrawerShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={isMobile ? "bottom" : "right"}
            title={labels.header}
            dialogWidth="cart"
            footerVariant="stacked"
            isSkeleton={isSkeleton}
            body={cartBody}
            footer={items.length > 0 ? footerSection : undefined}
            identity={{ tier: "overlay", component: "MiniCartDrawer" }}
        />
    )
}
