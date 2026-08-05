"use client"

import React, { useCallback, useEffect, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/features/cart/hooks/useCart"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCoursesCheckoutPreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesCheckoutPreviewSwr"
import { PaymentFlow } from "@/modules/types/payment"
import { pathConfig } from "@/resources/path"
import { _CartView, formatVnd } from "./component"

/**
 * Shopping-cart page: reviews the chosen courses and starts a multi-course
 * checkout — the CONNECTED half. Reads {@link useCart} directly (revalidates on
 * mount, e.g. on return from a gateway) plus the `coursesCheckoutPreview` query
 * (keyed on the current cart's course ids, revalidates whenever the cart
 * changes), computes both `isSkeleton` flags from the first-load formula,
 * resolves every label (incl. interpolation), and hands them to the
 * presentational {@link _CartView}. See `tiers/split.md`.
 *
 * Every amount from the preview is display-ready — it is passed straight
 * through to {@link import("./component")._CartView}, which forwards it into
 * `PriceTag`.
 */
export const CartView = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { open: openPayment } = usePaymentOverlayState()
    const { items, isLoading, error, isMutating, removeFromCart, clearCart, refresh } = useCart()

    const courseIds = useMemo(() => items.map((item) => item.courseId), [items])
    const previewSwr = useQueryCoursesCheckoutPreviewSwr(courseIds)
    const preview = previewSwr.data
    // the preview + the cart list load off separate keys; only shimmer the summary
    // once the cart itself has resolved and the preview is still pending.
    const isPreviewSkeleton = items.length > 0 && !preview && !previewSwr.error

    // revalidate on mount — on return from the gateway the backend has already
    // enrolled the courses + emptied the cart, so the list must refresh.
    useEffect(() => { refresh() }, [refresh])

    // cheapest installment cycle (lowest monthlyAmountVnd, usually the longest
    // term) — surfaces that installment plans EXIST before the buyer commits to
    // checkout; full term picker lives in PaymentModal once they proceed.
    const cheapestMonthlyVnd = preview?.installmentOptions.length
        ? Math.min(...preview.installmentOptions.map((option) => option.monthlyAmountVnd))
        : null

    const onCheckout = useCallback(
        () => {
            if (items.length === 0) {
                return
            }
            openPayment({
                flow: PaymentFlow.CoursesCheckout,
                courseIds,
                lines: items.map((item) => ({
                    courseId: item.courseId,
                    title: item.course.title,
                    coverImageUrl: item.course.coverImageUrl,
                })),
            })
        },
        [openPayment, items, courseIds],
    )

    const onBrowseCourses = useCallback(
        () => router.push(pathConfig().locale(locale).course().build()),
        [router, locale],
    )

    return (
        <_CartView
            items={items}
            previewLines={preview?.lines ?? []}
            totalChargedVnd={preview?.totalChargedVnd}
            totalListVnd={preview?.totalListVnd}
            isMutating={isMutating}
            isSkeleton={isLoading}
            isEmpty={items.length === 0}
            error={error}
            isPreviewSkeleton={isPreviewSkeleton}
            onRetry={refresh}
            onRemove={removeFromCart}
            onCheckout={onCheckout}
            onClearCart={() => { void clearCart() }}
            onBrowseCourses={onBrowseCourses}
            labels={{
                title: t("cart.title"),
                description: t("cart.description"),
                empty: t("cart.empty"),
                emptyHint: t("cart.emptyHint"),
                browseCourses: t("cart.browseCourses"),
                error: t("cart.error"),
                retry: t("cart.retry"),
                total: t("cart.total"),
                checkoutCount: t("cart.checkoutCount", { count: items.length }),
                clear: t("cart.clear"),
                clearConfirm: t("cart.clearConfirm"),
                savings: preview && preview.savingsVnd > 0
                    ? t("cart.savings", { amount: formatVnd(preview.savingsVnd) })
                    : undefined,
                bundleBonus: preview && preview.savingsVnd > 0 && preview.bundleBonusPercent > 0
                    ? t("cart.bundleBonus", { percent: preview.bundleBonusPercent })
                    : undefined,
                installmentHint: cheapestMonthlyVnd != null
                    ? t("cart.installmentHint", { amount: formatVnd(cheapestMonthlyVnd) })
                    : undefined,
                addMoreHint: preview?.itemCount === 1
                    ? t("cart.addMoreHint2")
                    : preview?.itemCount === 2
                        ? t("cart.addMoreHint3")
                        : undefined,
            }}
        />
    )
}
