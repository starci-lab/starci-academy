"use client"

import React, { useEffect, useMemo, useRef } from "react"
import {
    Background,
    BackgroundVariant,
    Controls,
    type Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useAppSelector } from "@/redux"
import { build } from "../build"
import { useMindMapFitView } from "../useMindMapFitView"
import type { MindMapThemeMode } from "../pastel"
import { COURSE_MODULE_NODE_TYPE, CourseModuleNode } from "../ModuleNode"
import type { CourseModuleSlotNodeData } from "../ModuleSlotNode"
import { CourseModuleSlotNode } from "../ModuleSlotNode"
import { COURSE_MODULE_SLOT_NODE_TYPE } from "../moduleExpansion"
import { COURSE_ROOT_NODE_TYPE, CourseRootNode } from "../RootNode"

/**
 * Inner canvas: syncs graph from Redux course + highlights active module; follows app light/dark theme.
 */
export const Canvas = () => {
    const t = useTranslations()
    const { resolvedTheme } = useTheme()
    const course = useAppSelector((state) => state.course.entity)
    const activeModuleId = useAppSelector((state) => state.module.entity?.id)

    const themeMode: MindMapThemeMode = resolvedTheme === "dark" ? "dark" : "light"

    const graph = useMemo(
        () => build({ course, activeModuleId, themeMode }),
        [course, activeModuleId, themeMode],
    )

    const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges)

    /** Holds slot nodes computed in `setNodes` so `setEdges` can keep matching edges in the same tick. */
    const preservedSlotsRef = useRef<Array<Node>>([])

    useEffect(() => {
        setNodes((prev) => {
            const keptSlots = prev.filter((node) => {
                if (node.type !== COURSE_MODULE_SLOT_NODE_TYPE) {
                    return false
                }
                const slotData = node.data as CourseModuleSlotNodeData
                return graph.nodes.some((base) => base.id === slotData.parentModuleId)
            })
            preservedSlotsRef.current = keptSlots
            return [...graph.nodes, ...keptSlots]
        })
        setEdges((prev) => {
            const mergedNodeIds = new Set([
                ...graph.nodes.map((node) => node.id),
                ...preservedSlotsRef.current.map((node) => node.id),
            ])
            const preservedExtras = prev.filter(
                (edge) =>
                    !graph.edges.some((base) => base.id === edge.id) &&
                    mergedNodeIds.has(edge.source) &&
                    mergedNodeIds.has(edge.target),
            )
            return [...graph.edges, ...preservedExtras]
        })
    }, [graph, setNodes, setEdges])

    const nodeTypes = useMemo(
        () => ({
            [COURSE_ROOT_NODE_TYPE]: CourseRootNode,
            [COURSE_MODULE_NODE_TYPE]: CourseModuleNode,
            [COURSE_MODULE_SLOT_NODE_TYPE]: CourseModuleSlotNode,
        }),
        [],
    )

    useMindMapFitView()

    if (!course) {
        return null
    }

    return (
        <div className="h-full w-full overflow-hidden rounded-2xl border border-divider bg-background/50 dark:bg-background/70">
            <ReactFlow
                aria-label={t("content.mindMapAria")}
                className="text-foreground"
                colorMode={themeMode}
                edges={edges}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                nodeTypes={nodeTypes}
                nodes={nodes}
                nodesConnectable={false}
                nodesDraggable={false}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                panOnScroll
                proOptions={{ hideAttribution: true }}
                zoomOnDoubleClick={false}
            >
                <Background gap={16} variant={BackgroundVariant.Dots} />
                <Controls className="border-divider bg-surface shadow-sm dark:border-zinc-600 dark:bg-zinc-900/90" showInteractive={false} />
            </ReactFlow>
        </div>
    )
}
