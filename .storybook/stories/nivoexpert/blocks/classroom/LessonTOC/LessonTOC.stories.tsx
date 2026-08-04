import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    LessonTOC,
    type LessonTOCLabels,
    type LessonTocItemView,
} from "@sb-components/nivoexpert/blocks/classroom/LessonTOC/LessonTOC"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LessonTOC` — the course-scoped table-of-contents rail: one numbered row per
 * lesson, each carrying its own completion-status glyph, with the lesson
 * currently open in the paired `LessonViewer` marked. The rival arrangement to
 * stacking every `LessonViewer` inline, for a lesson-heavy course. The two
 * pictures — a mix of statuses, and `items = []` — are DATA, so they are
 * STATES of the single shape. Grounded in the same `LessonEntity` +
 * `LessonProgressEntity` pair `CourseView` derives its own lesson statuses
 * from.
 */
const meta: Meta<typeof LessonTOC> = {
    title: "NivoExpert/Blocks/Classroom/LessonTOC/LessonTOC",
    component: LessonTOC,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LessonTOC>

const LABELS: LessonTOCLabels = {
    title: "Table of contents",
    lessonsSuffix: "lessons",
    emptyTitle: "No lessons yet",
    emptyDescription: "This course has no lessons — add the first one from the dashboard.",
}

const LESSON_TITLES = [
    "Environment setup",
    "App Router basics",
    "Data fetching & caching",
    "Layouts & templates",
    "Server Actions",
    "Streaming & Suspense",
]

const lessons = (statuses: Array<LessonTocItemView["status"]>): Array<LessonTocItemView> =>
    LESSON_TITLES.slice(0, statuses.length).map((title, index) => ({
        id: `lesson-${index + 1}`,
        title,
        status: statuses[index],
    }))

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCardList: { tier: "composite", role: "the bounded rail card + one row per lesson" },
}

/** LEAF — one shape; the mixed-status set, `currentLessonId`, and `items = []` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LessonTOC"
                tier="block"
                leaf="Table of contents"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xs"
                reason="Blocks take no `className`: the rail owns the course's lesson list and its viewer-derived statuses, so a route places the whole rail rather than restyling it. Each row's status glyph and left-edge band are the SAME derivation `CourseView` already uses (`completedAt` ⇒ completed, a `positionSec` with no `completedAt` ⇒ in-progress, no row ⇒ not-started); `currentLessonId` marks the lesson open in the paired `LessonViewer` beside this rail, the same `selected` mechanism `CourseRailList`/`MindMapRail` use for a jump list's own row."
                states={[
                    {
                        name: "mixed statuses, one open",
                        why: "A course in progress: two lessons completed, one open in the paired viewer (marked), one in progress, and the rest not started — the everyday shape of the rail.",
                        code: "<LessonTOC items={lessons} currentLessonId=\"lesson-3\" onSelectLesson={openLesson} labels={labels} />",
                        render: (
                            <LessonTOC
                                items={lessons(["completed", "completed", "in-progress", "not-started", "not-started", "not-started"])}
                                currentLessonId="lesson-3"
                                onSelectLesson={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "nothing open yet",
                        why: "The rail renders before the reader has picked a lesson: every row shows its status glyph, but none carries the \"currently open\" mark.",
                        code: "<LessonTOC items={lessons} currentLessonId={null} onSelectLesson={openLesson} labels={labels} />",
                        render: (
                            <LessonTOC
                                items={lessons(["not-started", "not-started", "not-started"])}
                                currentLessonId={null}
                                onSelectLesson={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "items = []",
                        why: "A course with no lessons yet: the rail falls to its empty state, same reasoning as `CourseView`'s own `no-lessons` picture.",
                        code: "<LessonTOC items={[]} onSelectLesson={openLesson} labels={labels} />",
                        render: <LessonTOC items={[]} onSelectLesson={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The rail's own first fetch is in flight, so it renders a fixed count of lesson-shaped rows shimmering — matching the loaded shape so nothing jumps when the lessons land.",
                        code: "<LessonTOC items={[]} onSelectLesson={openLesson} labels={labels} isSkeleton />",
                        render: <LessonTOC items={[]} onSelectLesson={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
