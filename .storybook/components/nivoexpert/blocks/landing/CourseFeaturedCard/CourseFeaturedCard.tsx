import { ArrowRightIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MetricCard } from "@sb-components/composites/stats/MetricCard/MetricCard"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { CourseOfferCardView } from "@sb-components/nivoexpert/blocks/landing/CourseOfferCard/CourseOfferCard"

/**
 * `CourseFeaturedCard` -- the 1-course arrangement of the tenant landing's
 * catalog: a full-measure two-pane card, never a one-cell grid. A sibling of
 * `CourseCatalogGrid` (2+ courses) and `CatalogComingSoonPanel` (0 courses),
 * not a variant of either -- the proposal's §3 volume table forces exactly
 * this shape at a count of 1. The right pane shows the real lesson count as
 * a `MetricCard` stat rather than an invented image, since `CourseEntity`
 * has no thumbnail field.
 */

/** Already-resolved copy the card renders. */
export interface CourseFeaturedCardLabels {
    /** Price-chip text shown when `priceText` is null (e.g. "Free"). */
    freeLabel: string
    /** Suffix after the lesson count stat (e.g. "lessons"). */
    lessonsSuffix: string
    /** The single press target's visible label (e.g. "View course"). */
    ctaLabel: string
}

/** Props for {@link CourseFeaturedCard}. */
export interface CourseFeaturedCardProps {
    /** The tenant's one course. */
    course: CourseOfferCardView
    /** Fires on press -- the connected layer routes to `/classroom/[slug]`. */
    onOpenCourse: (slug: string) => void
    /** `true` -> a fixed skeleton course renders in place of `course`, every field shimmering. */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: CourseFeaturedCardLabels
}

/** Skeleton placeholder -- sized like the real course so the shimmer mirrors the loaded shape. */
const SKELETON_COURSE: CourseOfferCardView = {
    slug: "skeleton",
    title: "Course title goes here",
    summary: "Course summary line goes here, long enough to wrap onto a second line of copy",
    priceText: "000.000",
    lessonCount: 6,
}

/**
 * The single-course featured arrangement. See the file header for why this is
 * a sibling of `CourseCatalogGrid`, not a variant of it.
 *
 * @param props - {@link CourseFeaturedCardProps}
 */
const CourseFeaturedCard = ({ course, onOpenCourse, isSkeleton = false, labels }: CourseFeaturedCardProps) => {
    const view = isSkeleton ? SKELETON_COURSE : course
    const priceLabel = view.priceText ?? labels.freeLabel

    return (
        <div data-tier="block" data-component="CourseFeaturedCard">
            <SurfaceCard
                padding={4}
                isHighlight
                isSkeleton={isSkeleton}
                onPress={() => onOpenCourse(course.slug)}
                body={() => (
                    <Grid
                        principle="block-boundary" columns={{ base: 1, md: 2 }}
                        isSkeleton={isSkeleton}
                        items={[
                            {
                                key: "info",
                                content: () => (
                                    <StackV
                                        gap={3}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => <Chip tone="accent" isSkeleton={isSkeleton} text={priceLabel} />,
                                            () => <Typography size="h4" weight="bold" isSkeleton={isSkeleton} text={view.title} />,
                                            ...(isSkeleton || view.summary
                                                ? [() => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={view.summary ?? ""} />]
                                                : []),
                                            () => (
                                                <Typography
                                                    size="sm"
                                                    weight="medium"
                                                    color="accent"
                                                    suffixIcon={ArrowRightIcon}
                                                    iconSlide={!isSkeleton}
                                                    isSkeleton={isSkeleton}
                                                    text={labels.ctaLabel}
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                            },
                            {
                                key: "stat",
                                content: () =>
                                    isSkeleton ? (
                                        <MetricCard isSkeleton />
                                    ) : (
                                        <MetricCard value={String(view.lessonCount)} label={labels.lessonsSuffix} />
                                    ),
                            },
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { CourseFeaturedCard }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CourseFeaturedCard" } as const
