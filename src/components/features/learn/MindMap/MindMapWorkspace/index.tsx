"use client"

import React, {
    useMemo,
    useState,
} from "react"
import { Button, cn } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { MapTrifoldIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { ConceptMap } from "../ConceptMap"
import { MindMapRail, type MindMapRailItem, type MindMapTier } from "../MindMapRail"
import { tierAllows } from "../mindMapFilter"
import type { CourseMindMapNodeData } from "@/modules/api/graphql/queries/types"
import { useQueryCourseMindMapSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseMindMapSwr"
import { useAppSelector } from "@/redux/hooks"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { ResizableRail } from "@/components/blocks/layout/ResizableRail"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link MindMapWorkspace}. */
export type MindMapWorkspaceProps = WithClassNames<undefined>

/**
 * The mind-map WORKSPACE — the 3rd column of the learn shell (sidebar › rail › canvas). Owns the
 * keyword-graph fetch + the shared filter/selection state, then lays out a resizable
 * {@link MindMapRail} (search + filters + result list) next to the {@link ConceptMap} canvas.
 *
 * Search + tier filter drive BOTH panes: the rail lists the matching keywords (a local, instant
 * fuzzy filter — no RAG needed, the tree is already loaded), the canvas hides non-matches. Selecting
 * a keyword — clicking a canvas node OR a rail row — recentres the map on it and opens its drawer.
 * An unauthored course shows the authored-map-only empty state + funnel to "Học phần".
 *
 * @param props - optional className for the root element.
 */
export const MindMapWorkspace = ({
    className,
}: MindMapWorkspaceProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)
    const { data, isLoading } = useQueryCourseMindMapSwr(displayId ?? null)

    const [query, setQuery] = useState("")
    const [tier, setTier] = useState<MindMapTier>("all")
    const [selectedId, setSelectedId] = useState<string | null>(null)

    // the rail's result list: concept keywords passing the tier floor + (when typing) the substring —
    // a plain in-memory filter over the loaded tree. Each row carries its ancestor breadcrumb.
    const railItems = useMemo<Array<MindMapRailItem>>(
        () => {
            if (!data) {
                return []
            }
            const value = query.trim().toLowerCase()
            const nodeById = new Map(data.nodes.map((node) => [node.id, node]))
            const parentOf = new Map(data.edges.map((edge) => [edge.target, edge.source]))
            const labelOf = (id: string) => String((nodeById.get(id)?.data as unknown as CourseMindMapNodeData | undefined)?.label ?? "")
            const breadcrumb = (id: string) => {
                const parts: Array<string> = []
                let cursor = parentOf.get(id)
                while (cursor) {
                    const ancestor = nodeById.get(cursor)
                    if (!ancestor || ancestor.type === "course") {
                        break
                    }
                    parts.unshift(labelOf(cursor))
                    cursor = parentOf.get(cursor)
                }
                return parts.join(" › ")
            }
            return data.nodes
                .filter((node) => {
                    if (node.type !== "concept") {
                        return false
                    }
                    const nodeData = node.data as unknown as CourseMindMapNodeData
                    return tierAllows(nodeData.popularity, tier)
                        && (!value || String(nodeData.label).toLowerCase().includes(value))
                })
                .map((node) => {
                    const nodeData = node.data as unknown as CourseMindMapNodeData
                    return {
                        id: node.id,
                        label: String(nodeData.label),
                        popularity: nodeData.popularity ?? null,
                        breadcrumb: breadcrumb(node.id),
                    }
                })
        },
        [data, query, tier],
    )

    const isEmpty = !data || data.nodes.length === 0

    return (
        <AsyncContent
            isLoading={isLoading && !data}
            skeleton={(
                // mirror the two-pane workspace: the left rail (search + funnel + result
                // list) beside the canvas — not one blank full-viewport box.
                <div className="flex h-full w-full">
                    <div className="flex h-full w-80 shrink-0 flex-col border-r border-default">
                        {/* toolbar: search input + funnel button */}
                        <div className="flex items-center gap-2 border-b border-default p-3">
                            <Skeleton className="h-9 min-w-0 flex-1 rounded-medium" />
                            <Skeleton className="size-9 shrink-0 rounded-medium" />
                        </div>
                        {/* result list */}
                        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
                            <Skeleton.Typography type="body-xs" width="1/3" />
                            <SurfaceListCard bordered>
                                {[0, 1, 2, 3, 4].map((row) => (
                                    <SurfaceListCardItem key={row}>
                                        <div className="flex flex-col gap-2">
                                            <Skeleton.Typography type="body-sm" width="3/4" />
                                            <Skeleton.Typography type="body-xs" width="1/2" />
                                        </div>
                                    </SurfaceListCardItem>
                                ))}
                            </SurfaceListCard>
                        </div>
                    </div>
                    {/* canvas */}
                    <Skeleton className="h-full flex-1" />
                </div>
            )}
        >
            {isEmpty ? (
                <div className="flex h-full w-full items-center justify-center p-6">
                    <EmptyState
                        icon={<MapTrifoldIcon aria-hidden focusable="false" />}
                        title={t("mindMap.emptyTitle")}
                        description={t("mindMap.emptyDescription")}
                        action={displayId ? (
                            <Button
                                variant="secondary"
                                size="sm"
                                onPress={() => router.push(
                                    pathConfig().locale(locale).course(displayId).learn().content().build(),
                                )}
                            >
                                {t("mindMap.emptyCta")}
                            </Button>
                        ) : undefined}
                    />
                </div>
            ) : (
                <div className={cn("flex h-full w-full", className)}>
                    <ResizableRail
                        storageKey="mindmap-rail-width"
                        defaultWidth={320}
                        minWidth={264}
                        maxWidth={520}
                        ariaLabel={t("mindMap.rail.resizeAria")}
                        className="relative h-full shrink-0 border-r border-default"
                    >
                        <MindMapRail
                            className="h-full"
                            query={query}
                            onQuery={setQuery}
                            tier={tier}
                            onTier={setTier}
                            items={railItems}
                            selectedId={selectedId}
                            onPick={setSelectedId}
                        />
                    </ResizableRail>
                    <ConceptMap
                        className="min-w-0 flex-1"
                        data={data}
                        query={query}
                        tier={tier}
                        selectedId={selectedId}
                        onSelectId={setSelectedId}
                    />
                </div>
            )}
        </AsyncContent>
    )
}
