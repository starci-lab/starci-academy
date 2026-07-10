"use client"

import React from "react"
import { Typography, cn } from "@heroui/react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
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
    limit = 3,
    className,
}: RelatedContentListProps) => {
    const locale = useLocale()
    const router = useRouter()
    const swr = useQuerySearchCourseContentSwr(courseId, query, Boolean(query.trim()))
    const results = (swr.data ?? []).slice(0, limit)

    if (!query.trim() || swr.error || (!swr.isLoading && results.length === 0)) {
        return null
    }

    return (
        <LabeledCard label={label} frameless className={cn(className)}>
            <AsyncContent
                isLoading={swr.isLoading}
                skeleton={
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: Math.min(limit, 2) }).map((_, index) => (
                            <div key={index} className="h-14 animate-pulse rounded-xl bg-default" />
                        ))}
                    </div>
                }
            >
                <div className="overflow-hidden rounded-2xl border border-default bg-surface">
                    {results.map((item, index) => (
                        <button
                            key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                            type="button"
                            onClick={() => {
                                const href = resolveSearchResultHref(item, locale, courseDisplayId)
                                if (href) {
                                    router.push(href)
                                }
                            }}
                            className="relative flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-default after:absolute after:bottom-0 after:left-[3%] after:h-px after:w-[94%] after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
                        >
                            {item.breadcrumb ? (
                                <Typography type="body-xs" color="muted" truncate>
                                    {item.breadcrumb}
                                </Typography>
                            ) : null}
                            <Typography type="body-sm" weight="medium" truncate>
                                {item.title}
                            </Typography>
                            <Typography type="body-xs" color="muted" className="line-clamp-2">
                                {item.snippet}
                            </Typography>
                        </button>
                    ))}
                </div>
            </AsyncContent>
        </LabeledCard>
    )
}
