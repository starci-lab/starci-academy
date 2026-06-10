"use client"

import React, { useCallback, useEffect, useMemo, useRef } from "react"
import {
    Background,
    BackgroundVariant,
    ControlButton,
    Controls,
    type Node,
    type NodeMouseHandler,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react"
import {
    Frame as FitViewIcon,
} from "@gravity-ui/icons"
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
import { MindMapFullscreenButton } from "../MindMapFullscreenButton"

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
    /** Canvas container — target for the floating fullscreen button. */
    const containerRef = useRef<HTMLDivElement>(null)

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

    const { setCenter, fitView } = useReactFlow()

    /** Smoothly frames the clicked node: root → full overview, anything else → zoom to its center. */
    const onNodeClick = useCallback<NodeMouseHandler>(
        (_event, node) => {
            // clicking the course root pulls the camera back to the whole graph
            if (node.type === COURSE_ROOT_NODE_TYPE) {
                void fitView({
                    padding: 0.2,
                    duration: 600,
                })
                return
            }
            // otherwise animate the viewport to the node's measured center with a gentle zoom-in
            const width = node.measured?.width ?? 300
            const height = node.measured?.height ?? 100
            void setCenter(
                node.position.x + width / 2,
                node.position.y + height / 2,
                {
                    zoom: 1.4,
                    duration: 600,
                },
            )
        },
        [
            setCenter,
            fitView,
        ],
    )

    useMindMapFitView()

    if (!course) {
        return null
    }

    return (
        <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-background/50 dark:bg-background/70">
            <ReactFlow
                aria-label={t("content.mindMapAria")}
                className="text-foreground"
                colorMode={themeMode}
                edges={edges}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                maxZoom={2}
                minZoom={0.2}
                nodeTypes={nodeTypes}
                nodes={nodes}
                nodesConnectable={false}
                nodesDraggable={false}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onNodesChange={onNodesChange}
                panOnScroll
                proOptions={{ hideAttribution: true }}
                zoomOnDoubleClick={false}
            >
                <Background gap={16} variant={BackgroundVariant.Dots} />
                <Controls
                    className="bg-surface shadow-sm dark:border-zinc-600 dark:bg-zinc-900/90"
                    showFitView={false}
                    showInteractive={false}
                    showZoom={false}
                >
                    <ControlButton
                        aria-label={t("mindMap.fitView")}
                        onClick={() => void fitView({ duration: 400, padding: 0.2 })}
                        title={t("mindMap.fitView")}
                    >
                        <FitViewIcon />
                    </ControlButton>
                </Controls>
                <MindMapFullscreenButton targetRef={containerRef} />
            </ReactFlow>
        </div>
    )
}
