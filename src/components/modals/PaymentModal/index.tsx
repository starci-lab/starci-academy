"use client"
import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import useMeasure from "react-use-measure"
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

export const PaymentModal = () => {
    const { isOpen, onOpenChange } = usePaymentDisclosure()
    const tab = useAppSelector((state) => state.tabs.tab)
    const [contentRef, bounds] = useMeasure()
    const [height, setHeight] = useState(0)
    const swr = useMutateCourseEnrollSwr()
    const course = useAppSelector((state) => state.course.course)

    useEffect(() => {
        if (bounds.height > 0) {
            setHeight(bounds.height)
        }
    }, [bounds.height, tab])

    useEffect(() => {
        if (!isOpen) {
            const timeout = setTimeout(() => {
                setHeight(0)
            }, 300)
    
            return () => clearTimeout(timeout)
        }
    }, [isOpen])

    const paymentData = useMemo(() => {
        return {
            paymentMethods: [
                {
                    id: "payos",
                    type: PaymentType.PayOS,
                    name: "PayOS",
                    description: "Pay with PayOS",
                    iconUrl: assetConfig().icon().payment().payos,
                    disabled: false,
                },
                {
                    id: "sepay",
                    type: PaymentType.Sepay,
                    name: "Sepay",
                    description: "Pay with Sepay",
                    iconUrl: assetConfig().icon().payment().sepay,
                    disabled: true,
                },
            ],
        }
    }, [])

    return (
        <StarCiModal
            isOpen={isOpen}
            size="xs"
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
        >
            <StarCiModalContent>
                <motion.div
                    animate={{ height }}
                    initial={false}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                    style={{ overflow: "hidden" }}
                >
                    <div ref={contentRef}>
                        <StarCiModalHeader
                            title="Choose Payment Method"
                            description="Choose a payment method to continue"
                        />
                        <StarCiModalBody>
                            <div className="flex flex-col rounded-medium overflow-hidden">
                                {
                                    paymentData.paymentMethods.map((paymentMethod, index) => (
                                        <>
                                            <StarCiCard 
                                                key={paymentMethod.id} 
                                                shadow="none" 
                                                radius="none" 
                                                isPressable={!paymentMethod.disabled} 
                                                className="bg-default/40"
                                                onPress={() => {
                                                    swr.trigger(
                                                        {
                                                            request: {
                                                                courseId: course?.id ?? "",
                                                                paymentType: paymentMethod.type,
                                                            }
                                                        }
                                                    )
                                                }}
                                            >
                                                <StarCiCardBody>
                                                    <div className="grid grid-cols-3 gap-4 items-center">
                                                        <StarCiImage src={paymentMethod.iconUrl} alt={paymentMethod.name} className="w-full col-span-1" />
                                                        <div className="flex flex-col gap-1 col-span-2">
                                                            <div className="flex items-center gap-2">
                                                                {swr.isMutating && (
                                                                    <StarCiSpinner className="w-5 h-5" />
                                                                )}
                                                                <div className="text-sm">{paymentMethod.name}</div>
                                                                {paymentMethod.disabled && (
                                                                    <StarCiChip color="danger" variant="flat" size="sm" className="text-xs">
                                                                        Disabled
                                                                    </StarCiChip>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-foreground-500">{paymentMethod.description}</div>
                                                        </div>
                                                    </div>
                                                </StarCiCardBody>
                                            </StarCiCard>
                                            {index !== paymentData.paymentMethods.length - 1 && <StarCiDivider />}
                                        </>
                                    ))
                                }
                            </div>
                        </StarCiModalBody>
                    </div>
                </motion.div>
            </StarCiModalContent>
        </StarCiModal>
    )
}