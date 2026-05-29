"use client"

import React, { useEffect, useMemo } from "react"
import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { MindMapFitView } from "../MindMapFitView"
import { buildCourseModuleGraph } from "../utils"

/**
 * Inner mind-map canvas: builds the graph from the redux course + active
 * module, keeps React Flow node/edge state in sync, and renders the flow.
 *
 * Client component: relies on redux selectors and React Flow state hooks.
 */
export const CourseModuleMindMapCanvas = () => {
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    const activeModuleId = useAppSelector((state) => state.module.entity?.id)

    const graph = useMemo(
        () => buildCourseModuleGraph(course, activeModuleId),
        [course, activeModuleId],
    )

    const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges)

    useEffect(() => {
        setNodes(graph.nodes)
        setEdges(graph.edges)
    }, [graph, setNodes, setEdges])

    if (!course) {
        return null
    }

    return (
        <div className="h-[min(420px,55vh)] w-full overflow-hidden rounded-2xl border  bg-background/50">
            <ReactFlow
                aria-label={t("content.mindMapAria")}
                className="text-foreground"
                edges={edges}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                nodes={nodes}
                nodesConnectable={false}
                nodesDraggable={false}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                panOnScroll
                proOptions={{ hideAttribution: true }}
                zoomOnDoubleClick={false}
            >
                <MindMapFitView courseId={course.id} />
                <Background gap={16} variant={BackgroundVariant.Dots} />
                <Controls className=" bg-surface shadow-sm" showInteractive={false} />
            </ReactFlow>
        </div>
    )
}
