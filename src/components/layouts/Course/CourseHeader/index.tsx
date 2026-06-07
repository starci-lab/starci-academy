"use client"

import React from "react"
import {
    Skeleton,
} from "@heroui/react"
import {
    useQueryCourseSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"

/**
 * Course title + rich-text description block.
 *
 * Self-contained section (single-use): reads its own load flag (course SWR
 * singleton) plus title/description (redux), so the course container renders
 * `<CourseHeader />` with no props. Renders skeletons while loading, otherwise
 * the heading and the description HTML. `"use client"` because HeroUI
 * `Skeleton` is a client component and it reads redux.
 */
export const CourseHeader = () => {
    const { isLoading } = useQueryCourseSwr()
    const title = useAppSelector((state) => state.course.entity?.title)
    const description = useAppSelector((state) => state.course.entity?.description)
    return (
        <>
            {isLoading ? (
                <Skeleton className="h-10 w-60 max-w-full" />
            ) : (
                <h1 className="text-4xl font-bold">{title}</h1>
            )}
            {isLoading ? (
                <div className="mt-3 space-y-2">
                    <Skeleton className="h-[14px] w-[60%] max-w-full" />
                    <Skeleton className="h-[14px] w-[50%] max-w-full" />
                    <Skeleton className="h-[14px] w-[40%] max-w-full" />
                </div>
            ) : (
                <div
                    className="text-sm text-muted mt-3"
                    dangerouslySetInnerHTML={{ __html: description ?? "" }}
                />
            )}
        </>
    )
}
