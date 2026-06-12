"use client"

import { Lock as LockKeyIcon, ShoppingCart as ShoppingCartSimpleIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
} from "react"
import {
    Button,
    Modal,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    usePaymentOverlayState,
    usePremiumGateOverlayState,
} from "@/hooks"
import {
    PaymentFlow,
} from "@/modules/types"

/**
 * Premium-gate modal: register/buy prompt shown when a viewer clicks a locked
 * premium feature (challenge tab, lesson tab, …) on a "trial read" lesson they
 * have not unlocked.
 *
 * Container: owns the premium-gate overlay state; dismissable so the user can
 * keep browsing the teaser. "Buy" closes this modal and opens the shared payment
 * modal (course-enroll flow). Opened via {@link usePremiumGateOverlayState}.
 */
export const PremiumGateModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen, close } = usePremiumGateOverlayState()
    const { open: openPayment } = usePaymentOverlayState()

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

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="flex items-center gap-1.5 pr-8">
                                <LockKeyIcon className="h-5 w-5 text-warning" />
                                <span className="text-lg font-semibold text-foreground">
                                    {t("course.paywall.title")}
                                </span>
                            </div>
                        </Modal.Header>
                        <Modal.Body className="gap-4 p-4">
                            <div className="text-sm text-muted">
                                {t("course.paywall.description")}
                            </div>
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                                onPress={onBuy}
                            >
                                <ShoppingCartSimpleIcon className="h-5 w-5" />
                                {t("course.paywall.buy")}
                            </Button>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
