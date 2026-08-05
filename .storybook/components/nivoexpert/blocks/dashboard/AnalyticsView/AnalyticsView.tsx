import { ChartLineUpIcon, TrendUpIcon } from "@phosphor-icons/react"
import { ProgressBar } from "@sb-components/atoms/display/Progress/Progress"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Table, type TableColumnSpec, type TableRowItem } from "@sb-components/composites/data/Table/Table"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AnalyticsView` -- the "Analytics" destination: new learners per week (as
 * relative bars), the most-viewed lessons, and the single clearest drop-off
 * point. The three pictures are DATA, so they are STATES of one shape.
 */

/** One week's new-learner count. */
export interface WeeklyGrowthPointView {
    /** Short week label (e.g. "W1"). */
    weekLabel: string
    /** New learners that week. */
    newLearners: number
}

/** One lesson ranked by views. */
export interface TopLessonView {
    /** Stable id. */
    id: string
    /** Lesson title. */
    title: string
    /** View count. */
    views: number
}

/** Props for {@link AnalyticsView}. */
export interface AnalyticsViewProps {
    /** Weekly new-learner series, oldest first. Empty is the section's own empty state. */
    growth: Array<WeeklyGrowthPointView>
    /** Lessons ranked by views, most-viewed first. Empty is the section's own empty state. */
    topLessons: Array<TopLessonView>
    /** Already-formatted description of the clearest drop-off point (e.g. "Lesson 4 drops 22% of learners"). `null` -> nothing clear enough to call out yet. */
    dropOffDescription?: string | null
    /**
     * `true` -> the view's own first fetch is in flight: all three sections keep
     * their titles and draw their skeleton mirror (§12b), threaded straight
     * down -- never a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: AnalyticsViewLabels
}

/** The already-resolved copy the block renders. */
export interface AnalyticsViewLabels {
    /** Growth section title. */
    growthTitle: string
    /** Suffix after a week's count (e.g. "new learners"). */
    newLearnersSuffix: string
    /** Growth section empty-state title. */
    growthEmptyTitle: string
    /** Growth section empty-state supporting line. */
    growthEmptyDescription: string
    /** Top-lessons section title. */
    topLessonsTitle: string
    /** Column header for the lesson title. */
    lessonColumn: string
    /** Column header for the view count. */
    viewsColumn: string
    /** Top-lessons empty-state title. */
    topLessonsEmptyTitle: string
    /** Top-lessons empty-state supporting line. */
    topLessonsEmptyDescription: string
    /** Drop-off section title. */
    dropOffTitle: string
    /** Drop-off empty-state supporting line, shown when {@link AnalyticsViewProps.dropOffDescription} is null. */
    dropOffEmptyDescription: string
}

/** How many placeholder rows each section's loading mirror draws. */
const SKELETON_ROW_COUNT = 3

/** Placeholder growth points -- sized like a real week so the shimmer mirrors the loaded shape. */
const SKELETON_GROWTH: Array<WeeklyGrowthPointView> = Array.from({ length: 6 }, (_unused, index) => ({
    weekLabel: `W${index + 1}`,
    newLearners: 10,
}))

/** Placeholder lessons -- sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_LESSONS: Array<TopLessonView> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    title: "Lesson title",
    views: 0,
}))

/** Column keys, shared by the header config and each row. */
const COLUMN_KEY = { lesson: "lesson", views: "views" } as const

/**
 * The analytics view. See the file header for why growth/top-lessons/drop-off
 * are states of one shape rather than three separate blocks, and why bars
 * (not a chart primitive) carry the weekly series.
 *
 * @param props - {@link AnalyticsViewProps}
 */
const AnalyticsView = ({ growth, topLessons, dropOffDescription, isSkeleton = false, labels }: AnalyticsViewProps) => {
    const growthPoints = isSkeleton ? SKELETON_GROWTH : growth
    const maxNewLearners = Math.max(1, ...growthPoints.map((point) => point.newLearners))

    /** One week's row: its label + count, then a bar filled to its share of the series' max. */
    const GrowthRow = (point: WeeklyGrowthPointView) => (
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <StackH
                        gap={3}
                        justify="between"
                        align="center"
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Typography size="sm" isSkeleton={isSkeleton} text={point.weekLabel} />,
                            () => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    isSkeleton={isSkeleton}
                                    text={`${point.newLearners} ${labels.newLearnersSuffix}`}
                                />
                            ),
                        ]}
                    />
                ),
                () => (
                    <ProgressBar
                        value={point.newLearners}
                        max={maxNewLearners}
                        color="accent"
                        isSkeleton={isSkeleton}
                        ariaLabel={`${point.weekLabel} — ${labels.newLearnersSuffix}`}
                    />
                ),
            ]}
        />
    )

    const GrowthSection = () => (
        <SurfaceCard
            padding={3}
            label={labels.growthTitle}
            isSkeleton={isSkeleton}
            body={() =>
                !isSkeleton && growth.length === 0 ? (
                    <EmptyState icon={TrendUpIcon} title={labels.growthEmptyTitle} description={labels.growthEmptyDescription} />
                ) : (
                    <StackV gap={3} isSkeleton={isSkeleton} items={growthPoints.map((point) => () => GrowthRow(point))} />
                )
            }
        />
    )

    const lessonColumns: ReadonlyArray<TableColumnSpec> = [
        { key: COLUMN_KEY.lesson, header: labels.lessonColumn },
        { key: COLUMN_KEY.views, header: labels.viewsColumn, align: "end" },
    ]
    const lessonRows = isSkeleton ? SKELETON_LESSONS : topLessons
    const lessonItems: ReadonlyArray<TableRowItem> = lessonRows.map((lesson): TableRowItem => ({
        key: lesson.id,
        [COLUMN_KEY.lesson]: <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={lesson.title} />,
        [COLUMN_KEY.views]: <Typography size="sm" color="muted" tabularNums isSkeleton={isSkeleton} text={lesson.views.toLocaleString()} />,
    }))

    const TopLessonsSection = () => (
        <SurfaceCard
            padding={3}
            label={labels.topLessonsTitle}
            isSkeleton={isSkeleton}
            body={() =>
                !isSkeleton && topLessons.length === 0 ? (
                    <EmptyState
                        icon={ChartLineUpIcon}
                        title={labels.topLessonsEmptyTitle}
                        description={labels.topLessonsEmptyDescription}
                    />
                ) : (
                    <Table columns={lessonColumns} items={lessonItems} ariaLabel={labels.topLessonsTitle} isSkeleton={isSkeleton} />
                )
            }
        />
    )

    const DropOffSection = () => (
        <SurfaceCard
            padding={3}
            label={labels.dropOffTitle}
            isSkeleton={isSkeleton}
            body={() =>
                isSkeleton ? (
                    <Typography size="sm" isSkeleton />
                ) : dropOffDescription != null ? (
                    <Callout status="warning" title={labels.dropOffTitle} description={dropOffDescription} />
                ) : (
                    <Typography size="sm" color="muted" text={labels.dropOffEmptyDescription} />
                )
            }
        />
    )

    return (
        <div data-tier="block" data-component="AnalyticsView">
            <StackV
                gap={4}
                isSkeleton={isSkeleton}
                items={[
                    () => <GrowthSection />,
                    () => (
                        <Grid
                            columns={{ base: 1, lg: 2 }}
                            gap={4}
                            isSkeleton={isSkeleton}
                            items={[
                                { key: "top-lessons", content: () => <TopLessonsSection /> },
                                { key: "drop-off", content: () => <DropOffSection /> },
                            ]}
                        />
                    ),
                ]}
            />
        </div>
    )
}

export { AnalyticsView }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AnalyticsView" } as const
