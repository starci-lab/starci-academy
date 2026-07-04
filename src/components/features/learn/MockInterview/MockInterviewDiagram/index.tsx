"use client"

import React, { useCallback, useEffect, useMemo, useRef } from "react"
import {
    addEdge,
    Background,
    BackgroundVariant,
    type Connection,
    Controls,
    type Edge,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "@xyflow/react"
import { Button, cn } from "@heroui/react"
import { PlusIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { BoxNode, MOCK_INTERVIEW_BOX_NODE_TYPE, type MockInterviewBoxNode } from "./BoxNode"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** A single box on the diagram, simplified to the fields a parent actually needs. */
export interface MockInterviewDiagramNodeSnapshot {
    /** Box id. */
    id: string
    /** Box's current label text. */
    label: string
}

/** A single arrow on the diagram, simplified to the fields a parent actually needs. */
export interface MockInterviewDiagramEdgeSnapshot {
    /** Id of the box the arrow starts from. */
    source: string
    /** Id of the box the arrow points to. */
    target: string
}

/** Props for the {@link MockInterviewDiagram} block. */
export interface MockInterviewDiagramProps extends WithClassNames<undefined> {
    /**
     * Fired whenever the boxes or arrows change (add/move/rename/connect/delete),
     * with a plain-object snapshot of the current diagram — not the internal
     * `@xyflow/react` node/edge objects — so a parent can grab the latest state
     * without importing xyflow types.
     */
    onChange?: (
        nodes: Array<MockInterviewDiagramNodeSnapshot>,
        edges: Array<MockInterviewDiagramEdgeSnapshot>,
    ) => void
}

/** Node type map registered on the canvas — a single rectangular labeled box. */
const NODE_TYPES = { [MOCK_INTERVIEW_BOX_NODE_TYPE]: BoxNode }

/** Starting box so the canvas never opens fully empty. */
const INITIAL_NODES: Array<MockInterviewBoxNode> = [
    {
        id: "box-1",
        type: MOCK_INTERVIEW_BOX_NODE_TYPE,
        position: { x: 0, y: 0 },
        data: { label: "New box" },
    },
]

const INITIAL_EDGES: Array<Edge> = []

/** Horizontal/vertical offset applied to each newly added box so they don't stack exactly. */
const NEW_BOX_OFFSET = 40

let nextBoxId = 2

/**
 * The interactive canvas rendered inside {@link MockInterviewDiagram} — split out
 * so it can freely use `@xyflow/react` hooks (`useNodesState`, `useEdgesState`)
 * under a `ReactFlowProvider`.
 */
const MockInterviewDiagramCanvas = ({ className, onChange }: MockInterviewDiagramProps) => {
    const t = useTranslations()
    const [nodes, setNodes, onNodesChange] = useNodesState<MockInterviewBoxNode>(INITIAL_NODES)
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(INITIAL_EDGES)
    /** Position of the most recently added box, so the next one offsets from it (not the origin). */
    const lastAddedPositionRef = useRef(INITIAL_NODES[0]?.position ?? { x: 0, y: 0 })

    const onConnect = useCallback(
        (connection: Connection) => setEdges((current) => addEdge(connection, current)),
        [setEdges],
    )

    const addBox = useCallback(() => {
        const position = {
            x: lastAddedPositionRef.current.x + NEW_BOX_OFFSET,
            y: lastAddedPositionRef.current.y + NEW_BOX_OFFSET,
        }
        lastAddedPositionRef.current = position

        const newNode: MockInterviewBoxNode = {
            id: `box-${nextBoxId++}`,
            type: MOCK_INTERVIEW_BOX_NODE_TYPE,
            position,
            data: { label: t("mockInterview.diagram.newBoxLabel") },
        }
        setNodes((current) => [...current, newNode])
    }, [setNodes, t])

    // notify the parent with a plain-object snapshot whenever boxes or arrows change
    useEffect(() => {
        onChange?.(
            nodes.map((node) => ({ id: node.id, label: node.data.label })),
            edges.map((edge) => ({ source: edge.source, target: edge.target })),
        )
    }, [nodes, edges, onChange])

    const nodeTypes = useMemo(() => NODE_TYPES, [])

    return (
        <div className={cn("relative flex h-64 w-full flex-col overflow-hidden rounded-xl border border-divider sm:h-80", className)}>
            <div className="flex items-center justify-between gap-2 border-b border-divider bg-surface px-3 py-2">
                <span className="text-sm font-medium text-foreground">{t("mockInterview.diagram.title")}</span>
                <Button onPress={addBox} size="sm" variant="secondary">
                    <PlusIcon aria-hidden className="size-4" focusable="false" />
                    {t("mockInterview.diagram.addBox")}
                </Button>
            </div>
            <div className="relative min-h-0 flex-1">
                <ReactFlow
                    aria-label={t("mockInterview.diagram.canvasAria")}
                    className="text-foreground"
                    deleteKeyCode={["Backspace", "Delete"]}
                    edges={edges}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    maxZoom={2}
                    minZoom={0.3}
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    onConnect={onConnect}
                    onEdgesChange={onEdgesChange}
                    onNodesChange={onNodesChange}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background gap={16} variant={BackgroundVariant.Dots} />
                    <Controls showFitView showInteractive={false} showZoom />
                </ReactFlow>
            </div>
        </div>
    )
}

/**
 * A minimal, self-contained editable box-and-arrow canvas for a mock-interview
 * candidate to sketch a system on. Backed by `@xyflow/react`: add a box from the
 * toolbar, drag it anywhere, double-click a box to rename its label inline, drag
 * from one box's edge to another to draw an arrow between them, select a box or
 * arrow and press `Backspace`/`Delete` to remove it, and pan/zoom the canvas
 * freely. Deliberately minimal — a single box shape, no auto-layout, no
 * grouping/subflows, no persistence, no undo/redo, no export.
 *
 * Wraps the canvas in a `ReactFlowProvider` so its custom node (which reads
 * `useReactFlow()` to commit inline-rename edits) always has store context, even
 * if this block is ever composed with other `@xyflow/react` trees on the page.
 *
 * @param props - {@link MockInterviewDiagramProps}
 */
export const MockInterviewDiagram = (props: MockInterviewDiagramProps) => {
    return (
        <ReactFlowProvider>
            <MockInterviewDiagramCanvas {...props} />
        </ReactFlowProvider>
    )
}
