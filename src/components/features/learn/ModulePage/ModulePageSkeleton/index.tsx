"use client"

import React from "react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Number of placeholder lesson rows shown in the mirrored list. */
const SKELETON_LESSON_COUNT = 5

/** Props for {@link ModulePageSkeleton}. */
export type ModulePageSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").ModulePage}: mirrors the real
 * layout — header (title + tier chip + description + meta chips), the flat
 * continue + progress block, then the rich lesson list — so the page does not
 * jump when data arrives.
 *
 * @param props - {@link ModulePageSkeletonProps}
 */
export const ModulePageSkeleton = ({ className }: ModulePageSkeletonProps) => {
    return (
        <div className={className}>
            {/* mirror loaded: PageHeader (header) → content cluster, gap-10 between; cluster gap-6 */}
            <div className="flex flex-col gap-10">
                {/* header tier — title + description + meta chips (PageHeader mirror) */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Skeleton.Typography type="h3" width="1/2" />
                        <Skeleton.Typography type="body-sm" width="2/3" />
                    </div>
                    <Skeleton.Typography type="body-xs" width="1/3" />
                </div>

                {/* content cluster — flat continue/progress + rich lesson list (gap-6) */}
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-20 w-full rounded-3xl" />
                    <div className="flex flex-col gap-3">
                        <Skeleton.Typography type="body-sm" width="1/3" />
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: SKELETON_LESSON_COUNT }).map((_lesson, lessonIndex) => (
                                <Skeleton.ListRow key={lessonIndex} withTrailing />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModulePageSkeleton
