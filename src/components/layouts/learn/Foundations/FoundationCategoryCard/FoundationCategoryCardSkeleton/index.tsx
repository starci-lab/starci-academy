"use client"

import { Skeleton } from "@heroui/react"
import React from "react"

/**
 * Loading placeholder for a foundation category card (thumbnail + title/description).
 */
export const FoundationCategoryCardSkeleton = () => {
    return (
        <div className="card card--default !p-0 flex h-full flex-col overflow-hidden rounded-xl">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="flex flex-col gap-1.5 p-3">
                <Skeleton className="h-6 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
            </div>
        </div>
    )
}
