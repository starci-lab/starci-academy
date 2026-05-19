"use client"

import { Skeleton } from "@heroui/react"
import React from "react"

/**
 * Loading placeholder for a foundation resource card.
 */
export const FoundationCardSkeleton = () => {
    return (
        <div className="card card--default flex h-full flex-col overflow-hidden">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="flex flex-col gap-3 p-4 pt-2">
                <Skeleton className="h-6 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
            </div>
        </div>
    )
}
