import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Loading placeholder for the flashcard reviewer. Mirrors the real layout: a
 * progress bar, one no-flip prompt card (mirrors {@link import("@/components/blocks/cards/FlipCard").FlipCard}'s
 * `min-h-64`/`sm:min-h-72` centered face), and the prev/show-answer controls.
 */
export const FlashcardReviewerSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={className}>
            <div className="flex flex-col gap-6">
                {/* progress bar */}
                <Skeleton className="h-1.5 w-full rounded-full" />
                {/* the flashcard — mirrors FlipCard's LabeledCard (label OUTSIDE + Card) */}
                <div className="flex flex-col gap-3">
                    <Skeleton.Typography type="body-xs" width="1/4" />
                    <div className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-surface">
                        <Skeleton.Typography type="body" width="3/4" />
                        <Skeleton.Typography type="body" width="2/3" />
                    </div>
                </div>
                {/* prev / show answer */}
                <div className="flex items-center justify-between gap-3">
                    <Skeleton.Button />
                    <Skeleton.Button />
                </div>
            </div>
        </div>
    )
}
