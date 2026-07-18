import React from "react"
import { cn } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Loading placeholder for {@link import("../").DueReview}. Mirrors the real shape
 * top-to-bottom: the edge-to-edge {@link import("@/components/blocks/navigation/WorkSessionHeader").WorkSessionHeader}
 * band (back-link · deck identity · counter · progress-segment bar), then a
 * `max-w-3xl` centered body — level/tag chips, the {@link import("@/components/blocks/cards/FlipCard").FlipCard}
 * face, and the reveal control flanked by prev/next carets. (Was wrong: a thin
 * progress bar + deck line instead of the header band, so the band popped in.)
 */
export const DueReviewSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* header band — mirrors WorkSessionHeader's own edge-to-edge shell */}
            <div className="border-b border-default bg-surface">
                <div className="flex items-center gap-3 px-4 py-2 sm:px-6">
                    <Skeleton className="h-4 w-16 rounded" />
                    <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                    <Skeleton className="hidden h-4 w-24 rounded sm:block" />
                    <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                    <Skeleton className="h-4 w-20 rounded" />
                </div>
                <div className="flex gap-1 px-4 pb-2 sm:px-6">
                    {Array.from({ length: 6 }, (_unused, index) => (
                        <Skeleton key={index} className="h-1 flex-1 rounded-full" />
                    ))}
                </div>
            </div>

            {/* body — centered column under the header */}
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                {/* level + tag chips */}
                <div className="flex flex-wrap items-center gap-2">
                    <Skeleton.Chip />
                    <Skeleton.Chip />
                </div>
                {/* the flashcard — FlipCard's LabeledCard (label OUTSIDE + Card) */}
                <div className="flex flex-col gap-3">
                    <Skeleton.Typography type="body-xs" width="1/4" />
                    <div className="flex flex-col gap-3 rounded-3xl bg-surface p-6 shadow-surface">
                        <Skeleton.Typography type="body" width="3/4" />
                        <Skeleton.Typography type="body" width="2/3" />
                    </div>
                </div>
                {/* reveal control flanked by prev/next carets */}
                <div className="flex items-center justify-center gap-3">
                    <Skeleton className="size-9 shrink-0 rounded-full" />
                    <Skeleton.Button />
                    <Skeleton className="size-9 shrink-0 rounded-full" />
                </div>
            </div>
        </div>
    )
}
