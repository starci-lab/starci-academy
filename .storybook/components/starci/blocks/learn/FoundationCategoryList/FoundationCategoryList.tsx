import React from "react"
import { CaretRightIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Image } from "@sb-components/atoms/media/Image/Image"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationCategoryList`: the FULL browse-and-drill-in list of the
 * Foundations content library — every category on the current page, each row a
 * navigation target, plus its own pager when there is more than one page.
 *
 * SIBLING OF `FoundationCategoryHeader`/`FoundationCategorySearchBar`, SAME HUB
 * — those two already establish the domain (`foundationCategorySuggestions`,
 * course-agnostic categories with a bare `{id, label}` shape) — this block is
 * the actual result list that search bar's picks drill into.
 *
 * REUSE, NOT A REBUILD (the exact trap `ContentModeNav`'s file header warns
 * about): wraps `SurfaceCardList` for the frame/row rhythm — same shape
 * `ModuleLessonList` wraps — and `Pagination` verbatim for the pager. NEW
 * because the DOMAIN doesn't match either: `ModuleLessonList` is a course's own
 * lesson progress (status icon, resume marker, premium lock) with no pager and
 * no thumbnail; this list is a flat, course-agnostic library of categories,
 * each carrying an optional THUMBNAIL (not a progress icon), no lock/resume
 * concept at all, and — because a library can be paged AND searched — TWO
 * distinct reasons a row set can come back empty.
 *
 * WHAT THIS BLOCK OWNS (§14d.1 — domain judgement the caller must not pre-decide):
 *
 *   1. THE THUMBNAIL-PRIORITY CHAIN. A category may carry a dedicated
 *      `thumbnailUrl`, a `logoSrc` (the underlying tech/brand mark), both, or
 *      neither. The chain: `logoSrc` wins when present (ported verbatim from
 *      `FoundationCategoryThumbnail` in `src`, which always prefers the brand
 *      mark); `thumbnailUrl` rides as the `Image` atom's OWN `fallbackSrc`
 *      (used if the logo 404s, or immediately as `src` when there is no logo
 *      at all); neither present → the atom's own built-in glyph. This is not
 *      a new fallback mechanism — it is the priority chain expressed entirely
 *      through `Image`'s existing `src`/`fallbackSrc` contract, so the block
 *      adds a naming decision, not a second rendering path.
 *
 *   2. THE TWO EMPTY REASONS (the domain reason this needs its own frame-facing
 *      wording rather than a caller-supplied string, §14d.1). An empty row set
 *      means one of two different things and reads differently for each:
 *        - `searchQuery` blank/absent → "the library itself has nothing yet",
 *          no icon (nothing to try differently).
 *        - `searchQuery` non-blank    → "this search matched nothing", quoting
 *          the trimmed query, with a magnifying-glass icon — no second-line
 *          hint, matching the real `foundations.searchEmpty` copy (one line,
 *          no icon in `src` either — the icon here stays a Storybook-local
 *          empty-state affordance, ported per this block's own icon judgement,
 *          not from real copy).
 *      `searchQuery` only ever DRIVES this choice — the block never renders it
 *      back verbatim beyond quoting it in its own title sentence.
 *
 *   3. THE TRAILING CARET. Every row navigates (drills into the category), so
 *      every row carries the same `CaretRightIcon` — a constant of THIS domain,
 *      not something the caller decides per row (contrast `ModuleLessonList`,
 *      where the trailing mark is conditional on `isPremium`).
 *
 * ⛔ A ROW NEVER SWALLOWS ITS PRESS ON BUSINESS GROUNDS (rule 7 / the exact bug
 * `ContentModeNav`'s header documents) — there is no lock/disabled concept in
 * this domain at all, so every real row is a plain press target; only
 * SKELETON placeholder rows carry no handler (nothing underneath can act yet).
 *
 * JUDGEMENT CALL — TWO LEAVES, `isSkeleton` FOLDED IN AS A STATE. Loading never
 * changes the STRUCTURE (still one bounded `SurfaceCardList`, only the row
 * text/thumbnail switch to shimmer) — same reasoning `FoundationCategorySearchBar`
 * already documents for its own `isSkeleton` ("only swaps which state each
 * composed atom renders … not its own leaf", §14d.2). So `Default` covers both
 * the populated and the loading row set; only the EMPTY branch — which replaces
 * the rows with a message entirely — earns its own leaf, split further into its
 * two wording states.
 *
 * JUDGEMENT CALL — the empty message renders THROUGH `SurfaceCardList`'s OWN
 * bounded `emptyState` slot, not by swapping the block's own tree for a loose,
 * unbounded message. Same reasoning `SubmissionFindingsList`'s file header
 * gives for its accordion card: the library's bounded surface is worth keeping
 * alive across every state — shimmering, empty, or full — never a card that
 * vanishes and a floating message appears in its place.
 *
 * JUDGEMENT CALL — the pager renders ONLY once there is something real to page
 * through (`!isSkeleton && categories.length > 0 && pagination` supplied).
 * There is nothing to page during the first fetch or an empty result, so it
 * never appears half-built underneath either.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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
            leading: (
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
    const EmptyState = () => (
        <EmptyState
            icon={hasQuery ? MagnifyingGlassIcon : undefined}
            title={hasQuery ? `No topics match "${searchQuery?.trim()}".` : LIBRARY_EMPTY_TITLE}


        />
    )
    const emptyState = !isSkeleton && categories.length === 0 ? EmptyState : undefined

    // Nothing to page through during the first fetch or an empty result (see
    // file header, judgement on the pager).
    const showPager = !isSkeleton && categories.length > 0 && pagination != null

    return (
        <StackV
            gap={4}

            body={
                <>
                    <SurfaceCardList

                        isSkeleton={isSkeleton}
                        items={rows}
                        emptyState={emptyState}
                    />
                    {showPager ? (
                        <div>
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={pagination.onPageChange}

                            />
                        </div>
                    ) : null}
                </>
            }
        />
    )
}

export { FoundationCategoryList }
