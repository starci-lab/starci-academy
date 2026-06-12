"use client"

import React, { useMemo, useState } from "react"
import { Card, Chip, cn, Modal, Separator, Spinner } from "@heroui/react"
import {
    useMutateCourseEnrollSwr,
    useMutatePurchaseAiSubscriptionSwr,
    usePaymentOverlayState,
} from "@/hooks"
import { useAppSelector } from "@/redux"
import { PaymentFlow, PaymentType } from "@/modules/types"
import { assetConfig } from "@/resources"
import { runGraphQLWithToast } from "@/modules/toast"
import { submitCheckout } from "@/modules/payment"
import { useTranslations } from "next-intl"

/**
 * Shared payment-method modal for every paid flow.
 *
 * The opener stashes a {@link import("@/modules/types").PaymentContext} via
 * `usePaymentOverlayState().open(context)`; this modal reads that context to
 * decide which SWR mutation to run (course enroll vs AI subscription) when the
 * user picks a method. Methods are grouped into Domestic (PayOS, Sepay) and
 * International (Stripe, PayPal, Crypto) sections. `"use client"` because it
 * reads SWR/redux and redirects to the gateway.
 */
export const PaymentModal = () => {
    // overlay handle + the flow/payload the opener stashed
    const { isOpen, setOpen, context } = usePaymentOverlayState()
    // both purchase mutations live here; the active one is chosen per context
    const courseEnrollSwr = useMutateCourseEnrollSwr()
    const purchaseAiSubscriptionSwr = useMutatePurchaseAiSubscriptionSwr()
    const course = useAppSelector((state) => state.course.entity)
    // which method is mid-checkout, so only its row shows a spinner
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentType | null>(null)
    const t = useTranslations()

    // any mutation in flight disables interaction + drives the row spinner
    const isMutating = courseEnrollSwr.isMutating || purchaseAiSubscriptionSwr.isMutating

    // domestic and international method groups, each rendered as its own section
    const paymentGroups = useMemo(
        () => [
            {
                id: "domestic",
                label: t("payment.group.domestic"),
                methods: [
                    {
                        id: "payos",
                        type: PaymentType.PayOS,
                        name: "PayOS",
                        description: t("payment.payos.desc"),
                        // domestic providers have brand SVGs on disk
                        iconUrl: assetConfig().icon().payment().payos,
                        disabled: false,
                    },
                    {
                        id: "sepay",
                        type: PaymentType.Sepay,
                        name: "Sepay",
                        description: t("payment.sepay.desc"),
                        iconUrl: assetConfig().icon().payment().sepay,
                        disabled: false,
                    },
                ],
            },
            {
                id: "international",
                label: t("payment.group.international"),
                methods: [
                    {
                        id: "stripe",
                        type: PaymentType.Stripe,
                        name: "Stripe",
                        description: t("payment.stripe.desc"),
                        iconUrl: assetConfig().icon().payment().stripe,
                        disabled: false,
                    },
                    {
                        id: "paypal",
                        type: PaymentType.Paypal,
                        name: "PayPal",
                        description: t("payment.paypal.desc"),
                        iconUrl: assetConfig().icon().payment().paypal,
                        disabled: false,
                    },
                    {
                        id: "crypto",
                        type: PaymentType.Crypto,
                        name: "Crypto",
                        description: t("payment.crypto.desc"),
                        iconUrl: assetConfig().icon().payment().crypto,
                        disabled: false,
                    },
                ],
            },
        ],
        [t],
    )

    /**
     * Run the purchase for the active flow with the chosen method, then send
     * the user to the gateway. Returns the resolved checkout payload (or null
     * on failure) so the caller can decide whether to redirect.
     */
    const runCheckout = async (paymentType: PaymentType) => {
        // guard: nothing to do without a flow context (defensive — opener sets it)
        if (!context) {
            return
        }
        let checkoutUrl = ""
        let checkoutFields: string | null | undefined
        // mark the picked method so its row shows the spinner
        setSelectedPaymentMethod(paymentType)
        // create the pending transaction + resolve the checkout URL/fields
        const success = await runGraphQLWithToast(
            async () => {
                // branch on the flow to call the right mutation with its payload
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
                // AI subscription flow — payload carries the tier slug
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
        // redirect to the gateway only when a checkout URL came back
        if (success && checkoutUrl) {
            submitCheckout({ checkoutUrl, checkoutFields })
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="xs">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="flex flex-col items-center">
                                <div className="font-semibold text-lg">{t("payment.title")}</div>
                                <div className="text-xs text-muted">{t("payment.desc")}</div>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex flex-col gap-6">
                                {paymentGroups.map((group) => (
                                    <div key={group.id} className="flex flex-col gap-3">
                                        {/* labeled divider — normal case, not uppercase */}
                                        <div className="flex gap-1.5">
                                            <div className="text-start text-xs text-muted">{group.label}</div>
                                        </div>
                                        <div className="flex flex-col overflow-hidden rounded-3xl border">
                                            {group.methods.map((paymentMethod, index) => (
                                                <React.Fragment key={paymentMethod.id}>
                                                    <Card
                                                        className={
                                                            cn(
                                                                paymentMethod.disabled || isMutating
                                                                    ? "cursor-not-allowed rounded-none opacity-60"
                                                                    : "cursor-pointer rounded-none active:scale-[0.99]"
                                                                , "bg-transparent"
                                                            )
                                                            
                                                        }
                                                        onClick={
                                                            paymentMethod.disabled || isMutating
                                                                ? undefined
                                                                : () => {
                                                                    void runCheckout(paymentMethod.type)
                                                                }
                                                        }
                                                    >
                                                        <Card.Content>
                                                            <div className="grid grid-cols-3 items-center gap-4">
                                                                {/* brand SVG logo (public/icons/payment) — fixed height, auto width, no distortion */}
                                                                <img
                                                                    alt={paymentMethod.name}
                                                                    className="col-span-1 h-8 w-auto max-w-full object-contain object-left"
                                                                    src={paymentMethod.iconUrl}
                                                                />
                                                                <div className="col-span-2 flex flex-col gap-1">
                                                                    <div className="flex items-center gap-1.5">
                                                                        {isMutating &&
                                                                            selectedPaymentMethod === paymentMethod.type && (
                                                                            <Spinner size="sm" />
                                                                        )}
                                                                        <div className="text-sm text-foreground">{paymentMethod.name}</div>
                                                                        {paymentMethod.disabled && (
                                                                            <Chip
                                                                                className="text-xs"
                                                                                color="danger"
                                                                                size="sm"
                                                                                variant="soft"
                                                                            >
                                                                                <Chip.Label>{t("common.disabled")}</Chip.Label>
                                                                            </Chip>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-muted">
                                                                        {paymentMethod.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card.Content>
                                                    </Card>
                                                    {index !== group.methods.length - 1 ? <Separator /> : null}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
