import { BookOpenIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    CourseRailList,
    type CourseRailCourseView,
    type CourseRailLessonView,
    type CourseRailListLabels,
} from "@sb-components/nivoexpert/blocks/studio/CourseRailList/CourseRailList"

/**
 * `CourseStudio` -- the admin PAGE at `/studio`: a rail of courses and the
 * selected course's lessons. Picking or adding a lesson opens
 * `LessonEditorPanel` (a wide drawer); adding a course opens
 * `CreateCourseModal` -- neither overlay mounted by this page itself. A
 * page's story is one complete STATE per story -- the brand-new tenant's
 * zero-course prompt, the populated rail, a course with no lessons yet, and
 * the whole-page loading skeleton -- not a leaf-per-prop map. Grounded in the
 * real `CourseForm.tsx` / `LessonManager.tsx`, the ad hoc admin UI this page
 * ports into the design system (`CourseEntity` / `LessonEntity`).
 */

/** Props for {@link CourseStudio}. */
export interface CourseStudioProps {
    /** The expert's courses. Empty is the WHOLE PAGE's `no-courses` state -- see file header. */
    courses: Array<CourseRailCourseView>
    /** Id of the course whose lessons show in the rail, or null. */
    selectedCourseId: string | null
    /** Change which course's lessons show. */
    onSelectCourse: (id: string) => void
    /** Open `CreateCourseModal` (an overlay this page never mounts itself). Also the zero-courses prompt's primary action. */
    onAddCourse: () => void
    /** The selected course's lessons. Forwarded to {@link CourseRailList}. */
    lessons: Array<CourseRailLessonView>
    /** Id of the lesson open in the editor drawer, or null when none is open. */
    selectedLessonId: string | null
    /** Open a lesson into `LessonEditorPanel` (an overlay this page never mounts itself). */
    onSelectLesson: (id: string) => void
    /** Open `LessonEditorPanel` in its drafting state for a brand-new lesson on the selected course. */
    onAddLesson: () => void
    /**
     * `true` -> the page's own first fetch is in flight: the rail draws its
     * own skeleton mirror. Threaded straight down -- never fed to a separate
     * skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy for the page's own chrome. */
    labels: CourseStudioLabels
    /** Already-localized copy forwarded to {@link CourseRailList}. */
    railLabels: CourseRailListLabels
}

/** The already-resolved copy the page renders directly (not forwarded to a composed block). */
export interface CourseStudioLabels {
    /** Page title (e.g. "Course studio"). */
    title: string
    /** Page subtitle under the title. */
    subtitle: string
    /** Title of the zero-courses prompt. */
    zeroCoursesTitle: string
    /** Supporting line under the zero-courses prompt. */
    zeroCoursesDescription: string
    /** Primary action label on the zero-courses prompt. */
    zeroCoursesAction: string
}

/**
 * The course/lesson authoring studio. See the file header for why a
 * brand-new tenant (zero courses) earns its own whole-page prompt instead of
 * an empty rail, and why neither overlay this page opens is mounted here.
 *
 * @param props - {@link CourseStudioProps}
 */
const CourseStudio = ({
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
    railLabels,
}: CourseStudioProps) => {
    // A brand-new tenant has nothing to rail yet -- one centred prompt outranks
    // an empty rail with nothing to show. Never taken while isSkeleton: the
    // first fetch hasn't resolved `courses` either way yet.
    if (!isSkeleton && courses.length === 0) {
        return (
            <div data-tier="page" data-component="CourseStudio" className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8">
                <EmptyState
                    size="page"
                    icon={BookOpenIcon}
                    title={labels.zeroCoursesTitle}
                    description={labels.zeroCoursesDescription}
                    action={() => (
                        <Button variant="primary" prefixIcon={PlusIcon} label={labels.zeroCoursesAction} onPress={onAddCourse} />
                    )}
                />
            </div>
        )
    }

    return (
        <div data-tier="page" data-component="CourseStudio" className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
            <StackV
                gap={1}
                isSkeleton={isSkeleton}
                items={[
                    () => <Typography size="h3" weight="semibold" isSkeleton={isSkeleton} text={labels.title} />,
                    () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.subtitle} />,
                ]}
            />
            <CourseRailList
                courses={courses}
                selectedCourseId={selectedCourseId}
                onSelectCourse={onSelectCourse}
                onAddCourse={onAddCourse}
                lessons={lessons}
                selectedLessonId={selectedLessonId}
                onSelectLesson={onSelectLesson}
                onAddLesson={onAddLesson}
                isSkeleton={isSkeleton}
                labels={railLabels}
            />
        </div>
    )
}

export { CourseStudio }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "CourseStudio" } as const
