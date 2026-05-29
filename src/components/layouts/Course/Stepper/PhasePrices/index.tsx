"use client"

import React from "react"
import {
    Chip,
} from "@heroui/react"
import {
    Spacer,
} from "@/components/reuseable"
import type {
    PricingPhasePriceRow,
} from "../types"

/** Props for {@link PhasePrices}. */
export interface PhasePricesProps {
    /** Pre-computed price rows, one per phase, in display order. */
    rows: Array<PricingPhasePriceRow>
}

/**
 * The price row under the dots: formatted price plus an optional save chip.
 *
 * Presentational: renders the supplied pre-computed rows, no calculation.
 * @param props - the computed price rows
 */
export const PhasePrices = ({
    rows,
}: PhasePricesProps) => {
    return (
        <div className="relative flex items-start justify-between">
            {rows.map((row) => (
                <div key={row.id} className="flex-1 flex flex-col items-center">
                    <div className="text-center text-sm font-medium text-muted">
                        {row.formattedPrice}
                    </div>
                    {/* secondary USD line — only when the course exposes a USD price */}
                    {row.formattedPriceUsd != null && (
                        <div className="text-center text-xs text-muted">
                            {row.formattedPriceUsd}
                        </div>
                    )}
                    <Spacer y={1} />
                    {row.savePercent != null && (
                        <Chip color="accent" size="sm" variant="soft">
                            {`Save ${row.savePercent}%`}
                        </Chip>
                    )}
                </div>
            ))}
        </div>
    )
}
