"use client"

import React, { useMemo, useState } from "react"
import { Chip, Modal, Spinner, Typography, cn } from "@heroui/react"
import useSWR from "swr"
import { ArrowRightIcon, FlameIcon, GraduationCapIcon, LockSimpleIcon } from "@phosphor-icons/react"
import {
    useMutateCourseEnrollSwr,
    useMutatePurchaseAiSubscriptionSwr,
    useMutatePurchaseMembershipSwr,
    usePaymentOverlayState,
    useQueryCoursePricePreviewSwr,
} from "@/hooks"
import { useAppSelector } from "@/redux"
import { PaymentFlow, PaymentType } from "@/modules/types"
import { assetConfig } from "@/resources"
import { useGraphQLWithToast } from "@/modules/toast"
import { submitCheckout } from "@/modules/payment"
import { queryAiSubscriptionTiers } from "@/modules/api"
import type { DiscountReason } from "@/modules/api"
import { AsyncContent, PressableCard } from "@/components/blocks"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Format an integer VND amount as "1.275.000₫". */
const formatVnd = (amount: number): string => `${amount.toLocaleString("vi-VN")}₫`

/** Format a USD amount as "$3.99". */
const formatUsd = (amount: number): string =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

/** The unified order shown in the summary, derived per flow. */
interface PaymentOrder {
    /** Product name (course title / AI tier / membership). */
    name: string
    /** Discounted VND price (what domestic gateways charge); undefined while loading. */
    priceVnd?: number
    /** Original VND price (struck through when a discount applies). */
    originalVnd?: number
    /** Discounted USD price for international gateways; null when not available. */
    priceUsd?: number | null
    /** Loyalty discount percent (0 when none — course flow only). */
    discountPercent: number
    /** Why the discount applies (course flow only). */
    discountReason: DiscountReason
    /** Courses the viewer already owns (feeds the discount copy). */
    enrolledCount: number
}

/**
 * Shared payment modal for every paid flow (course enroll · membership · AI subscription).
 *
 * Summary-first: shows WHAT the buyer gets + HOW MUCH (with the loyalty discount surfaced)
 * BEFORE the gateway choice, then groups methods into Domestic (VND) and International (USD)
 * — the latter locked when the product has no USD price — with a trust line beneath. The
 * opener stashes a {@link import("@/modules/types").PaymentContext}; this modal reads it to
 * decide which price to preview and which mutation to run on pick.
 */
export const PaymentModal = ({ className }: WithClassNames<undefined>) => {
    const { isOpen, setOpen, context } = usePaymentOverlayState()
    const courseEnrollSwr = useMutateCourseEnrollSwr()
    const purchaseAiSubscriptionSwr = useMutatePurchaseAiSubscriptionSwr()
    const purchaseMembershipSwr = useMutatePurchaseMembershipSwr()
    const course = useAppSelector((state) => state.course.entity)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentType | null>(null)
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()

    const isCourse = context?.flow === PaymentFlow.CourseEnroll
    const isAi = context?.flow === PaymentFlow.AiSubscription
    const isMembership = context?.flow === PaymentFlow.Membership

    // course price preview (original vs loyalty-discounted) — exact checkout pricing
    const coursePriceSwr = useQueryCoursePricePreviewSwr(isCourse ? course?.id ?? null : null)
    // AI tiers fetched modal-locally (the page hook is gated to /profile/ai-subscription)
    const aiTiersSwr = useSWR(
        isAi ? ["PAYMENT_MODAL_AI_TIERS"] : null,
        async () => (await queryAiSubscriptionTiers({})).data?.aiSubscriptionTiers?.data?.tiers ?? [],
    )
    const aiTier = useMemo(
        () => (isAi && context.flow === PaymentFlow.AiSubscription
            ? aiTiersSwr.data?.find((tier) => tier.tier === context.tier)
            : undefined),
        [isAi, context, aiTiersSwr.data],
    )

    // any mutation in flight disables interaction + drives the row spinner
    const isMutating = courseEnrollSwr.isMutating
        || purchaseAiSubscriptionSwr.isMutating
        || purchaseMembershipSwr.isMutating

    // the loading / error state of the price source for the active flow
    const priceLoading = (isCourse && !coursePriceSwr.data && !coursePriceSwr.error)
        || (isAi && !aiTiersSwr.data && !aiTiersSwr.error)
    const priceError = isCourse
        ? coursePriceSwr.error
        : isAi
            ? aiTiersSwr.error
            : undefined

    // unified order summary derived per flow
    const order = useMemo<PaymentOrder | null>(() => {
        if (!context) {
            return null
        }
        if (context.flow === PaymentFlow.CourseEnroll) {
            const price = coursePriceSwr.data
            return {
                name: course?.title ?? "",
                priceVnd: price?.discountedPriceVnd,
                originalVnd: price?.originalPriceVnd,
                priceUsd: price?.discountedPriceUsd ?? null,
                discountPercent: price?.discountPercent ?? 0,
                discountReason: price?.discountReason ?? "none",
                enrolledCount: price?.enrolledCount ?? 0,
            }
        }
        if (context.flow === PaymentFlow.AiSubscription) {
            return {
                name: aiTier?.displayName ?? t("payment.aiPlanName"),
                priceVnd: aiTier?.priceVnd,
                priceUsd: aiTier?.priceUsd ?? null,
                discountPercent: 0,
                discountReason: "none",
                enrolledCount: 0,
            }
        }
        // membership — single product, price from i18n config copy
        return {
            name: t("payment.membershipName"),
            discountPercent: 0,
            discountReason: "none",
            enrolledCount: 0,
            priceUsd: null,
        }
    }, [context, coursePriceSwr.data, aiTier, course?.title, t])

    // whether international (USD) gateways are usable for this order
    const hasUsd = isMembership || (order?.priceUsd != null)

    // method groups, each carrying its currency + whether it needs a USD price
    const paymentGroups = useMemo(
        () => [
            {
                id: "domestic",
                label: t("payment.group.domestic"),
                currency: "VND",
                requiresUsd: false,
                methods: [
                    { type: PaymentType.PayOS, name: "PayOS", description: t("payment.payos.desc"), iconUrl: assetConfig().icon().payment().payos },
                    { type: PaymentType.Sepay, name: "Sepay", description: t("payment.sepay.desc"), iconUrl: assetConfig().icon().payment().sepay },
                ],
            },
            {
                id: "international",
                label: t("payment.group.international"),
                currency: "USD",
                requiresUsd: true,
                methods: [
                    { type: PaymentType.Stripe, name: "Stripe", description: t("payment.stripe.desc"), iconUrl: assetConfig().icon().payment().stripe },
                    { type: PaymentType.Paypal, name: "PayPal", description: t("payment.paypal.desc"), iconUrl: assetConfig().icon().payment().paypal },
                    { type: PaymentType.Crypto, name: "Crypto", description: t("payment.crypto.desc"), iconUrl: assetConfig().icon().payment().crypto },
                ],
            },
        ],
        [t],
    )

    /**
     * Loyalty breakdown rows (course flow) — explains WHY the discount applies, not just the %.
     * Reads the BE `discountReason` + `enrolledCount`: enrolled-count bonus (+5%/owned course)
     * and/or the diligent bonus (streak/points). Renders one row per active reason.
     */
    const loyaltyReasons = (reason: DiscountReason, enrolledCount: number) => {
        const rows: Array<{ key: string, icon: React.ReactNode, label: string }> = []
        if (reason === "enrolledCount" || reason === "both") {
            rows.push({
                key: "enrolled",
                icon: <GraduationCapIcon aria-hidden focusable="false" className="size-4 text-success" />,
                label: t("payment.loyalty.enrolled", { count: enrolledCount }),
            })
        }
        if (reason === "diligent" || reason === "both") {
            rows.push({
                key: "diligent",
                icon: <FlameIcon aria-hidden focusable="false" className="size-4 text-success" />,
                label: t("payment.loyalty.diligent"),
            })
        }
        return rows
    }

    /**
     * Run the purchase for the active flow with the chosen method, then send the user
     * to the gateway (or the Sepay QR page).
     */
    const runCheckout = async (paymentType: PaymentType) => {
        if (!context) {
            return
        }
        let checkoutUrl = ""
        let checkoutFields: string | null | undefined
        setSelectedPaymentMethod(paymentType)
        const success = await runGraphQL(
            async () => {
                if (context.flow === PaymentFlow.CourseEnroll) {
                    const response = await courseEnrollSwr.trigger({
                        courseId: course?.id ?? "",
                        paymentType,
                        payosReturnUrl: window.location.href,
                        payosCancelUrl: window.location.href,
                    })
                    if (!response.data?.courseEnroll) {
                        throw new Error(response.error?.message)
                    }
                    const data = response.data.courseEnroll.data
                    checkoutUrl = data?.checkoutUrl ?? ""
                    checkoutFields = data?.checkoutFields
                    return response.data.courseEnroll
                }
                if (context.flow === PaymentFlow.Membership) {
                    const response = await purchaseMembershipSwr.trigger({
                        paymentType,
                        payosReturnUrl: window.location.href,
                        payosCancelUrl: window.location.href,
                    })
                    if (!response.data?.purchaseMembership) {
                        throw new Error(response.error?.message)
                    }
                    const data = response.data.purchaseMembership.data
                    checkoutUrl = data?.checkoutUrl ?? ""
                    checkoutFields = data?.checkoutFields
                    return response.data.purchaseMembership
                }
                const response = await purchaseAiSubscriptionSwr.trigger({
                    tier: context.tier,
                    paymentType,
                    payosReturnUrl: window.location.href,
                    payosCancelUrl: window.location.href,
                })
                if (!response.data?.purchaseAiSubscription) {
                    throw new Error(response.error?.message)
                }
                const data = response.data.purchaseAiSubscription.data
                checkoutUrl = data?.checkoutUrl ?? ""
                checkoutFields = data?.checkoutFields
                return response.data.purchaseAiSubscription
            },
            {
                showSuccessToast: false,
                showErrorToast: true,
            },
        )
        if (success && checkoutUrl) {
            submitCheckout({ checkoutUrl, checkoutFields })
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="sm">
                    <Modal.Dialog className={cn(className)}>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Typography type="body" weight="semibold">{t("payment.title")}</Typography>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex flex-col gap-6">
                                {/* order summary — what + how much (+ loyalty discount) before the method choice.
                                    Surface-in-surface (a card ON the modal surface) → the INNER surface carries a
                                    real `border border-default` to delineate it, plus a faint white veil for lift
                                    (the --overlay ladder has no step lighter than the dialog). */}
                                <div className="flex flex-col gap-2 rounded-2xl border border-default bg-white/5 px-4 py-3">
                                    <Typography type="body-sm" weight="semibold" truncate title={order?.name}>
                                        {order?.name}
                                    </Typography>
                                    <AsyncContent
                                        isLoading={Boolean(priceLoading)}
                                        skeleton={<div className="h-8 w-32 animate-pulse rounded-xl bg-surface" />}
                                        error={priceError}
                                        errorContent={{ title: t("payment.priceError") }}
                                    >
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            {order?.priceVnd != null ? (
                                                <Typography type="h4" weight="bold">{formatVnd(order.priceVnd)}</Typography>
                                            ) : isMembership ? (
                                                <Typography type="h4" weight="bold">{t("membership.price")}</Typography>
                                            ) : null}
                                            {order && order.discountPercent > 0 && order.originalVnd != null ? (
                                                <Typography type="body-sm" color="muted" className="line-through">
                                                    {formatVnd(order.originalVnd)}
                                                </Typography>
                                            ) : null}
                                            {order && order.discountPercent > 0 ? (
                                                <Chip size="sm" variant="soft" color="success">
                                                    <Chip.Label>{`−${order.discountPercent}%`}</Chip.Label>
                                                </Chip>
                                            ) : null}
                                        </div>
                                    </AsyncContent>
                                    {/* loyalty breakdown — WHY the discount applies (reads discountReason + enrolledCount) */}
                                    {order && order.discountPercent > 0
                                        && loyaltyReasons(order.discountReason, order.enrolledCount).length > 0 ? (
                                            <div className="flex flex-col gap-1 border-t border-white/10 pt-2">
                                                {loyaltyReasons(order.discountReason, order.enrolledCount).map((row) => (
                                                    <div key={row.key} className="flex items-center gap-2">
                                                        {row.icon}
                                                        <Typography type="body-xs" color="muted">{row.label}</Typography>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                </div>

                                {/* method groups: domestic (VND) always; international (USD) only when the
                                    order HAS a USD price — otherwise the whole group is hidden (no dead, locked
                                    rows). One currency per group; the row arrow signals an off-site redirect. */}
                                {paymentGroups
                                    .filter((group) => !(group.requiresUsd && !hasUsd))
                                    .map((group) => (
                                        <div key={group.id} className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <Typography type="body-xs" color="muted">{group.label}</Typography>
                                                <Typography type="body-xs" color="muted">{group.currency}</Typography>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {group.methods.map((method) => {
                                                    // the amount THIS gateway charges (VND domestic, USD international)
                                                    const amountLabel = group.requiresUsd
                                                        ? (order?.priceUsd != null ? formatUsd(order.priceUsd) : null)
                                                        : (order?.priceVnd != null ? formatVnd(order.priceVnd) : null)
                                                    const rowPending = isMutating && selectedPaymentMethod === method.type
                                                    return (
                                                        <PressableCard
                                                            key={method.type}
                                                            isDisabled={isMutating}
                                                            onPress={() => { void runCheckout(method.type) }}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    alt={method.name}
                                                                    className="h-8 w-12 shrink-0 object-contain object-left"
                                                                    src={method.iconUrl}
                                                                />
                                                                <div className="flex min-w-0 flex-col">
                                                                    <Typography type="body-sm" weight="semibold">{method.name}</Typography>
                                                                    <Typography type="body-xs" color="muted" truncate>{method.description}</Typography>
                                                                </div>
                                                                <div className="ml-auto flex shrink-0 items-center gap-2">
                                                                    {amountLabel ? (
                                                                        <Typography type="body-xs" color="muted">{amountLabel}</Typography>
                                                                    ) : null}
                                                                    {rowPending ? (
                                                                        <Spinner size="sm" />
                                                                    ) : (
                                                                        <ArrowRightIcon aria-hidden focusable="false" className="size-4 text-muted" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </PressableCard>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                {/* trust line — secure-payment reassurance next to the action (Baymard) */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center justify-center gap-2">
                                        <LockSimpleIcon aria-hidden focusable="false" className="size-5 text-muted" />
                                        <Typography type="body-xs" color="muted">{t("payment.secure")}</Typography>
                                    </div>
                                    <Typography type="body-xs" color="muted">{t("payment.noCardStored")}</Typography>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
