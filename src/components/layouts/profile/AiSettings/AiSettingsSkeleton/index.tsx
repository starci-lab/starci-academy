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
import {
    LaneCardSkeleton,
} from "../LaneSelector/LaneCardSkeleton"

export type AiSettingsSkeletonProps = WithClassNames<undefined>

/**
 * Loading state for the {@link AiSettings} content (everything below the
 * header).
 *
 * Presentational: mirrors the effective-lane row, the three lane cards, and the
 * save button. The header is static chrome and renders outside the loading
 * gate, so it is intentionally not skeletonized.
 * @param props.className - Optional wrapper class.
 */
export const AiSettingsSkeleton = ({
    className,
}: AiSettingsSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <div className="flex items-center gap-2">
                <SkeletonText
                    size="sm"
                    width="w-20"
                />
                <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <div className="flex flex-col gap-3">
                <LaneCardSkeleton />
                <LaneCardSkeleton />
                <LaneCardSkeleton />
            </div>
            <Skeleton className="h-11 w-full rounded-full" />
        </div>
    )
}
