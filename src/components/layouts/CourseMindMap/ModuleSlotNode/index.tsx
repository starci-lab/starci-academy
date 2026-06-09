"use client"

import React, { useCallback } from "react"
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react"
import { cn } from "@heroui/react"

import { COURSE_MODULE_SLOT_NODE_TYPE, SLOT_NODE_HEIGHT, SLOT_NODE_WIDTH } from "../moduleExpansion"
import { useMindMapContentDetailsOverlayState } from "@/hooks"

export type CourseModuleSlotNodeData = {
    /** Parent `courseModule` node id this lesson belongs to. */
    parentModuleId: string
    /** Course mount slug — needed to build the lesson URL. */
    courseDisplayId: string
    /** Owning module id — part of the lesson URL. */
    moduleId: string
    /** Lesson (content) id this card opens. */
    contentId: string
    /** Lesson title shown on the card. */
    label: string
    /** True when the parent module sits in the left column (handle faces right, toward the module). */
    isLeft: boolean
}

export type CourseModuleSlotFlowNode = Node<CourseModuleSlotNodeData, typeof COURSE_MODULE_SLOT_NODE_TYPE>

/**
 * Real lesson card expanded beside a course module. Clicking opens the details drawer (no navigation).
 * @param props — React Flow `NodeProps` for `courseModuleContent` nodes.
 */
export const CourseModuleSlotNode = (props: NodeProps<CourseModuleSlotFlowNode>) => {
    const { data, selected } = props
    const { open: openDetails } = useMindMapContentDetailsOverlayState()

    const onOpen = useCallback(() => {
        // open the global details drawer for this lesson — stay on the mind-map
        openDetails({
            contentId: data.contentId,
            moduleId: data.moduleId,
        })
    }, [
        openDetails,
        data.contentId,
        data.moduleId,
    ])

    return (
        <button
            type="button"
            onClick={(event) => {
                // keep the click on the card → open lesson; don't let the canvas zoom-handler also fire
                event.stopPropagation()
                onOpen()
            }}
            className={cn(
                "nodrag nopan relative flex items-center justify-center rounded-2xl px-3 py-2 text-center",
                "border bg-background/90 text-sm font-medium text-foreground shadow-sm outline-none",
                "transition-colors hover:border-accent hover:bg-accent/5",
                "focus-visible:ring-2 focus-visible:ring-accent/40",
                "dark:border-zinc-600/80 dark:bg-zinc-900/90 dark:hover:bg-accent/10",
                selected && "ring-2 ring-accent/25 dark:ring-accent/35",
            )}
            style={{ width: SLOT_NODE_WIDTH, minHeight: SLOT_NODE_HEIGHT }}
        >
            <Handle
                isConnectable={false}
                className="!h-px !w-px !min-h-0 !min-w-0 !border-0 !bg-transparent !opacity-0"
                position={data.isLeft ? Position.Right : Position.Left}
                type="target"
            />
            <span className="line-clamp-2 leading-snug">{data.label}</span>
        </button>
    )
}
