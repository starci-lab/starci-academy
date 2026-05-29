"use client"

import React from "react"
import {
    Skeleton,
} from "@heroui/react"

/**
 * Loading placeholder for the public content article.
 *
 * Presentational: mirrors the title/description/body layout while the
 * {@link useQueryPublicContentSwr} request is in flight. No logic.
 */
export const ContentDetailSkeleton = () => {
    return (
        <div className="mx-auto max-w-4xl p-6">
            <Skeleton className="h-8 w-3/4 rounded-2xl" />
            <div className="h-4" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full mt-2" />
            <div className="h-6" />
            <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
    )
}
