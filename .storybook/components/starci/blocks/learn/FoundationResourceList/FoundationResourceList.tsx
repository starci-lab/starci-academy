import React from "react"
import { CaretRightIcon, MagnifyingGlassIcon, StackIcon } from "@phosphor-icons/react"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { Cluster, type ClusterItem } from "@sb-components/frames/Cluster/Cluster"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `FoundationResourceList` — the resource browse list: numbered rows of supplementary
 * material (articles, videos, exercises, reference docs) the learner can search and
 * page through.
 *
 * Composes `AsyncContent` (error → loading → empty → content), `SurfaceCardList`,
 * `IconTile` (cover image with icon-glyph fallback), `EnumChip` (kind), `Chip`
 * ("Recommended"), and `Pagination`. Owns position numbering, the kind → chip-label
 * map, the recommended text, and the choice between "no resources yet" and
 * `no matches for "X"` from the typed `searchQuery`.
 *
 * Leaves: `isLoading` and `error` each their own; a zero-length `resources` (with or
 * without a query) is a data STATE of `Default`. Position numbers are local to the
 * current page (no `pageSize` to offset from). `ariaLabel` names the region, which has
 * no visible heading.
 */

/** The kind of resource a row points at — drives the kind chip's label/color. */
export type FoundationKindEnum = "article" | "video" | "exercise" | "reference"

/** One resource row — plain DATA; the block builds the numbering, chips and caret. */
export interface FoundationResourceItem {
    /** Stable id — the React key. */
    id: string
    /** Resource title — the block prefixes it with its position ("1. …"). */
    title: string
    /** One-line blurb under the title. */
    description?: string
    /** Cover thumbnail. Falls back to a `StackIcon` glyph — see file header. */
    thumbnailUrl?: string
    /** Drives the kind chip via {@link KIND_CHIP_MAP}. */
    kind: FoundationKindEnum
    /** `true` → an extra "Recommended" chip rides beside the kind chip. */
    isRecommended?: boolean
    /** Fired when the row is pressed. */
    onPress: () => void
}

/** Props for {@link FoundationResourceList}. */
export interface FoundationResourceListProps {
    /** The current page's resources, in display order. REQUIRED — see file header §R0. */
    resources: Array<FoundationResourceItem>
    /** `true` → the list's own fetch is in flight; own LEAF (see file header). */
    isLoading: boolean
    /** Truthy → the list falls to its error message; own LEAF (beats loading/empty). */
    error?: unknown
    /** Current search text, if the list is filtered. Decides which empty message shows. */
    searchQuery?: string
    /** 1-based current page. */
    currentPage: number
    /** Total page count. */
    totalPages: number
    /** Fired with the 1-based page the viewer picked. */
    onPageChange: (pageNumber: number) => void
    /** Accessible name for the list region — the block has no visible heading of its own. */
    ariaLabel?: string
}

/** kind → chip label/color — the block's own vocabulary (§14d.1), never handed in by a caller. */
const KIND_CHIP_MAP: Record<FoundationKindEnum, EnumChipEntry> = {
    article: { label: "Article" },
    video: { label: "Video", color: "accent" },
    exercise: { label: "Exercise", color: "warning" },
    reference: { label: "Reference", color: "success" },
}

/** The block's own wording for the recommended chip. */
const RECOMMENDED_LABEL = "Recommended"

const ERROR_TITLE = "Could not load the resource list"
const EMPTY_TITLE_NO_QUERY = "No resources here yet"
const EMPTY_DESCRIPTION_WITH_QUERY = "Try a different keyword."

/** How many placeholder rows mirror the list while `resources` hasn't landed yet. */
const SKELETON_ROW_COUNT = 4

/** One row's kind chip + optional recommended chip, in that order. */
const resourceMeta = (resource: FoundationResourceItem) => {
    const chips: Array<ClusterItem> = [
        {
            key: "kind",
            content: <EnumChip value={resource.kind} map={KIND_CHIP_MAP} />,
        },
    ]
    if (resource.isRecommended) {
        chips.push({
            key: "recommended",
            content: <Chip tone="accent" text={RECOMMENDED_LABEL} />,
        })
    }
    return <Cluster gap={3} items={chips} />
}

/** Placeholder rows for the loading mirror — no data, no press handler (§12c). */
const skeletonRows = (): Array<SurfaceCardListItem> =>
    Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        leading: () => <IconTile isSkeleton size="sm" />,
        title: "",
        subtitle: "",
    }))

/** One real row: numbered title, blurb, thumbnail-or-glyph, kind+recommended chips, caret. */
const resourceRow = (resource: FoundationResourceItem, position: number): SurfaceCardListItem => ({
    key: resource.id,
    leading: () => (
        <IconTile
            src={resource.thumbnailUrl}
            icon={StackIcon}
            size="sm"

        />
    ),
    // The block owns the numbering (§14d.1) — see file header for why it is
    // LOCAL to the current page rather than a running count across pages.
    title: `${position}. ${resource.title}`,
    subtitle: resource.description,
    meta: () => resourceMeta(resource),
    trailingIcon: CaretRightIcon,
    onPress: resource.onPress,
})

/**
 * The resource browse list. See the file header for the full contract, the
 * leaf boundary reasoning, and the judgement calls (local numbering, pager
 * placement, no retry action, `ariaLabel` as the region's only name).
 *
 * @param props - {@link FoundationResourceListProps}
 */
const FoundationResourceList = ({
    resources,
    isLoading,
    error,
    searchQuery,
    currentPage,
    totalPages,
    onPageChange,
    ariaLabel,
}: FoundationResourceListProps) => {
    const hasQuery = Boolean(searchQuery && searchQuery.trim().length > 0)

    const emptyContent: AsyncContentEmptyProps = hasQuery
        ? {
            icon: MagnifyingGlassIcon,
            title: `No resources found matching "${searchQuery}"`,
            description: EMPTY_DESCRIPTION_WITH_QUERY,

        }
        : {
            title: EMPTY_TITLE_NO_QUERY,

        }

    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,

    }

    const rows: Array<SurfaceCardListItem> = resources.map((resource, index) => resourceRow(resource, index + 1))

    return (
        <div aria-label={ariaLabel} role={ariaLabel ? "region" : undefined}>
            <AsyncContent
                isLoading={isLoading}
                skeleton={
                    <SurfaceCardList
                        items={skeletonRows()}
                        isSkeleton

                    />
                }
                isEmpty={resources.length === 0}
                emptyContent={emptyContent}
                error={error}
                errorContent={errorContent}

                content={
                    <StackV
                        gap={3}

                        items={[
                            () => <SurfaceCardList items={rows} />,
                            () => (
                                <div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={onPageChange}

                                    />
                                </div>
                            ),
                        ]}
                    />
                }
            />
        </div>
    )
}

export { FoundationResourceList }
