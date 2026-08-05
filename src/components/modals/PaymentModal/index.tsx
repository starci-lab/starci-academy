"use client"

import React, { useEffect, useMemo, useState } from "react"
import { toast } from "@/modules/toast/toast"
import useSWR from "swr"
import { CombinedGraphQLErrors } from "@apollo/client"
import { FlameIcon, GraduationCapIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useMutateCourseEnrollSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCourseEnrollSwr"
import { useMutateCoursesCheckoutSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCoursesCheckoutSwr"
import { useMutatePurchaseAiSubscriptionSwr } from "@/hooks/swr/api/graphql/mutations/useMutatePurchaseAiSubscriptionSwr"
import { useMutatePurchaseMembershipSwr } from "@/hooks/swr/api/graphql/mutations/useMutatePurchaseMembershipSwr"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { useQueryCoursesCheckoutPreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesCheckoutPreviewSwr"
import { useQueryMyVouchersSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyVouchersSwr"
import { useAppSelector } from "@/redux/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { PaymentType } from "@/modules/types/enums/payment-type"
import { assetConfig } from "@/resources/assets"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { submitCheckout } from "@/modules/payment/submit-checkout"
import { queryAiSubscriptionTiers } from "@/modules/api/graphql/queries/query-ai-subscription-tiers"
import type { DiscountReason } from "@/modules/api/graphql/queries/types/recommended-courses"
import type { CoursesCheckoutPreviewLine } from "@/modules/api/graphql/queries/types/courses-checkout-preview"
import type { PriceCurrency } from "@/components/starci/blocks/commerce/PriceTag"
import {
    _PaymentModal,
    type PaymentModalCheckoutLine,
    type PaymentModalGatewayGroup,
    type PaymentModalGatewayMethod,
    type PaymentModalLabels,
    type PaymentModalLoyaltyRow,
    type PaymentModalTab,
} from "./component"

/** GraphQL extension code the BE raises when the viewer already has an enrollment (`CourseAlreadyEnrolledError`). */
const COURSE_ALREADY_ENROLLED_CODE = "COURSE_ALREADY_ENROLLED_ERROR"

/**
 * GraphQL extension codes for the BE's typed checkout rejections, raised LOUD
 * before any transaction row is created (`course-enroll.handler.ts`). Each maps
 * to a localized, actionable toast (via {@link TYPED_REJECTION_KEY}) instead of
 * letting the generic error path dump the BE's untranslated English message.
 */
const VOUCHER_NOT_SUPPORTED_CODE = "VOUCHER_NOT_SUPPORTED_FOR_GATEWAY_EXCEPTION"
const INVALID_VOUCHER_CODE = "INVALID_VOUCHER_EXCEPTION"
const INSTALLMENT_CURRENCY_CODE = "INSTALLMENT_CURRENCY_NOT_SUPPORTED_EXCEPTION"

/** Typed-rejection code → i18n key for its localized toast description. */
const TYPED_REJECTION_KEY: Record<string, string> = {
    [VOUCHER_NOT_SUPPORTED_CODE]: "payment.voucher.rejected.notSupported",
    [INVALID_VOUCHER_CODE]: "payment.voucher.rejected.invalid",
    [INSTALLMENT_CURRENCY_CODE]: "payment.voucher.rejected.installmentCurrency",
}

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
 * CONNECTED half: owns the overlay store, every mutation/query the four flows need, and
 * resolves i18n; hands everything to the presentational {@link _PaymentModal}. See
 * `tiers/split.md`.
 *
 * Summary-first: shows WHAT the buyer gets + HOW MUCH (loyalty discount surfaced via
 * `PriceTagProminent` + hover breakdown) BEFORE the gateway choice. A currency toggle
 * (Domestic VND ↔ International USD) drives BOTH the shown price and the gateway list; the
 * USD side appears only when the order has a USD price. The opener stashes a
 * {@link import("@/modules/types").PaymentContext}; this modal reads it to decide which
 * price to preview and which mutation to run on pick.
 */
export const PaymentModal = () => {
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
    // installment plan term chosen — null = pay in full (unchanged default)
    const [installmentMonths, setInstallmentMonths] = useState<number | null>(null)
    // Coin-shop voucher code applied on top of the loyalty discount — null = none.
    // Course-enroll flow only (the multi-course cart has no voucherCode field).
    const [voucherCode, setVoucherCode] = useState<string | null>(null)
    // which panel is showing — always reopens on "summary" (reset alongside
    // installmentMonths below, on a fresh context)
    const [selectedTab, setSelectedTab] = useState<PaymentModalTab>("summary")
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()

    /**
     * Loyalty breakdown rows (course flow) — explains WHY the discount applies, not just the %.
     * Reads the BE `discountReason` + `enrolledCount`: enrolled-count bonus (+5%/owned course)
     * and/or the diligent bonus (streak/points). One row per active reason.
     */
    const loyaltyReasons = (reason: DiscountReason, enrolledCount: number): Array<PaymentModalLoyaltyRow> => {
        const rows: Array<PaymentModalLoyaltyRow> = []
        if (reason === "enrolledCount" || reason === "both") {
            rows.push({
                key: "enrolled",
                icon: GraduationCapIcon,
                label: t("payment.loyalty.enrolled", { count: enrolledCount }),
            })
        }
        if (reason === "diligent" || reason === "both") {
            rows.push({
                key: "diligent",
                icon: FlameIcon,
                label: t("payment.loyalty.diligent"),
            })
        }
        return rows
    }

    const isCourse = context?.flow === PaymentFlow.CourseEnroll
    const isCoursesCheckout = context?.flow === PaymentFlow.CoursesCheckout
    const isAi = context?.flow === PaymentFlow.AiSubscription
    const isMembership = context?.flow === PaymentFlow.Membership

    // course price preview (original vs loyalty-discounted) — exact checkout pricing
    const coursePriceSwr = useQueryCoursePricePreviewSwr(isCourse ? course?.id ?? null : null)
    // the viewer's Coin-shop vouchers — the source for the apply-voucher field
    // (course flow only). Shares the rewards page's SWR cache.
    const vouchersSwr = useQueryMyVouchersSwr()
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

    // installment plan terms for the active course flow (empty for AI/membership)
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
    // reset the term + voucher + panel whenever the order/context changes (a new modal open)
    useEffect(() => {
        setInstallmentMonths(null)
        setVoucherCode(null)
        setSelectedTab("summary")
    }, [context])

    // vouchers the viewer can apply to THIS course: unused, and either global
    // (any course) or scoped to the course being enrolled. Course flow only —
    // the cart checkout has no voucherCode field.
    const applicableVouchers = useMemo(
        () => (isCourse
            ? (vouchersSwr.data ?? []).filter((voucher) =>
                voucher.status === "unused"
                && (voucher.courseId == null || voucher.courseId === course?.id))
            : []),
        [isCourse, vouchersSwr.data, course?.id],
    )
    const selectedVoucher = useMemo(
        () => applicableVouchers.find((voucher) => voucher.code === voucherCode) ?? null,
        [applicableVouchers, voucherCode],
    )
    // a Flat (VND-denominated) voucher can't be applied on a USD gateway (the BE
    // rejects it per the capability matrix) — so, mirroring how an installment
    // term forces VND, selecting one clamps the order to the domestic side.
    const flatVoucherActive = selectedVoucher?.discountType === "flat"

    // whether international (USD) gateways are usable for this order (never while
    // paying in installments or applying a Flat voucher — both are VND-only)
    const hasUsd = (isMembership || (order?.priceUsd != null)) && !installmentActive && !flatVoucherActive
    // the effective currency (clamped to VND when no USD price exists)
    const activeCurrency: PriceCurrency = hasUsd ? currency : "VND"
    const isUsd = activeCurrency === "USD"

    // options for the apply-voucher field: a leading "no voucher" row plus one
    // per applicable voucher, labelled with its code + discount.
    const voucherOptions = useMemo(
        () => [
            { value: "", label: t("payment.voucher.none") },
            ...applicableVouchers.map((voucher) => ({
                value: voucher.code,
                label: `${voucher.code} · ${voucher.discountType === "percent"
                    ? `-${voucher.value}%`
                    : t("payment.voucher.flatOff", { amount: formatVnd(voucher.value) })}`,
            })),
        ],
        [applicableVouchers, t],
    )

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
                            voucherCode: voucherCode ?? undefined,
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
                        if (CombinedGraphQLErrors.is(error)) {
                            const code = String(error.errors[0]?.extensions?.code ?? "")
                            if (code === COURSE_ALREADY_ENROLLED_CODE) {
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
                            // typed modifier rejections (voucher/installment) — swap the
                            // BE's raw English exception message for a localized, actionable
                            // toast instead of letting the generic error path dump it verbatim.
                            const rejectionKey = TYPED_REJECTION_KEY[code]
                            if (rejectionKey) {
                                toast.danger(t("payment.voucher.rejected.title"), {
                                    description: t(rejectionKey),
                                })
                                return { success: false, message: "", error: code }
                            }
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
            // an applied voucher is now reserved by this in-flight checkout — refresh
            // the wallet so its status reflects that (BE: Unused → Reserved).
            if (voucherCode) {
                void vouchersSwr.mutate()
            }
            submitCheckout({ checkoutUrl, checkoutFields })
        }
    }

    const activeGroupSource = isUsd
        ? paymentGroups.find((group) => group.id === "international")
        : paymentGroups.find((group) => group.id === "domestic")

    // summary price in the active currency
    const summaryDiscounted = isUsd ? order?.priceUsd : order?.priceVnd
    const summaryOriginal = isUsd ? order?.originalUsd : order?.originalVnd
    const summaryPhase = isUsd ? order?.phaseUsd : order?.phaseVnd

    // multi-course cart lines, already resolved to display rows — undefined for every single-product flow
    const checkoutLines: Array<PaymentModalCheckoutLine> | undefined =
        isCoursesCheckout && context?.flow === PaymentFlow.CoursesCheckout
            ? context.lines.map((line) => {
                const previewLine = checkoutLineByCourse.get(line.courseId)
                return {
                    key: line.courseId,
                    title: line.title,
                    coverUrl: line.coverImageUrl,
                    discounted: isUsd ? previewLine?.chargedUsd : previewLine?.chargedVnd,
                    original: isUsd ? previewLine?.listUsd : previewLine?.listVnd,
                }
            })
            : undefined

    // amount label shown on every gateway row: the installment's monthly figure while an
    // installment term is active (installments charge only the first cycle, in VND), the
    // order's price in the active currency otherwise.
    const gatewayAmountLabel = installmentActive && selectedInstallment
        ? t("payment.installment.perMonth", { amount: formatVnd(selectedInstallment.monthlyAmountVnd) })
        : isUsd
            ? (order?.priceUsd != null ? formatUsd(order.priceUsd) : undefined)
            : (order?.priceVnd != null ? formatVnd(order.priceVnd) : undefined)

    const activeGroup: PaymentModalGatewayGroup | undefined = activeGroupSource
        ? {
            label: activeGroupSource.label,
            currencyLabel: activeGroupSource.currency,
            methods: activeGroupSource.methods.map((method): PaymentModalGatewayMethod => ({
                type: method.type,
                name: method.name,
                description: method.description,
                iconUrl: method.iconUrl,
                amountLabel: gatewayAmountLabel,
                isPending: isMutating && selectedPaymentMethod === method.type,
            })),
        }
        : undefined

    const labels: PaymentModalLabels = {
        title: t("payment.title"),
        tabsAria: t("payment.tabsAria"),
        tabSummary: t("payment.tabs.summary"),
        tabPayment: t("payment.tabs.payment"),
        continueToPayment: t("payment.continueToPayment"),
        total: t("cart.total"),
        priceError: t("payment.priceError"),
        membershipPrice: t("membership.price"),
        installmentTitle: t("payment.installment.title"),
        payFull: t("payment.installment.payFull"),
        payInstallment: t("payment.installment.payInstallment"),
        installmentMonths: selectedInstallment
            ? t("payment.installment.months", { months: selectedInstallment.months })
            : undefined,
        installmentPerMonth: selectedInstallment
            ? t("payment.installment.perMonth", { amount: formatVnd(selectedInstallment.monthlyAmountVnd) })
            : undefined,
        installmentSummary: selectedInstallment
            ? t("payment.installment.summary", {
                total: formatVnd(selectedInstallment.totalAmountVnd),
                markup: selectedInstallment.markupPercent,
            })
            : undefined,
        voucherTitle: t("payment.voucher.title"),
        voucherNone: t("payment.voucher.none"),
        voucherVndOnlyHint: t("payment.voucher.vndOnlyHint"),
        currencyVnd: t("payment.currency.vnd"),
        currencyUsd: t("payment.currency.usd"),
        secure: t("payment.secure"),
        noCardStored: t("payment.noCardStored"),
    }

    return (
        <_PaymentModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            selectedTab={selectedTab}
            onSelectedTabChange={setSelectedTab}
            orderName={order?.name ?? ""}
            orderCoverUrl={isCourse ? coverImageUrl : undefined}
            checkoutLines={checkoutLines}
            discounted={summaryDiscounted}
            original={summaryOriginal}
            phase={summaryPhase}
            discountPercent={order?.discountPercent ?? 0}
            isMembershipFlow={isMembership}
            loyaltyRows={order && order.discountPercent > 0 ? loyaltyReasons(order.discountReason, order.enrolledCount) : []}
            currency={activeCurrency}
            isSkeleton={Boolean(priceLoading)}
            priceError={Boolean(priceError)}
            installmentAvailable={installmentAvailable}
            installmentActive={installmentActive}
            onInstallmentActiveChange={(active) => setInstallmentMonths(
                // default straight to the 3-month term (shortest — least markup) so
                // switching to "Installment" doesn't force another decision before
                // showing a number; falls back to whatever the BE offered first if
                // 3-month isn't available.
                active
                    ? installmentOptions.find((option) => option.months === 3)?.months ?? installmentOptions[0]?.months ?? null
                    : null,
            )}
            showVoucher={isCourse && applicableVouchers.length > 0}
            voucherOptions={voucherOptions}
            voucherCode={voucherCode}
            onVoucherCodeChange={setVoucherCode}
            flatVoucherActive={flatVoucherActive}
            hasUsd={hasUsd}
            onCurrencyChange={setCurrency}
            activeGroup={activeGroup}
            onSelectMethod={(type) => { void runCheckout(type) }}
            isMutating={isMutating}
            labels={labels}
        />
    )
}
