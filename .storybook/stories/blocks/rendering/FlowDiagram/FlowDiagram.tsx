"use client"

import React, { useMemo } from "react"
import {
    Background,
    BackgroundVariant,
    type Edge,
    Handle,
    type Node,
    type NodeProps,
    Position,
    ReactFlow,
    ReactFlowProvider,
} from "@xyflow/react"
import { cn, Typography } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/rendering/FlowDiagram`. Authored in Storybook (not `src`);
 * synced back to `src` later. The `@xyflow/react` base CSS is loaded globally via
 * `src/app/globals.css` (imported by `.storybook/preview.tsx`), so the canvas
 * lays out correctly here without a per-story import.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** React Flow node-type id for {@link FlowDiagram}'s built-in labeled card node. */
export const FLOW_DIAGRAM_CARD_NODE_TYPE = "card" as const

/** Data carried on a {@link FLOW_DIAGRAM_CARD_NODE_TYPE} node. */
export interface FlowDiagramCardNodeData extends Record<string, unknown> {
    /** Primary label shown on the card. */
    label: string
    /** Optional supporting text shown below the label, in muted tone. */
    description?: string
}

/**
 * Simple labeled card node — a rounded, bordered surface with a title and an
 * optional muted description, styled with design-system tokens/Typography
 * (no raw colors), matching how the other React Flow surfaces in this repo
 * (MindMap's module node, the mock-interview box node) style their nodes.
 *
 * @param props - React Flow {@link NodeProps} carrying {@link FlowDiagramCardNodeData}.
 */
const FlowDiagramCardNode = ({ data, selected }: NodeProps) => {
    const { label, description } = data as FlowDiagramCardNodeData
    return (
        <>
            {/* Connection points — required for a CUSTOM node or edges never draw. */}
            <Handle type="target" position={Position.Top} className="!size-2 !border-none !bg-muted" />
            <div
                className={cn(
                    "min-w-[140px] max-w-[220px] rounded-large border bg-surface px-4 py-2.5 text-center shadow-sm transition-colors",
                    selected ? "border-accent ring-2 ring-accent/40" : "border-default",
                )}
            >
                <Typography type="body-sm" weight="medium">{label}</Typography>
                {description ? (
                    <Typography type="body-xs" color="muted" className="mt-1">{description}</Typography>
                ) : null}
            </div>
            <Handle type="source" position={Position.Bottom} className="!size-2 !border-none !bg-muted" />
        </>
    )
}

/** Node type map registered on the canvas. */
const NODE_TYPES = { [FLOW_DIAGRAM_CARD_NODE_TYPE]: FlowDiagramCardNode }

/** Props for the {@link FlowDiagram} block. */
export interface FlowDiagramProps {
    /** Nodes to render. Use {@link FLOW_DIAGRAM_CARD_NODE_TYPE} for the built-in labeled card node. */
    nodes: Array<Node>
    /** Edges connecting the given nodes. */
    edges: Array<Edge>
    /** Extra classes on the outer canvas frame. */
    className?: string
}

/**
 * Self-contained, presentational `@xyflow/react` rendering block: a sized,
 * bordered canvas that fits the given graph into view on mount, with a dotted
 * background. Generic — it isn't tied to any feature's data shape, unlike the
 * mind-map/knowledge-graph/mock-interview canvases which carry their own
 * domain logic. Ships one built-in node type ({@link FLOW_DIAGRAM_CARD_NODE_TYPE})
 * for simple labeled-card diagrams; pass nodes with a different `type` (and
 * register it yourself) to render anything else through the same canvas.
 *
 * Wraps `ReactFlow` in a `ReactFlowProvider` so it always has store context,
 * even if this block is ever composed with other `@xyflow/react` trees on
 * the page.
 *
 * @param props - See {@link FlowDiagramProps}.
 */
export const FlowDiagram = ({ nodes, edges, className }: FlowDiagramProps) => {
    const nodeTypes = useMemo(() => NODE_TYPES, [])

    return (
        <div className={cn("h-[420px] w-full overflow-hidden rounded-large border border-default", className)}>
            <ReactFlowProvider>
                <ReactFlow
                    className="text-foreground"
                    defaultEdges={edges}
                    defaultNodes={nodes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    maxZoom={2}
                    minZoom={0.2}
                    nodeTypes={nodeTypes}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background gap={16} variant={BackgroundVariant.Dots} />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    )
}
