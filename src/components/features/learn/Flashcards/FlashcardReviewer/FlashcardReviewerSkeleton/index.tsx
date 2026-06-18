import React from "react"
import { Skeleton } from "@/components/blocks"
import type { WithClassNames } from "@/modules/types"

/**
 * Loading placeholder for the flashcard reviewer. Mirrors the real layout: a
 * progress bar, one tall borderless flashcard, and the prev/flip/next controls.
 */
export const FlashcardReviewerSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={className}>
            <div className="flex flex-col gap-6">
                {/* progress bar */}
                <Skeleton className="h-1.5 w-full rounded-full" />
                {/* the flashcard — plain (borderless) surface */}
                <div className="flex min-h-64 flex-col gap-3 rounded-xl bg-default/40 p-8">
                    <Skeleton.Typography type="body" width="3/4" />
                    <Skeleton.Typography type="body" width="2/3" />
                    <Skeleton.Typography type="body" width="1/2" />
                </div>
                {/* prev / flip / next */}
                <div className="flex items-center justify-between gap-3">
                    <Skeleton.Button />
                    <Skeleton.Button />
                    <Skeleton.Button />
                </div>
            </div>
        </div>
    )
}
