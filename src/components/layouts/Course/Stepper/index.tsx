import React from "react"
import { Course as CourseType, PricingPhase } from "@/types"
import { motion } from "framer-motion"
import numeral from "numeral"
import { Chip, Divider, Spacer } from "@heroui/react"
import Decimal from "decimal.js"

export interface StepperProps {
    course: CourseType
}
export const Stepper = ({ course }: StepperProps) => {
    const phaseToIndex = (phase: PricingPhase) => {
        switch (phase) {
        case PricingPhase.Pioneer:
            return 0
        case PricingPhase.EarlyBird:
            return 1
        case PricingPhase.Regular:
            return 2
        default:
            return 0
        }
    }
    const currentPhaseIndex = phaseToIndex(course.currentPhase)

    const calculateDiscount = (price: number, originalPrice: number): number => {
        if (price >= originalPrice) return 0
        const discount = new Decimal(originalPrice)
            .minus(price)
            .dividedBy(originalPrice)
            .times(100)
        return discount.toNumber()
    }

    return (
        <div className="relative flex items-center justify-between">
    
            {/* Background line */}
            <Divider className="absolute top-6 left-0 right-0 z-0" />

            {/* Progress line */}
            <motion.div
                className="absolute top-6 left-0 h-[2px] bg-primary z-0"
                initial={false}
                animate={{
                    width: `${(currentPhaseIndex / (course.pricing.length - 1)) * 100}%`,
                }}
                transition={{ type: "spring", stiffness: 120 }}
            />

            {course.pricing.map((pricing, index) => {
                const isPast = index < currentPhaseIndex
                const isCurrent = index === currentPhaseIndex
                const discount = calculateDiscount(
                    pricing.price,
                    course.originalPrice
                )

                return (
                    <div
                        key={pricing.phase}
                        className="relative flex flex-col items-center z-10"
                    >
                        <div className="w-12 h-12 flex items-center justify-center">
                            <div className="relative flex items-center justify-center">
                                {isCurrent && (
                                    <motion.div
                                        initial={false}
                                        className="absolute rounded-full border-2 border-primary pointer-events-none"
                                        animate={{
                                            scale: [1, 1.5, 2],
                                            opacity: [0.8, 0.4, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeOut",
                                        }}
                                        style={{
                                            width: 32,
                                            height: 32,
                                        }}
                                    />
                                )}

                                <motion.div
                                    initial={false}
                                    className={`cursor-pointer rounded-full relative z-10 ${
                                        isPast || isCurrent
                                            ? "bg-primary"
                                            : "bg-foreground-500"
                                    }`}
                                    animate={
                                        isCurrent
                                            ? { width: 32, height: 32 }
                                            : { width: 24, height: 24 }
                                    }
                                    transition={
                                        isPast
                                            ? {}
                                            : { type: "spring", stiffness: 300 }
                                    }
                                />
                            </div>
                        </div>

                        <Spacer y={2} />

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                                <div className="text-sm">{pricing.name}</div>
                                {discount > 0 && (
                                    <Chip size="sm" color="primary" variant="flat">
                                        {discount.toFixed(1)}%
                                    </Chip>
                                )}
                            </div>
                            
                            <Spacer y={2} />
                            
                            <div className="text-foreground-500 text-xs">
                                {numeral(pricing.price).format("0,0")} VND
                            </div>

                            <Spacer y={2} />

                            {pricing.slotAvailable !== Infinity ? (
                                <div className="text-foreground-500 text-xs">
                                    {`${pricing.slotSold}/${pricing.slotAvailable} đã đăng ký`}
                                </div>
                            ) : (
                                <div className="h-4" />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}