"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    Background,
    BackgroundVariant,
    Controls,
    Handle,
    Position,
    ReactFlow,
    ReactFlowProvider,
    type NodeProps,
    type NodeTypes,
} from "@xyflow/react"
import {
    Skeleton,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowRightIcon,
    XIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { useRouter } from "next/navigation"
import { layoutConceptGraph } from "./layout"
import type {
    CourseMindMapLink,
    CourseMindMapNodeData,
    MindMapNodeKind,
} from "@/modules/api/graphql/queries/types"
import { useQueryCourseMindMapSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseMindMapSwr"
import { useAppSelector } from "@/redux/hooks"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Glyph per surface kind — the chips that hint what a keyword links to. */
const LINK_GLYPH: Partial<Record<MindMapNodeKind, string>> = {
    lesson: "📖",
    challenge: "⚔️",
    milestone: "🏗️",
    flashcard: "🃏",
    interview: "🎤",
}

/**
 * One authored concept — a keyword card with chips hinting which surfaces teach / drill / test
 * it. Clicking selects it and opens the link panel (a concept usually has SEVERAL targets, so a
 * single click-through would be a lie).
 */
const ConceptNode = ({ data, selected }: NodeProps) => {
    const node = data as unknown as CourseMindMapNodeData
    // one chip per distinct kind — a concept with 3 lessons still reads as "📖"
    const kinds = Array.from(new Set(node.links.map((link) => link.kind)))
    return (
        <div
            className={cn(
                "w-[216px] rounded-2xl border-2 bg-surface px-3 py-2 shadow-surface transition-colors",
                selected ? "border-accent" : "border-default hover:border-accent",
            )}
        >
            <Handle type="target" position={Position.Left} className="!size-2 !border-0 !bg-default" />
            <Typography type="body-sm" weight="semibold" className="line-clamp-2">
                {node.label}
            </Typography>
            {kinds.length > 0 ? (
                <div className="mt-1 flex gap-1 text-[11px]">
                    {kinds.map((kind) => (
                        <span key={kind}>{LINK_GLYPH[kind]}</span>
                    ))}
                </div>
            ) : null}
            <Handle type="source" position={Position.Right} className="!size-2 !border-0 !bg-default" />
        </div>
    )
}

/** The course root — the trunk every branch hangs off. */
const RootNode = ({ data }: NodeProps) => {
    const node = data as unknown as CourseMindMapNodeData
    return (
        <div className="w-[200px] rounded-2xl bg-accent px-4 py-3 text-center shadow-surface">
            <Typography type="body-sm" weight="bold" className="text-accent-foreground">
                {node.label}
            </Typography>
            <Handle type="source" position={Position.Right} className="!size-2 !border-0 !bg-accent" />
        </div>
    )
}

/** Stable map — React Flow re-mounts every node when this identity changes. */
const nodeTypes: NodeTypes = {
    concept: ConceptNode,
    course: RootNode,
}

/** Props for {@link ConceptMap}. */
export type ConceptMapProps = WithClassNames<undefined>

/**
 * The course "sơ đồ tư duy" — the AUTHORED concept map: a tree of KEYWORDS (not the module
 * outline), where each keyword points at every surface that teaches, drills or tests it. Click a
 * keyword to open its links and jump to the lesson / capstone / deck / interview bank.
 *
 * Rendered with React Flow and laid out by dagre against the REAL node boxes — so it reflows for
 * any tree size instead of breaking like hand-placed coordinates. Falls back gracefully: when a
 * course has no authored map the server sends its derived module graph, which renders the same way.
 *
 * @param props - optional className for the root element.
 */
export const ConceptMap = ({
    className,
}: ConceptMapProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)
    const { data, isLoading } = useQueryCourseMindMapSwr(displayId ?? null)
    const [selected, setSelected] = useState<CourseMindMapNodeData | null>(null)

    // re-rank with dagre using the client's true node sizes, then hand React Flow its shape
    const nodes = useMemo(
        () => (data
            ? layoutConceptGraph(data.nodes, data.edges).map((node) => ({
                id: node.id,
                type: node.type ?? "concept",
                position: node.position,
                data: node.data as unknown as Record<string, unknown>,
            }))
            : []),
        [data],
    )
    const edges = useMemo(
        () => (data
            ? data.edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: "smoothstep",
            }))
            : []),
        [data],
    )

    /** Where one authored link opens. Section-level kinds need no id; lessons need module+content. */
    const hrefFor = useCallback(
        (link: CourseMindMapLink): string | null => {
            if (!displayId) {
                return null
            }
            const learn = pathConfig().locale(locale).course(displayId).learn()
            if (link.kind === "lesson" || link.kind === "challenge") {
                return link.moduleId && link.entityId
                    ? learn.module(link.moduleId).content(link.entityId).build()
                    : null
            }
            if (link.kind === "flashcard") {
                return learn.flashcards().build()
            }
            if (link.kind === "milestone") {
                return learn.personalProject().build()
            }
            if (link.kind === "interview") {
                return learn.mockInterview().build()
            }
            return null
        },
        [displayId, locale],
    )

    return (
        <AsyncContent
            isLoading={isLoading && !data}
            skeleton={<Skeleton className="h-full w-full" />}
            isEmpty={!data || data.nodes.length === 0}
            emptyContent={{
                title: t("mindMap.journey.emptyTitle"),
                description: t("mindMap.journey.emptyDescription"),
            }}
        >
            <div className={cn("relative h-full w-full", className)}>
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        fitView
                        minZoom={0.2}
                        nodesDraggable={false}
                        nodesConnectable={false}
                        proOptions={{
                            hideAttribution: true,
                        }}
                        onNodeClick={(_event, node) => setSelected(node.data as unknown as CourseMindMapNodeData)}
                        onPaneClick={() => setSelected(null)}
                    >
                        <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
                        <Controls showInteractive={false} />
                    </ReactFlow>
                </ReactFlowProvider>

                {/* link panel — a concept fans out to several surfaces, so pick one */}
                {selected && selected.links.length > 0 ? (
                    <div className="absolute right-4 top-4 z-10 w-72 rounded-2xl border border-default bg-surface p-3 shadow-surface">
                        <div className="flex items-start gap-2">
                            <div className="min-w-0 flex-1">
                                <Typography type="body-sm" weight="bold">
                                    {selected.label}
                                </Typography>
                                {selected.desc ? (
                                    <Typography type="body-xs" color="muted">
                                        {selected.desc}
                                    </Typography>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                aria-label={t("mindMap.links.close")}
                                onClick={() => setSelected(null)}
                                className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-default"
                            >
                                <XIcon aria-hidden focusable="false" className="size-4" />
                            </button>
                        </div>
                        <div className="mt-3 flex flex-col gap-1">
                            {selected.links.map((link) => {
                                const href = hrefFor(link)
                                return (
                                    <button
                                        key={`${link.kind}-${link.displayId}`}
                                        type="button"
                                        disabled={!href}
                                        onClick={() => href && router.push(href)}
                                        className={cn(
                                            "flex items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition-colors",
                                            href ? "hover:bg-default" : "cursor-not-allowed opacity-50",
                                        )}
                                    >
                                        <span>{LINK_GLYPH[link.kind]}</span>
                                        <span className="min-w-0 flex-1 truncate">
                                            {t(`mindMap.links.${link.kind}`)}
                                        </span>
                                        {href ? (
                                            <ArrowRightIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                                        ) : null}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
        </AsyncContent>
    )
}
