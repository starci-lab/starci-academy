"use client"

import React, { useEffect } from "react"
import { useReactFlow } from "@xyflow/react"

/** Props for {@link MindMapFitView}. */
export interface MindMapFitViewProps {
    /** Active course id; changing it re-runs the fit-view. */
    courseId: string
}

/**
 * Re-runs `fitView` whenever the course changes (must live inside the
 * ReactFlow tree so the `useReactFlow` hook resolves). Renders nothing.
 */
export const MindMapFitView = ({ courseId }: MindMapFitViewProps) => {
    const { fitView } = useReactFlow()
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            fitView({ padding: 0.2 })
        })
        return () => cancelAnimationFrame(id)
    }, [courseId, fitView])
    return null
}
