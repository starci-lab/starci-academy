"use client"

import React from "react"
import { cn } from "@heroui/react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EntityResultRow } from "@/components/blocks/learn/EntityResultRow"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { resolveSearchResultHref } from "@/modules/learn/resolve-search-result-href"

/** Props for the {@link RelatedContentList} block. */
export interface RelatedContentListProps extends WithClassNames<undefined> {
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
     * itself as the top hit, which reads as a bug ("nên đọc: bài chính nó").
     */
    excludeId?: string
    /** Max rows shown. Defaults to 3. */
    limit?: number
}

/**
 * Passive, self-hiding "related content" list — course-wide RAG search
 * (`searchCourseContent`) rendered as clickable rows (kind chip + breadcrumb +
 * title + snippet), reusing the exact row shape `ContentAiChat`'s search view
 * established. Auto-triggered from a CONTEXT query (no typing), so it is never
 * a competing CTA — just a quiet, optional aid a learner can click into or
 * ignore. Silently renders nothing when the query is blank, still loading, or
 * came back empty/errored (a passive recommendation degrading to invisible is
 * better than an apologetic "no suggestions found" box).
 */
export const RelatedContentList = ({
    courseId,
    courseDisplayId,
    query,
    label,
    excludeId,
    limit = 3,
    className,
}: RelatedContentListProps) => {
    const locale = useLocale()
    const router = useRouter()
    const swr = useQuerySearchCourseContentSwr(courseId, query, Boolean(query.trim()))
    // drop the current surface's own source — a title-derived query always returns
    // itself as the top hit, and suggesting the page you're on reads as a bug.
    const results = (swr.data ?? [])
        .filter((item) => !excludeId
            || (item.contentId !== excludeId && item.deckId !== excludeId && item.taskId !== excludeId))
        .slice(0, limit)

    if (!query.trim() || swr.error || (!swr.isLoading && results.length === 0)) {
        return null
    }

    return (
        <LabeledCard label={label} frameless className={cn(className)}>
            <AsyncContent
                isLoading={swr.isLoading}
                skeleton={
                    <SurfaceListCard bordered>
                        {Array.from({ length: Math.min(limit, 2) }).map((_, index) => (
                            <SurfaceListCardItem key={index}>
                                <div className="flex flex-col gap-2">
                                    <Skeleton.Typography type="body-xs" width="1/3" />
                                    <Skeleton.Typography type="body-sm" width="3/4" />
                                    <Skeleton.Typography type="body-xs" width="full" />
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                }
            >
                <SurfaceListCard bordered>
                    {results.map((item, index) => (
                        <EntityResultRow
                            key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                            item={item}
                            onSelect={(picked) => {
                                const href = resolveSearchResultHref(picked, locale, courseDisplayId)
                                if (href) {
                                    router.push(href)
                                }
                            }}
                        />
                    ))}
                </SurfaceListCard>
            </AsyncContent>
        </LabeledCard>
    )
}
