"use client"

import React from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { Canvas } from "./Canvas"

/**
 * Course mind map layout: wraps the React Flow canvas with provider and empty-state handling.
 */
export const CourseMindMap = () => {
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    const hasModules = Boolean(course?.modules && course.modules.length > 0)

    if (!course) {
        return null
    }

    if (!hasModules) {
        return (
            <div className="rounded-2xl border border-dashed border-divider px-4 py-6 text-center text-sm text-muted dark:border-zinc-600">
                {t("content.mindMapEmpty")}
            </div>
        )
    }

    return (
        <ReactFlowProvider>
            <div className="h-[min(560px,70vh)] w-full">
                <Canvas />
            </div>
        </ReactFlowProvider>
    )
}
