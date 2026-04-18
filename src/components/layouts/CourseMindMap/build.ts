import type { CourseEntity } from "@/modules/types"
import { Edge, Node } from "@xyflow/react"
import {
    COURSE_ROOT_NODE_TYPE,
    ROOT_HANDLE_LEFT,
    ROOT_HANDLE_RIGHT,
} from "./RootNode"
import { COURSE_MODULE_NODE_TYPE } from "./ModuleNode"
import { pastelBackgroundForIndex, type MindMapThemeMode } from "./pastel"

const ROOT_ID = "course-root"

/**
 * Distance between module card **centers** on the Y axis (px).
 * With `CARD_MIN_HEIGHT` 100, this yields a small visible gap between stacked cards.
 */
const VERTICAL_GAP = 128

/**
 * Horizontal distance from graph origin (root center) to each module column **center** (px).
 * Same magnitude left/right so the mind map stays symmetric.
 */
const HORIZONTAL_DISTANCE = 420

/** Card width shared by root + module nodes (`RootNode` / `ModuleNode`). */
const CARD_WIDTH = 300

/** Minimum card height used for layout math (`min-h` on nodes). */
const CARD_MIN_HEIGHT = 100

const CARD_HALF_WIDTH = CARD_WIDTH / 2
const CARD_HALF_HEIGHT = CARD_MIN_HEIGHT / 2

/**
 * The mind graph.
 */
export interface MindGraph {
    /** The nodes of the mind graph. */
    nodes: Array<Node>
    /** The edges of the mind graph. */
    edges: Array<Edge>
}

/**
 * The mind graph builder.
 */
export interface BuildParams {
    /** The course entity. */
    course: CourseEntity | undefined
    /** The active module id. */
    activeModuleId: string | undefined
    /** Resolved UI theme for pastel fills and edge contrast. */
    themeMode?: MindMapThemeMode
}

/**
 * Builds a left/right column mind graph: custom root + module cards, Bezier edges (solid stroke).
 */
export const build = ({ course, activeModuleId, themeMode = "light" }: BuildParams): MindGraph => {
    const rootNodeId = course?.id ? `root-${course.id}` : ROOT_ID
    const title = course?.title?.trim() || ""
    const isDark = themeMode === "dark"

    if (!course?.modules?.length) {
        return {
            nodes: [
                {
                    id: rootNodeId,
                    type: COURSE_ROOT_NODE_TYPE,
                    position: { x: -CARD_HALF_WIDTH, y: -CARD_HALF_HEIGHT },
                    data: { label: title || "—", minimal: true },
                    draggable: false,
                    selectable: false,
                },
            ],
            edges: [],
        }
    }

    const sorted = [...course.modules].sort((a, b) => a.orderIndex - b.orderIndex)

    // Place root so its geometric center is at (0, 0) — keeps left/right columns visually balanced.
    const rootNode: Node = {
        id: rootNodeId,
        type: COURSE_ROOT_NODE_TYPE,
        position: { x: -CARD_HALF_WIDTH, y: -CARD_HALF_HEIGHT },
        data: { label: title },
        draggable: true,
        selectable: false,
    }

    const numModules = sorted.length
    const numLeftModules = Math.ceil(numModules / 2)

    const moduleNodes: Array<Node> = sorted.map((module, index) => {
        const isLeft = index < numLeftModules
        // Module center X at ±HORIZONTAL_DISTANCE; top-left = center minus half card width (symmetric both sides).
        const centerX = isLeft ? -HORIZONTAL_DISTANCE : HORIZONTAL_DISTANCE
        const x = centerX - CARD_HALF_WIDTH

        const countInSide = isLeft ? numLeftModules : numModules - numLeftModules
        const indexInSide = isLeft ? index : index - numLeftModules
        // Stack column around y = 0 (same center as root).
        const centerY = (indexInSide - (countInSide - 1) / 2) * VERTICAL_GAP
        const y = centerY - CARD_HALF_HEIGHT

        const isActive = Boolean(activeModuleId && module.id === activeModuleId)

        return {
            id: module.id,
            type: COURSE_MODULE_NODE_TYPE,
            position: { x, y },
            data: {
                label: `${module.orderIndex + 1}. ${module.title}`,
                isLeft,
                isActive,
                pastelBackground: pastelBackgroundForIndex(index, themeMode),
            },
            draggable: false,
            selectable: true,
        }
    })

    const edges: Array<Edge> = sorted.map((module, index) => {
        const isLeft = index < numLeftModules
        return {
            id: `e-${rootNodeId}-${module.id}`,
            source: rootNodeId,
            sourceHandle: isLeft ? ROOT_HANDLE_LEFT : ROOT_HANDLE_RIGHT,
            target: module.id,
            type: "default",
            animated: false,
            style: {
                stroke: "var(--accent)",
                strokeWidth: 2,
                opacity: isDark ? 0.95 : 0.9,
            },
        }
    })

    return {
        nodes: [rootNode, ...moduleNodes],
        edges,
    }
}
