"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Button, Label, Modal, Spinner, Tabs, Typography, cn } from "@heroui/react"
import { toast } from "@/modules/toast/toast"
import useSWR from "swr"
import { CombinedGraphQLErrors } from "@apollo/client"
import { ArrowRightIcon, FlameIcon, GraduationCapIcon, LockIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { pathConfig } from "@/resources/path"
import { useMutateCourseEnrollSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCourseEnrollSwr"
import { useMutateCoursesCheckoutSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCoursesCheckoutSwr"
import { useMutatePurchaseAiSubscriptionSwr } from "@/hooks/swr/api/graphql/mutations/useMutatePurchaseAiSubscriptionSwr"
import { useMutatePurchaseMembershipSwr } from "@/hooks/swr/api/graphql/mutations/useMutatePurchaseMembershipSwr"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { useQueryCoursesCheckoutPreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesCheckoutPreviewSwr"
import { useAppSelector } from "@/redux/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { PaymentType } from "@/modules/types/enums/payment-type"
import { assetConfig } from "@/resources/assets"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { submitCheckout } from "@/modules/payment/submit-checkout"
import { queryAiSubscriptionTiers } from "@/modules/api/graphql/queries/query-ai-subscription-tiers"
import type { DiscountReason } from "@/modules/api/graphql/queries/types/recommended-courses"
import type { CoursesCheckoutPreviewLine } from "@/modules/api/graphql/queries/types/courses-checkout-preview"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import type { PriceCurrency } from "@/components/blocks/commerce/PriceTag"

/** GraphQL extension code the BE raises when the viewer already has an enrollment (`CourseAlreadyEnrolledError`). */
const COURSE_ALREADY_ENROLLED_CODE = "COURSE_ALREADY_ENROLLED_ERROR"

/** Format an integer VND amount as "1.275.000₫". */
const formatVnd = (amount: number): string => `${amount.toLocaleString("vi-VN")}₫`

/** Format a USD amount as "$3.99". */
const formatUsd = (amount: number): string =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

/** Which of the modal's two panels is showing (mirrors {@link AiQuotaTabBar}'s
 *  raw-HeroUI-`Tabs` pattern) — "summary" = order + loyalty, "payment" =
 *  installment/currency/gateway list. Freely switchable, not a linear wizard. */
type PaymentModalTab = "summary" | "payment"

/** The unified order shown in the summary, derived per flow. */
interface PaymentOrder {
    /** Product name (course title / AI tier / membership). */
    name: string
    /** Discounted VND price (what domestic gateways charge); undefined while loading. */
    priceVnd?: number
    /** Original (list) VND price (struck through when a discount applies). */
    originalVnd?: number
    /** Active-phase VND price before loyalty (breakdown middle step). */
    phaseVnd?: number
    /** Discounted USD price for international gateways; null when not available. */
    priceUsd?: number | null
    /** Original (list) USD price. */
    originalUsd?: number | null
    /** Active-phase USD price before loyalty. */
    phaseUsd?: number | null
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
 * Summary-first: shows WHAT the buyer gets + HOW MUCH (loyalty discount surfaced via the
 * shared {@link PriceTag} + hover breakdown) BEFORE the gateway choice. A currency toggle
 * (Domestic VND ↔ International USD) drives BOTH the shown price and the gateway list; the
 * USD side appears only when the order has a USD price. The opener stashes a
 * {@link import("@/modules/types").PaymentContext}; this modal reads it to decide which
 * price to preview and which mutation to run on pick.
 */
export const PaymentModal = ({ className }: WithClassNames<undefined>) => {
    const { isOpen, setOpen, context } = usePaymentOverlayState()
    const courseEnrollSwr = useMutateCourseEnrollSwr()
    const coursesCheckoutSwr = useMutateCoursesCheckoutSwr()
    const purchaseAiSubscriptionSwr = useMutatePurchaseAiSubscriptionSwr()
    const purchaseMembershipSwr = useMutatePurchaseMembershipSwr()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const coverImageUrl = useAppSelector((state) => state.course.entity?.coverImageUrl)
    const locale = useLocale()
    const router = useRouter()
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentType | null>(null)
    // chosen currency / region (drives summary price + gateway list)
    const [currency, setCurrency] = useState<PriceCurrency>("VND")
    // installment (trả góp) term chosen — null = pay in full (unchanged default)
    const [installmentMonths, setInstallmentMonths] = useState<number | null>(null)
    // which panel is showing — always reopens on "summary" (reset alongside
    // installmentMonths below, on a fresh context)
    const [selectedTab, setSelectedTab] = useState<PaymentModalTab>("summary")
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()

    const isCourse = context?.flow === PaymentFlow.CourseEnroll
    const isCoursesCheckout = context?.flow === PaymentFlow.CoursesCheckout
    const isAi = context?.flow === PaymentFlow.AiSubscription
    const isMembership = context?.flow === PaymentFlow.Membership

    // course price preview (original vs loyalty-discounted) — exact checkout pricing
    const coursePriceSwr = useQueryCoursePricePreviewSwr(isCourse ? course?.id ?? null : null)
    // multi-course checkout preview (per-course + summed charged/list, bundle bonus).
    // Keyed on the context's course ids → shares the cart page's SWR cache.
    const checkoutCourseIds = useMemo(
        () => (isCoursesCheckout && context?.flow === PaymentFlow.CoursesCheckout ? context.courseIds : []),
        [isCoursesCheckout, context],
    )
    const checkoutPreviewSwr = useQueryCoursesCheckoutPreviewSwr(checkoutCourseIds)
    const checkoutPreview = checkoutPreviewSwr.data
    // courseId → preview line, for per-course prices in the multi-course summary
    const checkoutLineByCourse = useMemo(() => {
        const map = new Map<string, CoursesCheckoutPreviewLine>()
        checkoutPreview?.lines.forEach((line) => map.set(line.courseId, line))
        return map
    }, [checkoutPreview])
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
        || coursesCheckoutSwr.isMutating
        || purchaseAiSubscriptionSwr.isMutating
        || purchaseMembershipSwr.isMutating

    // the loading / error state of the price source for the active flow
    const priceLoading = (isCourse && !coursePriceSwr.data && !coursePriceSwr.error)
        || (isCoursesCheckout && !checkoutPreview && !checkoutPreviewSwr.error)
        || (isAi && !aiTiersSwr.data && !aiTiersSwr.error)
    const priceError = isCourse
        ? coursePriceSwr.error
        : isCoursesCheckout
            ? checkoutPreviewSwr.error
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
                phaseVnd: price?.phasePriceVnd,
                priceUsd: price?.discountedPriceUsd ?? null,
                originalUsd: price?.originalPriceUsd ?? null,
                phaseUsd: price?.phasePriceUsd ?? null,
                discountPercent: price?.discountPercent ?? 0,
                discountReason: price?.discountReason ?? "none",
                enrolledCount: price?.enrolledCount ?? 0,
            }
        }
        if (context.flow === PaymentFlow.CoursesCheckout) {
            // multi-course cart: totals from the checkout preview (real charged vs
            // list, VND always + USD when every line has one). Per-line detail is
            // rendered separately below the summary header.
            return {
                name: t("cart.checkoutCount", { count: context.lines.length }),
                priceVnd: checkoutPreview?.totalChargedVnd,
                originalVnd: checkoutPreview?.totalListVnd,
                priceUsd: checkoutPreview?.totalChargedUsd ?? null,
                originalUsd: checkoutPreview?.totalListUsd ?? null,
                discountPercent: 0,
                discountReason: "none",
                enrolledCount: 0,
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
    }, [context, coursePriceSwr.data, checkoutPreview, aiTier, course?.title, t])

    // installment (trả góp) terms for the active course flow (empty for AI/membership)
    const installmentOptions = isCourse
        ? (coursePriceSwr.data?.installmentOptions ?? [])
        : isCoursesCheckout
            ? (checkoutPreview?.installmentOptions ?? [])
            : []
    const installmentAvailable = installmentOptions.length > 0
    const selectedInstallment = installmentMonths != null
        ? installmentOptions.find((option) => option.months === installmentMonths) ?? null
        : null
    // paying in installments is VND-only (PayOS/Sepay) — force the domestic side
    const installmentActive = selectedInstallment != null
    // reset the term + panel whenever the order/context changes (a new modal open)
    useEffect(() => {
        setInstallmentMonths(null)
        setSelectedTab("summary")
    }, [context])

    // whether international (USD) gateways are usable for this order (never while
    // paying in installments — those cycles can only be collected in VND)
    const hasUsd = (isMembership || (order?.priceUsd != null)) && !installmentActive
    // the effective currency (clamped to VND when no USD price exists)
    const activeCurrency: PriceCurrency = hasUsd ? currency : "VND"
    const isUsd = activeCurrency === "USD"

    // method groups, each carrying its currency
    const paymentGroups = useMemo(
        () => [
            {
                id: "domestic",
                label: t("payment.group.domestic"),
                currency: "VND",
                methods: [
                    { type: PaymentType.PayOS, name: "PayOS", description: t("payment.payos.desc"), iconUrl: assetConfig().icon().payment().payos },
                    { type: PaymentType.Sepay, name: "Sepay", description: t("payment.sepay.desc"), iconUrl: assetConfig().icon().payment().sepay },
                ],
            },
            {
                id: "international",
                label: t("payment.group.international"),
                currency: "USD",
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
                icon: <GraduationCapIcon aria-hidden focusable="false" className="size-3 text-success-soft-foreground" />,
                label: t("payment.loyalty.enrolled", { count: enrolledCount }),
            })
        }
        if (reason === "diligent" || reason === "both") {
            rows.push({
                key: "diligent",
                icon: <FlameIcon aria-hidden focusable="false" className="size-3 text-success-soft-foreground" />,
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
                    try {
                        const response = await courseEnrollSwr.trigger({
                            courseId: course?.id ?? "",
                            paymentType,
                            payosReturnUrl: window.location.href,
                            payosCancelUrl: window.location.href,
                            installmentMonths: installmentMonths ?? undefined,
                        })
                        if (!response.data?.courseEnroll) {
                            throw new Error(response.error?.message)
                        }
                        const data = response.data.courseEnroll.data
                        checkoutUrl = data?.checkoutUrl ?? ""
                        checkoutFields = data?.checkoutFields
                        return response.data.courseEnroll
                    } catch (error) {
                        // already enrolled isn't a system error — swap the raw exception
                        // message for a friendly, expected-state toast (with a shortcut
                        // into the course) instead of letting the generic catch below
                        // dump the BE's English exception message verbatim.
                        if (
                            CombinedGraphQLErrors.is(error)
                            && error.errors[0]?.extensions?.code === COURSE_ALREADY_ENROLLED_CODE
                        ) {
                            toast.warning(t("payment.alreadyEnrolled.title"), {
                                description: t("payment.alreadyEnrolled.description"),
                                actionProps: {
                                    children: t("payment.alreadyEnrolled.action"),
                                    onPress: () => {
                                        setOpen(false)
                                        router.push(
                                            pathConfig().locale(locale).course(courseDisplayId).learn().content().build(),
                                        )
                                    },
                                },
                            })
                            // showSuccessToast is false for this call, so returning a
                            // failed-but-swallowed response shows no further toast and
                            // `checkoutUrl` stays empty (no gateway redirect below).
                            return { success: false, message: "", error: COURSE_ALREADY_ENROLLED_CODE }
                        }
                        throw error
                    }
                }
                if (context.flow === PaymentFlow.CoursesCheckout) {
                    const response = await coursesCheckoutSwr.trigger({
                        courseIds: context.courseIds,
                        paymentType,
                        returnUrl: window.location.href,
                        cancelUrl: window.location.href,
                        installmentMonths: installmentMonths ?? undefined,
                    })
                    if (!response.data?.coursesCheckout) {
                        throw new Error(response.error?.message)
                    }
                    const data = response.data.coursesCheckout.data
                    checkoutUrl = data?.checkoutUrl ?? ""
                    checkoutFields = data?.checkoutFields
                    return response.data.coursesCheckout
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

    const activeGroup = isUsd
        ? paymentGroups.find((group) => group.id === "international")
        : paymentGroups.find((group) => group.id === "domestic")

    // summary price in the active currency
    const summaryDiscounted = isUsd ? order?.priceUsd : order?.priceVnd
    const summaryOriginal = isUsd ? order?.originalUsd : order?.originalVnd
    const summaryPhase = isUsd ? order?.phaseUsd : order?.phaseVnd

    /**
     * One gateway as an INTERACTIVE LIST-CARD row — accordion-surface skin: the parent
     * list owns `bg-surface`/border/radius, each row is a `<button>` with the accordion
     * hover tint (`bg-default`), inset separator (hidden on the last row), focus ring and
     * disabled state. Amount shown in the active currency.
     */
    const renderMethodRow = (
        method: { type: PaymentType, name: string, description: string, iconUrl: string },
    ) => {
        const amountLabel = installmentActive && selectedInstallment
            // installments charge only the first cycle now (VND) — show the monthly figure
            ? t("payment.installment.perMonth", { amount: formatVnd(selectedInstallment.monthlyAmountVnd) })
            : isUsd
                ? (order?.priceUsd != null ? formatUsd(order.priceUsd) : null)
                : (order?.priceVnd != null ? formatVnd(order.priceVnd) : null)
        const rowPending = isMutating && selectedPaymentMethod === method.type
        return (
            <SurfaceListCardRow
                key={method.type}
                leading={(
                    <img
                        alt={method.name}
                        className="h-8 w-12 shrink-0 object-contain object-left"
                        src={method.iconUrl}
                    />
                )}
                title={method.name}
                subtitle={method.description}
                meta={amountLabel ? (
                    <Typography type="body-xs" color="muted">{amountLabel}</Typography>
                ) : undefined}
                trailing={rowPending ? (
                    <Spinner size="sm" />
                ) : (
                    <ArrowRightIcon aria-hidden focusable="false" className="size-5 text-muted" />
                )}
                onPress={() => { void runCheckout(method.type) }}
                isDisabled={isMutating}
            />
        )
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
                        {/* header → tabs = gap-3 (fe/foundations/gap.md's header rule), tighter
                            than the plain header→content gap-6 below — overrides HeroUI's own
                            `.modal__header + .modal__body { mt-2 }` default. */}
                        <Modal.Body className="mt-3!">
                            <div className="flex flex-col">
                                {/* 2 panels (raw HeroUI Tabs, mirrors AiQuotaTabBar) instead of one
                                    long stacked column: "Tóm tắt" (order + loyalty) and "Thanh toán"
                                    (installment/currency/gateways) — freely switchable, not a wizard. */}
                                <Tabs
                                    selectedKey={selectedTab}
                                    onSelectionChange={(key) => setSelectedTab(key as PaymentModalTab)}
                                >
                                    <Tabs.ListContainer>
                                        <Tabs.List aria-label={t("payment.tabsAria")}>
                                            <Tabs.Tab id="summary">
                                                {t("payment.tabs.summary")}
                                                <Tabs.Indicator />
                                            </Tabs.Tab>
                                            <Tabs.Tab id="payment">
                                                {t("payment.tabs.payment")}
                                                <Tabs.Indicator />
                                            </Tabs.Tab>
                                        </Tabs.List>
                                    </Tabs.ListContainer>
                                </Tabs>
                                {/* Tabs (nav) ↔ panel content (content) = 2 different-function zones
                                    → gap-6, not the panel's own internal gap-3 (mirrors AiQuotaModal's
                                    dedicated spacer between AiQuotaTabBar and AiQuotaBody). */}
                                <div className="h-6" />

                                <div className="flex flex-col gap-3">
                                    {selectedTab === "summary" ? (
                                        <>
                                            {/* multi-course cart summary — one row per course (cover + title +
                                    real charged price) + the charged total (from the checkout
                                    preview, in the active currency), on the modal surface. */}
                                            {isCoursesCheckout && context?.flow === PaymentFlow.CoursesCheckout ? (
                                                <AsyncContent
                                                    isLoading={Boolean(priceLoading)}
                                                    skeleton={
                                                        <div className="flex flex-col gap-2">
                                                            {context.lines.map((line) => (
                                                                <div key={line.courseId} className="flex items-center gap-3">
                                                                    <div className="size-12 shrink-0 animate-pulse rounded-xl bg-default" />
                                                                    <div className="h-4 min-w-0 flex-1 animate-pulse rounded-lg bg-default" />
                                                                    <div className="h-5 w-20 shrink-0 animate-pulse rounded-lg bg-default" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                    error={priceError}
                                                    errorContent={{ title: t("payment.priceError") }}
                                                >
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex flex-col gap-2">
                                                            {context.lines.map((line) => {
                                                                const previewLine = checkoutLineByCourse.get(line.courseId)
                                                                const lineDiscounted = isUsd ? previewLine?.chargedUsd : previewLine?.chargedVnd
                                                                const lineOriginal = isUsd ? previewLine?.listUsd : previewLine?.listVnd
                                                                return (
                                                                    <div key={line.courseId} className="flex items-center gap-3">
                                                                        <IconTile
                                                                            size="sm"
                                                                            tone="accent"
                                                                            icon={<GraduationCapIcon />}
                                                                            src={line.coverImageUrl ?? undefined}
                                                                            alt={line.title}
                                                                        />
                                                                        <Typography type="body-sm" truncate title={line.title} className="min-w-0 flex-1">
                                                                            {line.title}
                                                                        </Typography>
                                                                        {lineDiscounted != null ? (
                                                                            <PriceTag
                                                                                discounted={lineDiscounted}
                                                                                original={lineOriginal}
                                                                                currency={activeCurrency}
                                                                                size="sm"
                                                                                className="shrink-0"
                                                                            />
                                                                        ) : null}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <div className="flex items-center justify-between gap-3 border-t border-default pt-3">
                                                            <Typography type="body-sm" weight="semibold">{t("cart.total")}</Typography>
                                                            {summaryDiscounted != null ? (
                                                                <PriceTag
                                                                    discounted={summaryDiscounted}
                                                                    original={summaryOriginal}
                                                                    currency={activeCurrency}
                                                                    size="md"
                                                                    className="shrink-0 justify-end"
                                                                />
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </AsyncContent>
                                            ) : (
                                            /* single-item summary — FLAT (no card frame): IconTile + name + price
                                    (PriceTag with hover breakdown) + loyalty breakdown. */
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-3">
                                                        <IconTile
                                                            size="sm"
                                                            tone="accent"
                                                            icon={<GraduationCapIcon />}
                                                            src={isCourse ? coverImageUrl : undefined}
                                                            alt={order?.name ?? ""}
                                                        />
                                                        <div className="flex min-w-0 flex-1 flex-col">
                                                            <Typography type="body-xs" color="muted" truncate title={order?.name}>
                                                                {order?.name}
                                                            </Typography>
                                                            <AsyncContent
                                                                isLoading={Boolean(priceLoading)}
                                                                skeleton={<div className="mt-2 h-6 w-28 animate-pulse rounded-lg bg-default" />}
                                                                error={priceError}
                                                                errorContent={{ title: t("payment.priceError") }}
                                                            >
                                                                {summaryDiscounted != null ? (
                                                                    <PriceTag
                                                                        discounted={summaryDiscounted}
                                                                        original={summaryOriginal}
                                                                        currency={activeCurrency}
                                                                        size="md"
                                                                        breakdown={summaryPhase != null ? {
                                                                            phase: summaryPhase,
                                                                            loyaltyPercent: order?.discountPercent ?? 0,
                                                                        } : undefined}
                                                                    />
                                                                ) : isMembership ? (
                                                                    <Typography type="h4" weight="bold">{t("membership.price")}</Typography>
                                                                ) : null}
                                                            </AsyncContent>
                                                        </div>
                                                    </div>
                                                    {/* loyalty breakdown — WHY the discount applies (discountReason + enrolledCount) */}
                                                    {order && order.discountPercent > 0
                                        && loyaltyReasons(order.discountReason, order.enrolledCount).length > 0 ? (
                                                            <div className="mt-2 flex flex-col gap-2">
                                                                {loyaltyReasons(order.discountReason, order.enrolledCount).map((row) => (
                                                                    <div key={row.key} className="flex items-center gap-2">
                                                                        {row.icon}
                                                                        <Typography type="body-xs" color="muted">{row.label}</Typography>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : null}
                                                </div>
                                            )}

                                            {/* single primary CTA on this panel — advances to "Thanh toán" */}
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                className="w-full gap-2"
                                                onPress={() => setSelectedTab("payment")}
                                            >
                                                {t("payment.continueToPayment")}
                                                <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                            </Button>
                                        </>
                                    ) : null}

                                    {selectedTab === "payment" ? (
                                        <>
                                            {/* installment (trả góp) — pick "pay in full" or a 3/6/12-month plan.
                                    VND-only (choosing a term forces the domestic gateways). Course
                                    flows only, and only when the BE offered terms (positive VND price). */}
                                            {installmentAvailable ? (
                                                <div className="flex flex-col gap-3">
                                                    {/* nhãn nhóm control (fe/components/label.md §1b) — KHÔNG
                                                    Typography muted tay */}
                                                    <Label>{t("payment.installment.title")}</Label>
                                                    {/* 1 SETTING gọn TẠI CHỖ — chọn xong chỉ toggle field state
                                                    (hiện/ẩn 1 info row bên dưới), KHÔNG đổi cả panel/route →
                                                    TabsCard primary (pill), không phải nested Tabs (test đúng theo
                                                    segmented-control.md §Gotcha: "bấm xong có văng sang panel
                                                    khác hẳn không? Không → TabsCard primary size sm"). size="sm" vì
                                                    đây là lựa chọn PHỤ trong panel "Thanh toán" — không chiếm
                                                    hết bề ngang như 1 tính-năng-cấp-trang. */}
                                                    <TabsCard
                                                        variant="primary"
                                                        size="sm"
                                                        leftTabs={{
                                                            selectedKey: installmentActive ? "installment" : "full",
                                                            ariaLabel: t("payment.installment.title"),
                                                            onSelectionChange: (key) => setInstallmentMonths(
                                                            // default straight to the 3-month term (shortest — least
                                                            // markup) so switching to "Trả góp" doesn't force another
                                                            // decision before showing a number; falls back to whatever
                                                            // the BE offered first if 3-month isn't available.
                                                                String(key) === "installment"
                                                                    ? installmentOptions.find((option) => option.months === 3)?.months
                                                                    ?? installmentOptions[0]?.months
                                                                    ?? null
                                                                    : null,
                                                            ),
                                                            items: [
                                                                { key: "full", label: t("payment.installment.payFull") },
                                                                { key: "installment", label: t("payment.installment.payInstallment") },
                                                            ],
                                                        }}
                                                    />
                                                    {/* single fixed term (3 tháng, thầy: "không cho extend thời
                                                    gian") — nothing to CHOOSE among, so a static info row
                                                    replaces the old term picker (`FlexWrapButtonRadio`). */}
                                                    {installmentActive && selectedInstallment ? (
                                                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-default bg-default px-3 py-2">
                                                            <Typography type="body-sm" weight="semibold">
                                                                {t("payment.installment.months", { months: selectedInstallment.months })}
                                                            </Typography>
                                                            <Typography type="body-sm" color="muted">
                                                                {t("payment.installment.perMonth", { amount: formatVnd(selectedInstallment.monthlyAmountVnd) })}
                                                            </Typography>
                                                        </div>
                                                    ) : null}
                                                    {selectedInstallment ? (
                                                        <Typography type="body-xs" color="muted">
                                                            {t("payment.installment.summary", {
                                                                total: formatVnd(selectedInstallment.totalAmountVnd),
                                                                markup: selectedInstallment.markupPercent,
                                                            })}
                                                        </Typography>
                                                    ) : null}
                                                </div>
                                            ) : null}

                                            {/* currency / region toggle — drives the summary price + gateway list.
                                    Only shown when the order HAS a USD price (a real choice exists). */}
                                            {hasUsd ? (
                                                <TabsCard
                                                    variant="primary"
                                                    leftTabs={{
                                                        selectedKey: activeCurrency,
                                                        ariaLabel: t("payment.title"),
                                                        onSelectionChange: (key) => setCurrency(String(key) as PriceCurrency),
                                                        items: [
                                                            { key: "VND", label: t("payment.currency.vnd") },
                                                            { key: "USD", label: t("payment.currency.usd") },
                                                        ],
                                                    }}
                                                />
                                            ) : null}

                                            {/* gateways for the active currency — interactive list card */}
                                            {activeGroup ? (
                                                <LabeledCard
                                                    label={activeGroup.label}
                                                    labelEnd={activeGroup.currency}
                                                    frameless
                                                >
                                                    {/* gateway list = SurfaceListCard bordered + SurfaceListCardRow
                                                        (nested-in-modal); separator = component's 3%-inset per the
                                                        Storybook standard (storybook = source of truth). */}
                                                    <SurfaceListCard bordered>
                                                        {activeGroup.methods.map((method) => renderMethodRow(method))}
                                                    </SurfaceListCard>
                                                </LabeledCard>
                                            ) : null}

                                            {/* trust line — secure-payment reassurance next to the action (Baymard) */}
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex items-center justify-center gap-2">
                                                    <LockIcon aria-hidden focusable="false" className="size-3 text-muted" />
                                                    <Typography type="body-xs" color="muted">{t("payment.secure")}</Typography>
                                                </div>
                                                <Typography type="body-xs" color="muted">{t("payment.noCardStored")}</Typography>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
