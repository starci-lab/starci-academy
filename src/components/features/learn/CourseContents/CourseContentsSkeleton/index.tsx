"use client"

import React from "react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Number of placeholder lesson rows shown in the keep-going path. */
const SKELETON_LESSON_COUNT = 4

/** Props for {@link CourseContentsSkeleton}. */
export type CourseContentsSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").CourseContents}: mirrors the real
 * dashboard — header (title + description + catalog meta), the flat continue +
 * progress block, then the current-module "keep going" path — so the page does not
 * jump when data arrives. The full tree lives in the rail, so the skeleton has no
 * search / accordion.
 *
 * @param props - {@link CourseContentsSkeletonProps}
 */
export const CourseContentsSkeleton = ({ className }: CourseContentsSkeletonProps) => {
    return (
        <div className={className}>
            {/* mirror loaded: PageHeader (header) → content cluster, gap-10 between; cluster gap-6 */}
            <div className="flex flex-col gap-10">
                {/* header tier — title + description + catalog meta chip row
                    (PageHeader mirror: modules/hours/learners HighlightChips) */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Skeleton.Typography type="h3" width="1/2" />
                        <Skeleton.Typography type="body-sm" width="2/3" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {Array.from({ length: 3 }).map((_chip, chipIndex) => (
                            <Skeleton.Chip key={chipIndex} />
                        ))}
                    </div>
                </div>

                {/* content cluster — flat continue/progress + keep-going path (gap-6) */}
                <div className="flex flex-col gap-6">
                    {/* continue + progress — flat (no card frame): eyebrow + title ·
                        resume button · progress meter · stat line (mirrors CourseContents) */}
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
