"use client"

import React from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { resolveSearchResultHref } from "@/modules/learn/resolve-search-result-href"
import { _RelatedContentList } from "./component"

/** How many skeleton rows mirror the list while the first load is in flight. */
const SKELETON_ROW_COUNT_CAP = 2

/** Props the connected {@link RelatedContentList} takes from its caller. */
export interface RelatedContentListConnectedProps extends WithClassNames<undefined> {
    /** Course to search within (RAG query scope). */
    courseId: string
    /** The course's `displayId` (slug) — needed to build result URLs. */
    courseDisplayId: string
    /**
     * The search query, auto-built from context (a lesson's own title, a
     * task's brief, a set of weak tags, failing-finding text, etc.) — the
     * learner never types this. Blank → the block renders nothing (no loading
     * flash, no empty-state clutter for what is a quiet, optional aid).
     */
    query: string
    /** Section label (translated by the caller — each surface phrases this differently). */
    label: React.ReactNode
    /**
     * The current surface's OWN source id (this lesson / task / deck). Filtered out
     * of the results so the block never suggests the page the learner is already on
     * — a title-derived query (e.g. LessonReader's `content.title`) always returns
     * itself as the top hit, which reads as a bug ("suggested reading: itself").
     */
    excludeId?: string
    /** Max rows shown. Defaults to 3. */
    limit?: number
}

/**
 * Passive, self-hiding "related content" list — the CONNECTED half: fetches
 * `searchCourseContent`, filters out the current surface's own source, and
 * folds every hide condition (blank query, error, genuinely empty) into ONE
 * empty `results` array so the presentational half keeps a single render
 * path. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link RelatedContentListConnectedProps}
 */
export const RelatedContentList = ({
    courseId,
    courseDisplayId,
    query,
    label,
    excludeId,
    limit = 3,
    className,
}: RelatedContentListConnectedProps) => {
    const locale = useLocale()
    const router = useRouter()
    const hasQuery = query.trim().length > 0
    const swr = useQuerySearchCourseContentSwr(courseId, query, hasQuery)

    // drop the current surface's own source — a title-derived query always returns
    // itself as the top hit, and suggesting the page you're on reads as a bug.
    const filtered = (swr.data ?? [])
        .filter((item) => !excludeId
            || (item.contentId !== excludeId && item.deckId !== excludeId && item.taskId !== excludeId))
        .slice(0, limit)

    // first load, nothing in hand yet → skeleton. Every other hide condition
    // (blank query, error, genuinely empty) folds into an EMPTY results array —
    // the presentational half renders nothing for all of them alike.
    const isSkeleton = hasQuery && swr.isLoading && !swr.error
    const results = hasQuery && !swr.error ? filtered : []

    return (
        <_RelatedContentList
            label={label}
            results={results}
            isSkeleton={isSkeleton}
            skeletonRowCount={Math.min(limit, SKELETON_ROW_COUNT_CAP)}
            onSelectItem={(picked) => {
                const href = resolveSearchResultHref(picked, locale, courseDisplayId)
                if (href) {
                    router.push(href)
                }
            }}
            className={className}
        />
    )
}
