"use client"

import React from "react"
import {
    Separator,
} from "@heroui/react"
import {
    Skeleton,
} from "@/components/blocks"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Number of placeholder modules shown while the contents outline loads. */
const SKELETON_MODULE_COUNT = 3

/** Number of placeholder lesson rows shown per skeleton module. */
const SKELETON_LESSON_COUNT = 3

/** Props for {@link CourseContentsSkeleton}. */
export type CourseContentsSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").CourseContents}: mirrors the real
 * layout — a progress header (title bar + meter + resume button) followed by a
 * module → lesson tree — so the page does not jump when data arrives.
 *
 * @param props - {@link CourseContentsSkeletonProps}
 */
export const CourseContentsSkeleton = ({ className }: CourseContentsSkeletonProps) => {
    return (
        <div className={className}>
            <div className="flex flex-col gap-6">
                {/* progress header */}
                <div className="flex flex-col gap-3">
                    <Skeleton.Typography type="h3" width="1/2" />
                    <Skeleton.ProgressBar />
                    <div className="flex items-center gap-3">
                        <Skeleton.Typography type="body-sm" width="1/4" />
                        <Skeleton.Typography type="body-sm" width="1/4" />
                        <Skeleton.Typography type="body-sm" width="1/4" />
                    </div>
                    <Skeleton.Button />
                </div>
                {/* module tree */}
                <div className="flex flex-col gap-6">
                    {Array.from({ length: SKELETON_MODULE_COUNT }).map((_module, moduleIndex) => (
                        <div key={moduleIndex} className="flex flex-col gap-3">
                            <Skeleton.Typography type="body-sm" width="1/3" />
                            {Array.from({ length: SKELETON_LESSON_COUNT }).map((_lesson, lessonIndex) => (
                                <React.Fragment key={lessonIndex}>
                                    {lessonIndex > 0 ? <Separator /> : null}
                                    <Skeleton.ListRow withTrailing />
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
