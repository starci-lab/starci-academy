"use client"

import React from "react"
import {
    Skeleton,
    cn,
} from "@heroui/react"
import {
    SkeletonText,
} from "@/components/reuseable"
import type {
    WithClassNames,
} from "@/modules/types"

export type LaneCardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link LaneCard}.
 *
 * Presentational: mirrors the card frame (icon + title line + description line)
 * so the list does not shift when lanes load.
 * @param props.className - Optional wrapper class.
 */
export const LaneCardSkeleton = ({
    className,
}: LaneCardSkeletonProps) => {
    return (
        <div
            className={cn(
                "flex items-start gap-3 rounded-3xl border border-divider bg-background p-5",
                className,
            )}
        >
            <Skeleton className="size-6 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <SkeletonText
                    size="base"
                    width="w-32"
                />
                <SkeletonText
                    size="xs"
                    width="w-3/4"
                />
            </div>
        </div>
    )
}
