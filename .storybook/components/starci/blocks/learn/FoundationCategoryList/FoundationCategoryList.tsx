import React from "react"
import { CaretRightIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Image } from "@sb-components/atoms/media/Image/Image"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `FoundationCategoryList` — the Foundations content library's browse-and-drill-in
 * list: joined rows with a thumbnail, title, one-line description and a trailing
 * caret, plus a pager once there is more than one page. Loading swaps row content
 * to shimmer; the `Empty` state replaces the rows with an `EmptyState` (worded by
 * whether a search query drove the empty result), both bounded inside the same
 * `SurfaceCardList` surface.
 */

/** One category row — plain data; the block resolves the thumbnail chain and builds the wording. */
export interface FoundationCategoryListItem {
    /** Stable id — also what `onSelectCategory` fires with. */
    id: string
    /** Category title. */
    title: string
    /** One-line summary, shown as the row's subtitle. */
    description?: string
    /** Underlying tech/brand mark — rides as the `Image` atom's `fallbackSrc` (see file header). */
    logoSrc?: string
    /** Dedicated category thumbnail — wins over `logoSrc` when present (see file header). */
    thumbnailUrl?: string
}

/** Page state for the list's own pager — omit entirely when the caller has only one page. */
export interface FoundationCategoryListPagination {
    /** 1-based current page. */
    currentPage: number
    /** Total page count. */
    totalPages: number
    /** Fired with the 1-based page the reader picked. */
    onPageChange: (pageNumber: number) => void
}

/** Props for {@link FoundationCategoryList}. */
export interface FoundationCategoryListProps {
    /** The current page's categories, in display order. */
    categories: Array<FoundationCategoryListItem>
    /**
     * Current search text driving which empty reason applies when `categories`
     * is empty (see file header, judgement 2). Not rendered as a field by this
     * block — the search input itself is `FoundationCategorySearchBar`'s job.
     */
    searchQuery?: string
    /** Fired with a category's id on ANY row press. */
    onSelectCategory: (id: string) => void
    /** Page nav state. Omit → no pager, even with a full page of rows. */
    pagination?: FoundationCategoryListPagination
    /**
     * `true` → the list draws its own row mirror. `categories` empty while
     * loading (§12c) → guesses 3 rows, this composite's siblings' SSOT convention.
     */
    isSkeleton?: boolean
}

/** The library-itself-is-empty title — no search was involved, so no "try another word" hint applies. Ported verbatim from `foundations.emptyCategories`. */
const LIBRARY_EMPTY_TITLE = "No Foundations topics yet."

/** Placeholder rows for the guessed skeleton count (§12c) — never carry a press handler or a thumbnail. */
const SKELETON_CATEGORIES: Array<FoundationCategoryListItem> = Array.from({ length: 3 }, (_unused, index) => ({
    id: `skeleton-${index}`,
    title: "",
}))

/**
 * Resolves the thumbnail-priority chain (see file header, judgement 1) into the
 * `Image` atom's own `src`/`fallbackSrc` pair — a naming decision, not a second
 * rendering path.
 */
const resolveThumbnail = (category: FoundationCategoryListItem): { src?: string; fallbackSrc?: string } =>
    category.logoSrc
        ? { src: category.logoSrc, fallbackSrc: category.thumbnailUrl }
        : { src: category.thumbnailUrl, fallbackSrc: undefined }

/**
 * The Foundations library's browse-and-drill-in list. See the file header for
 * the thumbnail-priority chain, the two empty reasons, and why loading stays a
 * state of the same leaf rather than earning its own.
 *
 * @param props - {@link FoundationCategoryListProps}
 */
const FoundationCategoryList = ({
    categories,
    searchQuery,
    onSelectCategory,
    pagination,
    isSkeleton = false,
}: FoundationCategoryListProps) => {
    // Empty while loading (no real categories yet) → guess 3 rows, keeping the
    // right shape for when real data lands (§8). Once real `categories` exist,
    // keep the EXACT row count already there.
    const usingPlaceholders = isSkeleton && categories.length === 0
    const source = usingPlaceholders ? SKELETON_CATEGORIES : categories

    const rows: Array<SurfaceCardListItem> = source.map((category) => {
        const { src, fallbackSrc } = resolveThumbnail(category)
        return {
            key: category.id,
            leading: () => (
                <div className="size-10 shrink-0">
                    <Image
                        src={src}
                        fallbackSrc={fallbackSrc}
                        alt={category.title}
                        ratio="square"
                        radius="md"
                        isSkeleton={isSkeleton}

                    />
                </div>
            ),
            title: category.title,
            subtitle: category.description,
            // Every real row navigates — a constant of this domain, never conditional
            // (see file header, judgement 3).
            trailingIcon: CaretRightIcon,
            // Placeholder rows never become press targets — nothing underneath can act
            // yet, and a clickable shimmer row would be a false affordance.
            onPress: usingPlaceholders ? undefined : () => onSelectCategory(category.id),
        }
    })

    // Which of the two empty reasons applies (see file header, judgement 2) —
    // never during the skeleton branch, where "empty" just means "not loaded yet".
    const hasQuery = (searchQuery?.trim().length ?? 0) > 0
    // `emptyState` is now a component reference (COMPOSITE-4); only rendered when
    // not skeleton, so the component itself needs no `isSkeleton` branch of its own.
    const NoCategoriesEmptyState = () => (
        <EmptyState
            icon={hasQuery ? MagnifyingGlassIcon : undefined}
            title={hasQuery ? `No topics match "${searchQuery?.trim()}".` : LIBRARY_EMPTY_TITLE}
        />
    )
    const emptyState = !isSkeleton && categories.length === 0 ? NoCategoriesEmptyState : undefined

    // Nothing to page through during the first fetch or an empty result (see
    // file header, judgement on the pager).
    const showPager = !isSkeleton && categories.length > 0 && pagination != null

    return (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <SurfaceCardList

                        isSkeleton={isSkeleton}
                        items={rows}
                        emptyState={emptyState}
                    />
                ),
                ...(showPager
                    ? [
                        () => (
                            <div>
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={pagination.onPageChange}

                                />
                            </div>
                        ),
                    ]
                    : []),
            ]}
        />
    )
}

export { FoundationCategoryList }
