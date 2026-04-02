"use client"

import React, { useMemo } from "react"
import { SealCheckIcon } from "@phosphor-icons/react"
import type { ValuePropositionEntity } from "@/modules/types"
import { StarCiSkeleton } from "@/components/atomic"

export interface ValuePropositionsProps {
    /** Rows from API; shown in `orderIndex` order. */
    valuePropositions?: Array<ValuePropositionEntity>
    isLoading: boolean
}

export const ValuePropositions = ({
    valuePropositions,
    isLoading,
}: ValuePropositionsProps) => {
    const rows = useMemo(() => {
        return [...(valuePropositions ?? [])].sort(
            (a, b) => a.orderIndex - b.orderIndex
        )
    }, [valuePropositions])

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 text-foreground-500">
                <div className="flex items-center gap-2">
                    <StarCiSkeleton className="h-5 w-5 shrink-0" />
                    <StarCiSkeleton className="h-4 flex-1 max-w-[90%]" />
                </div>
                <div className="flex items-center gap-2">
                    <StarCiSkeleton className="h-5 w-5 shrink-0" />
                    <StarCiSkeleton className="h-4 flex-1 max-w-[75%]" />
                </div>
                <div className="flex items-center gap-2">
                    <StarCiSkeleton className="h-5 w-5 shrink-0" />
                    <StarCiSkeleton className="h-4 flex-1 max-w-[85%]" />
                </div>
            </div>
        )
    }

    if (rows.length === 0) {
        return null
    }

    return (
        <div className="flex flex-col gap-2 text-foreground-500">
            {rows.map((row) => (
                <div key={row.id} className="flex items-start gap-2">
                    <SealCheckIcon
                        size={20}
                        className="mt-0.5 shrink-0 text-foreground-500"
                    />
                    <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: row.content }}
                    />
                </div>
            ))}
        </div>
    )
}
