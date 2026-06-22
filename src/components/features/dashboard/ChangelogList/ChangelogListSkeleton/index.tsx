"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    Skeleton,
} from "@/components/blocks"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Representative changelog rows shown while entries load. */
const SKELETON_ROW_COUNT = 4

/**
 * Loading placeholder for {@link import("../").ChangelogList}: mirrors the dated
 * changelog rows — each a meta line (date + category chip) over a title line and a
 * body line — at the same `gap-3` / `gap-1.5` rhythm so the list does not jump in.
 *
 * @param props - {@link ChangelogListSkeleton}
 */
export const ChangelogListSkeleton = ({ className }: WithClassNames<undefined>) => {
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                    {/* meta: date + category chip */}
                    <div className="flex items-center gap-1.5">
                        <Skeleton.Typography type="body-xs" width="1/4" />
                        <Skeleton className="h-4 w-16 shrink-0 rounded-full" />
                    </div>
                    {/* title */}
                    <Skeleton.Typography type="body-sm" width="3/4" />
                    {/* body */}
                    <Skeleton.Typography type="body-xs" width="1/2" />
                </div>
            ))}
        </div>
    )
}
