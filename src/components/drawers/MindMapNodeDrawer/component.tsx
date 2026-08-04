import React from "react"
import { Drawer, Label, ScrollShadow, Typography } from "@heroui/react"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { EntityResultRow } from "@/components/blocks/learn/EntityResultRow"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** One kind-bucketed section of RAG hits, already resolved (label + count) by the connected `MindMapNodeDrawer`. */
export interface MindMapNodeDrawerGroup {
    /** Bucket key (`content` · `flashcard` · `challenge` · `milestone`) — also the `React` list key. */
    key: string
    /** `t("mindMap.drawer.group.<key>")`, already resolved. */
    label: string
    /** `t("mindMap.drawer.count", { count })`, already interpolated. */
    countLabel: string
    /** This bucket's hits, relevance-ordered (RAG best-match first). */
    items: ReadonlyArray<SearchCourseContentItem>
}

/** All display text, already localized by the connected `MindMapNodeDrawer`; a story passes i18n keys. */
export interface MindMapNodeDrawerLabels {
    aboutEyebrow: string
    /** Header title fallback, shown while no keyword is selected. */
    titleFallback: string
    eyebrow: string
    emptyTitle: string
    /** Already interpolated with the keyword. */
    emptyDescription: string
    loadError: string
    retry: string
}

/** Props for {@link _MindMapNodeDrawer} — presentational; all data resolved, no fetch/store/i18n. */
export interface MindMapNodeDrawerProps {
    /** The clicked concept's keyword (header title + what `labels.emptyDescription` was interpolated with). */
    keyword: string | null
    /** The keyword's authored explainer (localized) — renders above the RAG results as context. */
    desc?: string | null
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Fired when the drawer requests to close (backdrop / close button). */
    onClose: () => void
    /** RAG hits, already bucketed into kind sections (lessons / flashcards / challenges / capstone). */
    groups: ReadonlyArray<MindMapNodeDrawerGroup>
    /** First load, nothing in hand → the whole tree shimmers in place. Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero hits (and no error) → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Fired when a hit is picked — the connected file resolves the jump href and closes the drawer. */
    onSelectItem: (item: SearchCourseContentItem) => void
    labels: MindMapNodeDrawerLabels
}

/**
 * PRESENTATIONAL drawer — the mind-map keyword's related-surfaces view, driven by plain props (no
 * store/SWR/i18n) so it is fully story-able. Renders the relevance-ordered RAG hits already bucketed
 * into kind sections (lessons / flashcards / challenges / capstone), each a jump link; renders
 * loading / empty / error via {@link AsyncContent}. See `tiers/split.md` — the connected `index.tsx`
 * owns the fetch, the bucketing, and i18n.
 *
 * @param props - {@link MindMapNodeDrawerProps}
 * @see Story: .storybook/stories/drawers/MindMapNodeDrawer/MindMapNodeDrawer.stories
 */
export const _MindMapNodeDrawer = ({
    keyword,
    desc,
    isOpen,
    onClose,
    groups,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    onSelectItem,
    labels,
}: MindMapNodeDrawerProps) => {
    const { isMobile } = useSmViewpoint()

    return (
        <Drawer data-tier="overlay" data-component="MindMapNodeDrawer">
            <Drawer.Backdrop
                isOpen={isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        onClose()
                    }
                }}
            >
                <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                    <Drawer.Dialog className="p-0">
                        <div className="flex flex-col gap-2 p-4">
                            <Drawer.CloseTrigger />
                            <Drawer.Header className="flex flex-col gap-1 p-0">
                                <Typography type="body-xs" color="muted">
                                    {labels.aboutEyebrow}
                                </Typography>
                                <Drawer.Heading>
                                    {keyword ?? labels.titleFallback}
                                </Drawer.Heading>
                            </Drawer.Header>
                            {/* authored explainer — "understand the concept right in the drawer"
                                (teacher, 2026-07-18) before RAG lists where to dig deeper below. */}
                            {desc ? (
                                <Typography type="body-sm" color="muted">
                                    {desc}
                                </Typography>
                            ) : null}
                        </div>
                        <Drawer.Body>
                            <ScrollShadow className="h-full p-4 pt-0" hideScrollBar>
                                <AsyncContent
                                    isLoading={isSkeleton}
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
                                        title: labels.emptyTitle,
                                        description: labels.emptyDescription,
                                    }}
                                    error={error}
                                    errorContent={{
                                        title: labels.loadError,
                                        onRetry,
                                        retryLabel: labels.retry,
                                    }}
                                >
                                    <div className="flex flex-col gap-4">
                                        {/* section label over the related-content groups (each an
                                            interactive nav list) → `<Label>`, not hand-rolled muted
                                            Typography (label.md §1b/§1c). */}
                                        <Label>{labels.eyebrow}</Label>
                                        {groups.map((group) => (
                                            <LabeledCard
                                                key={group.key}
                                                frameless
                                                subtleLabel
                                                label={group.label}
                                                labelEnd={group.countLabel}
                                            >
                                                <SurfaceListCard bordered>
                                                    {group.items.map((item, index) => (
                                                        <EntityResultRow
                                                            key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                                                            item={item}
                                                            showSnippet
                                                            onSelect={onSelectItem}
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
