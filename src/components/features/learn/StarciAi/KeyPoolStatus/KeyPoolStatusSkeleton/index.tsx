"use client"

import React from "react"
import {
    cn,
    Skeleton,
} from "@heroui/react"
import {
    SkeletonText,
} from "@/components/reuseable"
import type { WithClassNames } from "@/modules/types"

/** Props for {@link KeyPoolStatusSkeleton}. */
export interface KeyPoolStatusSkeletonProps extends WithClassNames<undefined> {
    /** Number of placeholder provider cards. Defaults to `3`. */
    count?: number
}

/**
 * Loading placeholder for {@link KeyPoolStatus}. Mirrors the real provider cards:
 * a rounded panel with a provider chip + active-summary header and a couple of
 * key rows underneath.
 * @param props - {@link KeyPoolStatusSkeletonProps}
 */
export const KeyPoolStatusSkeleton = ({
    count = 3,
    className,
}: KeyPoolStatusSkeletonProps) => {
    return (
        <section className={cn("flex flex-col gap-3", className)}>
            {Array.from({ length: Math.max(count, 1) }).map((_unused, cardIndex) => (
                <div
                    key={cardIndex}
                    className="rounded-3xl border bg-background p-4"
                >
                    {/* provider chip + active summary */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <SkeletonText size="sm" width="w-24" />
                    </div>
                    <div className="h-4" />
                    {/* key rows */}
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 2 }).map((_unusedKey, keyIndex) => (
                            <div
                                key={keyIndex}
                                className="flex items-center justify-between gap-2 rounded-2xl border border-default-200/60 bg-default-50/50 px-3 py-2"
                            >
                                <div className="flex items-center gap-2">
                                    <SkeletonText size="xs" width="w-16" />
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </div>
                                <SkeletonText size="xs" width="w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}
