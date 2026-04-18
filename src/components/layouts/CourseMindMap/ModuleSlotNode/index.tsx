"use client"

import React from "react"
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"

import { COURSE_MODULE_SLOT_NODE_TYPE, SLOT_NODE_HEIGHT } from "../moduleExpansion"

export type CourseModuleSlotNodeData = {
    /** Parent `courseModule` node id this slot belongs to. */
    parentModuleId: string
}

export type CourseModuleSlotFlowNode = Node<CourseModuleSlotNodeData, typeof COURSE_MODULE_SLOT_NODE_TYPE>

/**
 * Small read-only card node attached under a course module (placeholder content).
 * @param props — React Flow `NodeProps` for `courseModuleSlot` nodes.
 */
export const CourseModuleSlotNode = (props: NodeProps<CourseModuleSlotFlowNode>) => {
    const { selected } = props
    const t = useTranslations()

    return (
        <div
            className={cn(
                "relative flex min-w-[200px] w-[200px] items-center justify-center rounded-2xl px-3 py-2 text-center",
                "border border-divider/70 bg-background/90 text-sm font-medium text-foreground shadow-sm",
                "dark:border-zinc-600/80 dark:bg-zinc-900/90",
                selected && "ring-2 ring-accent/25 dark:ring-accent/35",
            )}
            style={{ minHeight: SLOT_NODE_HEIGHT }}
        >
            <Handle
                isConnectable={false}
                className="!h-px !w-px !min-h-0 !min-w-0 !border-0 !bg-transparent !opacity-0"
                position={Position.Top}
                type="target"
            />
            {t("content.mindMapHelloWorld")}
        </div>
    )
}
