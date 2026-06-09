"use client"

import React from "react"
import { Skeleton } from "@heroui/react"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryCourseSwr,
} from "@/hooks"
import {
    CourseMindMap,
} from "@/components/layouts/CourseMindMap"
import {
    MindMapBreadcrumbs,
} from "./MindMapBreadcrumbs"

/**
 * Course mind-map feature container.
 *
 * Reads the active course (entity + display id) from redux, renders the
 * breadcrumb trail and the course title heading, then mounts the
 * {@link CourseMindMap} canvas. Mounted by the
 * `/[locale]/courses/[courseId]/learn/mind-map` route.
 *
 * Client component: relies on redux selectors and the i18n hook.
 */
export const MindMap = () => {
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // Trigger the course fetch on this route (the /modules layout does it elsewhere, but a hard
    // refresh straight into /mind-map has no other loader, so the canvas would stay empty).
    const { isLoading } = useQueryCourseSwr()

    return (
        // fill the viewport below the sticky h-16 navbar; breadcrumb is fixed, canvas takes the rest
        <div className="flex h-[calc(100dvh-4rem)] flex-col">
            <div className="shrink-0 p-3">
                <MindMapBreadcrumbs
                    courseTitle={course?.title}
                    courseDisplayId={courseDisplayId}
                />
            </div>
            {/* full-bleed canvas: only a top border separates it from the breadcrumb, no side/bottom gaps */}
            <div className="min-h-0 flex-1 border-t">
                {!course && isLoading ? (
                    <Skeleton className="h-full w-full" />
                ) : (
                    <CourseMindMap />
                )}
            </div>
        </div>
    )
}
