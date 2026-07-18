"use client"

import React, { useMemo } from "react"
import { Drawer, Label, ScrollShadow, Typography, cn } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { resolveSearchResultHref } from "@/modules/learn/resolve-search-result-href"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { EntityResultRow } from "@/components/blocks/learn/EntityResultRow"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

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

/** Presentational props — the pure view (no SWR); the container feeds these. */
export interface MindMapNodeDrawerViewProps extends WithClassNames<undefined> {
    /** The clicked concept's keyword (header title + the query that produced results). */
    keyword: string | null
    /** The keyword's authored explainer (localized) — renders above the RAG results as context. */
    desc?: string | null
    /** Course slug — builds the jump URLs for each hit. */
    courseDisplayId: string | null
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Fired when the drawer requests to close (backdrop / close button). */
    onClose: () => void
    /** RAG hits for the keyword, relevance-ordered (the view buckets them by kind). */
    results: ReadonlyArray<SearchCourseContentItem>
    /** True while the RAG search is in flight and no data has arrived yet. */
    isLoading: boolean
    /** Set when the RAG search failed (drives the error state + retry). */
    isError: boolean
    /** Re-run the RAG search (error retry). */
    onRetry: () => void
}

/**
 * PRESENTATIONAL drawer — the mind-map keyword's related-surfaces view, driven by
 * plain props (no store/SWR) so it is fully story-able. Buckets the relevance-ordered
 * RAG hits into kind sections (lessons / flashcards / challenges / capstone), each a
 * jump link; renders loading / empty / error via {@link AsyncContent}.
 *
 * @param props - {@link MindMapNodeDrawerViewProps}
 * @see Story: .storybook/stories/drawers/MindMapNodeDrawer/MindMapNodeDrawer.stories
 */
export const MindMapNodeDrawerView = ({
    keyword,
    desc,
    courseDisplayId,
    isOpen,
    onClose,
    results,
    isLoading,
    isError,
    onRetry,
    className,
}: MindMapNodeDrawerViewProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { isMobile } = useSmViewpoint()

    // bucket the flat, relevance-ordered hits into their kind sections (order kept
    // within each bucket = RAG best-match first).
    const grouped = useMemo(
        () => GROUPS.map((group) => ({
            key: group.key,
            items: results.filter((item) => group.kinds.includes(item.kind)),
        })).filter((group) => group.items.length > 0),
        [results],
    )

    const isEmpty = !isLoading && !isError && results.length === 0

    return (
        <Drawer>
            <Drawer.Backdrop
                isOpen={isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        onClose()
                    }
                }}
            >
                <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                    <Drawer.Dialog className={cn("p-0", className)}>
                        <div className="flex flex-col gap-2 p-4">
                            <Drawer.CloseTrigger />
                            <Drawer.Header className="flex flex-col gap-1 p-0">
                                <Typography type="body-xs" color="muted">
                                    {t("mindMap.drawer.aboutEyebrow")}
                                </Typography>
                                <Drawer.Heading>
                                    {keyword ?? t("mindMap.drawer.title")}
                                </Drawer.Heading>
                            </Drawer.Header>
                            {/* authored explainer — "hiểu concept ngay trong drawer" (thầy 2026-07-18)
                                trước khi RAG liệt kê nơi học sâu bên dưới. */}
                            {desc ? (
                                <Typography type="body-sm" color="muted">
                                    {desc}
                                </Typography>
                            ) : null}
                        </div>
                        <Drawer.Body>
                            <ScrollShadow className="h-full p-4 pt-0" hideScrollBar>
                                <AsyncContent
                                    isLoading={isLoading}
                                    skeleton={(
                                        <div className="flex flex-col gap-4">
                                            {[0, 1].map((section) => (
                                                <div key={section} className="flex flex-col gap-2">
                                                    {/* group label + count */}
                                                    <Skeleton.Typography type="body-xs" width="1/3" />
                                                    {/* bordered list of EntityResultRows (breadcrumb + title) */}
                                                    <SurfaceListCard bordered>
                                                        {[0, 1].map((row) => (
                                                            <SurfaceListCardItem key={row}>
                                                                <div className="flex flex-col gap-2">
                                                                    <Skeleton.Typography type="body-xs" width="1/3" />
                                                                    <Skeleton.Typography type="body-sm" width="3/4" />
                                                                </div>
                                                            </SurfaceListCardItem>
                                                        ))}
                                                    </SurfaceListCard>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    isEmpty={isEmpty}
                                    emptyContent={{
                                        title: t("mindMap.drawer.emptyTitle"),
                                        description: t("mindMap.drawer.emptyDescription", { keyword: keyword ?? "" }),
                                    }}
                                    error={isError ? new Error("rag-failed") : undefined}
                                    errorContent={{
                                        title: t("mindMap.drawer.loadError"),
                                        onRetry,
                                        retryLabel: t("mindMap.drawer.retry"),
                                    }}
                                >
                                    <div className="flex flex-col gap-4">
                                        {/* section label over the related-content groups (each an
                                            interactive nav list) → `<Label>`, not hand-rolled muted
                                            Typography (label.md §1b/§1c). */}
                                        <Label>{t("mindMap.drawer.eyebrow")}</Label>
                                        {grouped.map((group) => (
                                            <LabeledCard
                                                key={group.key}
                                                frameless
                                                subtleLabel
                                                label={t(`mindMap.drawer.group.${group.key}`)}
                                                labelEnd={t("mindMap.drawer.count", { count: group.items.length })}
                                            >
                                                <SurfaceListCard bordered>
                                                    {group.items.map((item, index) => (
                                                        <EntityResultRow
                                                            key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                                                            item={item}
                                                            showSnippet
                                                            onSelect={(picked) => {
                                                                const href = resolveSearchResultHref(picked, locale, courseDisplayId ?? "")
                                                                if (href) {
                                                                    router.push(href)
                                                                    onClose()
                                                                }
                                                            }}
                                                        />
                                                    ))}
                                                </SurfaceListCard>
                                            </LabeledCard>
                                        ))}
                                    </div>
                                </AsyncContent>
                            </ScrollShadow>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}

/** Props for {@link MindMapNodeDrawer} (the SWR container). */
export interface MindMapNodeDrawerProps extends WithClassNames<undefined> {
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
 * Thin container: owns only the SWR fetch, then hands {@link MindMapNodeDrawerView}
 * plain data (that pure view carries the layout + is what the story renders).
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
    className,
}: MindMapNodeDrawerProps) => {
    const swr = useQuerySearchCourseContentSwr(courseId, keyword ?? "", isOpen && Boolean(keyword))

    return (
        <MindMapNodeDrawerView
            className={className}
            keyword={keyword}
            desc={desc}
            courseDisplayId={courseDisplayId}
            isOpen={isOpen}
            onClose={onClose}
            results={swr.data ?? []}
            isLoading={swr.isLoading && !swr.data}
            isError={Boolean(swr.error)}
            onRetry={() => { void swr.mutate() }}
        />
    )
}

export default MindMapNodeDrawer
