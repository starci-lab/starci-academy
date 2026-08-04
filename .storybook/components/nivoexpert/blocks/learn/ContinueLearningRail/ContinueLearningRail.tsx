import { PlayCircleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * `ContinueLearningRail` — the "pick up where you left off" rail above the course
 * grid: one row per course with a lesson in progress, the position it was paused
 * at, and a resume action. The two pictures — `empty`, `content` — are DATA, so
 * they are STATES of the single shape. Grounded in the real `LessonProgressEntity`
 * row (`positionSec > 0` and no `completedAt` ⇒ resumable).
 */

/** One resumable course — the course's furthest-along unfinished lesson. */
export interface ContinueItemView {
    /** Course slug — the connected layer routes `onContinue` to `/classroom/[slug]`. */
    courseSlug: string
    /** Course title, shown as the row's subtitle. */
    courseTitle: string
    /** Title of the lesson to resume (`LessonEntity.title`). */
    lessonTitle: string
    /** Paused-at position, already formatted (e.g. "3:45") — the connected layer formats `positionSec`. */
    positionLabel: string
}

/** Props for {@link ContinueLearningRail}. */
export interface ContinueLearningRailProps {
    /** Courses with a lesson in progress, most-recently-touched first. Empty is the `empty` state. */
    items: Array<ContinueItemView>
    /** Resume a course — the connected layer routes to `/classroom/[slug]` and opens the paused lesson. */
    onContinue: (courseSlug: string) => void
    /** Empty state's onward action — the connected layer routes to the course catalog. */
    onBrowseCourses: () => void
    /**
     * `true` → the rail's own first fetch is in flight: a fixed count of
     * resume-shaped rows render with every cell shimmering (§12b), threaded down.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ContinueLearningRailLabels
}

/** The already-resolved copy the block renders. */
export interface ContinueLearningRailLabels {
    /** Section title above the rail (e.g. "Continue learning"). */
    title: string
    /** Prefix before the paused-at position (e.g. "Paused at"). */
    resumeAtPrefix: string
    /** Empty-state title — nothing currently in progress. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
    /** Empty-state action label — browse the catalog. */
    browseLabel: string
}

/** How many placeholder rows the loading rail draws while `items` hasn't landed yet. */
const SKELETON_ROW_COUNT = 2

/** Placeholder rows — non-empty stand-ins sized like a real row, so the rail's shimmer mirrors the loaded shape. */
const skeletonRows = (): Array<SurfaceCardListItem> =>
    Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        title: "Lesson title",
        subtitle: "Course title",
    }))

/**
 * The learner's resume rail. See the file header for why the two pictures are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link ContinueLearningRailProps}
 */
const ContinueLearningRail = ({ items, onContinue, onBrowseCourses, isSkeleton = false, labels }: ContinueLearningRailProps) => {
    const rows: Array<SurfaceCardListItem> = items.map((item) => ({
        key: item.courseSlug,
        title: item.lessonTitle,
        subtitle: item.courseTitle,
        metaText: `${labels.resumeAtPrefix} ${item.positionLabel}`,
        onPress: () => onContinue(item.courseSlug),
    }))

    /** Empty state's action — browse the course catalog. A component reference, called by `EmptyState` itself. */
    const BrowseAction = () => <Button variant="primary" size="sm" label={labels.browseLabel} onPress={onBrowseCourses} />

    /** Empty state — nothing currently in progress. A component reference, called by `SurfaceCardList` itself. */
    const EmptyRail = () => (
        <EmptyState icon={PlayCircleIcon} title={labels.emptyTitle} description={labels.emptyDescription} action={BrowseAction} />
    )

    return (
        <div data-tier="block" data-component="ContinueLearningRail">
            <SurfaceCardList
                label={labels.title}
                items={isSkeleton ? skeletonRows() : rows}
                emptyState={EmptyRail}
                isSkeleton={isSkeleton}
            />
        </div>
    )
}

export { ContinueLearningRail }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ContinueLearningRail" } as const
