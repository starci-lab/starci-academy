import { BookOpenIcon, CheckCircleIcon, CircleIcon, CircleHalfIcon, VideoCameraIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { ListRow } from "@sb-components/composites/lists/List/List"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CourseView` -- one published course opened in the classroom: header + overall
 * completion meter + the ordered lessons with each lesson's own state. The four
 * pictures -- `not-started`, `in-progress`, `completed`, `no-lessons` -- are DATA, so
 * they are STATES of the single shape. Grounded in the real `CourseEntity`,
 * `LessonEntity`, and `LessonProgressEntity` (each lesson's status is derived).
 */

/** A lesson's learning state, derived from its `LessonProgressEntity` row. */
export type LessonStatus = "completed" | "in-progress" | "not-started"

/** One lesson row -- a subset of `LessonEntity` joined with the viewer's progress. */
export interface CourseLessonView {
    /** Lesson id (`LessonEntity.id`). */
    id: string
    /** Lesson title (`LessonEntity.title`). */
    title: string
    /** Whether the lesson has an uploaded video (`LessonEntity.videoAssetId != null`). */
    hasVideo: boolean
    /** Learning state derived from the viewer's `LessonProgressEntity` row. */
    status: LessonStatus
}

/** The course header -- a subset of `CourseEntity`. */
export interface CourseHeaderView {
    /** Course title (`CourseEntity.title`). */
    title: string
    /** Short summary (`CourseEntity.summary`), or null when unset. */
    summary?: string | null
    /** Display price string (`CourseEntity.priceText`), or null when free/unpriced. */
    priceText?: string | null
}

/** Props for {@link CourseView}. */
export interface CourseViewProps {
    /** The course header. */
    course: CourseHeaderView
    /** The lessons, in `sortIndex` order. Empty is the `no-lessons` state. */
    lessons: Array<CourseLessonView>
    /**
     * `true` -> the block's own first fetch is in flight: the same card renders its
     * header, a shimmering progress meter, and a fixed count of lesson-shaped rows
     * (§12b), threading the flag down so every content node shimmers -- the box
     * neither shrinks nor jumps when the course resolves.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: CourseViewLabels
}

/** The already-resolved copy the block renders. */
export interface CourseViewLabels {
    /** Label above the progress meter (e.g. "Course progress"). */
    progressLabel: string
    /** Suffix after the "done / total" count (e.g. "lessons complete"). */
    lessonsCompleteSuffix: string
    /** Eyebrow prefix before a lesson's position (e.g. "Lesson"). */
    lessonPrefix: string
    /** Chip label for a lesson that has a video. */
    videoLabel: string
    /** The three lesson-status chip labels, keyed by status. */
    statusLabels: Record<LessonStatus, string>
    /** Empty-state title when the course has no lessons. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Lesson status -> the leading glyph + its tone class + the chip tone. */
const STATUS_ICON = {
    completed: CheckCircleIcon,
    "in-progress": CircleHalfIcon,
    "not-started": CircleIcon,
} as const

/** Icon colour per status -- completed reads success, in-progress warning, not-started muted. */
const STATUS_ICON_CLASS: Record<LessonStatus, string> = {
    completed: "size-5 shrink-0 text-success",
    "in-progress": "size-5 shrink-0 text-warning",
    "not-started": "size-5 shrink-0 text-muted",
}

/** Chip tone per status. */
const STATUS_CHIP_TONE: Record<LessonStatus, ChipTone> = {
    completed: "success",
    "in-progress": "warning",
    "not-started": "default",
}

/** How many placeholder lesson rows the loading mirror draws while `lessons` hasn't landed yet. */
const SKELETON_LESSON_COUNT = 3

/**
 * The classroom course view. See the file header for why the four pictures are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link CourseViewProps}
 */
const CourseView = ({ course, lessons, isSkeleton = false, labels }: CourseViewProps) => {
    const total = lessons.length
    const completedCount = lessons.filter((lesson) => lesson.status === "completed").length

    /** The course header row -- title on the left, the optional price chip on the right. */
    const Header = () => (
        <StackV
            principle="title-subtitle" gap={2}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <StackH
                        principle="value-row" gap={3}
                        justify="between"
                        align="center"
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Typography size="h4" weight="semibold" isSkeleton={isSkeleton} text={course.title} />,
                            ...(course.priceText ? [() => <Chip tone="accent" isSkeleton={isSkeleton} text={course.priceText ?? ""} />] : []),
                        ]}
                    />
                ),
                ...(course.summary ? [() => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={course.summary ?? ""} />] : []),
            ]}
        />
    )

    /** The overall completion meter plus the "done / total" count line. */
    const Progress = () => (
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <ProgressMeter
                        value={completedCount}
                        max={total}
                        label={labels.progressLabel}
                        showValue
                        isSkeleton={isSkeleton}
                        color={completedCount === total ? "success" : "accent"}
                    />
                ),
                () => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={`${completedCount} / ${total} ${labels.lessonsCompleteSuffix}`}
                    />
                ),
            ]}
        />
    )

    /** One lesson row -- a status glyph, the title + position, and status/video chips. */
    const LessonRow = (lesson: CourseLessonView, index: number) => {
        const Icon = STATUS_ICON[lesson.status]
        return (
            <ListRow
                key={lesson.id}
                divider={index < lessons.length - 1}
                leading={() => <Icon aria-hidden focusable="false" weight="fill" className={STATUS_ICON_CLASS[lesson.status]} />}
                title={lesson.title}
                subtitle={`${labels.lessonPrefix} ${index + 1}`}
                meta={() => (
                    <StackH
                        gap={3}
                        principle="chip-row"
                        align="center"
                        items={[
                            () => <Chip tone={STATUS_CHIP_TONE[lesson.status]} text={labels.statusLabels[lesson.status]} />,
                            ...(lesson.hasVideo
                                ? [() => <Chip tone="default" icon={VideoCameraIcon} text={labels.videoLabel} />]
                                : []),
                        ]}
                    />
                )}
            />
        )
    }

    return (
        <div data-tier="block" data-component="CourseView">
            <SurfaceCard
                padding={3}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        principle="label-field" gap={4}
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Header />,
                            // While loading the meter shows even with no lessons yet, so the
                            // shape stays stable when the real progress lands.
                            ...(isSkeleton || total > 0 ? [() => <Progress />] : []),
                            () =>
                                isSkeleton ? (
                                    <StackV
                                        principle="name-handle" gap={1}
                                        isSkeleton
                                        items={Array.from({ length: SKELETON_LESSON_COUNT }, (_unused, index) => () => (
                                            <ListRow
                                                key={index}
                                                divider={index < SKELETON_LESSON_COUNT - 1}
                                                title="Lesson title"
                                                subtitle="Lesson 1"
                                                isSkeleton
                                            />
                                        ))}
                                    />
                                ) : total === 0 ? (
                                    <EmptyState
                                        icon={BookOpenIcon}
                                        title={labels.emptyTitle}
                                        description={labels.emptyDescription}
                                    />
                                ) : (
                                    <StackV gap={1} items={lessons.map((lesson, index) => () => LessonRow(lesson, index))} />
                                ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { CourseView }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CourseView" } as const
