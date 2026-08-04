import { CheckIcon, CheckCircleIcon, PlayCircleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `LessonViewer` — one lesson opened in the classroom: title, an optional video
 * region, the body, and a "mark complete" action. The three pictures — `unread`,
 * `completed`, `no-video` — are DATA, so they are STATES of the single shape.
 * Grounded in the real `LessonEntity`, the `MediaAssetEntity` behind the video, and
 * `LessonProgressEntity.completedAt` behind the complete mark.
 */

/** The lesson body — a subset of `LessonEntity`. */
export interface LessonView {
    /** Lesson title (`LessonEntity.title`). */
    title: string
    /** Lesson content — markdown source (`LessonEntity.body`), rendered as a plain content region here. */
    body: string
}

/** The lesson's video, resolved from the `MediaAssetEntity` its `videoAssetId` points at. */
export interface LessonVideoView {
    /** Original uploaded filename (`MediaAssetEntity.originalName`). */
    name: string
    /** Already-formatted duration (from `MediaAssetEntity.durationSec`), or null when unknown. */
    durationLabel?: string | null
}

/** Props for {@link LessonViewer}. */
export interface LessonViewerProps {
    /** The lesson. */
    lesson: LessonView
    /** The lesson's video, or null for a text-only lesson (the `no-video` state). */
    video?: LessonVideoView | null
    /** `true` once the viewer has completed this lesson (`LessonProgressEntity.completedAt` set). */
    isCompleted: boolean
    /** `true` while the complete mark is in flight — the button locks and shows a spinner. */
    isMarking?: boolean
    /** Mark the lesson complete — the connected layer runs `markLessonComplete(lessonId)`. */
    onMarkComplete: () => void
    /**
     * `true` → the block's own first fetch is in flight: the same card renders its
     * title, the video region, the body, and the complete action all shimmering
     * (§12b). The video region always shows while loading so the shape stays
     * stable. Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: LessonViewerLabels
}

/** The already-resolved copy the block renders. */
export interface LessonViewerLabels {
    /** Video-region title (e.g. "Lesson video"). */
    videoTitle: string
    /** Video-region supporting line when the video has no known duration. */
    videoDescription: string
    /** Mark-complete button label at rest. */
    markCompleteLabel: string
    /** Mark-complete button label while the mark is in flight. */
    markingLabel: string
    /** Chip label once the lesson is completed. */
    completedLabel: string
}

/**
 * The classroom lesson viewer. See the file header for why the three pictures are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link LessonViewerProps}
 */
const LessonViewer = ({ lesson, video, isCompleted, isMarking = false, onMarkComplete, isSkeleton = false, labels }: LessonViewerProps) => {
    /** The labelled placeholder standing in for the embedded DASH player. */
    const VideoRegion = () => (
        <SurfaceCard
            variant="nested"
            padding={3}
            isSkeleton={isSkeleton}
            body={() => (
                <EmptyState
                    icon={PlayCircleIcon}
                    title={labels.videoTitle}
                    description={
                        video?.durationLabel ? `${video.name} · ${video.durationLabel}` : `${video?.name ?? labels.videoDescription}`
                    }
                />
            )}
        />
    )

    /** The completion control — a shimmer while loading, a live button, or a success chip once done. */
    const CompleteAction = () =>
        isSkeleton ? (
            <Button variant="primary" prefixIcon={CheckIcon} label={labels.markCompleteLabel} isSkeleton />
        ) : isCompleted ? (
            <Chip tone="success" icon={CheckCircleIcon} text={labels.completedLabel} />
        ) : (
            <Button
                variant="primary"
                prefixIcon={CheckIcon}
                label={isMarking ? labels.markingLabel : labels.markCompleteLabel}
                onPress={onMarkComplete}
                isDisabled={isMarking}
                isPending={isMarking}
            />
        )

    return (
        <div data-tier="block" data-component="LessonViewer">
            <SurfaceCard
                padding={3}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={4}
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Typography size="h4" weight="semibold" isSkeleton={isSkeleton} text={lesson.title} />,
                            // The video region always shows while loading so the card's shape
                            // stays stable when the real player wiring resolves.
                            ...(isSkeleton || video ? [() => <VideoRegion />] : []),
                            () => <Typography size="sm" preserveWhitespace isSkeleton={isSkeleton} text={lesson.body} />,
                            () => <StackH gap={3} align="center" isSkeleton={isSkeleton} items={[() => <CompleteAction />]} />,
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { LessonViewer }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "LessonViewer" } as const
