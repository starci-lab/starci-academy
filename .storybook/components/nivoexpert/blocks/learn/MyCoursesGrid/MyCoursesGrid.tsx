import { BookOpenIcon, CompassIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `MyCoursesGrid` -- every course the member is enrolled in, one card each: title,
 * status chip, progress meter, "done / total" count, and an open-course action.
 * The three pictures -- `empty`, `content`, `overflow` -- are DATA, so they are
 * STATES of the single shape. Grounded in the real `Course`/`Lesson` shape and the
 * client's own per-course progress count.
 */

/** One course card -- a subset of `Course` joined with the viewer's progress. */
export interface CourseCardView {
    /** Course slug -- routes to `/classroom/[slug]` (`Course.slug`). */
    slug: string
    /** Course title (`Course.title`). */
    title: string
    /** Short summary (`Course.summary`), or null when unset. */
    summary?: string | null
    /** Total lessons in the course (`Course.lessons.length`). */
    lessonCount: number
    /** Lessons with a `completedAt`, for this member, in this course. */
    completedCount: number
}

/** Props for {@link MyCoursesGrid}. */
export interface MyCoursesGridProps {
    /** The enrolled courses, in listing order. Empty is the `empty` state. */
    courses: Array<CourseCardView>
    /** Open a course's classroom -- the connected layer routes to `/classroom/[slug]`. */
    onOpenCourse: (slug: string) => void
    /** Empty state's onward action -- the connected layer routes to the course catalog. */
    onBrowseCourses: () => void
    /**
     * `true` -> the grid's own first fetch is in flight: a fixed count of
     * course-shaped cards render with every cell shimmering (§12b), threaded down.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: MyCoursesGridLabels
}

/** The already-resolved copy the block renders. */
export interface MyCoursesGridLabels {
    /** Section title above the grid (e.g. "My courses"). */
    title: string
    /** Status chip label for a course with `completedCount < lessonCount`. */
    inProgressLabel: string
    /** Status chip label for a course with every lesson completed. */
    completedLabel: string
    /** Suffix after the lesson count (e.g. "lessons"). */
    lessonsSuffix: string
    /** Suffix after the "done / total" count under the meter (e.g. "lessons complete"). */
    lessonsCompleteSuffix: string
    /** Open-course CTA label. */
    openLabel: string
    /** Empty-state title -- a brand-new member has never enrolled. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
    /** Empty-state action label -- browse the catalog. */
    browseLabel: string
}

/** How many placeholder cards the loading grid draws while `courses` hasn't landed yet. */
const SKELETON_CARD_COUNT = 3

/** Placeholder courses -- sized like a real card so the grid's shimmer mirrors the loaded shape. */
const SKELETON_COURSES: Array<CourseCardView> = Array.from({ length: SKELETON_CARD_COUNT }, (_unused, index) => ({
    slug: `skeleton-${index}`,
    title: "Course title",
    summary: "Course summary line",
    lessonCount: 4,
    completedCount: 0,
}))

/**
 * The learner's enrolled-courses grid. See the file header for why the three
 * pictures are states of one shape rather than separate leaves.
 *
 * @param props - {@link MyCoursesGridProps}
 */
const MyCoursesGrid = ({ courses, onOpenCourse, onBrowseCourses, isSkeleton = false, labels }: MyCoursesGridProps) => {
    const cards = isSkeleton ? SKELETON_COURSES : courses

    /** One course card -- header + status chip, optional summary, meter, count, open action. */
    const CourseCard = (course: CourseCardView) => {
        const isDone = course.lessonCount > 0 && course.completedCount === course.lessonCount
        const tone: ChipTone = isDone ? "success" : "accent"
        return (
            <SurfaceCard
                padding={3}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        principle="sibling-stack" gap={3}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    principle="value-row" gap={3}
                                    justify="between"
                                    align="center"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Typography size="base" weight="semibold" truncate isSkeleton={isSkeleton} text={course.title} />,
                                        () => <Chip tone={tone} isSkeleton={isSkeleton} text={isDone ? labels.completedLabel : labels.inProgressLabel} />,
                                    ]}
                                />
                            ),
                            ...(course.summary
                                ? [() => <Typography size="sm" color="muted" truncate isSkeleton={isSkeleton} text={course.summary ?? ""} />]
                                : []),
                            () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={`${course.lessonCount} ${labels.lessonsSuffix}`} />,
                            () => <ProgressMeter value={course.completedCount} max={course.lessonCount > 0 ? course.lessonCount : 1} isSkeleton={isSkeleton} color={isDone ? "success" : "accent"} />,
                            () => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    isSkeleton={isSkeleton}
                                    text={`${course.completedCount} / ${course.lessonCount} ${labels.lessonsCompleteSuffix}`}
                                />
                            ),
                            () => (
                                <div className="w-fit">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        label={labels.openLabel}
                                        isSkeleton={isSkeleton}
                                        onPress={() => onOpenCourse(course.slug)}
                                    />
                                </div>
                            ),
                        ]}
                    />
                )}
            />
        )
    }

    /** Empty state's action -- browse the course catalog. A component reference, called by `EmptyState` itself. */
    const BrowseAction = () => (
        <Button variant="primary" size="sm" prefixIcon={CompassIcon} label={labels.browseLabel} onPress={onBrowseCourses} />
    )

    return (
        <div data-tier="block" data-component="MyCoursesGrid">
            <StackV
                principle="label-field" gap={4}
                isSkeleton={isSkeleton}
                items={[
                    () => <Typography size="h5" weight="semibold" isSkeleton={isSkeleton} text={labels.title} />,
                    () =>
                        !isSkeleton && courses.length === 0 ? (
                            <EmptyState icon={BookOpenIcon} title={labels.emptyTitle} description={labels.emptyDescription} action={BrowseAction} />
                        ) : (
                            <Grid
                                principle="content-row" columns={{ base: 1, sm: 2, lg: 3 }}
                                items={cards.map((course) => ({ key: course.slug, content: () => CourseCard(course) }))}
                            />
                        ),
                ]}
            />
        </div>
    )
}

export { MyCoursesGrid }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "MyCoursesGrid" } as const
