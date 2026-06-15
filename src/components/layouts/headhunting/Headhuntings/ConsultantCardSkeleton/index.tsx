"use client"

import { Skeleton } from "@heroui/react"
import React from "react"
/**
 * Loading placeholder for a consultant card in the grid.
 */
export const ConsultantCardSkeleton = () => {
    return (
        <div className="card card--default flex flex-col overflow-hidden rounded-xl border border-divider/60">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex flex-col gap-1.5 p-4">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
            </div>
        </div>
    )
}


