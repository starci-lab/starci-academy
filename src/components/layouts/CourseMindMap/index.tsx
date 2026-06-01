"use client"

import React, { useCallback, useMemo, useState } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { Canvas } from "./Canvas"
import { MindMapDetailsProvider, type MindMapDetailsSelection } from "./context"
import { ContentDetailsDrawer } from "./ContentDetailsDrawer"

/**
 * Course mind map layout: wraps the React Flow canvas with provider and empty-state handling.
 * Holds the selected-lesson state so a content click opens the side details drawer (no navigation).
 */
export const CourseMindMap = () => {
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    const hasModules = Boolean(course?.modules && course.modules.length > 0)

    /** The lesson whose details drawer is open (null = closed). */
    const [selection, setSelection] = useState<MindMapDetailsSelection | null>(null)
    const openDetails = useCallback(
        (next: MindMapDetailsSelection) => setSelection(next),
        [],
    )
    const closeDetails = useCallback(() => setSelection(null), [])
    const detailsContextValue = useMemo(() => ({ openDetails }), [openDetails])

    if (!course) {
        return null
    }

    if (!hasModules) {
        return (
            <div className="rounded-2xl border border-dashed  px-4 py-6 text-center text-sm text-muted dark:border-zinc-600">
                {t("content.mindMapEmpty")}
            </div>
        )
    }

    return (
        <MindMapDetailsProvider value={detailsContextValue}>
            <ReactFlowProvider>
                <div className="h-[min(560px,70vh)] w-full">
                    <Canvas />
                </div>
            </ReactFlowProvider>
            <ContentDetailsDrawer selection={selection} onClose={closeDetails} />
        </MindMapDetailsProvider>
    )
}
