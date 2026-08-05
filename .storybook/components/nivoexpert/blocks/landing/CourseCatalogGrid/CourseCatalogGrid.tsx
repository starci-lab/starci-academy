import {
    CourseOfferCard,
    type CourseOfferCardLabels,
    type CourseOfferCardView,
} from "@sb-components/nivoexpert/blocks/landing/CourseOfferCard/CourseOfferCard"
import { Grid } from "@sb-components/frames/Grid/Grid"

/**
 * `CourseCatalogGrid` -- the tenant landing's course catalog at the volume the
 * real backend and the researched platforms both assume: 2-6 courses
 * typical, more flowing to additional rows (`CoursesResolver.execute()` is
 * unpaginated). Each cell is a real `CourseOfferCard`; this block owns only
 * the responsive `Grid` arrangement around them. Never called with 0 courses
 * (`CatalogComingSoonPanel`'s job) or exactly 1 (`CourseFeaturedCard`'s job)
 * -- see the component's file header for why those are siblings, not states
 * of this shape.
 */

/** Already-resolved copy, forwarded verbatim to every card. */
export type CourseCatalogGridLabels = CourseOfferCardLabels

/** Props for {@link CourseCatalogGrid}. */
export interface CourseCatalogGridProps {
    /**
     * The tenant's courses, in listing order -- 2+ typical. Never called with 0
     * or 1 (see the file header); this grid does not model those pictures.
     */
    courses: Array<CourseOfferCardView>
    /** Fires as any card is pressed -- the connected layer routes to `/classroom/[slug]`. */
    onOpenCourse: (slug: string) => void
    /**
     * `true` -> the catalog's own first fetch is in flight: a fixed count of
     * course-shaped cards render with every cell shimmering, matching the
     * loaded shape so nothing jumps when the courses land.
     */
    isSkeleton?: boolean
    /** Already-localized copy, forwarded to every card. */
    labels: CourseCatalogGridLabels
}

/** How many placeholder cards the loading grid draws while `courses` hasn't landed yet. */
const SKELETON_CARD_COUNT = 3

/** Placeholder courses -- sized like real cards so the grid's shimmer mirrors the loaded shape. */
const SKELETON_COURSES: Array<CourseOfferCardView> = Array.from({ length: SKELETON_CARD_COUNT }, (_unused, index) => ({
    slug: `skeleton-${index}`,
    title: "Course title",
    summary: "Course summary line",
    priceText: "000.000",
    lessonCount: 6,
}))

/**
 * The public catalog grid. See the file header for the volume precondition
 * and the shared `Grid` frame convention.
 *
 * @param props - {@link CourseCatalogGridProps}
 */
const CourseCatalogGrid = ({ courses, onOpenCourse, isSkeleton = false, labels }: CourseCatalogGridProps) => {
    const cards = isSkeleton ? SKELETON_COURSES : courses

    return (
        <div data-tier="block" data-component="CourseCatalogGrid">
            <Grid
                columns={{ base: 1, md: 2, lg: 3 }}
                gap={5}
                isSkeleton={isSkeleton}
                items={cards.map((course) => ({
                    key: course.slug,
                    content: () => (
                        <CourseOfferCard course={course} onOpenCourse={onOpenCourse} isSkeleton={isSkeleton} labels={labels} />
                    ),
                }))}
            />
        </div>
    )
}

export { CourseCatalogGrid }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CourseCatalogGrid" } as const
