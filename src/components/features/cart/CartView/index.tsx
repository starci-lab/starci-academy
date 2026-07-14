"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Button, Chip, Skeleton, Typography } from "@heroui/react"
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { useCart } from "@/components/features/cart/hooks/useCart"
import { CartLine } from "./CartLine"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCoursesCheckoutPreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesCheckoutPreviewSwr"
import { PaymentFlow } from "@/modules/types/payment"
import { pathConfig } from "@/resources/path"
import { publicEnv } from "@/resources/env/public"
import type { CoursesCheckoutPreviewLine } from "@/modules/api/graphql/queries/types/courses-checkout-preview"
import type { CourseEntity } from "@/modules/types/entities/course"

/** Format an integer VND amount as "1.275.000₫". */
const formatVnd = (amount: number): string => `${amount.toLocaleString("vi-VN")}₫`

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
 * "Clear cart" with a lightweight inline 2-step confirm (no modal): first press
 * arms a danger-soft "confirm" state that auto-disarms after 3s; second press
 * within the window actually clears — so a destroy-all action can't fire on one
 * stray click. (canon: destructive action needs confirmation.)
 */
const ClearCartButton = ({ isDisabled, onClear }: { isDisabled: boolean; onClear: () => void }) => {
    const t = useTranslations()
    const [confirming, setConfirming] = useState(false)
    useEffect(() => {
        if (!confirming) return
        const timer = setTimeout(() => setConfirming(false), 3000)
        return () => clearTimeout(timer)
    }, [confirming])
    return (
        <Button
            variant={confirming ? "danger-soft" : "tertiary"}
            fullWidth
            isDisabled={isDisabled}
            onPress={() => {
                if (confirming) {
                    onClear()
                    setConfirming(false)
                } else {
                    setConfirming(true)
                }
            }}
        >
            {confirming ? t("cart.clearConfirm") : t("cart.clear")}
        </Button>
    )
}

/**
 * Shopping-cart page: reviews the chosen courses and starts a multi-course
 * checkout. Header → {@link AsyncContent} (skeleton mirrors the loaded list;
 * empty state offers browsing courses) → cart lines in one {@link SurfaceListCard}
 * → a footer with the REAL discounted total (progressive loyalty + multi-course
 * bundle bonus), the saving, a bundle chip, an "add more to save more" nudge, a
 * primary "Checkout" CTA (opens the payment modal), and a tertiary "Clear cart".
 *
 * Pricing is driven by `coursesCheckoutPreview`, keyed on the current cart's
 * course ids (revalidates whenever the cart changes). Every amount from the
 * preview is display-ready — it is passed straight into {@link PriceTag}. Reads
 * {@link useCart} directly; revalidates on mount (e.g. on return from a gateway).
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
    // the preview + the cart list load off separate keys; only show the summary
    // skeleton once the cart itself has resolved and the preview is still pending.
    const previewLoading = items.length > 0 && !preview && !previewSwr.error

    // revalidate on mount — on return from the gateway the backend has already
    // enrolled the courses + emptied the cart, so the list must refresh.
    useEffect(() => { refresh() }, [refresh])

    // courseId → preview line, for per-line pricing
    const previewByCourse = useMemo(() => {
        const map = new Map<string, CoursesCheckoutPreviewLine>()
        preview?.lines.forEach((line) => map.set(line.courseId, line))
        return map
    }, [preview])

    // cheapest installment cycle (lowest monthlyAmountVnd, usually the longest
    // term) — surfaces that trả góp EXISTS before the buyer commits to checkout;
    // full term picker lives in PaymentModal once they proceed.
    const cheapestMonthlyVnd = preview?.installmentOptions.length
        ? Math.min(...preview.installmentOptions.map((option) => option.monthlyAmountVnd))
        : null

    // plain summed list total from the cart entities — the fallback shown when the
    // preview query errors (so the page still shows a total, minus the discount extras).
    const fallbackTotalVnd = useMemo(
        () => items.reduce((sum, item) => sum + displayPriceVnd(item.course), 0),
        [items],
    )

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
        <div className="mx-auto flex max-w-3xl flex-col gap-10 p-6">
            <PageHeader title={t("cart.title")} description={t("cart.description")} />

            <AsyncContent
                isLoading={isLoading}
                skeleton={
                    <div className="flex flex-col gap-6">
                        <div className="overflow-hidden rounded-3xl bg-surface shadow-surface">
                            {Array.from({ length: 3 }).map((_, index) => (
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
                        <Skeleton className="h-12 w-full rounded-2xl" />
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

                    {/* footer summary: total (real charged) + savings + bundle chip + nudge,
                        then checkout / clear. The preview drives the discount extras; on error
                        it hides them and still shows the plain list total (never blocks the page). */}
                    <div className="flex flex-col gap-3">
                        <AsyncContent
                            isLoading={previewLoading}
                            skeleton={
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <Skeleton className="h-5 w-20 rounded-lg" />
                                        <Skeleton className="h-7 w-32 rounded-lg" />
                                    </div>
                                    <Skeleton className="h-4 w-40 rounded-lg" />
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-2">
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
                                    ) : (
                                        <Typography type="h4" weight="bold">
                                            {formatVnd(fallbackTotalVnd)}
                                        </Typography>
                                    )}
                                </div>

                                {preview && preview.savingsVnd > 0 ? (
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <Typography type="body-sm" className="text-success">
                                            {t("cart.savings", { amount: formatVnd(preview.savingsVnd) })}
                                        </Typography>
                                        {preview.bundleBonusPercent > 0 ? (
                                            <Chip size="sm" className="bg-accent/10 text-accent">
                                                <Chip.Label>
                                                    {t("cart.bundleBonus", { percent: preview.bundleBonusPercent })}
                                                </Chip.Label>
                                            </Chip>
                                        ) : null}
                                    </div>
                                ) : null}

                                {cheapestMonthlyVnd != null ? (
                                    <Typography type="body-xs" color="muted">
                                        {t("cart.installmentHint", { amount: formatVnd(cheapestMonthlyVnd) })}
                                    </Typography>
                                ) : null}

                                {/* quiet nudge — add another course to reach the next bundle tier */}
                                {preview?.itemCount === 1 ? (
                                    <Typography type="body-xs" color="muted">
                                        {t("cart.addMoreHint2")}
                                    </Typography>
                                ) : preview?.itemCount === 2 ? (
                                    <Typography type="body-xs" color="muted">
                                        {t("cart.addMoreHint3")}
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
                            {t("cart.checkoutCount", { count: items.length })}
                            <ArrowRightIcon className="size-5" />
                        </Button>
                        <ClearCartButton
                            isDisabled={isMutating}
                            onClear={() => { void clearCart() }}
                        />
                    </div>
                </div>
            </AsyncContent>
        </div>
    )
}
