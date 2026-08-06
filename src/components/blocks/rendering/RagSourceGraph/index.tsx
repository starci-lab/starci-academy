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
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import { StatusChip } from "@/components/blocks/chips/StatusChip"

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
            {/* `Box`: the frame tier's escape hatch for a foreign-library mount point (here, an
                `@xyflow/react` custom node) — a plain flex/atom composition can't carry the
                node's own bg/rounded/shadow skin. */}
            <Box className="max-w-[220px] rounded-large bg-accent px-4 py-3 shadow-sm">
                {/* missingVocabulary: `Typography`'s color axis pairs `accent-soft` with a
                    SOFT-tinted surface but has no foreground for text on a SOLID `bg-accent`
                    surface, so the atom can't reproduce `text-accent-foreground` here. Kept as
                    a plain element rather than losing contrast to the atom's default color. */}
                <p className="line-clamp-2 text-sm font-medium text-accent-foreground">{question}</p>
            </Box>
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

    // `StatusChip` (block tier) exposes no `classNames`/positioning escape hatch at all — not
    // even the closed `AllowedClassName` set atoms/frames get — so it can no longer be told
    // `shrink-0`. Worked around from the OTHER side of the row instead: `filePath` below takes
    // `min-w-0`/`flex-1`, which lets IT shrink/truncate first and leaves the chip its natural size.
    const filePathRowItems = [
        () => (
            // missingVocabulary: `Typography` has no plain monospace body variant — its
            // `size="code"` wraps HeroUI's `.typography--code`, which pulls in a padded/`bg-default`
            // pill, not a bare `font-mono` run — so the exact `font-mono text-accent-soft-foreground`
            // pairing this file path needs can't be expressed through the atom.
            <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium text-accent-soft-foreground">
                {filePath}
            </span>
        ),
        ...(score != null ? [() => <StatusChip tone="accent">{score.toFixed(2)}</StatusChip>] : []),
    ]

    return (
        <>
            <Handle type="target" position={Position.Left} className="!size-2 !border-none !bg-muted" />
            {/* `Box`: same foreign-library-mount rationale as the question node above. */}
            <Box className="w-[220px] rounded-large border border-default bg-surface px-3 py-2 shadow-sm">
                <StackV
                    gap={2}
                    principle="title-subtitle"
                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                    items={[
                        () => <StackH gap={3} principle="chip-row" justify="between" items={filePathRowItems} explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."/>,
                        () => <Typography size="xs" color="muted" truncate text={snippetPreview} />,
                    ]}
                />
            </Box>
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

/**
 * Props for the {@link RagSourceGraph} block. Does NOT take `className`
 * (BLOCK-4) — its only caller (`PlaygroundRagWorkspace`) never passed one, so
 * the escape hatch closes outright rather than being renamed to `classNames`.
 */
export interface RagSourceGraphProps {
    /** The question the sources grounded the answer for — shown on the left node. */
    question: string
    /** Retrieved source chunks, fanned out on the right, one node each. */
    sources: Array<RagSourceGraphSource>
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
 *
 * @see Story: .storybook/stories/blocks/rendering/RagSourceGraph/RagSourceGraph.stories
 */
export const RagSourceGraph = ({ question, sources }: RagSourceGraphProps) => {
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
        // Plain `div` rather than `Box`: this root must self-identify as the BLOCK
        // (`data-tier`/`data-component`), and `Box` hard-codes its own `"frame"`/`"Box"` pair —
        // the same reason the sibling `FlowDiagram` composite's root stays a hand-written `div`.
        <div
            data-tier="block"
            data-component="RagSourceGraph"
            className="h-[300px] w-full overflow-hidden rounded-large border border-default"
        >
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
