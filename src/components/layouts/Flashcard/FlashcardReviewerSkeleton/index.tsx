"use client"

import React from "react"
import {
    Skeleton,
} from "@heroui/react"
import {
    SkeletonText,
} from "@/components/reuseable"

/**
 * Loading placeholder for the flashcard reviewer. Mirrors the real layout: a
 * progress bar, one tall borderless flashcard, and the prev/flip/next controls.
 */
export const FlashcardReviewerSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            {/* progress bar */}
            <Skeleton className="h-2 w-full rounded-full" />
            {/* the flashcard — plain (borderless) surface */}
            <div className="flex min-h-64 flex-col gap-4 rounded-2xl bg-default-100 p-8 shadow-sm">
                <SkeletonText size="base" width="w-3/4" />
                <SkeletonText size="base" width="w-2/3" />
                <SkeletonText size="base" width="w-1/2" />
            </div>
            {/* prev / flip / next */}
            <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-28 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
        </div>
    )
}
