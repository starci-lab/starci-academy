import React from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StackH, StackV } from "@/components/frames/Stack"
import type { QueryMyDashboardMilestoneProgressItemData } from "@/modules/api/graphql/queries/types/my-dashboard"
import { CourseRow } from "./CourseRow"

/** How many placeholder rows the co-located skeleton shows while the first load is in flight. */
const SKELETON_ROW_COUNT = 2

/** All display text, already localized by the connected `MyCoursesProgress`; a story passes i18n keys. */
export interface MyCoursesProgressLabels {
    /** Error-message title. */
    errorTitle: string
    /** Retry-button label, paired with `onRetry` on the error branch. */
    retry: string
    /** Empty-message title, shown once settled with zero enrolled courses. */
    emptyTitle: string
}

/** Props for {@link _MyCoursesProgress} — presentational; all data resolved, no fetch/store/i18n. */
export interface MyCoursesProgressProps {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: string
    /** First load, nothing in hand → the row list shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero enrolled courses → the empty message (beats content, loses to loading). */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler, paired with `labels.retry` on the error branch. */
    onRetry?: () => void
    /** Enrolled-course progress rows, in display order. */
    courses?: Array<QueryMyDashboardMilestoneProgressItemData>
    labels: MyCoursesProgressLabels
}

/**
 * Enrolled-course progress — the presentational half of {@link MyCoursesProgress}: each
 * course as one whole-row clickable item inside a single surface list card. Three states in
 * the fixed order error → loading → empty → content: `error` falls to the shared
 * `AsyncContentError` frame, settled-empty to `AsyncContentEmpty`, and otherwise the same
 * `SurfaceListCard` renders — real `CourseRow`s once loaded, or placeholder rows of the SAME
 * shape while shimmering. `CourseRow` (and the blocks it composes — `IconTile`,
 * `CourseProgressBar`) take no `isSkeleton` of their own, so the loading rows are hand-mirrored
 * `Skeleton.*` pieces right where the real rows sit — still co-located, not a separate tree
 * (loading-and-skeleton.md §1). `frameless` stays computed from whether real courses are on
 * screen, so the loaded list (self-framed as a `SurfaceListCard`) skips the outer `Card` while
 * every other state still gets one (avoids rendering bare on the page background). See
 * `tiers/split.md` — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link MyCoursesProgressProps}
 */
const _MyCoursesProgress = ({
    label,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    courses = [],
    labels,
}: MyCoursesProgressProps) => {
    // error beats a stale loading flag; empty only once settled (BLOCK-8 order); real content
    // (its OWN bounded `SurfaceListCard`) is the only branch that drops `LabeledCard`'s inner `Card`.
    const hasCourses = !isSkeleton && !isEmpty && !error

    const body = () => {
        if (error) {
            return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
        }
        if (!isSkeleton && isEmpty) {
            return <AsyncContentEmpty title={labels.emptyTitle} />
        }

        // ROWS — while shimmering, placeholder rows keep the SAME `SurfaceListCardItem` shape/count
        // (loading-and-skeleton.md §1: same row component, same count shape).
        return (
            <SurfaceListCard>
                {isSkeleton
                    ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => (
                        <SurfaceListCardItem key={`pending-${index}`}>
                            <StackH gap={4} principle="content-row" items={[
                                () => <Skeleton className="size-12 shrink-0 rounded-2xl" />,
                                () => (
                                    <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]} items={[
                                        () => (
                                            <StackH gap={3} principle="flex-action" justify="between" items={[
                                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                () => <Skeleton className="h-3 w-8 rounded" />,
                                            ]} />
                                        ),
                                        () => <Skeleton.ProgressBar />,
                                    ]} />
                                ),
                            ]} />
                        </SurfaceListCardItem>
                    ))
                    : courses.map((item) => <CourseRow key={item.globalId} item={item} />)}
            </SurfaceListCard>
        )
    }

    return (
        <LabeledCard
            label={label}
            frameless={hasCourses}
            identity={{ tier: "block", component: "MyCoursesProgress" }}
        >
            {body()}
        </LabeledCard>
    )
}

export { _MyCoursesProgress }
