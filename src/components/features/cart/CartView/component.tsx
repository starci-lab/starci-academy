import React, { useEffect, useMemo, useState } from "react"
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { Container } from "@/components/frames/Container"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { CartLine } from "./CartLine"
import { publicEnv } from "@/resources/env/public"
import type { CartItemEntity } from "@/modules/api/graphql/queries/types/my-cart"
import type { CoursesCheckoutPreviewLine } from "@/modules/api/graphql/queries/types/courses-checkout-preview"
import type { CourseEntity } from "@/modules/types/entities/course"

/** How many placeholder rows the co-located skeleton shows for the cart-line list. */
const SKELETON_ROW_COUNT = 3

/** Format an integer VND amount as "1.275.000₫". */
export const formatVnd = (amount: number): string => `${amount.toLocaleString("vi-VN")}₫`

/**
 * A course's DISPLAY list VND price from its entity (active-phase price, falling
 * back to the list price, ÷ non-prod test divisor). Used only as the FALLBACK
 * total when the checkout preview fails — the real charged total comes from the
 * preview, whose amounts are already display-ready.
 */
const displayPriceVnd = (course: CourseEntity): number => {
    const divisor = publicEnv().pricing.testDivisor
    const toVnd = (amount: number): number =>
        divisor === 1 ? amount : Math.max(1, Math.round(amount / divisor))
    const phasePrice = course.pricingPhases?.find(
        (phase) => phase.phase === course.currentPhase,
    )?.price
    return toVnd(phasePrice ?? course.originalPrice ?? 0)
}

/**
 * One row's minimal shimmer standing in for {@link CartLine} while the cart's
 * first load is in flight. `CartLine` takes no `isSkeleton` prop, so this mirrors
 * its leading-tile + title/price + trailing-button shape right where the row
 * sits, instead of a hand-kept parallel skeleton tree (missingSkeletonSupport).
 */
const CartLineSkeletonRow = () => (
    <SurfaceListCardItem>
        <StackH gap={4} items={[
            () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
            () => (
                <StackV gap={3} classNames={["min-w-0", "flex-1"]} items={[
                    () => <Skeleton.Typography type="body-sm" width="1/2" />,
                    () => <Skeleton className="h-4 w-24 rounded-lg" />,
                ]} />
            ),
            () => <Skeleton className="size-9 shrink-0 rounded-lg" />,
        ]} />
    </SurfaceListCardItem>
)

/** Props for the private {@link ClearCartButton} helper. */
interface ClearCartButtonProps {
    isDisabled: boolean
    onClear: () => void
    /** Already-translated resting label ("Clear cart"). */
    clearLabel: string
    /** Already-translated armed-state label ("Press again to confirm"). */
    confirmLabel: string
}

/**
 * "Clear cart" with a lightweight inline 2-step confirm (no modal): first press
 * arms a danger-soft "confirm" state that auto-disarms after 3s; second press
 * within the window actually clears — so a destroy-all action can't fire on one
 * stray click. (canon: destructive action needs confirmation.)
 */
const ClearCartButton = ({ isDisabled, onClear, clearLabel, confirmLabel }: ClearCartButtonProps) => {
    const [confirming, setConfirming] = useState(false)
    useEffect(() => {
        if (!confirming) return
        const timer = setTimeout(() => setConfirming(false), 3000)
        return () => clearTimeout(timer)
    }, [confirming])
    return (
        <Button
            variant={confirming ? "danger-soft" : "tertiary"}
            isDisabled={isDisabled}
            label={confirming ? confirmLabel : clearLabel}
            classNames={["w-full"]}
            onPress={() => {
                if (confirming) {
                    onClear()
                    setConfirming(false)
                } else {
                    setConfirming(true)
                }
            }}
        />
    )
}

/** All display text, already localized by the connected `CartView`; a story passes i18n keys. */
export interface CartViewLabels {
    title: string
    description: string
    empty: string
    emptyHint: string
    browseCourses: string
    error: string
    retry: string
    total: string
    /** Full "Checkout (N)" sentence — the connected file interpolates the count. */
    checkoutCount: string
    clear: string
    clearConfirm: string
    /** Present only when the preview reports a real saving over the list total. */
    savings?: string
    /** Present only when the preview also reports a multi-course bundle bonus. */
    bundleBonus?: string
    /** Present only when an installment plan exists for this cart. */
    installmentHint?: string
    /** "Add one more to unlock the next tier" nudge — present only at cart size 1 or 2. */
    addMoreHint?: string
}

/** Props for {@link _CartView} — presentational; all data resolved, no fetch/store/i18n. */
export interface CartViewProps {
    /** Every cart row with its full course. */
    items: Array<CartItemEntity>
    /** The checkout preview's per-course lines, for per-line pricing inside {@link CartLine}. */
    previewLines: Array<CoursesCheckoutPreviewLine>
    /** Real charged total from the checkout preview; undefined while it's pending or on error. */
    totalChargedVnd?: number
    /** Real list (pre-discount) total from the checkout preview. */
    totalListVnd?: number
    /** Disables the remove/checkout/clear affordances while a cart write is in flight. */
    isMutating: boolean
    /** First load, nothing in hand yet → the cart-line list + footer shimmer in place. */
    isSkeleton?: boolean
    /** Settled with zero rows → the empty message (offers browsing courses). */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file's settled cart-fetch error. */
    error?: unknown
    /**
     * The cart itself has resolved but the checkout-preview query (a separate SWR
     * key) is still pending — only the footer total/savings block shimmers.
     */
    isPreviewSkeleton?: boolean
    /** Retry handler for the error branch — re-fetches the cart. */
    onRetry: () => void
    /** Remove one course from the cart. */
    onRemove: (courseId: string) => void
    /** Opens the payment overlay for the current cart. */
    onCheckout: () => void
    /** Empties the cart (after the inline 2-step confirm). */
    onClearCart: () => void
    /** Jumps to course browsing — the empty state's action. */
    onBrowseCourses: () => void
    labels: CartViewLabels
}

/**
 * Shopping-cart page — the presentational half of {@link import("./index").CartView}.
 * Header (always shown) → error/empty/content in that order (`error` beats a stale
 * `isSkeleton`; `isEmpty` only once settled) → cart lines in one `SurfaceListCard` →
 * a footer with the REAL discounted total (progressive loyalty + multi-course bundle
 * bonus), the saving, a bundle chip, an "add more to save more" nudge, a primary
 * "Checkout" CTA (opens the payment modal), and a tertiary "Clear cart". The cart-line
 * list and the footer's preview total shimmer independently (two separate SWR keys —
 * `isSkeleton` for the cart itself, `isPreviewSkeleton` for the checkout preview),
 * both threaded co-located rather than built as a parallel skeleton tree. See
 * `tiers/split.md` — the connected `./index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link CartViewProps}
 */
export const _CartView = ({
    items,
    previewLines,
    totalChargedVnd,
    totalListVnd,
    isMutating,
    isSkeleton = false,
    isEmpty = false,
    error,
    isPreviewSkeleton = false,
    onRetry,
    onRemove,
    onCheckout,
    onClearCart,
    onBrowseCourses,
    labels,
}: CartViewProps) => {
    const { savings: savingsLabel, bundleBonus: bundleBonusLabel, installmentHint: installmentHintLabel, addMoreHint: addMoreHintLabel } = labels

    // courseId → preview line, for per-line pricing.
    const previewByCourse = useMemo(() => {
        const map = new Map<string, CoursesCheckoutPreviewLine>()
        previewLines.forEach((line) => map.set(line.courseId, line))
        return map
    }, [previewLines])

    // plain summed list total from the cart entities — the fallback shown when the
    // preview total hasn't arrived (still pending, or errored).
    const fallbackTotalVnd = useMemo(
        () => items.reduce((sum, item) => sum + displayPriceVnd(item.course), 0),
        [items],
    )

    // the footer summary block: total (real charged) + savings + bundle chip + nudge.
    // While the preview itself is pending it shimmers independently of the cart list.
    const summaryItems = isPreviewSkeleton
        ? [() => <Skeleton className="h-4 w-40 rounded-lg" />]
        : [
            ...(savingsLabel ? [() => (
                <StackH gap={3} justify="between" items={[
                    () => <Typography size="sm" color="success-soft" text={savingsLabel} />,
                    () => (bundleBonusLabel ? <Chip tone="accent" text={bundleBonusLabel} /> : null),
                ]} />
            )] : []),
            ...(installmentHintLabel ? [() => <Typography size="xs" color="muted" text={installmentHintLabel} />] : []),
            ...(addMoreHintLabel ? [() => <Typography size="xs" color="muted" text={addMoreHintLabel} />] : []),
        ]

    // error beats a stale isSkeleton flag; empty only once settled (BLOCK-8) — the
    // two message branches are the shared `AsyncContent*` frames, not hand-written JSX.
    const contentBody = () => {
        if (error) {
            return <AsyncContentError title={labels.error} onRetry={onRetry} retryLabel={labels.retry} />
        }
        if (!isSkeleton && isEmpty) {
            return (
                <AsyncContentEmpty
                    icon={ShoppingCartIcon}
                    title={labels.empty}
                    description={labels.emptyHint}
                    onRetry={onBrowseCourses}
                    retryLabel={labels.browseCourses}
                />
            )
        }
        return (
            <StackV gap={6} items={[
                () => (
                    <SurfaceListCard>
                        {isSkeleton
                            ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => (
                                <CartLineSkeletonRow key={index} />
                            ))
                            : items.map((item) => (
                                <CartLine
                                    key={item.id}
                                    item={item}
                                    previewLine={previewByCourse.get(item.courseId)}
                                    onRemove={onRemove}
                                    isMutating={isMutating}
                                />
                            ))}
                    </SurfaceListCard>
                ),
                () => (
                    <StackV gap={4} items={isSkeleton
                        ? [() => <Skeleton className="h-12 w-full rounded-2xl" />]
                        : [
                            () => (
                                <StackV gap={3} isSkeleton={isPreviewSkeleton} items={[
                                    () => (
                                        <StackH gap={4} justify="between" items={[
                                            () => <Typography size="base" weight="semibold" text={labels.total} isSkeleton={isPreviewSkeleton} />,
                                            () => (isPreviewSkeleton
                                                ? <Skeleton className="h-7 w-32 rounded-lg" />
                                                : (totalChargedVnd != null
                                                    ? (
                                                        <PriceTag
                                                            discounted={totalChargedVnd}
                                                            original={totalListVnd}
                                                            currency="VND"
                                                            size="md"
                                                            className="justify-end"
                                                        />
                                                    )
                                                    : <Typography size="h4" weight="bold" text={formatVnd(fallbackTotalVnd)} />)),
                                        ]} />
                                    ),
                                    ...summaryItems,
                                ]} />
                            ),
                            () => (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    isDisabled={isMutating}
                                    onPress={onCheckout}
                                    label={labels.checkoutCount}
                                    suffixIcon={ArrowRightIcon}
                                    classNames={["w-full"]}
                                />
                            ),
                            () => (
                                <ClearCartButton
                                    isDisabled={isMutating}
                                    onClear={onClearCart}
                                    clearLabel={labels.clear}
                                    confirmLabel={labels.clearConfirm}
                                />
                            ),
                        ]}
                    />
                ),
            ]} />
        )
    }

    return (
        <Container
            size="md"
            padding={6}
            identity={{ tier: "block", component: "CartView" }}
            body={() => (
                <StackV gap={7} items={[
                    () => <PageHeader title={labels.title} description={labels.description} />,
                    contentBody,
                ]} />
            )}
        />
    )
}
