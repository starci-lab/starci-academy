import { BookOpenIcon, CheckCircleIcon, CircleHalfIcon, CircleIcon } from "@phosphor-icons/react"
import type { AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import type { VerdictBandVariant } from "@sb-components/composites/cards/verdict-band"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * `LessonTOC` -- the course-scoped table-of-contents rail: one numbered row per
 * lesson, each carrying its own completion-status glyph, with the lesson
 * currently open in the paired `LessonViewer` marked. The rival arrangement to
 * stacking every `LessonViewer` inline, for a lesson-heavy course. The two
 * pictures -- a mix of statuses, and `items = []` -- are DATA, so they are
 * STATES of the single shape. Grounded in the same `LessonEntity` +
 * `LessonProgressEntity` pair `CourseView` derives its own lesson statuses
 * from.
 */

/** A lesson's learning state, derived from its `LessonProgressEntity` row -- same vocabulary as `CourseView`. */
export type LessonTocStatus = "completed" | "in-progress" | "not-started"

/** One rail row -- a subset of `LessonEntity` joined with the viewer's progress. */
export interface LessonTocItemView {
    /** Lesson id (`LessonEntity.id`) -- also what `onSelectLesson` fires with. */
    id: string
    /** Lesson title (`LessonEntity.title`). */
    title: string
    /** Learning state derived from the viewer's `LessonProgressEntity` row. */
    status: LessonTocStatus
}

/** Props for {@link LessonTOC}. */
export interface LessonTOCProps {
    /** The lessons, in `sortIndex` order. Empty is the `no-lessons` state. */
    items: Array<LessonTocItemView>
    /** Id of the lesson currently open in the paired `LessonViewer`, or null before one is picked. */
    currentLessonId?: string | null
    /** Jump to a lesson -- the connected layer opens it in the paired `LessonViewer`. */
    onSelectLesson: (lessonId: string) => void
    /**
     * `true` -> the rail's own first fetch is in flight: the same list renders a
     * fixed count of lesson-shaped rows shimmering (§12b), threaded straight
     * down -- never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: LessonTOCLabels
}

/** The already-resolved copy the block renders. */
export interface LessonTOCLabels {
    /** Rail heading (e.g. "Table of contents"). */
    title: string
    /** Suffix after the lesson count in the heading (e.g. "lessons"). */
    lessonsSuffix: string
    /** Empty-state title when the course has no lessons yet. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Status -> glyph. Same vocabulary as `CourseView`'s own `STATUS_ICON`. */
const STATUS_ICON = {
    completed: CheckCircleIcon,
    "in-progress": CircleHalfIcon,
    "not-started": CircleIcon,
} as const

/** Status -> the leading glyph's status colour (`Alert`'s own tone vocabulary). */
const STATUS_ICON_COLOR: Record<LessonTocStatus, AlertStatus> = {
    completed: "success",
    "in-progress": "warning",
    "not-started": "default",
}

/** Status -> left-edge verdict band. `not-started` carries no band -- nothing to flag yet. */
const STATUS_TONE: Record<LessonTocStatus, VerdictBandVariant | undefined> = {
    completed: "success",
    "in-progress": "warning",
    "not-started": undefined,
}

/** How many placeholder rows the loading mirror draws while `items` hasn't landed yet. */
const SKELETON_ROW_COUNT = 5

/** Placeholder lessons -- sized like a real row so the list's shimmer mirrors the loaded shape. */
const SKELETON_ITEMS: Array<LessonTocItemView> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    title: "Lesson title",
    status: "not-started",
}))

/**
 * The classroom lesson table of contents. See the file header for why the two
 * pictures are states of one shape rather than separate leaves.
 *
 * @param props - {@link LessonTOCProps}
 */
const LessonTOC = ({ items, currentLessonId, onSelectLesson, isSkeleton = false, labels }: LessonTOCProps) => {
    const rows = isSkeleton ? SKELETON_ITEMS : items
    const listItems: Array<SurfaceCardListItem> = rows.map((lesson, index) => ({
        key: lesson.id,
        title: `${index + 1}. ${lesson.title}`,
        leadingIcon: STATUS_ICON[lesson.status],
        leadingIconColor: STATUS_ICON_COLOR[lesson.status],
        tone: STATUS_TONE[lesson.status],
        selected: lesson.id === currentLessonId,
        isDisabled: isSkeleton,
        onPress: () => onSelectLesson(lesson.id),
    }))

    const Empty = () => <EmptyState icon={BookOpenIcon} title={labels.emptyTitle} description={labels.emptyDescription} />

    return (
        <div data-tier="block" data-component="LessonTOC">
            <SurfaceCardList
                label={`${labels.title} (${items.length} ${labels.lessonsSuffix})`}
                items={listItems}
                emptyState={Empty}
                isSkeleton={isSkeleton}
            />
        </div>
    )
}

export { LessonTOC }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "LessonTOC" } as const
