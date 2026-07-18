"use client"

import React, {
    useEffect,
    useMemo,
    useRef,
} from "react"
import {
    Background,
    BackgroundVariant,
    Controls,
    Handle,
    MiniMap,
    Position,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
    useStore,
    type NodeProps,
    type NodeTypes,
} from "@xyflow/react"
import {
    Typography,
    cn,
} from "@heroui/react"
import { useAppSelector } from "@/redux/hooks"
import type {
    CourseMindMapData,
    CourseMindMapNodeData,
} from "@/modules/api/graphql/queries/types"
import type { MindMapTier } from "../MindMapRail"
import {
    POP_RANK,
    TIER_MIN,
    tierAllows,
} from "../mindMapFilter"
import { MindMapNodeDrawer } from "@/components/drawers/MindMapNodeDrawer"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Border-ring tone per popularity tier (green / yellow / red) — the ring signals how common a keyword is. */
const RING_BY_POP: Record<string, string> = {
    high: "border-success",
    medium: "border-warning",
    low: "border-danger",
}
/** MiniMap swatch colour per tier (SVG fill wants a concrete colour, not a utility class). */
const MINIMAP_BY_POP: Record<string, string> = {
    high: "#2f8f57",
    medium: "#c99a1e",
    low: "#c0392b",
}

/**
 * One authored KEYWORD — a card whose RING colour encodes its popularity tier (green = very common,
 * yellow = common, red = specialized). The face carries ONLY the keyword; the explainer + related
 * surfaces (via RAG) live in the drawer that opens on click.
 */
const ConceptNode = ({ data, selected }: NodeProps) => {
    const node = data as unknown as CourseMindMapNodeData
    const ring = (node.popularity && RING_BY_POP[node.popularity]) || "border-default"
    return (
        <div
            className={cn(
                "max-w-[220px] rounded-2xl border-2 bg-surface px-3.5 py-2 shadow-surface transition-shadow hover:shadow-md",
                selected ? "border-accent" : ring,
            )}
        >
            <Handle type="target" position={Position.Left} className="!size-2 !border-0 !bg-transparent !opacity-0" />
            <Typography type="body-sm" weight="medium" className="line-clamp-2">
                {node.label}
            </Typography>
            <Handle type="source" position={Position.Right} className="!size-2 !border-0 !bg-transparent !opacity-0" />
        </div>
    )
}

/** The course root — the trunk every branch hangs off. */
const RootNode = ({ data }: NodeProps) => {
    const node = data as unknown as CourseMindMapNodeData
    return (
        <div className="max-w-[220px] rounded-2xl bg-accent px-4 py-3 text-center shadow-surface">
            <Typography type="body-sm" weight="bold" className="text-accent-foreground line-clamp-2">
                {node.label}
            </Typography>
            <Handle type="source" position={Position.Right} className="!size-2 !border-0 !bg-transparent !opacity-0" />
        </div>
    )
}

/** Stable map — React Flow re-mounts every node when this identity changes. */
const nodeTypes: NodeTypes = {
    concept: ConceptNode,
    course: RootNode,
}

/** Half a node's box — `setCenter` wants the node CENTRE, positions are the top-left corner. */
const NODE_HALF_W = 110
const NODE_HALF_H = 20

/** Left margin (px) the course root is pinned to on the initial frame. */
const INITIAL_LEFT = 72
/** Readable-but-dense zoom the map opens at (small enough to show many, big enough to read). */
const INITIAL_ZOOM = 0.8

/**
 * Frames the map ONCE per mount: the course root pinned near the LEFT edge, vertically centred, at
 * a readable zoom — so it opens the same way on every mount / F5 / re-mount (thầy 2026-07-18: "render
 * cận cái khóa · tên khóa sát trái · đủ nhỏ để render nhiều, đủ to để đọc"). Not `fitView` (which
 * centres the whole tree's bbox → an empty middle). Must live INSIDE the flow.
 */
const InitialFrame = ({
    nodes,
}: {
    nodes: CourseMindMapData["nodes"]
}) => {
    const { setViewport } = useReactFlow()
    const paneHeight = useStore((state) => state.height)
    const framed = useRef(false)
    useEffect(() => {
        if (framed.current || !paneHeight) {
            return
        }
        const root = nodes.find((candidate) => candidate.type === "course")
        if (!root) {
            return
        }
        framed.current = true
        void setViewport(
            {
                // root.x is 0 (column 0) → screen x = INITIAL_LEFT; y translated so root sits centred.
                x: INITIAL_LEFT,
                y: paneHeight / 2 - root.position.y * INITIAL_ZOOM,
                zoom: INITIAL_ZOOM,
            },
            { duration: 0 },
        )
    }, [paneHeight, nodes, setViewport])
    return null
}

/** Recentres the viewport on the selected node whenever it changes (must live INSIDE the flow). */
const FocusOnSelect = ({
    selectedId,
    nodes,
}: {
    selectedId: string | null
    nodes: CourseMindMapData["nodes"]
}) => {
    const { setCenter } = useReactFlow()
    useEffect(() => {
        if (!selectedId) {
            return
        }
        const node = nodes.find((candidate) => candidate.id === selectedId)
        if (node) {
            void setCenter(node.position.x + NODE_HALF_W, node.position.y + NODE_HALF_H, {
                zoom: 0.9,
                duration: 600,
            })
        }
    }, [selectedId, nodes, setCenter])
    return null
}

/** Props for {@link ConceptMap}. */
export interface ConceptMapProps extends WithClassNames<undefined> {
    /** The full keyword graph (server-laid-out). */
    data: CourseMindMapData
    /** Live search text — hides non-matching nodes (keeping matches + their ancestor path). */
    query: string
    /** Popularity floor — dims lower tiers while browsing (no search). */
    tier: MindMapTier
    /** The node whose drawer is open + which the view is centred on (`null` = none). */
    selectedId: string | null
    /** Select a node (open its drawer + recentre) — `null` closes. */
    onSelectId: (id: string | null) => void
}

/**
 * The keyword-map CANVAS (controlled) — React Flow over the server's tidy-tree positions. Ring
 * colour = popularity; clicking a node (or a rail result) selects it → the view recentres
 * (`FocusOnSelect`) and its drawer (explainer + RAG surfaces) opens. Search HIDES non-matching
 * nodes but keeps each match's ancestor path so it never floats context-free; the tier filter dims
 * lower tiers while browsing. Filter + selection state is owned by the parent workspace.
 *
 * @param props - {@link ConceptMapProps}
 */
export const ConceptMap = ({
    data,
    query,
    tier,
    selectedId,
    onSelectId,
    className,
}: ConceptMapProps) => {
    const courseId = useAppSelector((state) => state.course.id)
    const displayId = useAppSelector((state) => state.course.displayId)

    // when searching, the VISIBLE set = every match + its ancestor path + the root (so a matched
    // node never floats without its branch). `null` = no search → nothing hidden.
    const visible = useMemo(
        () => {
            const value = query.trim().toLowerCase()
            if (!value) {
                return null
            }
            const parentOf = new Map(data.edges.map((edge) => [edge.target, edge.source]))
            const set = new Set<string>()
            for (const node of data.nodes) {
                const nodeData = node.data as unknown as CourseMindMapNodeData
                if (node.type === "course") {
                    set.add(node.id)
                    continue
                }
                const matches = String(nodeData.label).toLowerCase().includes(value)
                    && tierAllows(nodeData.popularity, tier)
                if (matches) {
                    let cursor: string | undefined = node.id
                    while (cursor) {
                        set.add(cursor)
                        cursor = parentOf.get(cursor)
                    }
                }
            }
            return set
        },
        [query, tier, data],
    )

    const nodes = useMemo(
        () => data.nodes.map((node) => {
            const pop = (node.data as unknown as CourseMindMapNodeData).popularity
            // browsing (no search): dim tiers below the floor; searching: hide non-visible nodes.
            const dimmed = !visible && node.type !== "course" && pop
                ? POP_RANK[pop] < TIER_MIN[tier]
                : false
            return {
                id: node.id,
                type: node.type ?? "concept",
                position: node.position,
                data: node.data as unknown as Record<string, unknown>,
                selected: node.id === selectedId,
                hidden: visible ? !visible.has(node.id) : false,
                className: dimmed ? "opacity-15 transition-opacity" : "transition-opacity",
            }
        }),
        [data, tier, visible, selectedId],
    )
    const edges = useMemo(
        () => data.edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            // bezier curves ("nét tròn") read smoother than orthogonal steps.
            type: "default",
        })),
        [data],
    )

    const selectedData = selectedId
        ? (data.nodes.find((node) => node.id === selectedId)?.data as unknown as CourseMindMapNodeData | undefined)
        : undefined

    return (
        <div className={cn("relative h-full w-full", className)}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    minZoom={0.1}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    proOptions={{
                        hideAttribution: true,
                    }}
                    onNodeClick={(_event, node) => {
                        // root re-frames (deselect); every keyword selects → recentre + drawer.
                        onSelectId(node.type === "course" ? null : node.id)
                    }}
                    onPaneClick={() => onSelectId(null)}
                >
                    <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
                    <Controls showInteractive={false} />
                    <MiniMap
                        pannable
                        zoomable
                        nodeColor={(node) => (node.type === "course"
                            ? "#c0407a"
                            : MINIMAP_BY_POP[String((node.data as unknown as CourseMindMapNodeData).popularity)] ?? "#c0c0c8")}
                    />
                    <InitialFrame nodes={data.nodes} />
                    <FocusOnSelect selectedId={selectedId} nodes={data.nodes} />
                </ReactFlow>
            </ReactFlowProvider>

            <MindMapNodeDrawer
                keyword={selectedData?.label ?? null}
                desc={selectedData?.desc ?? null}
                courseId={courseId ?? null}
                courseDisplayId={displayId ?? null}
                isOpen={Boolean(selectedId)}
                onClose={() => onSelectId(null)}
            />
        </div>
    )
}
