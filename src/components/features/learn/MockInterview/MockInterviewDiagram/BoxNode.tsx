"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Handle, type Node, type NodeProps, Position, useReactFlow } from "@xyflow/react"
import { cn } from "@heroui/react"

/** React Flow node type id for the mock-interview diagram's single box node. */
export const MOCK_INTERVIEW_BOX_NODE_TYPE = "mockInterviewBox" as const

/** Data carried on a {@link MockInterviewBoxNode} — just its editable label. */
export type MockInterviewBoxNodeData = {
    /** Current label text shown on the box. */
    label: string
}

export type MockInterviewBoxNode = Node<MockInterviewBoxNodeData, typeof MOCK_INTERVIEW_BOX_NODE_TYPE>

/**
 * The diagram's only node shape: a simple rectangular labeled box. Double-click
 * enters inline rename (a plain `<input>`); `Enter` or blur commits the new label
 * back onto the node's `data.label` via `useReactFlow().updateNodeData`. Exposes a
 * connectable handle on every side so the candidate can drag an arrow from any edge
 * of the box to any edge of another box.
 *
 * @param props - React Flow `NodeProps` for `mockInterviewBox` nodes.
 */
export const BoxNode = ({ id, data, selected }: NodeProps<MockInterviewBoxNode>) => {
    const { updateNodeData } = useReactFlow()
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState(data.label)
    const inputRef = useRef<HTMLInputElement>(null)

    // keep the draft in sync if the label changes from outside while not editing
    useEffect(() => {
        if (!isEditing) {
            setDraft(data.label)
        }
    }, [data.label, isEditing])

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [isEditing])

    const commit = useCallback(() => {
        const next = draft.trim()
        updateNodeData(id, { label: next.length > 0 ? next : data.label })
        setIsEditing(false)
    }, [draft, id, data.label, updateNodeData])

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                event.preventDefault()
                commit()
            } else if (event.key === "Escape") {
                event.preventDefault()
                setDraft(data.label)
                setIsEditing(false)
            }
        },
        [commit, data.label],
    )

    return (
        <div
            className={cn(
                "relative flex min-h-[56px] min-w-[140px] items-center justify-center rounded-xl border bg-surface px-4 py-2 text-center shadow-sm transition-colors",
                selected ? "border-accent ring-2 ring-accent/40" : "border-divider",
            )}
            onDoubleClick={() => setIsEditing(true)}
        >
            <Handle className="opacity-0" position={Position.Top} type="target" />
            <Handle className="opacity-0" position={Position.Top} id="top-source" type="source" />
            <Handle className="opacity-0" position={Position.Right} type="source" />
            <Handle className="opacity-0" position={Position.Right} id="right-target" type="target" />
            <Handle className="opacity-0" position={Position.Bottom} type="target" />
            <Handle className="opacity-0" position={Position.Bottom} id="bottom-source" type="source" />
            <Handle className="opacity-0" position={Position.Left} type="source" />
            <Handle className="opacity-0" position={Position.Left} id="left-target" type="target" />

            {isEditing ? (
                <input
                    ref={inputRef}
                    className="nodrag w-full bg-transparent text-center text-sm text-foreground outline-none"
                    onBlur={commit}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleKeyDown}
                    value={draft}
                />
            ) : (
                <span className="max-w-full break-words text-sm text-foreground">{data.label}</span>
            )}
        </div>
    )
}
