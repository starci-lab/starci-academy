"use client"

import React from "react"
import { Card, cn, Skeleton } from "@heroui/react"
import type { WithClassNames } from "@/modules/types"

/**
 * Props for {@link FeedbackCardSkeleton}.
 */
type FeedbackCardSkeletonProps = WithClassNames<undefined>
/**
 * Loading placeholders for feedback cards.
 *
 * @param props - Skeleton config.
 */
export const FeedbackCardSkeleton = ({ className }: FeedbackCardSkeletonProps) => {
    return (
        <Card className={cn("bg-background w-full p-0", className)}>
            <Card.Content>
                <div className="p-3">
                    <div className="flex items-center justify-between gap-3">
                        <Skeleton className="h-[14px] w-2/5 my-[3px] rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="h-3" />
                    <div className="flex flex-col">
                        <Skeleton className="h-[14px] w-full my-[3px] rounded-full" />
                        <Skeleton className="h-[14px] w-3/4 my-[3px] rounded-full" />
                    </div>
                    <div className="h-3" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-[14px] w-1/5 my-[3px] rounded-full" />
                    </div>
                </div>
                <div className="border-b border-divider" />
                <div className="p-3">
                    <div className="flex flex-col">
                        <Skeleton className="h-[14px] w-full my-[3px] rounded-full" />
                        <Skeleton className="h-[14px] w-1/4 my-[3px] rounded-full" />
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}

