import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AnalyticsView,
    type AnalyticsViewLabels,
    type TopLessonView,
    type WeeklyGrowthPointView,
} from "@sb-components/nivoexpert/blocks/dashboard/AnalyticsView/AnalyticsView"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AnalyticsView` — the "Analytics" destination: new learners per week (as
 * relative bars), the most-viewed lessons, and the single clearest drop-off
 * point. The three pictures are DATA, so they are STATES of one shape.
 */
const meta: Meta<typeof AnalyticsView> = {
    title: "NivoExpert/Blocks/Dashboard/AnalyticsView/AnalyticsView",
    component: AnalyticsView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AnalyticsView>

const LABELS: AnalyticsViewLabels = {
    growthTitle: "New learners per week",
    newLearnersSuffix: "new learners",
    growthEmptyTitle: "No signups yet",
    growthEmptyDescription: "Once learners start signing up, their weekly count fills in here.",
    topLessonsTitle: "Most-viewed lessons",
    lessonColumn: "Lesson",
    viewsColumn: "Views",
    topLessonsEmptyTitle: "No lesson views yet",
    topLessonsEmptyDescription: "Publish a course and views will rank here as learners watch.",
    dropOffTitle: "Drop-off",
    dropOffEmptyDescription: "Not enough completions yet to call out a clear drop-off point.",
}

const GROWTH: Array<WeeklyGrowthPointView> = [
    { weekLabel: "W1", newLearners: 14 },
    { weekLabel: "W2", newLearners: 20 },
    { weekLabel: "W3", newLearners: 18 },
    { weekLabel: "W4", newLearners: 27 },
    { weekLabel: "W5", newLearners: 24 },
    { weekLabel: "W6", newLearners: 35 },
]

const TOP_LESSONS: Array<TopLessonView> = [
    { id: "lesson-1", title: "Deep dive: useReducer", views: 1200 },
    { id: "lesson-2", title: "Optimizing Context", views: 980 },
    { id: "lesson-3", title: "Suspense & streaming", views: 640 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the growth, top-lessons, and drop-off section cards" },
    ProgressBar: { tier: "atom", role: "one bar per week, filled to its share of the series' peak week" },
    Table: { tier: "composite", role: "the ranked lesson rows" },
    Callout: { tier: "composite", role: "the drop-off call-out, only once one is clear enough to name" },
    EmptyState: { tier: "composite", role: "shown for the growth or top-lessons section with no data yet" },
}

/** LEAF — one shape; content, per-section empties, and loading are all STATES. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AnalyticsView"
                tier="block"
                leaf="Analytics"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                reason="Blocks take no `className`: the block owns the growth series, the lesson ranking, and the drop-off read, so their phases are states of one shape. A weekly series is small and ranked, not a dashboard KPI, so it renders as relative bars (the same 'label + value + fill' row `ExpertDashboardOverview`'s funnel uses) rather than reaching for a chart primitive that does not exist in this system yet. No numbers are invented: a section with nothing to show renders its own empty note, never a zeroed-out picture."
                states={[
                    {
                        name: "six weeks of growth, three ranked lessons, a clear drop-off",
                        why: "A steady upward trend across six weeks, the three most-viewed lessons in order, and one lesson called out as the clearest drop-off point.",
                        code: "<AnalyticsView growth={growth} topLessons={topLessons} dropOffDescription=\"Lesson 4 drops 22% of learners\" labels={labels} />",
                        render: (
                            <AnalyticsView
                                growth={GROWTH}
                                topLessons={TOP_LESSONS}
                                dropOffDescription="Lesson 4 (“Suspense & streaming”) drops 22% of learners — the steepest fall in the course."
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "dropOffDescription = null (too new to tell)",
                        why: "Growth and top-lessons are both populated, but the course is too new for a drop-off point to be clear yet — the section falls to its own quiet note instead of guessing.",
                        code: "<AnalyticsView growth={growth} topLessons={topLessons} dropOffDescription={null} labels={labels} />",
                        render: <AnalyticsView growth={GROWTH} topLessons={TOP_LESSONS} dropOffDescription={null} labels={LABELS} />,
                    },
                    {
                        name: "growth = [], topLessons = [] (brand-new academy)",
                        why: "No learners and no views yet — the growth and top-lessons sections both fall to their own empty states, and there is nothing to call a drop-off on.",
                        code: "<AnalyticsView growth={[]} topLessons={[]} dropOffDescription={null} labels={labels} />",
                        render: <AnalyticsView growth={[]} topLessons={[]} dropOffDescription={null} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The view's own first fetch is in flight: all three section titles stay put while their bodies draw a fixed-shape shimmer — six placeholder bars, three placeholder rows, one placeholder line.",
                        code: "<AnalyticsView growth={[]} topLessons={[]} labels={labels} isSkeleton />",
                        render: <AnalyticsView growth={[]} topLessons={[]} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
