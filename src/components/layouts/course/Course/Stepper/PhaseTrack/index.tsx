"use client"

import React from "react"
import {
    Separator,
    cn,
} from "@heroui/react"
import {
    motion,
} from "framer-motion"
import type {
    PricingPhaseEntity,
    WithClassNames,
} from "@/modules/types"

/** Props for {@link PhaseTrack}. */
export interface PhaseTrackProps extends WithClassNames<undefined> {
    /** Pricing phases ordered for display. */
    pricingPhases: Array<PricingPhaseEntity>
    /** Pre-computed progress-bar width (CSS percentage value). */
    progressWidth: string
    /** Order index of the currently active phase. */
    currentOrderIndex: number
}

/**
 * The animated phase dots track with the progress fill.
 *
 * Presentational: renders dots/progress from the supplied phases, no logic.
 * @param props - ordered phases, progress width and current order index
 */
export const PhaseTrack = ({
    pricingPhases,
    progressWidth,
    currentOrderIndex,
    className,
}: PhaseTrackProps) => {
    return (
        <div className={cn("relative flex items-center justify-between w-full", className)}>
            <Separator className="absolute top-6 left-0 right-0 z-0" />
            <motion.div
                className="absolute top-6 left-0  z-0 w-full"
                initial={false}
                animate={{
                    width: progressWidth,
                }}
                transition={{ type: "spring", stiffness: 120 }}
            />
            {pricingPhases.map((pricingPhase: PricingPhaseEntity, index: number) => {
                const isPast = index < currentOrderIndex
                const isCurrent = index === currentOrderIndex
                return (
                    <div key={pricingPhase.id} className="flex-1">
                        <div className="relative flex flex-col items-center z-10">
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
            })}
        </div>
    )
}
