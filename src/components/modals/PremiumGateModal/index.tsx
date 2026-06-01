"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
    Modal,
} from "@heroui/react"
import {
    LockKeyIcon,
    ShoppingCartSimpleIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useParams,
    useRouter,
} from "next/navigation"
import {
    usePremiumGateOverlayState,
} from "@/hooks/singleton"
import {
    pathConfig,
} from "@/resources"

/**
 * Premium-gate modal: register/buy prompt shown when a viewer clicks a locked
 * premium feature (challenge tab, lesson tab, …) on an "đọc thử" lesson they
 * have not unlocked.
 *
 * Container: owns the premium-gate overlay state; dismissable so the user can
 * keep browsing the teaser. Reads the locale + `courseId` route segment and
 * owns the buy navigation handler. Opened via {@link usePremiumGateOverlayState}.
 */
export const PremiumGateModal = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const params = useParams<{ courseId: string }>()
    const { isOpen, setOpen, close } = usePremiumGateOverlayState()

    /** Go to the course detail page where the user can enroll/buy. */
    const onBuy = useCallback(
        () => {
            close()
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(params.courseId)
                    .build(),
            )
        },
        [close, router, locale, params.courseId],
    )

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="flex items-center gap-2 pr-8">
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
