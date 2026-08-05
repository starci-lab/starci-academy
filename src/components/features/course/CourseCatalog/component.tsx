import React from "react"
import type { Key } from "react"
import { ListIcon, SquaresFourIcon } from "@phosphor-icons/react"
import {
    AsyncContentEmpty,
    AsyncContentError,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@/components/composites/async/AsyncContent"
import { Breadcrumbs } from "@/components/atoms/navigation/Breadcrumbs"
import { Typography } from "@/components/atoms/text/Typography"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Container } from "@/components/frames/Container"
import { Cluster } from "@/components/frames/Cluster"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Pagination } from "@/components/blocks/navigation/Pagination"
import { CourseCardSkeleton } from "@/components/blocks/cards/CourseCardSkeleton"
import { CatalogCourseCard } from "./CatalogCourseCard"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import type { CourseEntity } from "@/modules/types/entities/course"

/** Courses per page (3 columns × 3 rows on desktop). Re-exported so the connected `CourseCatalog` computes `totalPages` against the same constant. */
export const PAGE_SIZE = 9

/** How the catalog is laid out — a roomy card grid or a compact row list. */
export type CatalogView = "grid" | "line"

/** How many placeholder cards the co-located skeleton shows while the first load is in flight — same count either layout used to hand-build. */
const SKELETON_ITEM_COUNT = 6

/** Every already-translated string the presentational tree renders, resolved by the connected `CourseCatalog`. */
export interface CourseCatalogLabels {
    /** Breadcrumb root crumb label. */
    navHome: string
    /** Breadcrumb current crumb label. */
    navCourses: string
    /** Page title. */
    title: string
    /** Search field placeholder. */
    searchPlaceholder: string
    /** Accessible name for the grid/line view-toggle tab group. */
    viewAria: string
    /** Accessible label for the grid-view icon tab. */
    viewGrid: string
    /** Accessible label for the line-view icon tab. */
    viewLine: string
}

/** Props for {@link _CourseCatalog} — presentational; every value already resolved by the connected `CourseCatalog`. */
export interface CourseCatalogProps {
    /** First load, nothing in hand yet → the card grid/list shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero courses for the current search → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats a stale loading flag). The connected file passes its settled fetch error. */
    error?: unknown
    /** Props for the error message — forwarded straight to `AsyncContentError`. */
    errorContent?: AsyncContentErrorProps
    /** Props for the empty message — forwarded straight to `AsyncContentEmpty` (the connected file switches between the plain-empty and filtered-empty copy). */
    emptyContent?: AsyncContentEmptyProps
    /** The current page of courses, already ordered (curated learning-path order). */
    list: ReadonlyArray<CourseEntity>
    /** grid ⇆ line layout, persisted by the connected file. */
    view: CatalogView
    /** Fired when the view toggle changes. */
    onChangeView: (next: CatalogView) => void
    /** Live search text (immediate, not debounced — drives the field). */
    query: string
    /** Fired on every keystroke in the search field. */
    onQueryChange: (next: string) => void
    /** Already-localized result-count line, e.g. "12 courses" — omitted while there is nothing to count yet (mirrors the pre-split behaviour of showing nothing, not a skeleton, for this line). */
    countLabel?: string
    /** Fired when the breadcrumb "Home" crumb is pressed. */
    onNavigateHome: () => void
    /** 1-based current page. */
    currentPage: number
    /** Total pages (>= 1). */
    totalPages: number
    /** Fired with a 1-based page number when the user changes page. */
    onPageChange: (pageNumber: number) => void
    labels: CourseCatalogLabels
}

/**
 * Loading placeholder for ONE compact "line" catalog row — mirrors
 * {@link CatalogCourseCard}'s `layout="line"` shape (thumbnail, title + one
 * description line, a price line, and a two-button action row) so the
 * catalog's line view does not jump when data resolves. Co-located right here
 * (not a separate hand-kept file) since `CatalogCourseCard` takes no
 * `isSkeleton` prop of its own to thread through (`loading-and-skeleton.md`).
 */
const CatalogLineCardSkeleton = () => (
    <SurfaceCard
        identity={{ tier: "block", component: "CatalogLineCardSkeleton" }}
        body={() => (
            <StackH
                gap={4}
                items={[
                    () => (
                        <Skeleton className="hidden aspect-video w-36 shrink-0 rounded-2xl @app-sm:block" />
                    ),
                    () => (
                        <StackV
                            gap={2}
                            classNames={["min-w-0", "flex-1"]}
                            items={[
                                () => <Skeleton.Typography type="h6" width="1/2" />,
                                () => <Skeleton.Typography type="body-sm" width="3/4" />,
                            ]}
                        />
                    ),
                    () => (
                        <StackV
                            gap={2}
                            align="end"
                            classNames={["shrink-0"]}
                            items={[
                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                () => (
                                    <StackH
                                        gap={2}
                                        classNames={["w-full"]}
                                        items={[
                                            () => <Skeleton.Button width="flex-1" />,
                                            () => <Skeleton.Button width="flex-1" />,
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    ),
                ]}
            />
        )}
    />
)

/**
 * Featured courses catalog — the presentational half of `CourseCatalog`
 * (`design/storybook/architecture/tiers/split.md`). Left-aligned header
 * (breadcrumb → title), a search row (result count + grid⇆line toggle), the
 * ES-backed course grid/list, and a pager that stays visible across every
 * state. Only the grid/list region is async-gated, in the fixed order
 * error → skeleton → empty → content (`loading-and-skeleton.md`): `error`
 * falls to the shared `AsyncContentError` frame, `isEmpty` to
 * `AsyncContentEmpty`, and otherwise the ONE real grid/list tree renders —
 * `isSkeleton` swaps each card for its co-located placeholder in place,
 * instead of a hand-built parallel skeleton tree swapped in wholesale.
 *
 * `CatalogCourseCard` (and the `CourseCard` block underneath it) carries no
 * `isSkeleton` prop of its own — it is a sibling component with its own
 * `index.tsx`, out of this split's scope — so the loading placeholder per
 * card is the existing `CourseCardSkeleton` (grid) / the co-located
 * `CatalogLineCardSkeleton` (line), mirrored right where the real card sits.
 *
 * @param props - {@link CourseCatalogProps}
 */
export const _CourseCatalog = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    errorContent,
    emptyContent,
    list,
    view,
    onChangeView,
    query,
    onQueryChange,
    countLabel,
    onNavigateHome,
    currentPage,
    totalPages,
    onPageChange,
    labels,
}: CourseCatalogProps) => {
    // ── the grid/list region only — the header, search row, and pager stay put across
    // every state, exactly as the retired `AsyncContent` wrapper only ever wrapped this
    // region (BLOCK-8's error → skeleton → empty → content order, scoped to this region).
    const renderCatalogRegion = (): React.ReactNode => {
        if (error && errorContent) {
            return <AsyncContentError {...errorContent} />
        }
        if (!isSkeleton && isEmpty) {
            return emptyContent ? <AsyncContentEmpty {...emptyContent} /> : null
        }

        const cardItems: Array<{ key: string; Content: ComponentTypeWithSkeleton }> = isSkeleton
            ? Array.from({ length: SKELETON_ITEM_COUNT }, (_unused, index) => ({
                key: `pending-${index}`,
                Content: view === "grid"
                    ? () => <CourseCardSkeleton />
                    : () => <CatalogLineCardSkeleton />,
            }))
            : list.map((course) => ({
                key: course.id,
                Content: () => <CatalogCourseCard course={course} layout={view} />,
            }))

        if (view === "grid") {
            const gridItems: Array<GridItem> = cardItems.map(({ key, Content }) => ({ key, content: Content }))
            return <Grid items={gridItems} columns={{ base: 1, md: 2, lg: 3 }} gap={3} isSkeleton={isSkeleton} />
        }
        return <StackV gap={3} items={cardItems.map(({ Content }) => Content)} isSkeleton={isSkeleton} />
    }

    return (
        <Container
            identity={{ tier: "block", component: "CourseCatalog" }}
            size="xl"
            padding={6}
            body={() => (
                <StackV
                    gap={4}
                    items={[
                        () => (
                            <PageHeader
                                breadcrumb={(
                                    <Breadcrumbs
                                        items={[
                                            { key: "home", label: labels.navHome, onPress: onNavigateHome },
                                            { key: "courses", label: labels.navCourses },
                                        ]}
                                    />
                                )}
                                title={labels.title}
                            />
                        ),
                        () => (
                            <Cluster
                                gap={3}
                                justify="between"
                                align="center"
                                items={[
                                    () => <SearchInput value={query} onValueChange={onQueryChange} placeholder={labels.searchPlaceholder} />,
                                    () => (
                                        <StackH
                                            gap={3}
                                            classNames={["shrink-0"]}
                                            items={[
                                                ...(countLabel != null ? [() => <Typography size="sm" color="muted" text={countLabel} />] : []),
                                                () => (
                                                    <TabsCard
                                                        variant="primary"
                                                        leftTabs={{
                                                            selectedKey: view,
                                                            ariaLabel: labels.viewAria,
                                                            onSelectionChange: (key: Key) => onChangeView(String(key) as CatalogView),
                                                            items: [
                                                                {
                                                                    key: "grid",
                                                                    label: (
                                                                        <SquaresFourIcon
                                                                            className="size-5"
                                                                            aria-label={labels.viewGrid}
                                                                            focusable="false"
                                                                        />
                                                                    ),
                                                                },
                                                                {
                                                                    key: "line",
                                                                    label: (
                                                                        <ListIcon
                                                                            className="size-5"
                                                                            aria-label={labels.viewLine}
                                                                            focusable="false"
                                                                        />
                                                                    ),
                                                                },
                                                            ],
                                                        }}
                                                    />
                                                ),
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        () => renderCatalogRegion(),
                        () => (
                            // Always rendered (even a single page) so the catalog's page-boundary UI
                            // is stable as the course count grows — per the teacher's call, do not
                            // hide it at ≤ PAGE_SIZE. Every page number shown (no windowing), matching
                            // the pre-split pager exactly.
                            <Pagination
                                className="mt-0 justify-start"
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}
