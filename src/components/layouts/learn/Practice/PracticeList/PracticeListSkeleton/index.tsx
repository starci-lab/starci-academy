"use client"

import React from "react"
import {
    Card,
    CardContent,
    cn,
    Skeleton,
} from "@heroui/react"
import {
    SkeletonText,
} from "@/components/reuseable"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link PracticeListSkeleton}. */
export interface PracticeListSkeletonProps extends WithClassNames<undefined> {
    /** Number of placeholder problem rows to render. Defaults to `6`. */
    count?: number
}

/**
 * Loading placeholder for {@link PracticeList}. Mirrors the real problem rows: a
 * card with the problem title on the left and a pair of chips (a topic tag and
 * the difficulty) on the right.
 * @param props - {@link PracticeListSkeletonProps}
 */
export const PracticeListSkeleton = ({
    count = 6,
    className,
}: PracticeListSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {Array.from({ length: Math.max(count, 1) }).map((_unused, index) => (
                <Card key={index} className="w-full">
                    <CardContent className="flex flex-row items-center justify-between gap-3">
                        {/* problem title */}
                        <SkeletonText size="base" width="w-1/2" />
                        {/* topic tag + difficulty chips */}
                        <div className="flex items-center gap-1.5">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
