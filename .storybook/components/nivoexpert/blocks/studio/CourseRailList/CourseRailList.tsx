import { BookOpenIcon, NotePencilIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CourseRailList` -- the Course Studio's leading rail: the expert's courses, and
 * once one is picked, that course's lessons -- both single-select lists the editor
 * panel reads its open lesson from. The pictures -- no courses yet, a nonempty list
 * with nothing picked, a course with no lessons yet, a populated tree -- are DATA,
 * so they are STATES of the single shape. Grounded in the real `CourseEntity`
 * (`CourseForm.tsx`'s `slug`/`title`) and `LessonEntity` (`LessonManager.tsx`'s
 * per-course `lessons`, ordered by `sortIndex`).
 */

/** One course row -- a subset of `CourseEntity`. */
export interface CourseRailCourseView {
    /** Course id (`CourseEntity.id`). */
    id: string
    /** Course title (`CourseEntity.title`). */
    title: string
    /** Lesson count for this course (`course.lessons.length`), shown as the row's meta. */
    lessonCount: number
}

/** One lesson row of the SELECTED course -- a subset of `LessonEntity`. */
export interface CourseRailLessonView {
    /** Lesson id (`LessonEntity.id`). */
    id: string
    /** Lesson title (`LessonEntity.title`). */
    title: string
}

/** Props for {@link CourseRailList}. */
export interface CourseRailListProps {
    /** The expert's courses, in listing order. Empty is the `no-courses` state. */
    courses: Array<CourseRailCourseView>
    /** Id of the course whose lessons show below, or null when nothing is picked yet. */
    selectedCourseId: string | null
    /** Change which course's lessons show below -- the connected layer re-reads that course's lessons. */
    onSelectCourse: (id: string) => void
    /** Open the new-course flow -- the connected layer runs `createCourse`. */
    onAddCourse: () => void
    /** The SELECTED course's lessons, `sortIndex` order. Empty is that course's own `no-lessons` state. */
    lessons: Array<CourseRailLessonView>
    /** Id of the lesson open in the editor, or null when none is open yet. */
    selectedLessonId: string | null
    /** Open a lesson in the editor panel. */
    onSelectLesson: (id: string) => void
    /** Start a new lesson on the selected course -- the connected layer runs `createLesson`. */
    onAddLesson: () => void
    /**
     * `true` -> the rail's own first fetch is in flight: both lists render a fixed
     * count of course/lesson-shaped rows with every cell shimmering (§12b), and
     * both add actions go inert. Threaded straight down -- never fed to a separate
     * skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: CourseRailListLabels
}

/** The already-resolved copy the block renders. */
export interface CourseRailListLabels {
    /** Courses list header (e.g. "Courses"). */
    coursesTitle: string
    /** Add-course button label. */
    addCourseLabel: string
    /** Suffix after a course's lesson count (e.g. "lessons"). */
    lessonCountSuffix: string
    /** Empty-state title when the expert has no courses yet. */
    coursesEmptyTitle: string
    /** Empty-state supporting line for no courses. */
    coursesEmptyDescription: string
    /** Lessons list header (e.g. "Lessons"). */
    lessonsTitle: string
    /** Add-lesson button label. */
    addLessonLabel: string
    /** Shown in the lessons slot before any course is picked. */
    noCourseSelectedTitle: string
    /** Empty-state title when the selected course has no lessons yet. */
    lessonsEmptyTitle: string
    /** Empty-state supporting line for a course with no lessons. */
    lessonsEmptyDescription: string
}

/** How many placeholder rows each list's loading mirror draws while its data hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder courses -- sized like a real row so the list's shimmer mirrors the loaded shape. */
const SKELETON_COURSES: Array<CourseRailCourseView> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-course-${index}`,
    title: "Course title",
    lessonCount: 0,
}))

/** Placeholder lessons -- sized like a real row so the list's shimmer mirrors the loaded shape. */
const SKELETON_LESSONS: Array<CourseRailLessonView> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-lesson-${index}`,
    title: "Lesson title",
}))

/**
 * The Course Studio rail. See the file header for why the four pictures are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link CourseRailListProps}
 */
const CourseRailList = ({
    courses,
    selectedCourseId,
    onSelectCourse,
    onAddCourse,
    lessons,
    selectedLessonId,
    onSelectLesson,
    onAddLesson,
    isSkeleton = false,
    labels,
}: CourseRailListProps) => {
    const courseRows = isSkeleton ? SKELETON_COURSES : courses
    const courseItems: Array<SurfaceCardListItem> = courseRows.map((course) => ({
        key: course.id,
        title: course.title,
        subtitle: `${course.lessonCount} ${labels.lessonCountSuffix}`,
        leadingIcon: BookOpenIcon,
        selected: course.id === selectedCourseId,
        isDisabled: isSkeleton,
        onPress: () => onSelectCourse(course.id),
    }))

    // The lessons list only ever shows the SELECTED course's own lessons -- while
    // nothing is picked there is nothing to list, so the row-building below is
    // skipped entirely rather than rendering a stale/foreign set.
    const lessonRows = isSkeleton ? SKELETON_LESSONS : lessons
    const lessonItems: Array<SurfaceCardListItem> = lessonRows.map((lesson) => ({
        key: lesson.id,
        title: lesson.title,
        leadingIcon: NotePencilIcon,
        selected: lesson.id === selectedLessonId,
        isDisabled: isSkeleton,
        onPress: () => onSelectLesson(lesson.id),
    }))

    const CoursesEmpty = () => (
        <EmptyState icon={BookOpenIcon} title={labels.coursesEmptyTitle} description={labels.coursesEmptyDescription} />
    )
    // Two DIFFERENT reasons this list can be empty -- no course picked yet vs. the
    // picked course genuinely has none -- so the copy names the actual reason
    // rather than a single generic "empty" line.
    const LessonsEmpty = () => (
        <EmptyState
            icon={NotePencilIcon}
            title={selectedCourseId ? labels.lessonsEmptyTitle : labels.noCourseSelectedTitle}
            description={selectedCourseId ? labels.lessonsEmptyDescription : undefined}
        />
    )

    return (
        <div data-tier="block" data-component="CourseRailList">
            <StackV
                gap={6}
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <SurfaceCardList
                            label={labels.coursesTitle}
                            items={courseItems}
                            emptyState={CoursesEmpty}
                            isSkeleton={isSkeleton}
                            action={isSkeleton ? undefined : () => (
                                <Button variant="secondary" size="sm" prefixIcon={PlusIcon} label={labels.addCourseLabel} onPress={onAddCourse} />
                            )}
                        />
                    ),
                    () => (
                        <SurfaceCardList
                            label={labels.lessonsTitle}
                            items={selectedCourseId ? lessonItems : []}
                            emptyState={LessonsEmpty}
                            isSkeleton={isSkeleton}
                            // No course picked yet => nothing to add a lesson TO -- the action only
                            // earns its place once a course is selected (same reasoning
                            // `MembersManager` uses to gate its own header action on load state).
                            action={isSkeleton || !selectedCourseId ? undefined : () => (
                                <Button variant="secondary" size="sm" prefixIcon={PlusIcon} label={labels.addLessonLabel} onPress={onAddLesson} />
                            )}
                        />
                    ),
                ]}
            />
        </div>
    )
}

export { CourseRailList }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CourseRailList" } as const
