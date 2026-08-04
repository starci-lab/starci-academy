"use client"

import React, { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { resolveSearchResultHref } from "@/modules/learn/resolve-search-result-href"
import { _MindMapNodeDrawer, type MindMapNodeDrawerGroup } from "./component"

/**
 * Kind → the group it renders under. `code` chunks resolve to their parent lesson,
 * so they live with `content`. Order here is the section order in the drawer.
 */
const GROUPS: ReadonlyArray<{ key: string, kinds: ReadonlyArray<string> }> = [
    { key: "content", kinds: ["content", "code"] },
    { key: "flashcard", kinds: ["flashcard"] },
    { key: "challenge", kinds: ["challenge"] },
    { key: "milestone", kinds: ["milestone"] },
]

/** Props for {@link MindMapNodeDrawer} (the SWR container). */
export interface MindMapNodeDrawerProps {
    /** The clicked concept's keyword — the RAG query. `null` closes the drawer. */
    keyword: string | null
    /** The keyword's authored explainer (localized) — shown above the RAG results. */
    desc?: string | null
    /** Internal course id — scopes the RAG search. */
    courseId: string | null
    /** Course slug — builds the jump URLs for each hit. */
    courseDisplayId: string | null
    /** Whether the drawer is open (driven by the map's selected-node state). */
    isOpen: boolean
    /** Fired when the drawer requests to close (backdrop / close button). */
    onClose: () => void
}

/**
 * Node-detail drawer for the course mind-map: given a clicked keyword it runs the
 * course-scoped RAG search (`searchCourseContent`) and lists every RELATED surface
 * — lessons, flashcard decks, challenges, capstone tasks — grouped by kind, each a
 * jump link. Unlike the authored link panel it replaces, relatedness is SEMANTIC
 * (RAG), so a keyword surfaces material even where no hard link was authored.
 *
 * CONNECTED half: owns the SWR fetch, buckets the relevance-ordered hits into kind
 * sections, resolves every label (incl. per-group count interpolation), and
 * resolves the jump href on selection. See `tiers/split.md`.
 *
 * @param props - {@link MindMapNodeDrawerProps}
 */
export const MindMapNodeDrawer = ({
    keyword,
    desc,
    courseId,
    courseDisplayId,
    isOpen,
    onClose,
}: MindMapNodeDrawerProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const swr = useQuerySearchCourseContentSwr(courseId, keyword ?? "", isOpen && Boolean(keyword))
    const results = swr.data ?? []

    // bucket the flat, relevance-ordered hits into their kind sections (order kept
    // within each bucket = RAG best-match first), resolving each section's label
    // + count text here — that interpolation needs the bucketed count.
    const groups = useMemo<Array<MindMapNodeDrawerGroup>>(
        () => GROUPS.map((group) => {
            const items = results.filter((item) => group.kinds.includes(item.kind))
            return {
                key: group.key,
                label: t(`mindMap.drawer.group.${group.key}`),
                countLabel: t("mindMap.drawer.count", { count: items.length }),
                items,
            }
        }).filter((group) => group.items.length > 0),
        [results, t],
    )

    // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
    const isSkeleton = swr.isLoading && !swr.data
    const isEmpty = !isSkeleton && !swr.error && results.length === 0

    return (
        <_MindMapNodeDrawer
            keyword={keyword}
            desc={desc}
            isOpen={isOpen}
            onClose={onClose}
            groups={groups}
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            error={!results.length ? swr.error : undefined}
            onRetry={() => { void swr.mutate() }}
            onSelectItem={(picked: SearchCourseContentItem) => {
                const href = resolveSearchResultHref(picked, locale, courseDisplayId ?? "")
                if (href) {
                    router.push(href)
                    onClose()
                }
            }}
            labels={{
                aboutEyebrow: t("mindMap.drawer.aboutEyebrow"),
                titleFallback: t("mindMap.drawer.title"),
                eyebrow: t("mindMap.drawer.eyebrow"),
                emptyTitle: t("mindMap.drawer.emptyTitle"),
                emptyDescription: t("mindMap.drawer.emptyDescription", { keyword: keyword ?? "" }),
                loadError: t("mindMap.drawer.loadError"),
                retry: t("mindMap.drawer.retry"),
            }}
        />
    )
}

export default MindMapNodeDrawer
