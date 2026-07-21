"use client"

import React from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"

/** Number of placeholder question rows shown while the list loads. */
const SKELETON_QUESTION_COUNT = 4

/** Props for {@link CourseQaSkeleton}. */
export type CourseQaSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for the course-Q&A social inbox: one {@link SurfaceListCard}
 * of flush rows mirroring the real collapsed {@link import("./QaInboxRow").QaInboxRow}
 * (avatar · name line · two-line preview · scope + status chips · status dot) so the
 * column does not jump when data arrives. Only the LIST region is skeletoned — the
 * page header, honest strip and toolbar around it stay rendered.
 *
 * @param props - {@link CourseQaSkeletonProps}
 */
export const CourseQaSkeleton = ({ className }: CourseQaSkeletonProps) => {
    return (
        <div className={className}>
            <SurfaceListCard className="divide-y divide-default">
                {Array.from({ length: SKELETON_QUESTION_COUNT }).map((_question, questionIndex) => (
                    <div key={questionIndex} className="flex items-start gap-3 p-3">
                        <Skeleton className="size-8 shrink-0 rounded-full" />
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            {/* asker + time line */}
                            <Skeleton.Typography type="body-xs" width="1/3" />
                            {/* two-line preview */}
                            <div className="flex flex-col gap-2">
                                <Skeleton.Typography type="body-sm" width="full" />
                                <Skeleton.Typography type="body-sm" width="2/3" />
                            </div>
                            {/* scope + status chip row */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-32 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                        {/* status dot */}
                        <Skeleton className="mt-2 size-2 shrink-0 rounded-full" />
                    </div>
                ))}
            </SurfaceListCard>
        </div>
    )
}
