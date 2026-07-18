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
                {/* header tier — title + description + meta chip row (PageHeader mirror:
                    tier StatusChip + lessons/minutes/challenges HighlightChips) */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Skeleton.Typography type="h3" width="1/2" />
                        <Skeleton.Typography type="body-sm" width="2/3" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {Array.from({ length: 4 }).map((_chip, chipIndex) => (
                            <Skeleton.Chip key={chipIndex} />
                        ))}
                    </div>
                </div>

                {/* content cluster — flat continue/progress + rich lesson list (gap-6) */}
                <div className="flex flex-col gap-6">
                    {/* continue + progress — flat (no card frame): eyebrow + title ·
                        resume button · progress meter · stat line (mirrors ModulePage) */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-col gap-0">
                                <Skeleton.Typography type="body-xs" width="1/3" />
                                <Skeleton.Typography type="body" width="1/2" />
                            </div>
                            <Skeleton.Button className="shrink-0" />
                        </div>
                        <Skeleton.ProgressBar />
                        <Skeleton.Typography type="body-xs" width="1/2" />
                    </div>
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
