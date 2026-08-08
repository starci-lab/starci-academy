import React from "react"
import {
    BookOpenIcon,
} from "@phosphor-icons/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    AsyncContentError,
} from "@/components/composites/async/AsyncContent"
import {
    Typography,
} from "@/components/atoms/text/Typography"
import {
    IconTile,
} from "@/components/blocks/identity/IconTile"
import {
    SurfaceCardList,
    type SurfaceCardListItem,
} from "@/components/composites/cards/SurfaceCard"
import {
    Skeleton,
} from "@/components/blocks/skeleton/Skeleton"
import {
    PriceTagInline,
} from "@/components/blocks/commerce/PriceTag"
import {
    StackH,
    StackV,
} from "@/components/frames/Stack"

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
 * "Courses for you" — class A collapse: one {@link SurfaceCardList} owns label +
 * identity + isSkeleton + free-form course rows (B37). Former LabeledCard frameless
 * shell and SurfaceListCard children API removed.
 *
 * @param props - {@link RecommendedCoursesProps}
 */
export const _RecommendedCourses = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    items = [],
    labels,
}: RecommendedCoursesProps) => {
    if (!isSkeleton && !error && isEmpty) {
        return null
    }

    const listItems: Array<SurfaceCardListItem> = isSkeleton
        ? Array.from(
            {
                length: SKELETON_ROW_COUNT,
            },
            (_unused, index) => ({
                key: `skeleton-${index}`,
                content: () => (
                    <StackH gap={3} items={[
                        () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                        () => (
                            <StackV gap={2} classNames={[
                                "min-w-0",
                                "flex-1",
                            ]} items={[
                                () => <Typography size="sm" weight="medium" isSkeleton />,
                                () => <Skeleton.Typography type="body-xs" width="1/4" />,
                            ]} />
                        ),
                    ]} />
                ),
            }),
        )
        : items.map((course) => ({
            key: course.displayId,
            href: course.href,
            hover: "underline" as const,
            content: () => (
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
                        <StackV gap={1} classNames={[
                            "min-w-0",
                            "flex-1",
                        ]} items={[
                            () => (
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    truncate
                                    underlineOnGroupHover
                                    text={course.title}
                                />
                            ),
                            ...(course.description ? [
                                () => (
                                    <Typography size="xs" color="muted" truncate text={course.description} />
                                ),
                            ] : []),
                            () => (
                                <PriceTagInline
                                    discounted={course.discountedPriceVnd}
                                    original={course.discounted ? course.originalPriceVnd : null}
                                />
                            ),
                            ...(course.reasonText ? [
                                () => (
                                    <Typography size="xs" color="accent-soft" text={course.reasonText} />
                                ),
                            ] : []),
                        ]} />
                    ),
                ]} />
            ),
        }))

    return (
        <SurfaceCardList
            identity={{
                tier: "block",
                component: "RecommendedCourses",
            }}
            label={labels.title}
            items={listItems}
            isSkeleton={isSkeleton}
            error={error}
            errorState={() => (
                <AsyncContentError
                    title={labels.loadErrorTitle}
                    onRetry={onRetry}
                    retryLabel={labels.retry}
                />
            )}
        />
    )
}
