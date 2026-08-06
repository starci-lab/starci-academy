import { Accordion, type AccordionItem } from "@sb-components/atoms/navigation/Accordion/Accordion"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CurriculumPreview` -- the landing's curriculum-transparency block: every
 * real course, expanding to its real lesson titles, straight from
 * `CourseEntity`/`LessonEntity`. Grounded in the research annex's converged
 * finding -- "give away module/lesson TITLES... people buy when they know
 * exactly what they get" -- this is the PUBLIC, pre-enrollment picture: no
 * status glyph, no press handler, just the ordered title list, unlike
 * `LessonTOC` inside the classroom. Never called with 0 courses
 * (`CatalogComingSoonPanel`'s job) -- see the component's file header.
 */

/** One lesson row, as the public landing reads it -- a subset of `LessonEntity`. */
export interface CurriculumPreviewLesson {
    /** `LessonEntity.id` -- React key. */
    id: string
    /** `LessonEntity.title`, shown verbatim, in `sortIndex` order. */
    title: string
}

/** One course panel, as the public landing reads it -- a subset of `CourseEntity`. */
export interface CurriculumPreviewCourse {
    /** `CourseEntity.id` -- also the accordion panel key. */
    id: string
    /** `CourseEntity.title`, shown in the panel trigger. */
    title: string
    /** `CourseEntity.lessons`, in `sortIndex` order. Never empty in practice -- a course with no lessons has nothing to preview. */
    lessons: Array<CurriculumPreviewLesson>
}

/** Already-resolved copy `CurriculumPreview` renders. */
export interface CurriculumPreviewLabels {
    /** Suffix after each panel's lesson count (e.g. "lessons"). */
    lessonsSuffix: string
}

/** Props for {@link CurriculumPreview}. */
export interface CurriculumPreviewProps {
    /** Optional accent-toned kicker above the title. */
    eyebrow?: string
    /** The section title (e.g. "See exactly what you'll learn"). */
    title: string
    /** Optional supporting intro line below the title. */
    intro?: string
    /** The tenant's courses, in listing order -- 1+ (see the file header's precondition). */
    courses: Array<CurriculumPreviewCourse>
    /**
     * `true` -> the courses fetch is still in flight: the heading stays as
     * given (static marketing copy, always known up front -- the same
     * decision `FaqAccordion` makes for its own heading), and the accordion
     * renders a fixed count of collapsed, shimmering course rows in place of
     * `courses`.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: CurriculumPreviewLabels
}

/** How many placeholder course panels the loading accordion draws while `courses` hasn't landed yet. */
const SKELETON_COURSE_COUNT = 2

/** Placeholder courses -- sized like real panels so the accordion's shimmer mirrors the loaded shape. */
const SKELETON_COURSES: Array<CurriculumPreviewCourse> = Array.from({ length: SKELETON_COURSE_COUNT }, (_unused, index) => ({
    id: `skeleton-course-${index}`,
    title: "Course title",
    lessons: [],
}))

/**
 * The curriculum-transparency block. See the file header for the
 * public-vs-classroom distinction and the never-zero-courses precondition.
 *
 * @param props - {@link CurriculumPreviewProps}
 */
const CurriculumPreview = ({ eyebrow, title, intro, courses, isSkeleton = false, labels }: CurriculumPreviewProps) => {
    const rows = isSkeleton ? SKELETON_COURSES : courses

    const items: Array<AccordionItem> = rows.map((course) => ({
        key: course.id,
        title: (
            <StackH
                principle="value-row" gap={3}
                justify="between"
                classNames={["w-full"]}
                items={[
                    () => <Typography size="sm" weight="semibold" truncate text={course.title} />,
                    () => <Typography size="xs" color="muted" noWrap text={`${course.lessons.length} ${labels.lessonsSuffix}`} />,
                ]}
            />
        ),
        content: (
            <StackV
                gap={2}
                items={course.lessons.map((lesson, index) => () => (
                    <StackH
                        gap={2}
                        items={[
                            () => (
                                <span className="shrink-0">
                                    <Typography size="sm" color="muted" tabularNums text={`${index + 1}.`} />
                                </span>
                            ),
                            () => <Typography size="sm" text={lesson.title} />,
                        ]}
                    />
                ))}
            />
        ),
    }))

    return (
        <div data-tier="block" data-component="CurriculumPreview">
            <StackV
                principle="marketing-beat" gap={8}
                items={[
                    ...(eyebrow ? [() => <Typography size="sm" weight="semibold" color="accent" align="center" text={eyebrow} />] : []),
                    () => <Typography size="h2" weight="bold" align="center" text={title} />,
                    ...(intro ? [() => <Typography size="base" color="muted" align="center" text={intro} />] : []),
                    () => (
                        <Accordion
                            isSkeleton={isSkeleton}
                            items={items}
                            defaultExpandedKeys={rows.length > 0 ? [rows[0].id] : undefined}
                        />
                    ),
                ]}
            />
        </div>
    )
}

export { CurriculumPreview }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CurriculumPreview" } as const
