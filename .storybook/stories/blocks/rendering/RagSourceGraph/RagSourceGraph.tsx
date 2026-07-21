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
import { StatusChip } from "../../chips/StatusChip/StatusChip"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/rendering/RagSourceGraph`. Authored in Storybook (not
 * `src`); synced back to `src` later. Uses the already-ported local `StatusChip`
 * (relative import) instead of `@/components/blocks/chips/StatusChip`. The
 * `@xyflow/react` base CSS is loaded globally via `src/app/globals.css`
 * (imported by `.storybook/preview.tsx`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** React Flow node-type id for {@link RagSourceGraph}'s question node. */
const RAG_SOURCE_GRAPH_QUESTION_NODE_TYPE = "question" as const

/** React Flow node-type id for {@link RagSourceGraph}'s source node. */
const RAG_SOURCE_GRAPH_SOURCE_NODE_TYPE = "source" as const

/** Data carried on the single {@link RAG_SOURCE_GRAPH_QUESTION_NODE_TYPE} node. */
interface RagSourceGraphQuestionNodeData extends Record<string, unknown> {
    /** The visitor's question, shown truncated to ~2 lines. */
    question: string
}

/** Data carried on one {@link RAG_SOURCE_GRAPH_SOURCE_NODE_TYPE} node. */
interface RagSourceGraphSourceNodeData extends Record<string, unknown> {
    /** File path (or synthetic label) the chunk came from — rendered `font-mono`. */
    filePath: string
    /** First line of the chunk's excerpt, truncated. */
    snippetPreview: string
    /** Retrieval score (0-1), when the backend reports one. */
    score?: number
}

/**
 * The question — a single accent-filled node anchored on the left of the
 * canvas, fanning out to every source it grounded the answer in.
 *
 * @param props - React Flow {@link NodeProps} carrying {@link RagSourceGraphQuestionNodeData}.
 */
const RagSourceGraphQuestionNode = ({ data }: NodeProps) => {
    const { question } = data as RagSourceGraphQuestionNodeData
    return (
        <>
            {/* Connection point — required for a CUSTOM node or edges never draw. */}
            <Handle type="target" position={Position.Left} className="!size-2 !border-none !bg-muted" />
            <div className="max-w-[220px] rounded-large bg-accent px-4 py-3 shadow-sm">
                <Typography type="body-sm" weight="medium" className="line-clamp-2 text-accent-foreground">
                    {question}
                </Typography>
            </div>
            <Handle type="source" position={Position.Right} className="!size-2 !border-none !bg-muted" />
        </>
    )
}

/**
 * One retrieved source chunk — a small card naming the file it came from, a
 * one-line preview of the matched excerpt, and (when the backend reports one)
 * the retrieval score as a chip.
 *
 * @param props - React Flow {@link NodeProps} carrying {@link RagSourceGraphSourceNodeData}.
 */
const RagSourceGraphSourceNode = ({ data }: NodeProps) => {
    const { filePath, snippetPreview, score } = data as RagSourceGraphSourceNodeData
    return (
        <>
            <Handle type="target" position={Position.Left} className="!size-2 !border-none !bg-muted" />
            <div className="flex w-[220px] flex-col gap-1 rounded-large border border-default bg-surface px-3 py-2 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                    <Typography type="body-xs" weight="medium" truncate className="font-mono text-accent-soft-foreground">
                        {filePath}
                    </Typography>
                    {score != null ? (
                        <StatusChip tone="accent" className="shrink-0">
                            {score.toFixed(2)}
                        </StatusChip>
                    ) : null}
                </div>
                <Typography type="body-xs" color="muted" truncate>
                    {snippetPreview}
                </Typography>
            </div>
            <Handle type="source" position={Position.Right} className="!size-2 !border-none !bg-muted" />
        </>
    )
}

/** Node type map registered on the canvas. */
const NODE_TYPES = {
    [RAG_SOURCE_GRAPH_QUESTION_NODE_TYPE]: RagSourceGraphQuestionNode,
    [RAG_SOURCE_GRAPH_SOURCE_NODE_TYPE]: RagSourceGraphSourceNode,
}

/** Vertical gap between fanned-out source nodes, in px. */
const SOURCE_ROW_HEIGHT = 110
/** Horizontal offset of the source column from the question node, in px. */
const SOURCE_COLUMN_X = 320

/** One retrieved source chunk, as passed to {@link RagSourceGraph}. */
export interface RagSourceGraphSource {
    /** File path (or synthetic label) the chunk came from. */
    filePath: string
    /** Excerpt of the chunk's content. */
    snippet: string
    /** Retrieval score (0-1), when the backend reports one. */
    score?: number
}

/** Props for the {@link RagSourceGraph} block. */
export interface RagSourceGraphProps {
    /** The question the sources grounded the answer for — shown on the left node. */
    question: string
    /** Retrieved source chunks, fanned out on the right, one node each. */
    sources: Array<RagSourceGraphSource>
    /** Extra classes on the outer canvas frame. */
    className?: string
}

/**
 * A small `@xyflow/react` graph visualizing WHICH retrieved chunks grounded
 * one RAG answer: a single accent question node on the left, an edge to every
 * source card fanned out on the right (edge label = retrieval score, when
 * present). Mirrors `FlowDiagram`'s self-contained provider/background/fit-view
 * setup, but ships its own two node types instead of a generic labeled card,
 * since a question/source pair has a fixed shape unlike a free-form diagram.
 *
 * Node positions are computed deterministically from the source list's index
 * (question anchored at the vertical center of the fan-out) — no randomness,
 * so the same sources always lay out the same way.
 *
 * @param props - See {@link RagSourceGraphProps}.
 */
export const RagSourceGraph = ({ question, sources, className }: RagSourceGraphProps) => {
    const nodeTypes = useMemo(() => NODE_TYPES, [])

    const { nodes, edges } = useMemo<{ nodes: Array<Node>; edges: Array<Edge> }>(() => {
        const centerY = ((sources.length - 1) * SOURCE_ROW_HEIGHT) / 2

        const questionNode: Node = {
            id: "question",
            type: RAG_SOURCE_GRAPH_QUESTION_NODE_TYPE,
            position: { x: 0, y: centerY },
            data: { question } satisfies RagSourceGraphQuestionNodeData,
        }

        const sourceNodes: Array<Node> = sources.map((source, index) => ({
            id: `source-${index}`,
            type: RAG_SOURCE_GRAPH_SOURCE_NODE_TYPE,
            position: { x: SOURCE_COLUMN_X, y: index * SOURCE_ROW_HEIGHT },
            data: {
                filePath: source.filePath,
                snippetPreview: source.snippet.split("\n")[0] ?? "",
                score: source.score,
            } satisfies RagSourceGraphSourceNodeData,
        }))

        const sourceEdges: Array<Edge> = sources.map((source, index) => ({
            id: `edge-${index}`,
            source: "question",
            target: `source-${index}`,
            label: source.score != null ? source.score.toFixed(2) : undefined,
        }))

        return { nodes: [questionNode, ...sourceNodes], edges: sourceEdges }
    }, [question, sources])

    return (
        <div className={cn("h-[300px] w-full overflow-hidden rounded-large border border-default", className)}>
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
