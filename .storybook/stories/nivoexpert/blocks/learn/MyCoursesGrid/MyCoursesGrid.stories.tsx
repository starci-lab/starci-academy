import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    MyCoursesGrid,
    type CourseCardView,
    type MyCoursesGridLabels,
} from "@sb-components/nivoexpert/blocks/learn/MyCoursesGrid/MyCoursesGrid"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MyCoursesGrid` — every course the member is enrolled in, one card each: title,
 * status chip, progress meter, "done / total" count, and an open-course action.
 * The three pictures — `empty`, `content`, `overflow` — are DATA, so they are
 * STATES of the single shape. Grounded in the real `Course`/`Lesson` shape and the
 * client's own per-course progress count.
 */
const meta: Meta<typeof MyCoursesGrid> = {
    title: "NivoExpert/Blocks/Learn/MyCoursesGrid/MyCoursesGrid",
    component: MyCoursesGrid,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MyCoursesGrid>

const LABELS: MyCoursesGridLabels = {
    title: "My courses",
    inProgressLabel: "In progress",
    completedLabel: "Completed",
    lessonsSuffix: "lessons",
    lessonsCompleteSuffix: "lessons complete",
    openLabel: "Open course",
    emptyTitle: "You haven't enrolled in a course yet",
    emptyDescription: "Browse the catalog and start your first course — it'll show up here with your progress.",
    browseLabel: "Browse courses",
}

const COURSES: Array<CourseCardView> = [
    { slug: "ship-your-first-ai-agent", title: "Ship Your First AI Agent", summary: "Build, deploy, and monetise a working agent in four evenings.", lessonCount: 8, completedCount: 3 },
    { slug: "rag-in-a-weekend", title: "RAG in a Weekend", summary: "Ground an LLM in your own documents with a real pgvector pipeline.", lessonCount: 6, completedCount: 6 },
]

const MANY_COURSES: Array<CourseCardView> = [
    ...COURSES,
    { slug: "prompting-for-production", title: "Prompting for Production", summary: "Patterns that hold up outside a demo.", lessonCount: 5, completedCount: 0 },
    { slug: "fine-tuning-basics", title: "Fine-Tuning Basics", summary: "When to fine-tune instead of prompt.", lessonCount: 7, completedCount: 2 },
    { slug: "agent-evals", title: "Agent Evals", summary: "Measuring whether an agent actually works.", lessonCount: 4, completedCount: 4 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "each course card" },
    Chip: { tier: "atom", role: "the in-progress / completed status chip on each card" },
    ProgressBar: { tier: "atom", role: "each course's completion meter" },
    Button: { tier: "atom", role: "the open-course action on each card, and the empty state's browse action" },
    EmptyState: { tier: "composite", role: "shown when the member has never enrolled" },
    Typography: { tier: "atom", role: "the section title and every card's title/summary/counts" },
}

/** LEAF — one shape; empty / content / overflow / skeleton are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MyCoursesGrid"
                tier="block"
                leaf="Grid"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                reason="Blocks take no `className`: the block owns the enrolled courses, so its pictures are states of one shape. `courseRepository` has no BE pagination — a tenant's course count is a handful by construction — so a large roster is the SAME grid simply scrolling, never a paged leaf. Each card's status is DERIVED (`completedCount === lessonCount` ⇒ completed), never a separate field to keep in sync."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The grid's own first fetch is in flight: a fixed count of course-shaped cards render with every cell shimmering, matching the loaded shape so nothing jumps when the courses land.",
                        code: "<MyCoursesGrid {...props} isSkeleton />",
                        render: <MyCoursesGrid courses={COURSES} onOpenCourse={() => {}} onBrowseCourses={() => {}} isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "courses = [] (never enrolled)",
                        why: "A brand-new member: the empty state names it and points at the catalog — the critical empty case for this block, since a fresh tenant's member has enrolled in nothing yet.",
                        code: "<MyCoursesGrid courses={[]} onOpenCourse={onOpenCourse} onBrowseCourses={onBrowseCourses} labels={labels} />",
                        render: <MyCoursesGrid courses={[]} onOpenCourse={() => {}} onBrowseCourses={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "two courses, mixed progress",
                        why: "The ordinary shape: one course mid-way through, one finished — the finished card's chip and meter switch to the success tone.",
                        code: "<MyCoursesGrid courses={courses} onOpenCourse={onOpenCourse} onBrowseCourses={onBrowseCourses} labels={labels} />",
                        render: <MyCoursesGrid courses={COURSES} onOpenCourse={() => {}} onBrowseCourses={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "five courses (overflow)",
                        why: "More courses than fit one row: the SAME grid, simply reflowing to more rows and scrolling with the page — never a separate paged arrangement, matching the BE's un-paginated `courseRepository.find()`.",
                        code: "<MyCoursesGrid courses={manyCourses} onOpenCourse={onOpenCourse} onBrowseCourses={onBrowseCourses} labels={labels} />",
                        render: <MyCoursesGrid courses={MANY_COURSES} onOpenCourse={() => {}} onBrowseCourses={() => {}} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
