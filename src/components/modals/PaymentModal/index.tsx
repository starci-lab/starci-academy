"use client"

import React, { useMemo, useState } from "react"
import {
    StarCiModal,
    StarCiModalContent,
    StarCiModalHeader,
    StarCiImage,
    StarCiCardBody,
    StarCiCard,
    StarCiModalBody,
    StarCiDivider,
    StarCiChip,
    StarCiSpinner,
} from "../../atomic"
import { useMutateCourseEnrollSwr, usePaymentDisclosure } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { PaymentType } from "@/modules/types"
import { assetConfig } from "@/resources"
import { runGraphQLWithToast } from "@/modules/toast"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"


export const PaymentModal = () => {
    const { isOpen, onOpenChange } = usePaymentDisclosure()
    const swr = useMutateCourseEnrollSwr()
    const course = useAppSelector((state) => state.course.course)
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
        <StarCiModal
            isOpen={isOpen}
            size="xs"
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
        >
            <StarCiModalContent>
                <StarCiModalHeader
                    title={t("payment.title")}
                    description={t("payment.desc")}
                />
                <StarCiModalBody>
                    <div className="flex flex-col rounded-medium overflow-hidden">
                        {paymentData.paymentMethods.map((paymentMethod, index) => (
                            <React.Fragment key={paymentMethod.id}>
                                <StarCiCard
                                    shadow="none"
                                    radius="none"
                                    isPressable={!paymentMethod.disabled}
                                    className="bg-default/40"
                                    onPress={
                                        async () => {
                                            let checkoutUrl = ""
                                            setSelectedPaymentMethod(paymentMethod.type)
                                            const success = await runGraphQLWithToast(
                                                async () => {
                                                    const response = await swr.trigger(
                                                        {
                                                            request: {
                                                                courseId: course?.id ?? "",
                                                                paymentType: paymentMethod.type,
                                                                payosReturnUrl: window.location.href,
                                                                payosCancelUrl: window.location.href,
                                                            },
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
                                    <StarCiCardBody>
                                        <div className="grid grid-cols-3 gap-4 items-center">
                                            <StarCiImage
                                                src={paymentMethod.iconUrl}
                                                alt={paymentMethod.name}
                                                className="w-full col-span-1"
                                            />
                                            <div className="flex flex-col gap-1 col-span-2">
                                                <div className="flex items-center gap-2">
                                                    {swr.isMutating &&
                                                        selectedPaymentMethod === paymentMethod.type && (
                                                        <StarCiSpinner size="sm" />
                                                    )}
                                                    <div className="text-sm">{paymentMethod.name}</div>
                                                    {paymentMethod.disabled && (
                                                        <StarCiChip
                                                            color="danger"
                                                            variant="flat"
                                                            size="sm"
                                                            className="text-xs"
                                                        >
                                                            {t("common.disabled")}
                                                        </StarCiChip>
                                                    )}
                                                </div>
                                                <div className="text-xs text-foreground-500">
                                                    {paymentMethod.description}
                                                </div>
                                            </div>
                                        </div>
                                    </StarCiCardBody>
                                </StarCiCard>
                                {index !== paymentData.paymentMethods.length - 1 && <StarCiDivider />}
                            </React.Fragment>
                        ))}
                    </div>
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}
