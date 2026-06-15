"use client"

import React from "react"
import {
    Chip,
    cn,
} from "@heroui/react"
import {
    Spacer,
} from "@/components/reuseable"
import type {
    PricingPhasePriceRow,
} from "../types"
import type {
    WithClassNames,
} from "@/modules/types"

/** Props for {@link PhasePrices}. */
export interface PhasePricesProps extends WithClassNames<undefined> {
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
    className,
}: PhasePricesProps) => {
    return (
        <div className={cn("relative flex items-start justify-between", className)}>
            {rows.map((row) => (
                <div key={row.id} className="flex-1 flex flex-col items-center">
                    <div
                        className={`text-center text-sm font-medium text-muted${
                            row.soldOut ? " line-through opacity-50" : ""
                        }`}
                    >
                        {row.formattedPrice}
                    </div>
                    {/* secondary USD line — only when the course exposes a USD price */}
                    {row.formattedPriceUsd != null && (
                        <div
                            className={`text-center text-xs text-muted${
                                row.soldOut ? " line-through opacity-50" : ""
                            }`}
                        >
                            {row.formattedPriceUsd}
                        </div>
                    )}
                    <Spacer y={1} />
                    {/* sold-out phases show a "sold out" chip instead of the save chip */}
                    {row.soldOut ? (
                        <Chip color="default" size="sm" variant="soft">
                            Hết chỗ
                        </Chip>
                    ) : row.savePercent != null && (
                        <Chip color="accent" size="sm" variant="soft">
                            {`Save ${row.savePercent}%`}
                        </Chip>
                    )}
                </div>
            ))}
        </div>
    )
}
