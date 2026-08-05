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
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Box } from "@sb-components/frames/Box/Box"
import { StackH } from "@sb-components/frames/Stack/Stack"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "FlowDiagram" } as const

/** 6 basic web architecture concepts, connected along a real request flow. */

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
            <Box
                principle="title-subtitle"
                className={cn(
                    "flex min-w-[140px] max-w-[220px] flex-col items-center gap-1 rounded-large border bg-surface px-3 py-2 text-center shadow-sm transition-colors",
                    selected ? "border-accent ring-2 ring-accent/40" : "border-default",
                )}
            >
                <Typography size="sm" weight="medium" text={label} />
                {description ? (
                    <Typography size="xs" color="muted" text={description} />
                ) : null}
            </Box>
            <Handle type="source" position={Position.Bottom} className="!size-2 !border-none !bg-muted" />
        </>
    )
}

/** Node type map registered on the canvas. */
const NODE_TYPES = { [FLOW_DIAGRAM_CARD_NODE_TYPE]: FlowDiagramCardNode }

/**
 * How many placeholder cards the loading canvas shows. A per-node shimmer isn't
 * feasible before the graph is fetched (positions/edges are exactly the unknown),
 * so the composite picks a small, fixed cluster of the SAME card shape a real node
 * uses (COMPOSITE-10: it decides WHICH parts shimmer and HOW MANY; each card's
 * `Typography` decides its own shimmer shape).
 */
const SKELETON_NODE_COUNT = 3

/** Props {@link FlowDiagram} carries regardless of loading state. */
interface FlowDiagramOwnProps {
    /** Where the canvas frame sits inside its parent. */
    classNames?: Array<AllowedClassName>
}

/**
 * Props for the {@link FlowDiagram} block. `nodes`/`edges` are REQUIRED unless
 * `isSkeleton` (§12b) — a shimmer canvas has no real graph to lay out yet.
 */
export type FlowDiagramProps = FlowDiagramOwnProps &
    (
        | { isSkeleton: true; nodes?: Array<Node>; edges?: Array<Edge> }
        | {
            isSkeleton?: false
            /** Nodes to render. Use {@link FLOW_DIAGRAM_CARD_NODE_TYPE} for the built-in labeled card node. */
            nodes: Array<Node>
            /** Edges connecting the given nodes. */
            edges: Array<Edge>
        }
    )

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
export const FlowDiagram = ({ nodes, edges, isSkeleton = false, classNames}: FlowDiagramProps) => {
    const nodeTypes = useMemo(() => NODE_TYPES, [])

    // The frame stays real throughout — same footprint, border, radius whether or not
    // a graph has loaded (COMPOSITE-10: "a card that is loading is still a card").
    return (
        <div
            className={cn("h-[420px] w-full overflow-hidden rounded-large border border-default", classNames)}

            data-tier="composite"
            data-component="FlowDiagram"
        >
            {isSkeleton ? (
                <StackH
                    gap={1}
                    principle="page-pad"
                    padding={6}
                    align="center"
                    justify="center"
                    classNames={["h-full"]}
                    items={[() => (
                        <StackH
                            gap={5}
                            principle="group-boundary"
                            align="center"
                            items={Array.from({ length: SKELETON_NODE_COUNT }, () => () => (
                                <Box
                                    principle="title-subtitle"
                                    className="flex min-w-[140px] max-w-[220px] flex-col items-center gap-1 rounded-large border border-default bg-surface px-3 py-2 text-center shadow-sm"
                                >
                                    <Typography size="sm" weight="medium" isSkeleton />
                                    <Typography size="xs" color="muted" isSkeleton />
                                </Box>
                            ))}
                        />
                    )]}
                />
            ) : (
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
            )}
        </div>
    )
}
