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
    /** Order index of the active phase; phases before it are sold out. */
    currentOrderIndex: number
}

/**
 * The phase name row, each label backed by a description tooltip.
 *
 * Presentational: maps phases to their label/description from the lookup map.
 * Phases before the active one are dimmed + struck-through to read as sold out.
 * @param props - the ordered pricing phases + active order index
 */
export const PhaseLabels = ({
    pricingPhases,
    currentOrderIndex,
}: PhaseLabelsProps) => {
    return (
        <div className="relative flex items-center justify-between">
            {pricingPhases.map((pricingPhase: PricingPhaseEntity) => {
                // phases before the active one have filled their slots → sold out
                const soldOut = pricingPhase.orderIndex < currentOrderIndex
                return (
                    <div key={pricingPhase.id} className="flex-1">
                        <Tooltip>
                            <TooltipTrigger>
                                <div
                                    className={`text-center text-sm font-medium${
                                        soldOut ? " line-through text-muted opacity-50" : ""
                                    }`}
                                >
                                    {PRICING_PHASE_DATA_MAP[pricingPhase.phase].name}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {soldOut
                                    ? `${PRICING_PHASE_DATA_MAP[pricingPhase.phase].description} — đã hết chỗ`
                                    : PRICING_PHASE_DATA_MAP[pricingPhase.phase].description}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )
            })}
        </div>
    )
}
