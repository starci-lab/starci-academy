"use client"

import React from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { useTranslations } from "next-intl"
import { Canvas } from "../Canvas"
import { useAppSelector } from "@/redux/hooks"
import { EmptyState } from "@/components/composites/feedback/EmptyState"

/** Props for {@link MindMapCanvas}. */
export type MindMapCanvasProps = Record<string, never>
/**
 * Shared React Flow mind-map canvas: provider wrapper and empty-state handling.
 *
 * Used by both {@link MindMap} (learn shell) and {@link StandaloneMindMap} (public route).
 * The authenticated canvas overlays the viewer's progress (per-module status, the "you
 * are here" module, overall completion) and a content-first "Continue" action; the public
 * standalone route degrades to a structure-only map. Clicking a lesson navigates straight
 * into its reader.
 * @param props - optional className (unused; layout is controlled by the parent container)
 */
export const MindMapCanvas = () => {
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    const hasModules = Boolean(course?.modules && course.modules.length > 0)

    if (!course) {
        return null
    }

    if (!hasModules) {
        return (
            <div className={"flex h-full w-full items-center justify-center rounded-2xl border border-dashed dark:border-zinc-600"}>
                <EmptyState title={t("content.mindMapEmpty")} />
            </div>
        )
    }

    return (
        <ReactFlowProvider>
            <div className={"h-full w-full"}>
                <Canvas />
            </div>
        </ReactFlowProvider>
    )
}
