"use client"

import { cn, Skeleton } from "@heroui/react"
import React from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link ConsultantCardSkeleton}. */
export type ConsultantCardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for a consultant card in the grid.
 * @param props - {@link ConsultantCardSkeletonProps}
 */
export const ConsultantCardSkeleton = ({ className }: ConsultantCardSkeletonProps) => {
    return (
        <div className={cn("card card--default flex flex-col overflow-hidden rounded-xl border border-divider/60", className)}>
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex flex-col gap-1.5 p-4">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
            </div>
        </div>
    )
}
