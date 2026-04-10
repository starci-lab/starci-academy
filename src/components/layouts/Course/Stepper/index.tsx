"use client"

import React, { useCallback, useMemo } from "react"
import {
    PricingPhase,
    PricingPhaseEntity,
} from "@/modules/types"
import { motion } from "framer-motion"
import numeral from "numeral"
import { Spacer } from "@heroui/react"
import Decimal from "decimal.js"
import { StarCiChip, StarCiDivider, StarCiTooltip } from "@/components/atomic"
import { computePercentage } from "@/modules/utils"
import { useAppSelector } from "@/redux"
import _ from "lodash"

/**
 * The data for a pricing phase.
 */
export interface PricingPhaseData {
    /** The name of the pricing phase. */
    name: string
    /** The description of the pricing phase. */
    description: string
}

/**
 * The Stepper component.
 */
export const Stepper = () => {
    /**
     * The course entity.
     */
    const course = useAppSelector((state) => state.course.entity)
    /**
    * Display price for a tier: `regular` when set; Regular tier falls back to course list price.
    */
    const pricingPhaseDisplayPrice = useCallback(
        (
            pricingPhase: PricingPhaseEntity,
        ): number => {
            if (pricingPhase.price != null) {
                return pricingPhase.price
            }
            if (pricingPhase.phase === PricingPhase.Regular) {
                return course?.originalPrice ?? 0
            }
            return course?.originalPrice ?? 0
        }, []
    )
    /**
     * The pricing phases.
     */
    const pricingPhases = useMemo(() => {
        return _.cloneDeep(course?.pricingPhases ?? []).sort(
            (prev, next) => prev.orderIndex - next.orderIndex)
    }, [course])

    const listPrice = course?.originalPrice ?? 0

    const phaseData: Record<PricingPhase, PricingPhaseData> = React.useMemo(
        () => {
            return {
                [PricingPhase.Pioneer]: { name: "Pioneer", description: "Pioneer" },
                [PricingPhase.EarlyBird]: { name: "Early Bird", description: "Early Bird" },
                [PricingPhase.Regular]: { name: "Regular", description: "Regular" },
            }
        }, [])

    const currentPhase = course?.currentPhase ?? PricingPhase.Pioneer

    /**
     * Calculate the discount for a pricing phase.
     */
    const calculateDiscount = useCallback(
        (tierPrice: number, refPrice: number): number => {
            if (refPrice <= 0 || tierPrice >= refPrice) return 0
            const discount = new Decimal(refPrice)
                .minus(tierPrice)
                .dividedBy(refPrice)
                .times(100)
            return discount.toNumber()
        }, []
    )

    /**
     * The segment count.
     */
    const segmentCount = useMemo(() => {
        return Math.max(1, pricingPhases.length - 1)
    }, [pricingPhases])

    /**
     * The current phase data.
     */
    const currentPhaseData = useMemo(() => {
        return course?.pricingPhases?.find(phase => phase.phase === currentPhase)
    }, [course, currentPhase])

    return (
        <div>
            <div className="relative flex items-center justify-between w-full">
                <StarCiDivider className="absolute top-6 left-0 right-0 z-0" />
                <motion.div
                    className="absolute top-6 left-0  z-0 w-full"
                    initial={false}
                    animate={{
                        width: `${(currentPhaseData?.orderIndex ?? 0 / segmentCount) * 100}%`,
                    }}
                    transition={{ type: "spring", stiffness: 120 }}
                />
                {
                    pricingPhases.map(
                        (pricingPhase: PricingPhaseEntity, index: number) => {
                            const isPast = index < (currentPhaseData?.orderIndex ?? 0)
                            const isCurrent = index === (currentPhaseData?.orderIndex ?? 0)
                            return (
                                <div key={pricingPhase.id} className="flex-1">
                                    <div
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
                                                    className={`cursor-pointer rounded-full relative z-10 ${isPast || isCurrent
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
                                    </div>
                                </div>
                            )
                        }
                    )
                }
            </div>
            <Spacer y={2} />
            <div className="relative flex items-center justify-between">
                {
                    pricingPhases.map(
                        (pricingPhase: PricingPhaseEntity) => {
                            return (
                                <div key={pricingPhase.id} className="flex-1">
                                    <StarCiTooltip content={phaseData[pricingPhase.phase].description}>
                                        <div className="text-center text-sm font-medium">
                                            {phaseData[pricingPhase.phase].name}
                                        </div>
                                    </StarCiTooltip>
                                </div>
                            )
                        }
                    )
                }
            </div>
            <Spacer y={2} />
            <div className="relative flex items-start justify-between">
                {
                    pricingPhases.map(
                        (pricingPhase: PricingPhaseEntity) => {
                            return (
                                <div key={pricingPhase.id} className="flex-1 flex flex-col items-center">
                                    <div className="text-center text-sm font-medium text-foreground-500">
                                        {numeral(pricingPhaseDisplayPrice(pricingPhase)).format("0,0")}
                                    </div>
                                    <Spacer y={1} />
                                    {
                                        pricingPhase.price != null && (
                                            <StarCiChip color="primary" size="sm" variant="flat">
                                                {`Save ${computePercentage(
                                                    {
                                                        numerator: new Decimal(calculateDiscount(pricingPhaseDisplayPrice(pricingPhase), listPrice)),
                                                        denominator: new Decimal(100),
                                                        fractionDigits: 2
                                                    }
                                                ).toNumber()
                                                }%`
                                                }
                                            </StarCiChip>
                                        )
                                    }
                                </div>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}
