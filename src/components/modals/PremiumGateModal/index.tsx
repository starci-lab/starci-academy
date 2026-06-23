"use client"

import { LockIcon, ShoppingCartIcon, CheckCircleIcon } from "@phosphor-icons/react"
import React, {
    useCallback,
} from "react"
import {
    Button,
    Chip,
    Modal,
    Typography,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    usePaymentOverlayState,
    usePremiumGateOverlayState,
    useQueryCoursePricePreviewSwr,
} from "@/hooks"
import { useAppSelector } from "@/redux"
import {
    PaymentFlow,
} from "@/modules/types"
import { AsyncContent } from "@/components/blocks"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Format an integer VND amount as "1.020.000₫". */
const formatVnd = (amount: number): string => `${amount.toLocaleString("vi-VN")}₫`

/**
 * Premium-gate modal: a VALUE-FIRST register/buy prompt shown when a viewer clicks
 * a locked premium feature (challenge tab, lesson tab, …) on a "trial read" lesson
 * they have not unlocked.
 *
 * Sells before it asks: what the purchase unlocks (full content · challenges ·
 * personal project) + the loyalty-aware price (struck original + % off, read from
 * `coursePricePreview` — the SAME price everywhere) anchor the single CTA. Dismissable
 * so the user can keep browsing the teaser. "Buy" closes this modal and opens the
 * shared payment modal (course-enroll flow). Opened via {@link usePremiumGateOverlayState}.
 */
export const PremiumGateModal = ({ className }: WithClassNames<undefined>) => {
    const t = useTranslations()
    const { isOpen, setOpen, close } = usePremiumGateOverlayState()
    const { open: openPayment } = usePaymentOverlayState()
    const course = useAppSelector((state) => state.course.entity)

    // loyalty-aware price preview (same source as PaymentModal) — only while the gate is open
    const priceSwr = useQueryCoursePricePreviewSwr(isOpen ? course?.id ?? null : null)
    const price = priceSwr.data
    const priceLoading = Boolean(course?.id) && !priceSwr.data && !priceSwr.error

    /** Close the gate, then open the shared payment modal in the course-enroll flow. */
    const onBuy = useCallback(
        () => {
            close()
            openPayment({
                flow: PaymentFlow.CourseEnroll,
            })
        },
        [close, openPayment],
    )

    const unlocks = [
        t("course.paywall.unlock.content"),
        t("course.paywall.unlock.challenges"),
        t("course.paywall.unlock.project"),
    ]

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className={cn(className)}>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="flex items-center gap-2 pr-8">
                                <LockIcon aria-hidden focusable="false" className="size-5 text-warning" />
                                <Typography type="body" weight="semibold">
                                    {course?.title
                                        ? t("course.paywall.titleNamed", { course: course.title })
                                        : t("course.paywall.title")}
                                </Typography>
                            </div>
                        </Modal.Header>
                        <Modal.Body className="gap-4">
                            <Typography type="body-sm" color="muted">
                                {t("course.paywall.description")}
                            </Typography>

                            {/* what the purchase unlocks — value before price */}
                            <ul className="flex flex-col gap-2">
                                {unlocks.map((item) => (
                                    <li key={item} className="flex items-center gap-2">
                                        <CheckCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-success" />
                                        <Typography type="body-sm">{item}</Typography>
                                    </li>
                                ))}
                            </ul>

                            {/* loyalty-aware price anchor (struck original + % off) */}
                            <AsyncContent
                                isLoading={priceLoading}
                                skeleton={<div className="h-7 w-32 animate-pulse rounded-xl bg-surface" />}
                                error={priceSwr.error}
                                errorContent={{ title: t("payment.priceError") }}
                            >
                                {price?.discountedPriceVnd != null ? (
                                    <div className="flex flex-wrap items-baseline gap-2 border-t border-default pt-3">
                                        <Typography type="h4" weight="bold">
                                            {formatVnd(price.discountedPriceVnd)}
                                        </Typography>
                                        {price.discountPercent > 0 && price.originalPriceVnd != null ? (
                                            <>
                                                <Typography type="body-sm" color="muted" className="line-through">
                                                    {formatVnd(price.originalPriceVnd)}
                                                </Typography>
                                                <Chip size="sm" variant="soft" color="success">
                                                    <Chip.Label>{t("course.paywall.loyaltyOff", { percent: price.discountPercent })}</Chip.Label>
                                                </Chip>
                                            </>
                                        ) : null}
                                    </div>
                                ) : null}
                            </AsyncContent>

                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                                onPress={onBuy}
                            >
                                <ShoppingCartIcon aria-hidden focusable="false" className="size-5" />
                                {t("course.paywall.buy")}
                            </Button>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
