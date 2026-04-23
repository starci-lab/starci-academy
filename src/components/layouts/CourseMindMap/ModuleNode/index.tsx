"use client"

import React, { useCallback } from "react"
import { Handle, type Edge, type Node, type NodeProps, Position, useReactFlow, useStore } from "@xyflow/react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"

import {
    COURSE_MODULE_SLOT_NODE_TYPE,
    MODULE_CARD_BODY_HEIGHT,
    MODULE_CHILD_SOURCE_HANDLE,
    SLOT_FIRST_OFFSET_Y,
    SLOT_NODE_WIDTH,
    SLOT_VERTICAL_STEP,
    moduleSlotNodeId,
} from "../moduleExpansion"

/** React Flow node type id for course modules (card + invisible target handle). */
export const COURSE_MODULE_NODE_TYPE = "courseModule" as const

export type CourseModuleNodeData = {
    /** Module title line (order + title). */
    label: string
    /** True when this module sits in the left column (target handle on the right). */
    isLeft: boolean
    /** Whether this module is the active selection in Redux. */
    isActive: boolean
    /** Inline pastel fill from {@link pastelBackgroundForIndex}. */
    pastelBackground: string
}

export type CourseModuleFlowNode = Node<CourseModuleNodeData, typeof COURSE_MODULE_NODE_TYPE>

const SLOT_COUNT = 5

/**
 * Module node: click the title area to add/remove five real child nodes (React Flow slots).
 * @param props — React Flow `NodeProps` for `courseModule` nodes.
 */
export const CourseModuleNode = (props: NodeProps<CourseModuleFlowNode>) => {
    const { id, data, selected } = props
    const t = useTranslations()
    const { getNode, setNodes, setEdges } = useReactFlow()

    const expanded = useStore(
        useCallback((state) => state.nodes.some((node) => node.id === moduleSlotNodeId(id, 0)), [id]),
    )

    const toggleSlots = useCallback(() => {
        const self = getNode(id)
        if (!self) {
            return
        }

        const slot0Id = moduleSlotNodeId(id, 0)
        const hasSlots = getNode(slot0Id)

        if (hasSlots) {
            const slotPrefix = `${id}__slot__`
            setNodes((nodes) => nodes.filter((node) => !node.id.startsWith(slotPrefix)))
            setEdges((edges) => edges.filter((edge) => !edge.target.startsWith(slotPrefix)))
            return
        }

        const slotX = self.position.x + (300 - SLOT_NODE_WIDTH) / 2
        const baseY = self.position.y + MODULE_CARD_BODY_HEIGHT + SLOT_FIRST_OFFSET_Y

        const slotNodes: Array<Node> = Array.from({ length: SLOT_COUNT }, (_, index) => ({
            id: moduleSlotNodeId(id, index),
            type: COURSE_MODULE_SLOT_NODE_TYPE,
            position: { x: slotX, y: baseY + index * SLOT_VERTICAL_STEP },
            data: { parentModuleId: id },
            draggable: false,
            selectable: false,
        }))

        const slotEdges: Array<Edge> = Array.from({ length: SLOT_COUNT }, (_, index) => ({
            id: `e-${id}__slot__${index}`,
            source: id,
            sourceHandle: MODULE_CHILD_SOURCE_HANDLE,
            target: moduleSlotNodeId(id, index),
            type: "default",
            animated: false,
            style: {
                stroke: "var(--accent)",
                strokeWidth: 1.5,
                opacity: 0.85,
            },
        }))

        setNodes((nodes) => [...nodes, ...slotNodes])
        setEdges((edges) => [...edges, ...slotEdges])
    }, [getNode, id, setEdges, setNodes])

    const onToggleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                toggleSlots()
            }
        },
        [toggleSlots],
    )

    return (
        <div
            className={cn(
                "relative flex min-h-[100px] min-w-[300px] w-[300px] flex-col items-stretch rounded-3xl px-4 py-3 text-center",
                "border /60 shadow-sm dark:border-zinc-500/50 dark:shadow-lg dark:shadow-black/30",
                data.isActive && "border-accent ring-2 ring-accent/35 dark:ring-accent/45",
                selected && "ring-2 ring-accent/25 dark:ring-accent/35",
            )}
            style={{ backgroundColor: data.pastelBackground }}
        >
            <Handle
                isConnectable={false}
                className="!h-px !w-px !min-h-0 !min-w-0 !border-0 !bg-transparent !opacity-0"
                position={data.isLeft ? Position.Right : Position.Left}
                type="target"
            />
            <Handle
                id={MODULE_CHILD_SOURCE_HANDLE}
                isConnectable={false}
                className="!h-px !w-px !min-h-0 !min-w-0 !border-0 !bg-transparent !opacity-0"
                position={Position.Bottom}
                type="source"
            />
            <button
                type="button"
                aria-expanded={expanded}
                aria-label={t("content.mindMapModuleToggleAria")}
                className={cn(
                    "nodrag nopan w-full cursor-pointer rounded-2xl px-1 py-2 text-center outline-none transition-colors",
                    "hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-accent/40 dark:hover:bg-white/10",
                    "flex min-h-0 flex-1 items-center justify-center",
                )}
                onClick={(event) => {
                    event.stopPropagation()
                    toggleSlots()
                }}
                onKeyDown={onToggleKeyDown}
            >
                <div className="max-w-full text-pretty text-sm font-semibold leading-snug text-foreground">
                    {data.label}
                </div>
            </button>
        </div>
    )
}
