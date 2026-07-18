"use client"

import React from "react"
import { cn } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Props for {@link FeedbackCardSkeleton}.
 */
type FeedbackCardSkeletonProps = WithClassNames<undefined>
/**
 * Loading placeholders for feedback cards. Mirrors {@link FeedbackCard}'s real
 * layout — chip on its own line, message/detail stack, conditional footer
 * divider, then the location + suggestion rows — so swapping skeleton → real
 * content never shifts the layout.
 *
 * @param props - Skeleton config.
 */
export const FeedbackCardSkeleton = ({ className }: FeedbackCardSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-3 rounded-medium border border-default px-4 py-3", className)}>
            <div>
                <Skeleton.Chip />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton.Typography type="body-sm" width="full" />
                <Skeleton.Typography type="body-sm" width="3/4" />
            </div>
            <div className="-mx-4 border-t border-divider" role="separator" />
            {/* footer row 1 — location: MapPin (size-3) + link text */}
            <div className="flex items-center gap-2">
                <Skeleton className="size-3 shrink-0 rounded-full" />
                <Skeleton.Typography type="body-xs" width="1/3" />
            </div>
            {/* footer row 2 — suggestion: Lightbulb (size-4) + text */}
            <div className="flex items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-full" />
                <Skeleton.Typography type="body-sm" width="2/3" />
            </div>
        </div>
    )
}

