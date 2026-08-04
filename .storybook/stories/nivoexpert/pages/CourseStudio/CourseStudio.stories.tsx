import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CourseStudio,
    type CourseStudioLabels,
} from "@sb-components/nivoexpert/pages/CourseStudio/CourseStudio"
import type { CourseRailCourseView, CourseRailLessonView, CourseRailListLabels } from "@sb-components/nivoexpert/blocks/studio/CourseRailList/CourseRailList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CourseStudio` — the admin PAGE at `/studio`: a rail of courses and the
 * selected course's lessons. Picking or adding a lesson opens
 * `LessonEditorPanel` (a wide drawer); adding a course opens
 * `CreateCourseModal` — neither overlay mounted by this page itself. A
 * page's story is one complete STATE per story — the brand-new tenant's
 * zero-course prompt, the populated rail, a course with no lessons yet, and
 * the whole-page loading skeleton — not a leaf-per-prop map. Grounded in the
 * real `CourseForm.tsx` / `LessonManager.tsx`, the ad hoc admin UI this page
 * ports into the design system (`CourseEntity` / `LessonEntity`).
 */
const meta: Meta<typeof CourseStudio> = {
    title: "NivoExpert/Pages/CourseStudio/CourseStudio",
    component: CourseStudio,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseStudio>

const NOOP = () => {}

const LABELS: CourseStudioLabels = {
    title: "Course studio",
    subtitle: "Create and edit your courses' lessons.",
    zeroCoursesTitle: "Create your first course",
    zeroCoursesDescription: "Your academy has no courses yet — start one to begin adding lessons.",
    zeroCoursesAction: "Create your first course",
}

const RAIL_LABELS: CourseRailListLabels = {
    coursesTitle: "Courses",
    addCourseLabel: "Add course",
    lessonCountSuffix: "lessons",
    coursesEmptyTitle: "No courses yet",
    coursesEmptyDescription: "Create your first course to start building lessons.",
    lessonsTitle: "Lessons",
    addLessonLabel: "Add lesson",
    noCourseSelectedTitle: "Select a course to see its lessons",
    lessonsEmptyTitle: "No lessons yet",
    lessonsEmptyDescription: "Add the first lesson to this course.",
}

// Same courses/lessons `CourseRailList.stories.tsx` and `LessonEditorPanel.stories.tsx`
// use, so the fixtures read as one continuous academy across the book rather
// than a page-local invention.
const COURSES: Array<CourseRailCourseView> = [
    { id: "course-agent", title: "Ship Your First AI Agent", lessonCount: 4 },
    { id: "course-rag", title: "RAG in a Weekend", lessonCount: 0 },
]

const AGENT_LESSONS: Array<CourseRailLessonView> = [
    { id: "lesson-1", title: "What an agent actually is" },
    { id: "lesson-2", title: "Wiring the tool loop" },
    { id: "lesson-3", title: "Giving it memory" },
    { id: "lesson-4", title: "Shipping to production" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    CourseRailList: {
        tier: "block",
        role: "the courses rail, then the selected course's lessons",
        storyId: "nivoexpert-blocks-studio-courserailist-courserailist--default",
    },
    EmptyState: { tier: "composite", role: "the zero-courses prompt, replacing the whole rail" },
}

const REASON =
    "A page composes blocks/composites/frames, never draws a shape of its own (page.md PAGE-2/PAGE-3) — this page NAMES `CourseRailList` and hands it typed data, the one shape it draws itself being the zero-courses prompt (there is nothing left for the rail to show). Picking or adding a lesson opens `LessonEditorPanel` (an overlay drawer this page never mounts); adding a course opens `CreateCourseModal` (an overlay modal this page never mounts either) — the same contract `DomainsView` uses for `RegisterDomainModal`/`DomainDetailModal`."

const BASE_PROPS = {
    courses: COURSES,
    selectedCourseId: "course-agent",
    onSelectCourse: NOOP,
    onAddCourse: NOOP,
    lessons: AGENT_LESSONS,
    selectedLessonId: "lesson-2",
    onSelectLesson: NOOP,
    onAddLesson: NOOP,
    labels: LABELS,
    railLabels: RAIL_LABELS,
}

/** STATE — a brand-new tenant: zero courses, so one centred prompt replaces the whole rail. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseStudio"
                tier="screen"
                leaf="Empty"
                annotate={ANNOTATE}
                reason="The critical admin empty case: a fresh tenant has no courses to rail, so the page shows one big centred prompt instead of a rail with nothing in it — nothing else competes for attention. `onAddCourse` opens `CreateCourseModal`, the only way onward."
                states={[
                    {
                        name: "courses = []",
                        why: "Zero courses tenant-wide: the primary action is the one way onward, matching the Academy Dashboard's own fresh-tenant empty case.",
                        code: "<CourseStudio courses={[]} … />",
                        render: <CourseStudio {...BASE_PROPS} courses={[]} lessons={[]} selectedCourseId={null} selectedLessonId={null} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the populated working surface: a course picked and its lessons listed. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseStudio"
                tier="screen"
                leaf="Content"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "course picked, lessons listed",
                        why: "The ordinary working shape: \"Ship Your First AI Agent\" is picked in the rail and its four lessons list below it; opening any of them (`onSelectLesson`) or adding one (`onAddLesson`) opens `LessonEditorPanel`, a wide drawer beside this same rail.",
                        code: "<CourseStudio courses={courses} selectedCourseId=\"course-agent\" lessons={lessons} … />",
                        render: <CourseStudio {...BASE_PROPS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a course is picked but has no lessons yet: the rail's own no-lessons branch. */
export const NoLessonsYet: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseStudio"
                tier="screen"
                leaf="No lessons yet"
                annotate={ANNOTATE}
                reason={"\"RAG in a Weekend\" is picked but has no lessons yet — the rail's own empty branch names the way onward (add the first lesson) rather than an empty list with nothing to explain it."}
                states={[
                    {
                        name: "course picked, lessons = []",
                        why: "A course with no lessons yet — the Add-lesson action in the rail opens `LessonEditorPanel` in its drafting state, the way onward.",
                        code: "<CourseStudio selectedCourseId=\"course-rag\" lessons={[]} … />",
                        render: (
                            <CourseStudio
                                {...BASE_PROPS}
                                selectedCourseId="course-rag"
                                lessons={[]}
                                selectedLessonId={null}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the page's own first fetch is in flight: the rail draws its own skeleton mirror. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseStudio"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="Neither the courses nor the lessons have resolved yet, so `isSkeleton` threads straight into `CourseRailList` — it draws its OWN skeleton mirror unchanged, rather than this page building a second loading tree of its own."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "First load: the rail shimmers its real shape, so nothing jumps once the courses and lessons resolve.",
                        code: "<CourseStudio courses={[]} … isSkeleton />",
                        render: <CourseStudio {...BASE_PROPS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
