"use client"

import React from "react"
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@heroui/react"
import type {
    PricingPhaseEntity,
} from "@/modules/types"
import {
    PRICING_PHASE_DATA_MAP,
} from "../map"

/** Props for {@link PhaseLabels}. */
export interface PhaseLabelsProps {
    /** Pricing phases ordered for display. */
    pricingPhases: Array<PricingPhaseEntity>
}

/**
 * The phase name row, each label backed by a description tooltip.
 *
 * Presentational: maps phases to their label/description from the lookup map.
 * @param props - the ordered pricing phases
 */
export const PhaseLabels = ({
    pricingPhases,
}: PhaseLabelsProps) => {
    return (
        <div className="relative flex items-center justify-between">
            {pricingPhases.map((pricingPhase: PricingPhaseEntity) => (
                <div key={pricingPhase.id} className="flex-1">
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="text-center text-sm font-medium">
                                {PRICING_PHASE_DATA_MAP[pricingPhase.phase].name}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            {PRICING_PHASE_DATA_MAP[pricingPhase.phase].description}
                        </TooltipContent>
                    </Tooltip>
                </div>
            ))}
        </div>
    )
}
