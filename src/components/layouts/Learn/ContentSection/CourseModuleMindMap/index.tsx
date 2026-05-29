"use client"

import React from "react"
import {
    ReactFlowProvider,
} from "@xyflow/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { CourseModuleMindMapCanvas } from "./CourseModuleMindMapCanvas"

/**
 * Course-centric mind map of modules (React Flow). Reads the active course from
 * `state.course.entity`; shows an empty state when the course has no modules
 * and otherwise mounts the canvas inside a React Flow provider.
 *
 * Client component: relies on redux selectors and the i18n hook.
 */
export const CourseModuleMindMap = () => {
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    const hasModules = Boolean(course?.modules && course.modules.length > 0)

    if (!course) {
        return null
    }

    if (!hasModules) {
        return (
            <div className="rounded-2xl border border-dashed  px-4 py-6 text-center text-sm text-muted">
                {t("content.mindMapEmpty")}
            </div>
        )
    }

    return (
        <ReactFlowProvider>
            <CourseModuleMindMapCanvas />
        </ReactFlowProvider>
    )
}
