import React from "react"
import { BookOpenIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Typography } from "@/components/atoms/text/Typography"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { StackH, StackV } from "@/components/frames/Stack"

/** How many placeholder rows the co-located skeleton shows. */
const SKELETON_ROW_COUNT = 3

/** One recommended (not-yet-enrolled) course row, already resolved by the connected half. */
export interface RecommendedCoursesItem {
    /** Public display id — also the row's React key. */
    displayId: string
    title: string
    description: string | null
    thumbnailUrl: string | null
    /** Deep link into the course detail page, already locale-prefixed. */
    href: string
    /** Price the viewer actually pays (their loyalty discount already applied). */
    discountedPriceVnd: number
    originalPriceVnd: number
    /** `true` when the viewer's loyalty discount applies (`discountPercent > 0`). */
    discounted: boolean
    /** Already-translated "why this discount" line; omitted when there's no discount or no reason. */
    reasonText?: string
}

/** All display text, already localized by the connected `RecommendedCourses`. */
export interface RecommendedCoursesLabels {
    /** Section title above the card. */
    title: string
    /** Error-branch title. */
    loadErrorTitle: string
    /** Error-branch retry button label. */
    retry: string
}

/** Props for {@link _RecommendedCourses} — presentational; all data resolved, no fetch/store/i18n. */
export interface RecommendedCoursesProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the list rows shimmer in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero recommendations → the whole section hides (nothing left to recommend). */
    isEmpty?: boolean
    /** Truthy → the error message (beats the empty hide). The connected file only forwards a settled error with nothing in hand. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry?: () => void
    /** Recommended courses, in display order. */
    items?: Array<RecommendedCoursesItem>
    labels: RecommendedCoursesLabels
}

/**
 * "Courses for you" — the presentational half of {@link RecommendedCourses}: courses the viewer has
 * NOT bought yet, each priced with their engagement-based loyalty discount (an exclusive offer for
 * diligent / multi-course learners; the discounted price is the price actually charged). One framed
 * `LabeledCard` with a flat row per course — the TITLE is the link into the course (not a whole-card
 * press, matching "my courses"). Hides entirely once settled with zero recommendations — this block
 * never had an empty-state message, only a genuine fetch failure gets one.
 *
 * `error` falls to the shared `AsyncContentError` frame; otherwise the list renders with `isSkeleton`
 * threaded to every leaf that supports it (`loading-and-skeleton.md`). `IconTile` and `PriceTag`
 * carry no `isSkeleton` of their own, so their skeleton row is a hand-mirrored `Skeleton.*` pair sized
 * to their real boxes, right where they sit (still co-located — not a parallel tree). See
 * `tiers/split.md` — the connected `index.tsx` owns the fetch, the hrefs, and every translated string.
 *
 * @param props - {@link RecommendedCoursesProps}
 */
export const _RecommendedCourses = ({
    className,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    items = [],
    labels,
}: RecommendedCoursesProps) => {
    // settled, no error, nothing left to recommend → hide the whole section (the original contract
    // never rendered an empty-state message here, only a genuine fetch failure gets one).
    if (!isSkeleton && !error && isEmpty) {
        return null
    }

    // `frameless` mirrors the loaded list — self-framed as a `SurfaceListCard` — skipping the outer
    // `Card` only once real rows are showing, matching `MyCoursesProgress`.
    const hasItems = !isSkeleton && !error && items.length > 0

    return (
        <LabeledCard
            label={labels.title}
            className={className}
            frameless={hasItems}
            identity={{ tier: "block", component: "RecommendedCourses" }}
        >
            {error ? (
                <AsyncContentError title={labels.loadErrorTitle} onRetry={onRetry} retryLabel={labels.retry} />
            ) : (
                <SurfaceListCard>
                    {isSkeleton
                        ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => (
                            <SurfaceListCardItem key={index}>
                                <StackH gap={3} items={[
                                    // IconTile has no isSkeleton of its own — hand-mirrored, sized to its "sm" box.
                                    () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                                    () => (
                                        <StackV gap={2} classNames={["min-w-0", "flex-1"]} items={[
                                            () => <Typography size="sm" weight="medium" isSkeleton />,
                                            // PriceTag has no isSkeleton of its own — hand-mirrored to its box.
                                            () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                        ]} />
                                    ),
                                ]} />
                            </SurfaceListCardItem>
                        ))
                        : items.map((course) => (
                            <SurfaceListCardItem key={course.displayId} href={course.href} hover="underline">
                                <StackH gap={3} items={[
                                    () => (
                                        <IconTile
                                            size="sm"
                                            src={course.thumbnailUrl}
                                            alt={course.title}
                                            icon={<BookOpenIcon aria-hidden focusable="false" />}
                                        />
                                    ),
                                    () => (
                                        <StackV gap={1} classNames={["min-w-0", "flex-1"]} items={[
                                            // whole-row link → title underlines on CARD hover (group), matching "my courses" CourseRow.
                                            () => (
                                                <Typography
                                                    size="sm"
                                                    weight="medium"
                                                    truncate
                                                    underlineOnGroupHover
                                                    text={course.title}
                                                />
                                            ),
                                            ...(course.description ? [() => (
                                                <Typography size="xs" color="muted" truncate text={course.description} />
                                            )] : []),
                                            () => (
                                                <PriceTag
                                                    discounted={course.discountedPriceVnd}
                                                    original={course.discounted ? course.originalPriceVnd : null}
                                                    size="sm"
                                                />
                                            ),
                                            ...(course.reasonText ? [() => (
                                                <Typography size="xs" color="accent-soft" text={course.reasonText} />
                                            )] : []),
                                        ]} />
                                    ),
                                ]} />
                            </SurfaceListCardItem>
                        ))}
                </SurfaceListCard>
            )}
        </LabeledCard>
    )
}
