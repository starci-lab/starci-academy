import { FloppyDiskIcon, TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"
import { InputNumber, InputText, InputTextarea } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `LessonEditorPanel` — overlay drawer over one lesson: title, body, its
 * position among the course's siblings, and the video attached to it. The
 * pictures — editing an existing lesson, one still transcoding its video,
 * one with a ready video, drafting a brand-new lesson, a failed save — are
 * DATA, so they are STATES of the single shape. Grounded in the real
 * `LessonManager.tsx` (`createLesson` / `updateLesson`) and the video
 * pipeline (MinIO → ffmpeg → DASH), the ad hoc admin UI this overlay ports
 * into the design system.
 */

/** The lesson open in the drawer — a subset of `LessonEntity`, or a not-yet-saved draft when `id` is null. */
export interface LessonEditView {
    /** Lesson id (`LessonEntity.id`), or null while drafting a brand-new lesson not yet saved. */
    id: string | null
    /** Lesson title (`LessonEntity.title`). */
    title: string
    /** Lesson body, markdown (`LessonEntity.body`). */
    body: string
    /** 1-based position among the course's lessons (`LessonEntity.sortIndex + 1`). */
    order: number
}

/** Where the lesson's attached video sits in the transcode pipeline — `none` until the first upload. */
export type LessonVideoStatus = "none" | "processing" | "ready"

/** Props for {@link LessonEditorPanel}. */
export interface LessonEditorPanelProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** Title of the course this lesson belongs to, shown as quiet context under the drawer's title. */
    courseTitle: string
    /** The lesson being edited. */
    lesson: LessonEditView
    /** Total lessons on the course — bounds the `order` field. */
    lessonCount: number
    /** Fired as the title field changes. */
    onChangeTitle: (title: string) => void
    /** Fired as the body field changes. */
    onChangeBody: (body: string) => void
    /** Fired as the order field changes. */
    onChangeOrder: (order: number) => void
    /** Where the attached video sits in the transcode pipeline. `"none"` shows the upload trigger alone. */
    video: LessonVideoStatus
    /** Start a video upload — the connected layer opens the file picker and drives the transcode job. */
    onUploadVideo: () => void
    /** Save the lesson — the connected layer runs `createLesson` (new) or `updateLesson` (existing). */
    onSave: () => void
    /**
     * Ask to delete the lesson — the connected layer opens `ConfirmDialog` (an
     * overlay this drawer never mounts itself), never deletes directly. Hidden
     * for a not-yet-saved draft.
     */
    onDelete: () => void
    /** `true` → a save is in flight: every field and both actions lock, the Save button shows its busy label. */
    isSaving?: boolean
    /**
     * The last save's error message, or null/omitted on success. The typed
     * `lesson` stays exactly as the expert left it — a failed save never
     * discards what was written.
     */
    saveError?: string | null
    /**
     * `true` → the drawer's own first fetch (the opened lesson's full body) is
     * in flight: the title, every field, and the video row all shimmer.
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: LessonEditorPanelLabels
}

/** The already-resolved copy the drawer renders. */
export interface LessonEditorPanelLabels {
    /** Title field label. */
    titleLabel: string
    /** Body field label. */
    bodyLabel: string
    /** Order field label. */
    orderLabel: string
    /** Save button label for an existing lesson. */
    saveLabel: string
    /** Save button label while drafting a brand-new lesson. */
    createLabel: string
    /** Save button label while a save is in flight. */
    savingLabel: string
    /** Delete button label. */
    deleteLabel: string
    /** Save-error alert title. */
    saveErrorTitle: string
    /** Shown when no video has been attached yet. */
    videoNoneLabel: string
    /** Shown while an uploaded video is still transcoding. */
    videoProcessingLabel: string
    /** Shown once the video is transcoded and playable. */
    videoTranscodedLabel: string
    /** Shown once the DASH manifest is ready to stream. */
    videoDashReadyLabel: string
    /** Upload-video button label. */
    uploadVideoLabel: string
}

/**
 * The Course Studio's lesson-editor drawer. See the file header for why a
 * brand-new draft is a state of this same shape, and why Delete only ever
 * ASKS (through `ConfirmDialog`) rather than acting.
 *
 * @param props - {@link LessonEditorPanelProps}
 */
const LessonEditorPanel = ({
    isOpen,
    onOpenChange,
    courseTitle,
    lesson,
    lessonCount,
    onChangeTitle,
    onChangeBody,
    onChangeOrder,
    video,
    onUploadVideo,
    onSave,
    onDelete,
    isSaving = false,
    saveError = null,
    isSkeleton = false,
    labels,
}: LessonEditorPanelProps) => {
    const isNew = lesson.id === null
    const locked = isSkeleton || isSaving

    return (
        <DrawerShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="right"
            title={lesson.title.trim().length > 0 ? lesson.title : labels.createLabel}
            description={courseTitle}
            contentClassName="w-full sm:max-w-[560px]"
            isSkeleton={isSkeleton}
            body={({ isSkeleton }: SkeletonProps) => (
                <StackV
                    gap={4}
                    isSkeleton={isSkeleton}
                    items={[
                        // A save failure keeps the typed content on screen (no data loss) —
                        // the alert sits ABOVE the still-editable fields, not in their place.
                        ...(saveError ? [() => (
                            <Alert status="danger" title={labels.saveErrorTitle} description={saveError} />
                        )] : []),
                        () => (
                            <InputText
                                label={labels.titleLabel}
                                value={lesson.title}
                                onValueChange={onChangeTitle}
                                isDisabled={locked}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        () => (
                            <InputTextarea
                                label={labels.bodyLabel}
                                rows={8}
                                value={lesson.body}
                                onValueChange={onChangeBody}
                                isDisabled={locked}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        () => (
                            <InputNumber
                                label={labels.orderLabel}
                                value={lesson.order}
                                onValueChange={onChangeOrder}
                                minValue={1}
                                maxValue={Math.max(lessonCount, 1)}
                                isDisabled={locked}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        () => (
                            <StackH
                                gap={3}
                                align="center"
                                justify="between"
                                isSkeleton={isSkeleton}
                                items={[
                                    () => (
                                        <StackH
                                            gap={2}
                                            align="center"
                                            isSkeleton={isSkeleton}
                                            items={
                                                video === "ready"
                                                    ? [
                                                        () => <Chip tone="success" text={labels.videoTranscodedLabel} isSkeleton={isSkeleton} />,
                                                        () => <Chip tone="success" text={labels.videoDashReadyLabel} isSkeleton={isSkeleton} />,
                                                    ]
                                                    : video === "processing"
                                                        ? [() => <Chip tone="warning" text={labels.videoProcessingLabel} isSkeleton={isSkeleton} />]
                                                        : [() => <Typography size="xs" color="muted" text={labels.videoNoneLabel} isSkeleton={isSkeleton} />]
                                            }
                                        />
                                    ),
                                    () => (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            prefixIcon={UploadSimpleIcon}
                                            label={labels.uploadVideoLabel}
                                            onPress={onUploadVideo}
                                            isDisabled={locked || video === "processing"}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
            footer={() => (
                <>
                    {/* A draft that was never saved has nothing to delete yet. */}
                    {!isNew ? (
                        <Button variant="danger-soft" prefixIcon={TrashIcon} label={labels.deleteLabel} onPress={onDelete} isDisabled={locked} />
                    ) : null}
                    <Button
                        variant="primary"
                        prefixIcon={FloppyDiskIcon}
                        label={isSaving ? labels.savingLabel : isNew ? labels.createLabel : labels.saveLabel}
                        onPress={onSave}
                        isDisabled={locked}
                        isPending={isSaving}
                    />
                </>
            )}
        />
    )
}

export { LessonEditorPanel }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "LessonEditorPanel" } as const
