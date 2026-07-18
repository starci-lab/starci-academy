"use client"

import React from "react"
import { cn } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link ConsultantCardSkeleton}. */
export type ConsultantCardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for a consultant card — mirrors the {@link
 * import("../ConsultantCard").ConsultantCard} tree inside its `PressableCard`
 * surface: avatar + name + jobTitle + a company LINK row (icon + text) + a
 * 3-line clamped description.
 * @param props - {@link ConsultantCardSkeletonProps}
 */
export const ConsultantCardSkeleton = ({ className }: ConsultantCardSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-3 rounded-3xl bg-surface px-4 py-3 shadow-surface", className)}>
            {/* avatar (size="card" square, rounded-2xl) */}
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex flex-col gap-2">
                {/* name (h5) */}
                <Skeleton.Typography type="h5" width="3/4" />
                {/* jobTitle (body-sm muted) */}
                <Skeleton.Typography type="body-sm" width="1/2" />
                {/* company link row — leading BuildingsIcon (size-5) + text */}
                <div className="flex items-center gap-2">
                    <Skeleton className="size-5 shrink-0 rounded" />
                    <Skeleton.Typography type="body-sm" width="1/3" />
                </div>
                {/* description (line-clamp-3) */}
                <Skeleton.Paragraph lines={3} />
            </div>
        </div>
    )
}
