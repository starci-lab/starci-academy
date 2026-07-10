"use client"

import React, { useCallback, useEffect, useMemo } from "react"
import { Button, Chip, Drawer, ScrollShadow, Skeleton, Typography } from "@heroui/react"
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { CartLine } from "@/components/features/cart/CartView/CartLine"
import { useCart } from "@/components/features/cart/hooks/useCart"
import { useQueryCoursesCheckoutPreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesCheckoutPreviewSwr"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { useMiniCartOverlayState, usePaymentOverlayState, usePendingCartIntent } from "@/hooks/zustand/overlay/hooks"
import { useAppSelector } from "@/redux/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { pathConfig } from "@/resources/path"
import type { CoursesCheckoutPreviewLine } from "@/modules/api/graphql/queries/types/courses-checkout-preview"

/** Format an integer VND amount as "1.275.000₫". */
const formatVnd = (amount: number): string => `${amount.toLocaleString("vi-VN")}₫`

/** Bundle bonus percent by purchasable course count (mirrors the backend tiers). */
const BUNDLE_TIER: Record<number, number> = { 1: 5, 2: 10 }
/** Course count at which the combo meter reads "full" (max tier reached). */
const BUNDLE_MAX_ITEMS = 3

/**
 * Mini-cart drawer — the slide-out cart confirmation + combo meter that is the
 * PRIMARY affordance of the cart UX (the `/cart` page stays as the deep review).
 * Right on desktop, bottom-sheet on mobile. Opens after any add-to-cart (via
 * {@link useCart}) or when the nav cart button is tapped. Reads the cart + the real
 * multi-course checkout preview off shared SWR keys; renders the line list (reusing
 * {@link CartLine}, the SAME row the `/cart` page uses), a bundle-discount meter, a
 * footer with the real charged total + saving, a primary "Checkout" (opens the
 * payment modal, `CoursesCheckout`) and a text link to the full cart page.
 *
 * Also REPLAYS a guest's deferred cart intent (see {@link usePendingCartIntent}) once
 * they authenticate: this is always-mounted (by {@link import("../DrawerContainer").DrawerContainer})
 * so it can watch the auth flag and run "add + open" / "open" after sign-in.
 */
export const MiniCartDrawer = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { isMobile } = useSmViewpoint()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)

    const { isOpen, setOpen, open: openMiniCart, close: closeMiniCart } = useMiniCartOverlayState()
    const { open: openPayment } = usePaymentOverlayState()
    const { pendingCartIntent, setPendingCartIntent } = usePendingCartIntent()
    const { items, count, isLoading, error, isMutating, addToCart, removeFromCart, refresh } = useCart()

    const courseIds = useMemo(() => items.map((item) => item.courseId), [items])
    const previewSwr = useQueryCoursesCheckoutPreviewSwr(courseIds)
    const preview = previewSwr.data
    // the preview loads off a separate key from the cart list; only show the summary
    // skeleton once the cart has resolved and the preview is still pending.
    const previewLoading = items.length > 0 && !preview && !previewSwr.error

    // replay a guest's deferred cart action once they sign in (add + open, or open).
    useEffect(() => {
        if (!authenticated || !pendingCartIntent) {
            return
        }
        if (pendingCartIntent.type === "add") {
            void addToCart(pendingCartIntent.courseId) // addToCart opens the drawer on success
        } else {
            openMiniCart()
        }
        setPendingCartIntent(null)
    }, [authenticated, pendingCartIntent, addToCart, openMiniCart, setPendingCartIntent])

    // courseId → preview line, for per-line pricing (same as the /cart page)
    const previewByCourse = useMemo(() => {
        const map = new Map<string, CoursesCheckoutPreviewLine>()
        preview?.lines.forEach((line) => map.set(line.courseId, line))
        return map
    }, [preview])

    // combo meter: fill toward the max bundle tier (3+ courses = full bar).
    const bundlePercent = preview?.bundleBonusPercent ?? 0
    const itemCount = preview?.itemCount ?? items.length
    const meterPercent = Math.min(itemCount / BUNDLE_MAX_ITEMS, 1) * 100
    const nextTierPercent = itemCount < BUNDLE_MAX_ITEMS ? BUNDLE_TIER[itemCount] : undefined

    // cheapest installment cycle (lowest monthlyAmountVnd, usually the longest
    // term) — surfaces that trả góp EXISTS before the buyer commits to checkout;
    // full term picker lives in PaymentModal once they proceed.
    const cheapestMonthlyVnd = preview?.installmentOptions.length
        ? Math.min(...preview.installmentOptions.map((option) => option.monthlyAmountVnd))
        : null

    const onCheckout = useCallback(() => {
        if (items.length === 0) {
            return
        }
        closeMiniCart()
        openPayment({
            flow: PaymentFlow.CoursesCheckout,
            courseIds,
            lines: items.map((item) => ({
                courseId: item.courseId,
                title: item.course.title,
                coverImageUrl: item.course.coverImageUrl,
            })),
        })
    }, [items, courseIds, closeMiniCart, openPayment])

    const onBrowseCourses = useCallback(() => {
        closeMiniCart()
        router.push(pathConfig().locale(locale).course().build())
    }, [closeMiniCart, router, locale])

    const onViewFullCart = useCallback(() => {
        closeMiniCart()
        router.push(pathConfig().locale(locale).cart().build())
    }, [closeMiniCart, router, locale])

    return (
        <Drawer>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={setOpen} className="backdrop-blur-sm">
                <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                    <Drawer.Dialog className="p-0 sm:max-w-md">
                        <div className="p-3">
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>
                                    {`${t("cart.title")} · ${t("cart.itemsCount", { count })}`}
                                </Drawer.Heading>
                            </Drawer.Header>
                        </div>
                        <Drawer.Body>
                            <ScrollShadow hideScrollBar className="h-full p-4">
                                <AsyncContent
                                    isLoading={isLoading}
                                    skeleton={
                                        <div className="overflow-hidden rounded-3xl bg-surface shadow-surface">
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
                                    }
                                    isEmpty={items.length === 0}
                                    emptyContent={{
                                        icon: <ShoppingCartIcon aria-hidden className="size-8 text-muted" />,
                                        title: t("cart.empty"),
                                        description: t("cart.emptyHint"),
                                        onRetry: onBrowseCourses,
                                        retryLabel: t("cart.browseCourses"),
                                    }}
                                    error={error}
                                    errorContent={{ title: t("cart.error"), onRetry: refresh, retryLabel: t("cart.retry") }}
                                >
                                    <div className="flex flex-col gap-6">
                                        {/* combo-discount meter — StarCi's bundle differentiator */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <Typography type="body-sm" weight="medium">
                                                    {bundlePercent > 0
                                                        ? t("cart.comboActive", { percent: bundlePercent })
                                                        : t("cart.comboStart")}
                                                </Typography>
                                                {bundlePercent > 0 ? (
                                                    <Chip size="sm" className="bg-accent/10 text-accent">
                                                        <Chip.Label>
                                                            {t("cart.bundleBonus", { percent: bundlePercent })}
                                                        </Chip.Label>
                                                    </Chip>
                                                ) : null}
                                            </div>
                                            {/* thin hairline meter — div track + accent fill (never a heavy bar) */}
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-default">
                                                <div
                                                    className="h-full rounded-full bg-accent transition-[width]"
                                                    style={{ width: `${meterPercent}%` }}
                                                />
                                            </div>
                                            <Typography type="body-xs" color="muted">
                                                {nextTierPercent != null
                                                    ? t("cart.comboNextHint", { percent: nextTierPercent })
                                                    : t("cart.comboMaxHint")}
                                            </Typography>
                                        </div>

                                        {/* line list — reuses the SAME CartLine as the /cart page */}
                                        <SurfaceListCard>
                                            {items.map((item) => (
                                                <CartLine
                                                    key={item.id}
                                                    item={item}
                                                    previewLine={previewByCourse.get(item.courseId)}
                                                    onRemove={removeFromCart}
                                                    isMutating={isMutating}
                                                />
                                            ))}
                                        </SurfaceListCard>
                                    </div>
                                </AsyncContent>
                            </ScrollShadow>
                        </Drawer.Body>
                        {items.length > 0 ? (
                            <Drawer.Footer className="flex flex-col gap-3 border-t p-4">
                                {/* summary: real charged total + saving; falls back to the plain list total on preview error */}
                                <AsyncContent
                                    isLoading={previewLoading}
                                    skeleton={
                                        <div className="flex items-center justify-between gap-3">
                                            <Skeleton className="h-5 w-20 rounded-lg" />
                                            <Skeleton className="h-7 w-32 rounded-lg" />
                                        </div>
                                    }
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <Typography type="body" weight="semibold">
                                                {t("cart.total")}
                                            </Typography>
                                            {preview ? (
                                                <PriceTag
                                                    discounted={preview.totalChargedVnd}
                                                    original={preview.totalListVnd}
                                                    currency="VND"
                                                    size="md"
                                                    className="justify-end"
                                                />
                                            ) : null}
                                        </div>
                                        {preview && preview.savingsVnd > 0 ? (
                                            <Typography type="body-sm" className="text-success">
                                                {t("cart.savings", { amount: formatVnd(preview.savingsVnd) })}
                                            </Typography>
                                        ) : null}
                                        {cheapestMonthlyVnd != null ? (
                                            <Typography type="body-xs" color="muted">
                                                {t("cart.installmentHint", { amount: formatVnd(cheapestMonthlyVnd) })}
                                            </Typography>
                                        ) : null}
                                    </div>
                                </AsyncContent>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    isDisabled={isMutating}
                                    onPress={onCheckout}
                                >
                                    {t("cart.checkout")}
                                    <ArrowRightIcon className="size-5" />
                                </Button>
                                <Button variant="tertiary" fullWidth onPress={onViewFullCart}>
                                    {t("cart.viewFullCart")}
                                </Button>
                            </Drawer.Footer>
                        ) : null}
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
