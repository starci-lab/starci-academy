import type {
    Edge,
    Node,
} from "@xyflow/react"
import type {
    CourseEntity,
    ModuleEntity,
} from "@/modules/types"
import {
    LEAF_RADIUS,
    ROOT_ID,
} from "../constants"
import type {
    MindGraph,
} from "../types"

/**
 * Build a star layout for the course mind map: course at center, modules on a
 * circle ordered by `orderIndex`.
 *
 * @param course - Active course entity (with its modules) or `undefined`.
 * @param activeModuleId - Id of the module to highlight, when any.
 * @returns The React Flow nodes + edges describing the mind map.
 */
export function buildCourseModuleGraph(
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

    const sorted = [...course.modules].sort((a, b) => a.sortIndex - b.sortIndex)
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
                label: `${mod.sortIndex}. ${mod.title}`,
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
