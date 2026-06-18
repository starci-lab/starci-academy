"use client"

import { Skeleton, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types"
import React from "react"

/**
 * Loading placeholder for a foundation resource card.
 * @param props.className - Optional root class names.
 */
export const FoundationCardSkeleton = ({
    className,
}: WithClassNames<undefined>) => {
    return (
        <div className={cn("card card--default !p-0 flex h-full flex-col overflow-hidden rounded-xl", className)}>
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="flex flex-col gap-3 p-3">
                <Skeleton className="h-6 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
            </div>
        </div>
    )
}
