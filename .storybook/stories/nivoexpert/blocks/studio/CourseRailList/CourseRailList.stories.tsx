import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CourseRailList,
    type CourseRailCourseView,
    type CourseRailLessonView,
    type CourseRailListLabels,
} from "@sb-components/nivoexpert/blocks/studio/CourseRailList/CourseRailList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CourseRailList` — the Course Studio's leading rail: the expert's courses, and
 * once one is picked, that course's lessons — both single-select lists the editor
 * panel reads its open lesson from. The pictures — no courses yet, a nonempty list
 * with nothing picked, a course with no lessons yet, a populated tree — are DATA,
 * so they are STATES of the single shape. Grounded in the real `CourseEntity`
 * (`CourseForm.tsx`'s `slug`/`title`) and `LessonEntity` (`LessonManager.tsx`'s
 * per-course `lessons`, ordered by `sortIndex`).
 */
const meta: Meta<typeof CourseRailList> = {
    title: "NivoExpert/Blocks/Studio/CourseRailList/CourseRailList",
    component: CourseRailList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseRailList>

const NOOP = () => {}

const LABELS: CourseRailListLabels = {
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

// Same two courses `AcademyManagementDashboard.stories.tsx` uses, so the fixtures
// read as one continuous academy across the book rather than two invented ones.
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
    SurfaceCardList: { tier: "composite", role: "the courses list, then the selected course's lessons list" },
    EmptyState: { tier: "composite", role: "shown when there are no courses, no lessons, or nothing picked yet" },
    Button: { tier: "atom", role: "the add-course and add-lesson header actions" },
}

const REASON =
    "The controls map one-to-one onto the real admin flow — a course row opens that course's lessons below, a lesson row opens it in `LessonEditorPanel`, and the two header actions start `createCourse`/`createLesson`. The lessons list only ever holds the SELECTED course's own rows; nothing is listed until a course is picked."

/** LEAF — one shape; the pictures are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseRailList"
                tier="block"
                leaf="Courses & lessons"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason={REASON}
                states={[
                    {
                        name: "courses = []",
                        why: "A brand-new academy with no courses at all: the courses list gives way to an empty state, while the Add-course action stays available in the header. Nothing can be picked, so the lessons list shows its own \"select a course\" prompt.",
                        code: "<CourseRailList courses={[]} selectedCourseId={null} lessons={[]} selectedLessonId={null} … />",
                        render: (
                            <CourseRailList
                                courses={[]}
                                selectedCourseId={null}
                                onSelectCourse={NOOP}
                                onAddCourse={NOOP}
                                lessons={[]}
                                selectedLessonId={null}
                                onSelectLesson={NOOP}
                                onAddLesson={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "courses present, nothing picked",
                        why: "Courses exist, but the expert hasn't opened one yet — every course row is unchecked, and the lessons list prompts to pick one instead of showing stale rows or an add action with nowhere to attach.",
                        code: "<CourseRailList courses={courses} selectedCourseId={null} lessons={[]} selectedLessonId={null} … />",
                        render: (
                            <CourseRailList
                                courses={COURSES}
                                selectedCourseId={null}
                                onSelectCourse={NOOP}
                                onAddCourse={NOOP}
                                lessons={[]}
                                selectedLessonId={null}
                                onSelectLesson={NOOP}
                                onAddLesson={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "course picked, lessons = []",
                        why: "\"RAG in a Weekend\" is picked but has no lessons yet: its own empty state shows, with the Add-lesson action now available since a course IS selected.",
                        code: "<CourseRailList courses={courses} selectedCourseId=\"course-rag\" lessons={[]} … />",
                        render: (
                            <CourseRailList
                                courses={COURSES}
                                selectedCourseId="course-rag"
                                onSelectCourse={NOOP}
                                onAddCourse={NOOP}
                                lessons={[]}
                                selectedLessonId={null}
                                onSelectLesson={NOOP}
                                onAddLesson={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "course picked, lessons present",
                        why: "\"Ship Your First AI Agent\" is picked, its four lessons list below in `sortIndex` order, and the second lesson is the one open in the editor.",
                        code: "<CourseRailList courses={courses} selectedCourseId=\"course-agent\" lessons={lessons} selectedLessonId=\"lesson-2\" … />",
                        render: (
                            <CourseRailList
                                courses={COURSES}
                                selectedCourseId="course-agent"
                                onSelectCourse={NOOP}
                                onAddCourse={NOOP}
                                lessons={AGENT_LESSONS}
                                selectedLessonId="lesson-2"
                                onSelectLesson={NOOP}
                                onAddLesson={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The rail's own first fetch is in flight, so both lists draw a fixed count of shimmering placeholder rows and both add actions go inert, so nothing jumps when the real courses and lessons land.",
                        code: "<CourseRailList courses={[]} … labels={labels} isSkeleton />",
                        render: (
                            <CourseRailList
                                courses={[]}
                                selectedCourseId={null}
                                onSelectCourse={NOOP}
                                onAddCourse={NOOP}
                                lessons={[]}
                                selectedLessonId={null}
                                onSelectLesson={NOOP}
                                onAddLesson={NOOP}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
