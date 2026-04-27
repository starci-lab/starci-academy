"use client"

import React, { useMemo, useState } from "react"
import { Card, Chip, Modal, Separator, Spinner } from "@heroui/react"
import { useMutateCourseEnrollSwr, usePaymentOverlayState } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { PaymentType } from "@/modules/types"
import { assetConfig } from "@/resources"
import { runGraphQLWithToast } from "@/modules/toast"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { AppModalHeader } from "../AppModalHeader"

export const PaymentModal = () => {
    const { isOpen, onOpenChange } = usePaymentOverlayState()
    const swr = useMutateCourseEnrollSwr()
    const course = useAppSelector((state) => state.course.entity)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentType | null>(null)
    const router = useRouter()
    const t = useTranslations()

    const paymentData = useMemo(() => {
        return {
            paymentMethods: [
                {
                    id: "payos",
                    type: PaymentType.PayOS,
                    name: "PayOS",
                    description: t("payment.payos.desc"),
                    iconUrl: assetConfig().icon().payment().payos,
                    disabled: false,
                },
                {
                    id: "sepay",
                    type: PaymentType.Sepay,
                    name: "Sepay",
                    description: t("payment.sepay.desc"),
                    iconUrl: assetConfig().icon().payment().sepay,
                    disabled: true,
                },
            ],
        }
    }, [t])

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="xs">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <AppModalHeader
                            description={t("payment.desc")}
                            title={t("payment.title")}
                        />
                        <Modal.Body className="gap-0 p-4">
                            <div className="flex flex-col overflow-hidden rounded-medium">
                                {paymentData.paymentMethods.map((paymentMethod, index) => (
                                    <React.Fragment key={paymentMethod.id}>
                                        <Card
                                            className={
                                                paymentMethod.disabled
                                                    ? "cursor-not-allowed rounded-none bg-default/40 opacity-60 shadow-none"
                                                    : "cursor-pointer rounded-none bg-default/40 shadow-none transition-colors hover:bg-default/55 active:scale-[0.99]"
                                            }
                                            onClick={
                                                paymentMethod.disabled
                                                    ? undefined
                                                    : async () => {
                                                        let checkoutUrl = ""
                                                        setSelectedPaymentMethod(paymentMethod.type)
                                                        const success = await runGraphQLWithToast(
                                                            async () => {
                                                                const response = await swr.trigger(
                                                                    {
                                                                        courseId: course?.id ?? "",
                                                                        paymentType: paymentMethod.type,
                                                                        payosReturnUrl: window.location.href,
                                                                        payosCancelUrl: window.location.href,
                                                                    }
                                                                )
                                                                if (!response.data?.courseEnroll) {
                                                                    throw new Error(response.error?.message)
                                                                }
                                                                checkoutUrl = response.data.courseEnroll.data?.checkoutUrl ?? ""
                                                                return response.data?.courseEnroll
                                                            },
                                                            {
                                                                showSuccessToast: false,
                                                                showErrorToast: true,
                                                            }
                                                        )
                                                        if (success) {
                                                            router.push(checkoutUrl)
                                                        }
                                                    }
                                            }
                                        >
                                            <Card.Content>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <img
                                                        alt={paymentMethod.name}
                                                        className="col-span-1 w-full"
                                                        src={paymentMethod.iconUrl}
                                                    />
                                                    <div className="col-span-2 flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            {swr.isMutating &&
                                                                selectedPaymentMethod === paymentMethod.type && (
                                                                <Spinner size="sm" />
                                                            )}
                                                            <div className="text-sm">{paymentMethod.name}</div>
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
                                                        <div className="text-xs text-foreground-500">
                                                            {paymentMethod.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Content>
                                        </Card>
                                        {index !== paymentData.paymentMethods.length - 1 ? <Separator /> : null}
                                    </React.Fragment>
                                ))}
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
