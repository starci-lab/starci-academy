"use client"

import React from "react"
import { cn } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link LessonCardSkeleton}. */
export type LessonCardSkeletonProps = WithClassNames<undefined>

/**
 * Render loading placeholders for lesson cards.
 * @param {LessonCardSkeletonProps} props Skeleton props (unused).
 */
export const LessonCardSkeleton = ({ className }: LessonCardSkeletonProps) => {
    return (
        <div className={cn("space-y-2", className)}>
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
    )
}
