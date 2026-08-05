import React from "react"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { DrawerShell } from "@/components/composites/layout/DrawerShell"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { EntityResultRow } from "@/components/blocks/learn/EntityResultRow"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"

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

/** How many placeholder sections/rows the loading skeleton mirrors — matches the common 1–2 group shape. */
const SKELETON_SECTION_COUNT = 2
const SKELETON_ROW_COUNT = 2

/**
 * PRESENTATIONAL drawer — the mind-map keyword's related-surfaces view, driven by plain props (no
 * store/SWR/i18n) so it is fully story-able. Renders the relevance-ordered RAG hits already bucketed
 * into kind sections (lessons / flashcards / challenges / capstone), each a jump link. Branches in
 * priority order error → skeleton → empty → content (`AsyncContentError`/`AsyncContentEmpty` for the
 * message branches; the skeleton is a small inline mirror of the group/row shape, per
 * `authoring/loading-and-skeleton.md`). See `tiers/split.md` — the connected `index.tsx` owns the
 * fetch, the bucketing, and i18n.
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

    // authored explainer — "understand the concept right in the drawer" (teacher, 2026-07-18) before
    // RAG lists where to dig deeper below. Always known from the click, never part of the RAG fetch,
    // so it never shimmers.
    const header: ComponentTypeWithSkeleton = () => (
        <StackV
            gap={1}
            items={[
                () => <Typography size="xs" color="muted" text={labels.aboutEyebrow} />,
                () => <Typography size="h4" weight="bold" text={keyword ?? labels.titleFallback} />,
                ...(desc ? [() => <Typography size="sm" color="muted" text={desc} />] : []),
            ]}
        />
    )

    // small inline mirror of the [group label + bordered row list] shape — one Skeleton.Typography
    // per text node, the same structural nodes (SurfaceListCard, SurfaceListCardItem) real content
    // renders through, so the box doesn't jump when the data lands.
    const skeletonSections: Array<ComponentTypeWithSkeleton> = Array.from(
        { length: SKELETON_SECTION_COUNT },
        () => () => (
            <StackV
                gap={2}
                items={[
                    () => <Skeleton.Typography type="body-xs" width="1/3" />,
                    () => (
                        <SurfaceListCard bordered>
                            {Array.from({ length: SKELETON_ROW_COUNT }, (_row, index) => (
                                <SurfaceListCardItem key={index}>
                                    <StackV
                                        gap={2}
                                        items={[
                                            () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                            () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                        ]}
                                    />
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    ),
                ]}
            />
        ),
    )

    const body: ComponentTypeWithSkeleton = () => {
        if (error) {
            return <AsyncContentError title={labels.loadError} onRetry={onRetry} retryLabel={labels.retry} />
        }
        if (isSkeleton) {
            return <StackV gap={4} items={skeletonSections} />
        }
        if (isEmpty) {
            return <AsyncContentEmpty title={labels.emptyTitle} description={labels.emptyDescription} />
        }
        return (
            <StackV
                gap={4}
                items={[
                    // section label over the related-content groups (each an interactive nav list)
                    () => <Typography size="sm" weight="semibold" text={labels.eyebrow} />,
                    ...groups.map((group) => () => (
                        <LabeledCard frameless subtleLabel label={group.label} labelEnd={group.countLabel}>
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
                    )),
                ]}
            />
        )
    }

    return (
        <DrawerShell
            identity={{ tier: "overlay", component: "MindMapNodeDrawer" }}
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose()
                }
            }}
            placement={isMobile ? "bottom" : "right"}
            header={header}
            body={body}
        />
    )
}
