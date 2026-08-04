"use client"

import React, { useCallback, useEffect, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/features/cart/hooks/useCart"
import { useQueryCoursesCheckoutPreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesCheckoutPreviewSwr"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { useMiniCartOverlayState, usePaymentOverlayState, usePendingCartIntent } from "@/hooks/zustand/overlay/hooks"
import { useAppSelector } from "@/redux/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { pathConfig } from "@/resources/path"
import { publicEnv } from "@/resources/env/public"
import type { CoursesCheckoutPreviewLine } from "@/modules/api/graphql/queries/types/courses-checkout-preview"
import { _MiniCartDrawer } from "./component"

/** Format an integer VND amount as "1.275.000₫". */
const formatVnd = (amount: number): string => `${amount.toLocaleString("vi-VN")}₫`

/** Bundle bonus percent by purchasable course count (mirrors the backend tiers). */
const BUNDLE_TIER: Record<number, number> = { 1: 5, 2: 10 }
/** Course count at which the combo meter reads "full" (max tier reached). */
const BUNDLE_MAX_ITEMS = 3

/**
 * Mini-cart drawer — the CONNECTED half: reads the cart + the real multi-course
 * checkout preview off shared SWR keys, resolves the combo meter/summary
 * evidence, replays a guest's deferred cart intent once they authenticate,
 * resolves every label (incl. interpolation), and hands them to the
 * presentational {@link _MiniCartDrawer}. Also the PRIMARY affordance of the
 * cart UX (the `/cart` page stays as the deep review); opens after any
 * add-to-cart (via {@link useCart}) or when the nav cart button is tapped.
 *
 * Always-mounted (by {@link import("../DrawerContainer").DrawerContainer}) so it
 * can watch the auth flag and run "add + open" / "open" after sign-in. See
 * `tiers/split.md`.
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
    const isPreviewSkeleton = items.length > 0 && !preview && !previewSwr.error

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
    const nextTierPercent = itemCount < BUNDLE_MAX_ITEMS ? BUNDLE_TIER[itemCount] : undefined

    // cheapest installment cycle (lowest monthlyAmountVnd, usually the longest
    // term) — surfaces that installment plans EXIST before the buyer commits to checkout;
    // full term picker lives in PaymentModal once they proceed.
    const cheapestMonthlyVnd = preview?.installmentOptions.length
        ? Math.min(...preview.installmentOptions.map((option) => option.monthlyAmountVnd))
        : null

    // fallback total from entity display price (same math as `useCourseDisplayPrice`,
    // inlined here since it must sum over ALL items, not one course at a time) — used
    // only when the checkout-preview failed to load, so the footer total is never blank.
    const fallbackTotalVnd = useMemo(() => {
        const divisor = publicEnv().pricing.testDivisor
        const toVnd = (amount: number): number => (divisor === 1 ? amount : Math.max(1, Math.round(amount / divisor)))
        return items.reduce((sum, item) => {
            const phasePrice = item.course.pricingPhases?.find(
                (phase) => phase.phase === item.course.currentPhase,
            )?.price
            const rawPrice = phasePrice ?? item.course.originalPrice ?? 0
            return sum + toVnd(rawPrice)
        }, 0)
    }, [items])

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
        <_MiniCartDrawer
            isOpen={isOpen}
            onOpenChange={setOpen}
            isMobile={isMobile}
            isSkeleton={isLoading}
            isEmpty={items.length === 0}
            error={error}
            onRetry={refresh}
            onBrowseCourses={onBrowseCourses}
            items={items}
            previewByCourse={previewByCourse}
            isMutating={isMutating}
            onRemove={removeFromCart}
            itemCount={itemCount}
            bundlePercent={bundlePercent}
            isPreviewSkeleton={isPreviewSkeleton}
            preview={preview ? {
                totalChargedVnd: preview.totalChargedVnd,
                totalListVnd: preview.totalListVnd,
                savingsVnd: preview.savingsVnd,
            } : undefined}
            previewError={Boolean(previewSwr.error)}
            fallbackTotalVnd={fallbackTotalVnd}
            cheapestMonthlyLabel={cheapestMonthlyVnd != null ? formatVnd(cheapestMonthlyVnd) : null}
            onCheckout={onCheckout}
            onViewFullCart={onViewFullCart}
            labels={{
                header: `${t("cart.title")} · ${t("cart.itemsCount", { count })}`,
                emptyTitle: t("cart.empty"),
                emptyDescription: t("cart.emptyHint"),
                browseCourses: t("cart.browseCourses"),
                errorTitle: t("cart.error"),
                retry: t("cart.retry"),
                comboLabel: bundlePercent > 0
                    ? t("cart.comboActive", { percent: bundlePercent })
                    : t("cart.comboStart"),
                bundleBonusChip: t("cart.bundleBonus", { percent: bundlePercent }),
                comboHint: nextTierPercent != null
                    ? t("cart.comboNextHint", { percent: nextTierPercent })
                    : t("cart.comboMaxHint"),
                total: t("cart.total"),
                savings: t("cart.savings", { amount: formatVnd(preview?.savingsVnd ?? 0) }),
                installmentHint: t("cart.installmentHint", { amount: formatVnd(cheapestMonthlyVnd ?? 0) }),
                checkout: t("cart.checkout"),
                viewFullCart: t("cart.viewFullCart"),
            }}
        />
    )
}
