import React from "react"
import { Skeleton } from "@/components/blocks"
import type { WithClassNames } from "@/modules/types"

/**
 * Loading placeholder for {@link import("../").DueReview}. Mirrors the real
 * layout: a deck-context line, a progress bar, one tall borderless flashcard, and
 * the reveal control.
 */
export const DueReviewSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={className}>
            <div className="flex flex-col gap-6">
                {/* progress label + bar */}
                <div className="flex flex-col gap-2">
                    <Skeleton.Typography type="body-xs" width="1/4" />
                    <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
                {/* deck-context line */}
                <Skeleton.Typography type="body-xs" width="1/3" />
                {/* the flashcard — plain (borderless) surface */}
                <div className="flex min-h-64 flex-col gap-3 rounded-xl bg-default/40 p-8">
                    <Skeleton.Typography type="body" width="3/4" />
                    <Skeleton.Typography type="body" width="2/3" />
                    <Skeleton.Typography type="body" width="1/2" />
                </div>
                {/* reveal control */}
                <Skeleton.Button />
            </div>
        </div>
    )
}
