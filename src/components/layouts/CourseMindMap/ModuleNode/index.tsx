"use client"

import React from "react"
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react"
import { cn } from "@heroui/react"

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

/**
 * Module leaf styled like the course root card, with a hidden target handle (no visible dots).
 * @param props — React Flow `NodeProps` for `courseModule` nodes.
 */
export const CourseModuleNode = (props: NodeProps<CourseModuleFlowNode>) => {
    const { data, selected } = props

    return (
        <div
            className={cn(
                "relative flex min-h-[100px] min-w-[300px] w-[300px] items-center justify-center rounded-3xl px-4 py-3 text-center",
                "border border-divider/60 shadow-sm dark:border-zinc-500/50 dark:shadow-lg dark:shadow-black/30",
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
            <div className="max-w-full text-pretty text-sm font-semibold leading-snug text-foreground">
                {data.label}
            </div>
        </div>
    )
}
