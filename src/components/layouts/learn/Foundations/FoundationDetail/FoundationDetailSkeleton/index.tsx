"use client"

import React from "react"
import {
    Skeleton,
} from "@heroui/react"

/**
 * Loading placeholder for the foundation detail view.
 *
 * Presentational: renders static skeleton blocks while the foundations list loads.
 */
export const FoundationDetailSkeleton = () => {
    return (
        <div className="p-3">
            <Skeleton className="mb-4 h-6 w-2/3 rounded-lg" />
            <Skeleton className="mb-2 h-8 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
        </div>
    )
}
