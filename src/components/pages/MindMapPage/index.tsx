"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseMindMapSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseMindMapSwr"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import type { CourseMindMapNodeData } from "@/modules/api/graphql/queries/types"
import { tierAllows } from "@/modules/utils/mind-map"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { ConceptMap } from "@/components/blocks/learn/ConceptMap"
import { MindMapCanvas } from "@/components/blocks/learn/ConceptMap/MindMapCanvas"
import type {
    MindMapPopularity,
    MindMapRailItem,
    MindMapRailTier,
} from "@/components/starci/blocks/learn/MindMapRail"
import { Stage } from "@/components/frames/Stage"
import { _MindMapPage, type MindMapVariant } from "./component"

/**
 * The graph carries popularity as a free-form string; the rail names a closed set.
 * Anything else (or nothing) reads as "no tier", which is what structural nodes are.
 */
const toPopularity = (value: string | null | undefined): MindMapPopularity =>
    value === "high" || value === "medium" || value === "low" ? value : null

/** Props for {@link MindMapPage}. */
export interface MindMapPageProps {
    /**
     * Which shape to render. `workspace` is the learn-shell third column (rail
     * beside the graph); `standalone` is the full-bleed map with floating chrome.
     */
    variant?: MindMapVariant
}

/**
 * `MindMapPage` — the CONNECTED half of the course keyword graph. Owns the
 * course fetch (a hard refresh straight into this route has no other loader, so
 * the graph would otherwise stay empty), the map fetch, and the search + tier +
 * selection state that drives BOTH panes: the rail lists the matching keywords,
 * the canvas hides the non-matches. Selecting a keyword — from a canvas node OR
 * a rail row — recentres the map on it and opens its drawer.
 *
 * The filter is a plain in-memory pass over the loaded tree, not a query: the
 * whole graph is already in hand, so typing has to feel instant.
 *
 * @param props - {@link MindMapPageProps}
 */
export const MindMapPage = ({ variant = "workspace" }: MindMapPageProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const displayId = useAppSelector((state) => state.course.displayId)
    const { isLoading: isCourseLoading, error: courseError, mutate: reloadCourse } = useQueryCourseSwr()
    const { data, isLoading: isMapLoading } = useQueryCourseMindMapSwr(displayId ?? null)

    const [query, setQuery] = useState("")
    const [tier, setTier] = useState<MindMapRailTier>("all")
    const [selectedId, setSelectedId] = useState<string | null>(null)

    // The rail's result list: concept keywords clearing the tier floor and (while
    // typing) the substring, each carrying its ancestor breadcrumb for context.
    const items = useMemo<Array<MindMapRailItem>>(
        () => {
            if (!data) {
                return []
            }
            const value = query.trim().toLowerCase()
            const nodeById = new Map(data.nodes.map((node) => [node.id, node]))
            const parentOf = new Map(data.edges.map((edge) => [edge.target, edge.source]))
            const labelOf = (id: string) =>
                String((nodeById.get(id)?.data as unknown as CourseMindMapNodeData | undefined)?.label ?? "")
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
                        popularity: toPopularity(nodeData.popularity),
                        breadcrumb: breadcrumb(node.id),
                    }
                })
        },
        [data, query, tier],
    )

    const onPick = useCallback((id: string) => setSelectedId(id), [])

    /** The empty state's funnel: an unauthored map still has modules worth reading. */
    const onBrowseModules = useCallback(
        () => {
            if (!displayId) {
                return
            }
            router.push(pathConfig().locale(locale).course(displayId).learn().content().build())
        },
        [displayId, locale, router],
    )

    // The graph itself — the screen mounts it, and knows nothing about it beyond
    // "something fills the canvas".
    const Canvas = useCallback(
        () => {
            // `standalone` draws the MODULE graph (progress + floating chrome); `workspace`
            // draws the KEYWORD graph beside the rail. Two different maps, one slot.
            if (variant === "standalone") {
                return <MindMapCanvas />
            }
            return data
                ? (
                    <ConceptMap
                        data={data}
                        query={query}
                        tier={tier}
                        selectedId={selectedId}
                        onSelectId={setSelectedId}
                    />
                )
                : null
        },
        [data, query, selectedId, tier, variant],
    )

    // error beats a stale loading flag (BLOCK-8); the course fetch is the one that
    // can fail loudly here, so it replaces the whole viewport rather than leaving
    // an empty canvas the reader would read as "this course has no map".
    if (courseError && !course) {
        return (
            <Stage
                identity={{ tier: "page", component: "MindMapPage" }}
                fill="viewport"
                canvas={() => (
                    <AsyncContentError
                        title={t("courseLanding.errorTitle")}
                        onRetry={() => { void reloadCourse() }}
                        retryLabel={t("courseLanding.retry")}
                    />
                )}
            />
        )
    }

    const isSkeleton = (isCourseLoading && !course) || (isMapLoading && !data)

    return (
        <_MindMapPage
            variant={variant}
            query={query}
            onQuery={setQuery}
            tier={tier}
            onTier={setTier}
            items={items}
            selectedId={selectedId ?? undefined}
            onPick={onPick}
            railAriaLabel={t("mindMap.toolbar.searchAria")}
            railTierAriaLabel={t("mindMap.toolbar.tierAria")}
            railResizeAriaLabel={t("mindMap.rail.resizeAria")}
            canvas={Canvas}
            isSkeleton={isSkeleton}
            // settled with a map that has no nodes → the course has nothing authored yet
            isEmpty={!isMapLoading && (!data || data.nodes.length === 0)}
            onBrowseModules={displayId ? onBrowseModules : undefined}
            labels={{
                emptyTitle: t("mindMap.emptyTitle"),
                emptyDescription: t("mindMap.emptyDescription"),
                emptyCta: t("mindMap.emptyCta"),
            }}
        />
    )
}
