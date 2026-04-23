"use client"

import React, { useEffect, useMemo } from "react"
import {
    Background,
    BackgroundVariant,
    Controls,
    type Edge,
    type Node,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import type { CourseEntity, ModuleEntity } from "@/modules/types"

const ROOT_ID = "course-root"

/** Radius from center to module nodes (px in flow space). */
const LEAF_RADIUS = 260

type MindGraph = {
    nodes: Array<Node>
    edges: Array<Edge>
}

/**
 * Builds a star layout: course at center, modules on a circle (by `orderIndex`).
 */
function buildCourseModuleGraph(
    course: CourseEntity | undefined,
    activeModuleId: string | undefined,
): MindGraph {
    const title = course?.title?.trim() || ""
    if (!course?.modules?.length) {
        return {
            nodes: [
                {
                    id: ROOT_ID,
                    position: { x: 0, y: 0 },
                    data: { label: title || "—" },
                    className:
                        "rounded-2xl border  bg-surface px-4 py-3 text-center text-sm font-semibold text-foreground shadow-sm max-w-[220px]",
                    draggable: false,
                    selectable: false,
                },
            ],
            edges: [],
        }
    }

    const sorted = [...course.modules].sort((a, b) => a.orderIndex - b.orderIndex)
    const n = sorted.length
    const rootNode: Node = {
        id: ROOT_ID,
        position: { x: 0, y: 0 },
        data: { label: title },
        className:
            "rounded-2xl border border-accent/40 bg-surface px-4 py-3 text-center text-sm font-semibold text-foreground shadow-sm max-w-[240px]",
        draggable: false,
        selectable: false,
    }

    const moduleNodes: Array<Node> = sorted.map((mod: ModuleEntity, index: number) => {
        const angle = (2 * Math.PI * index) / n - Math.PI / 2
        const isActive = Boolean(activeModuleId && mod.id === activeModuleId)
        return {
            id: mod.id,
            position: {
                x: LEAF_RADIUS * Math.cos(angle) - 70,
                y: LEAF_RADIUS * Math.sin(angle) - 28,
            },
            data: {
                label: `${mod.orderIndex + 1}. ${mod.title}`,
            },
            className: [
                "rounded-xl border px-3 py-2 text-center text-xs text-foreground max-w-[200px] leading-snug shadow-sm",
                isActive ? "border-accent bg-accent/10" : " bg-background/80",
            ].join(" "),
            draggable: false,
            selectable: false,
        }
    })

    const edges: Array<Edge> = sorted.map((mod: ModuleEntity) => ({
        id: `e-${ROOT_ID}-${mod.id}`,
        source: ROOT_ID,
        target: mod.id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "var(--accent)", strokeWidth: 1.5, opacity: 0.65 },
    }))

    return {
        nodes: [rootNode, ...moduleNodes],
        edges,
    }
}

/**
 * Inner canvas: syncs graph from Redux course + highlights active module.
 */
function CourseModuleMindMapCanvas() {
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

/**
 * Re-runs fitView when graph or course changes (inside ReactFlow tree).
 */
function MindMapFitView({ courseId }: { courseId: string }) {
    const { fitView } = useReactFlow()
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            fitView({ padding: 0.2 })
        })
        return () => cancelAnimationFrame(id)
    }, [courseId, fitView])
    return null
}

/**
 * Course-centric mind map of modules (React Flow). Data from `state.course.entity` / `state.module.entity`.
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
