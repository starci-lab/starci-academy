import React from "react"
import { Button, Chip, Drawer, ScrollShadow, Typography } from "@heroui/react"
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
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
 * right on desktop / bottom-sheet on mobile. Renders the line list (reusing
 * {@link CartLine}, the SAME row the `/cart` page uses), a bundle-discount meter, a
 * footer with the real charged total + saving, a primary "Checkout" and a text link
 * to the full cart page. `error`/`isEmpty` fall to the shared `AsyncContentError` /
 * `AsyncContentEmpty` composites; otherwise the tree renders with `isSkeleton`
 * threaded to the cart-list zone so the shimmer mirrors the loaded shape
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
}: MiniCartDrawerProps) => (
    <Drawer>
        <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} className="backdrop-blur-sm">
            <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                <Drawer.Dialog
                    data-tier="overlay"
                    data-component="MiniCartDrawer"
                    className="p-0 sm:max-w-md"
                >
                    <div className="p-4">
                        <Drawer.CloseTrigger />
                        <Drawer.Header>
                            <Drawer.Heading>{labels.header}</Drawer.Heading>
                        </Drawer.Header>
                    </div>
                    <Drawer.Body>
                        <ScrollShadow hideScrollBar className="h-full p-4">
                            {error ? (
                                <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
                            ) : !isSkeleton && isEmpty ? (
                                <AsyncContentEmpty
                                    icon={ShoppingCartIcon}
                                    title={labels.emptyTitle}
                                    description={labels.emptyDescription}
                                    onRetry={onBrowseCourses}
                                    retryLabel={labels.browseCourses}
                                />
                            ) : isSkeleton ? (
                                <div className="flex flex-col gap-6">
                                    {/* combo-discount block above the list (label + bonus chip + meter + hint) */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <Skeleton.Typography type="body-sm" width="1/2" />
                                            <Skeleton.Chip />
                                        </div>
                                        <Skeleton.ProgressBar />
                                        <Skeleton.Typography type="body-xs" width="2/3" />
                                    </div>
                                    {/* mirror the bordered nested list (not shadow-surface) */}
                                    <div className="overflow-hidden rounded-3xl border border-default bg-surface">
                                        {Array.from({ length: 2 }).map((_, index) => (
                                            <div key={index} className="flex items-center gap-3 px-4 py-4">
                                                <Skeleton className="size-12 shrink-0 rounded-xl" />
                                                <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                                                    <Skeleton className="h-4 w-24 rounded-lg" />
                                                </div>
                                                <Skeleton className="size-9 shrink-0 rounded-lg" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {/* combo-discount meter — StarCi's bundle differentiator */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <Typography type="body-sm" weight="medium">
                                                {labels.comboLabel}
                                            </Typography>
                                            {bundlePercent > 0 ? (
                                                <Chip size="sm" className="bg-accent-soft text-accent-soft-foreground">
                                                    <Chip.Label>{labels.bundleBonusChip}</Chip.Label>
                                                </Chip>
                                            ) : null}
                                        </div>
                                        {/* label + Chip row above owns the copy; ProgressMeter's own
                                            top-row is skipped here since it doesn't host a Chip. */}
                                        <ProgressMeter value={itemCount} max={3} />
                                        <Typography type="body-xs" color="muted">
                                            {labels.comboHint}
                                        </Typography>
                                    </div>

                                    {/* line list — reuses the SAME CartLine as the /cart page.
                                        `bordered`: this list is NESTED inside the drawer surface,
                                        where `shadow-surface` renders invisible against the parent
                                        (dark mode) — nested cards need a border to delineate
                                        (`card.md` §surface-in-surface). The /cart PAGE keeps it
                                        un-bordered (top-level on `bg-background`, shadow shows). */}
                                    <SurfaceListCard bordered>
                                        {items.map((item) => (
                                            <CartLine
                                                key={item.id}
                                                item={item}
                                                previewLine={previewByCourse?.get(item.courseId)}
                                                onRemove={onRemove}
                                                isMutating={isMutating}
                                            />
                                        ))}
                                    </SurfaceListCard>
                                </div>
                            )}
                        </ScrollShadow>
                    </Drawer.Body>
                    {items.length > 0 ? (
                        <Drawer.Footer className="flex flex-col gap-3 border-t p-4">
                            {/* summary: real charged total + saving; falls back to the plain list total on preview error */}
                            {isPreviewSkeleton ? (
                                // mirror the left-aligned, full-width total row
                                <div className="flex w-full items-center gap-3">
                                    <Skeleton className="h-5 w-20 rounded-lg" />
                                    <Skeleton className="h-7 w-32 rounded-lg" />
                                </div>
                            ) : (
                                /* `w-full`: `Drawer.Footer` (flex-col) does NOT stretch its
                                    non-`fullWidth` children, so this summary block hugged its
                                    content (~274px) while the `fullWidth` buttons below spanned
                                    the footer — same gotcha as `Card.Footer` (CourseCard). Force
                                    full width so the stack matches the buttons' edge. */
                                <div className="flex w-full flex-col gap-1">
                                    {/* total + price grouped on the LEFT (not spread edge-to-edge)
                                        so the whole summary stack — total · saving · installment —
                                        reads as one left-aligned column, per teacher feedback. */}
                                    <div className="flex w-full items-center gap-3">
                                        <Typography type="body" weight="semibold">
                                            {labels.total}
                                        </Typography>
                                        {preview ? (
                                            <PriceTag
                                                discounted={preview.totalChargedVnd}
                                                original={preview.totalListVnd}
                                                currency="VND"
                                                size="md"
                                            />
                                        ) : previewError ? (
                                            // preview failed to load — fall back to the plain
                                            // list total (no bundle discount known) so the total
                                            // is never blank.
                                            <PriceTag discounted={fallbackTotalVnd} currency="VND" size="md" />
                                        ) : null}
                                    </div>
                                    {preview && preview.savingsVnd > 0 ? (
                                        <Typography type="body-sm" className="text-success-soft-foreground">
                                            {labels.savings}
                                        </Typography>
                                    ) : null}
                                    {cheapestMonthlyLabel != null ? (
                                        <Typography type="body-xs" color="muted">
                                            {labels.installmentHint}
                                        </Typography>
                                    ) : null}
                                </div>
                            )}

                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                isDisabled={isMutating}
                                onPress={onCheckout}
                            >
                                {labels.checkout}
                                <ArrowRightIcon className="size-5" />
                            </Button>
                            <Button variant="tertiary" fullWidth onPress={onViewFullCart}>
                                {labels.viewFullCart}
                            </Button>
                        </Drawer.Footer>
                    ) : null}
                </Drawer.Dialog>
            </Drawer.Content>
        </Drawer.Backdrop>
    </Drawer>
)
