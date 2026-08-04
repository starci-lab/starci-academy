import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CourseView,
    type CourseLessonView,
    type CourseViewLabels,
} from "@sb-components/nivoexpert/blocks/classroom/CourseView/CourseView"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CourseView` — one published course opened in the classroom: header + overall
 * completion meter + the ordered lessons with each lesson's own state. The four
 * pictures — `not-started`, `in-progress`, `completed`, `no-lessons` — are DATA, so
 * they are STATES of the single shape. Grounded in the real `CourseEntity`,
 * `LessonEntity`, and `LessonProgressEntity` (each lesson's status is derived).
 */
const meta: Meta<typeof CourseView> = {
    title: "NivoExpert/Blocks/Classroom/CourseView/CourseView",
    component: CourseView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseView>

const LABELS: CourseViewLabels = {
    progressLabel: "Course progress",
    lessonsCompleteSuffix: "lessons complete",
    lessonPrefix: "Lesson",
    videoLabel: "Video",
    statusLabels: {
        completed: "Completed",
        "in-progress": "In progress",
        "not-started": "Not started",
    },
    emptyTitle: "No lessons yet",
    emptyDescription: "This course has no lessons — add the first one from the dashboard.",
}

const COURSE = {
    title: "Ship Your First AI Agent",
    summary: "Build, deploy, and monetise a working agent in four evenings.",
    priceText: "1,500,000 VND",
}

/** The four lessons — statuses vary per story. */
const LESSON_TITLES = [
    "What an agent actually is",
    "Wiring the tool loop",
    "Giving it memory",
    "Shipping to production",
]

const lessons = (statuses: Array<CourseLessonView["status"]>): Array<CourseLessonView> =>
    LESSON_TITLES.map((title, index) => ({
        id: `lesson-${index + 1}`,
        title,
        hasVideo: index !== 2,
        status: statuses[index],
    }))

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the course card wrapping the header, meter, and lessons" },
    ProgressBar: { tier: "atom", role: "the overall completion meter (lessons done / total)" },
    ListRow: { tier: "composite", role: "one row per lesson — status glyph, title, and status/video chips" },
    Chip: { tier: "atom", role: "each lesson's completion status and its video indicator" },
    EmptyState: { tier: "composite", role: "shown when the course has no lessons" },
    Typography: { tier: "atom", role: "the course title, summary, and the lesson titles" },
}

/** LEAF — one shape; the four pictures are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseView"
                tier="block"
                leaf="Course"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Blocks take no `className`: the block owns the course and its lessons, so its pictures are states of one shape. Each lesson's status is DERIVED from its `LessonProgressEntity` row — `completedAt` ⇒ completed, a `positionSec` with no `completedAt` ⇒ in-progress, no row ⇒ not-started. The DASH player and lesson body live in `LessonViewer`, not here."
                states={[
                    {
                        name: "no lesson completed",
                        why: "A freshly opened course: the meter sits at 0% and every lesson reads \"Not started\". The learner has enrolled but not begun.",
                        code: "<CourseView course={course} lessons={notStarted} labels={labels} />",
                        render: (
                            <CourseView
                                course={COURSE}
                                lessons={lessons(["not-started", "not-started", "not-started", "not-started"])}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "some done, one in progress",
                        why: "Mid-course: the first lesson is complete, the second is being watched (a `positionSec` with no `completedAt`), and the rest are untouched — the meter reflects the real done/total ratio.",
                        code: "<CourseView {...props} lessons={mixed} />",
                        render: (
                            <CourseView
                                course={COURSE}
                                lessons={lessons(["completed", "in-progress", "not-started", "not-started"])}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "every lesson completed",
                        why: "The course is finished: every lesson reads \"Completed\" and the meter is full and switches to the success tone.",
                        code: "<CourseView {...props} lessons={allDone} />",
                        render: (
                            <CourseView
                                course={COURSE}
                                lessons={lessons(["completed", "completed", "completed", "completed"])}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "lessons = []",
                        why: "A course with no lessons yet: the meter is hidden (there is nothing to measure) and the lessons region falls to its empty state pointing the expert to the dashboard.",
                        code: "<CourseView {...props} lessons={[]} />",
                        render: <CourseView course={COURSE} lessons={[]} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The block's own first fetch is in flight, so the same card renders its header, a shimmering progress meter, and a fixed count of lesson-shaped rows — matching the loaded shape so nothing jumps when the course lands.",
                        code: "<CourseView course={course} lessons={[]} labels={labels} isSkeleton />",
                        render: <CourseView course={COURSE} lessons={[]} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
