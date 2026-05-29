"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
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
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    return (
        <div>
            <MindMapBreadcrumbs
                courseTitle={course?.title}
                courseDisplayId={courseDisplayId}
            />

            <div className="h-12" />

            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold">{course?.title}</h1>
                    <p className="text-muted mt-2">{t("content.mindMapAria")}</p>
                </div>

                <CourseMindMap />
            </div>
        </div>
    )
}
