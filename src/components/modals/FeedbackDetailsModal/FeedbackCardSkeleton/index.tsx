"use client"

import React from "react"
import { cn, Skeleton } from "@heroui/react"
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
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-[14px] w-full my-[3px] rounded-sm" />
                <Skeleton className="h-[14px] w-3/4 my-[3px] rounded-sm" />
            </div>
            <div className="-mx-4 border-t border-divider" role="separator" />
            <div className="flex items-center gap-2">
                <Skeleton className="size-3 shrink-0 rounded-full" />
                <Skeleton className="h-[14px] w-1/5 my-[3px] rounded-sm" />
            </div>
        </div>
    )
}

