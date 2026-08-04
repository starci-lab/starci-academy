import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ContinueLearningRail,
    type ContinueItemView,
    type ContinueLearningRailLabels,
} from "@sb-components/nivoexpert/blocks/learn/ContinueLearningRail/ContinueLearningRail"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ContinueLearningRail` — the "pick up where you left off" rail above the course
 * grid: one row per course with a lesson in progress, the position it was paused
 * at, and a resume action. The two pictures — `empty`, `content` — are DATA, so
 * they are STATES of the single shape. Grounded in the real `LessonProgressEntity`
 * row (`positionSec > 0` and no `completedAt` ⇒ resumable).
 */
const meta: Meta<typeof ContinueLearningRail> = {
    title: "NivoExpert/Blocks/Learn/ContinueLearningRail/ContinueLearningRail",
    component: ContinueLearningRail,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContinueLearningRail>

const LABELS: ContinueLearningRailLabels = {
    title: "Continue learning",
    resumeAtPrefix: "Paused at",
    emptyTitle: "Nothing in progress",
    emptyDescription: "Start a lesson and it'll show up here so you can pick up where you left off.",
    browseLabel: "Browse courses",
}

const ITEMS: Array<ContinueItemView> = [
    { courseSlug: "ship-your-first-ai-agent", courseTitle: "Ship Your First AI Agent", lessonTitle: "Wiring the tool loop", positionLabel: "3:45" },
    { courseSlug: "rag-in-a-weekend", courseTitle: "RAG in a Weekend", lessonTitle: "Chunking strategy", positionLabel: "0:52" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCardList: { tier: "composite", role: "the rail's own card face + row list" },
    EmptyState: { tier: "composite", role: "shown when nothing is currently in progress" },
    Button: { tier: "atom", role: "the empty state's browse-courses action" },
}

/** LEAF — one shape; empty / content / skeleton are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContinueLearningRail"
                tier="block"
                leaf="Rail"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Blocks take no `className`: the block owns which courses are resumable, so its pictures are states of one shape. A lesson counts as resumable the same way the real client's `findContinueLesson` does: a `LessonProgressEntity` row with `positionSec > 0` and no `completedAt`. 'Nothing to resume' covers three different real situations (never enrolled, enrolled but never started, or finished everything) — all render the SAME empty picture, because the rail cannot and should not guess which one it is."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The rail's own first fetch is in flight: a fixed count of resume-shaped rows render with every cell shimmering, matching the loaded shape so nothing jumps when the courses land.",
                        code: "<ContinueLearningRail {...props} isSkeleton />",
                        render: <ContinueLearningRail items={ITEMS} onContinue={() => {}} onBrowseCourses={() => {}} isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "items = [] (nothing to resume)",
                        why: "No course currently has a paused, unfinished lesson — the empty state points at the catalog rather than leaving the rail's spot blank.",
                        code: "<ContinueLearningRail items={[]} onContinue={onContinue} onBrowseCourses={onBrowseCourses} labels={labels} />",
                        render: <ContinueLearningRail items={[]} onContinue={() => {}} onBrowseCourses={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "two courses in progress",
                        why: "The ordinary shape: each row names the lesson to resume, the course it belongs to, and the exact position it was paused at.",
                        code: "<ContinueLearningRail items={items} onContinue={onContinue} onBrowseCourses={onBrowseCourses} labels={labels} />",
                        render: <ContinueLearningRail items={ITEMS} onContinue={() => {}} onBrowseCourses={() => {}} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
