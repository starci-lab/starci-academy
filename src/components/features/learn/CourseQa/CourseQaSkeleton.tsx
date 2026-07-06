"use client"

import React from "react"
import { Card } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Number of placeholder question cards shown while the list loads. */
const SKELETON_QUESTION_COUNT = 4

/** Props for {@link CourseQaSkeleton}. */
export type CourseQaSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for the course-Q&A list: mirrors the real {@link import("./QuestionRow").QuestionRow}
 * cards (asker row + a two-line body + a meta chip row) so the column does not
 * jump when data arrives. Only the LIST region is skeletoned — the page header,
 * honest strip and toolbar around it stay rendered.
 *
 * @param props - {@link CourseQaSkeletonProps}
 */
export const CourseQaSkeleton = ({ className }: CourseQaSkeletonProps) => {
    return (
        <div className={className}>
            <div className="flex flex-col gap-3">
                {Array.from({ length: SKELETON_QUESTION_COUNT }).map((_question, questionIndex) => (
                    <Card key={questionIndex}>
                        <div className="flex flex-col gap-3">
                            {/* asker row: avatar + name */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-8 shrink-0 rounded-full" />
                                <Skeleton.Typography type="body-sm" width="1/3" />
                            </div>
                            {/* two-line body */}
                            <div className="flex flex-col gap-2">
                                <Skeleton.Typography type="body-sm" width="full" />
                                <Skeleton.Typography type="body-sm" width="2/3" />
                            </div>
                            {/* meta chip row */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-32 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
