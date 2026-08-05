import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    LessonEditorPanel,
    type LessonEditView,
    type LessonEditorPanelLabels,
    type LessonVideoStatus,
} from "@sb-components/nivoexpert/blocks/studio/LessonEditorPanel/LessonEditorPanel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
const meta: Meta<typeof LessonEditorPanel> = {
    title: "NivoExpert/Blocks/Studio/LessonEditorPanel/LessonEditorPanel",
    component: LessonEditorPanel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LessonEditorPanel>

const NOOP = () => {}

const LABELS: LessonEditorPanelLabels = {
    titleLabel: "Title",
    bodyLabel: "Body",
    orderLabel: "Position",
    saveLabel: "Save",
    createLabel: "Create lesson",
    savingLabel: "Saving…",
    deleteLabel: "Delete",
    saveErrorTitle: "Couldn't save this lesson",
    videoNoneLabel: "No video attached yet",
    videoProcessingLabel: "Transcoding video…",
    videoTranscodedLabel: "Video transcoded",
    videoDashReadyLabel: "DASH ready",
    uploadVideoLabel: "Upload video",
}

// Same course/lesson `CourseStudio.stories.tsx` and `CourseRailList.stories.tsx`
// use, so the fixtures read as one continuous academy across the book rather
// than an invented one.
const COURSE_TITLE = "Ship Your First AI Agent"
const LESSON_COUNT = 4

const EXISTING_LESSON: LessonEditView = {
    id: "lesson-2",
    title: "Wiring the tool loop",
    body: "Walk through the request/response loop an agent runs between the model and its tools, and where to put a retry.",
    order: 2,
}

const DRAFT_LESSON: LessonEditView = { id: null, title: "", body: "", order: 5 }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    InputText: { tier: "atom", role: "the lesson title field" },
    InputTextarea: { tier: "atom", role: "the lesson body field, markdown" },
    InputNumber: { tier: "atom", role: "the lesson's position among its siblings" },
    Chip: { tier: "atom", role: "the video's transcode/DASH status, once a video is attached" },
    Alert: { tier: "atom", role: "a failed save, with the typed content kept in place" },
    Button: { tier: "atom", role: "upload video, delete (hidden for a draft), and save" },
}

const REASON =
    "Every field maps one-to-one onto `LessonEntity` (`title`/`body`/`sortIndex`), and Save runs `createLesson` for a not-yet-saved draft (`id === null`) or `updateLesson` for an existing one — the button's own label says which. Delete only ASKS: it opens the `ConfirmDialog` overlay rather than deleting directly, and stays hidden for a draft (nothing on the server yet). A failed save (`saveError`) never clears the fields — the expert's typed content stays exactly where it was."

/** Shared controlled wrapper — one `isOpen`/field state feeds every leaf state below. */
type ControlledLessonEditorPanelProps = {
    lesson: LessonEditView
    video: LessonVideoStatus
    saveError?: string | null
    isSaving?: boolean
}
const ControlledLessonEditorPanel = ({
    lesson: initialLesson,
    video: initialVideo,
    saveError,
    isSaving,
}: ControlledLessonEditorPanelProps) => {
    const [isOpen, setIsOpen] = useState(true)
    const [lesson, setLesson] = useState(initialLesson)

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        courseTitle: COURSE_TITLE,
        lesson,
        lessonCount: LESSON_COUNT,
        onChangeTitle: (t: string) => setLesson((l) => ({ ...l, title: t })),
        onChangeBody: (b: string) => setLesson((l) => ({ ...l, body: b })),
        onChangeOrder: (o: number) => setLesson((l) => ({ ...l, order: o })),
        video: initialVideo,
        onUploadVideo: NOOP,
        onSave: () => setIsOpen(false),
        onDelete: NOOP,
        saveError: saveError ?? null,
        isSaving: isSaving ?? false,
        labels: LABELS,
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="self-start">
                <Button label="Open lesson editor" variant="secondary" size="sm" onPress={() => setIsOpen(true)} />
            </div>
            <LessonEditorPanel {...base} />
        </div>
    )
}

/** LEAF — one shape; the pictures are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LessonEditorPanel"
                tier="block"
                leaf="Lesson"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "existing lesson, no video yet",
                        why: "The everyday shape: an existing lesson's title/body/position, no video attached — the upload trigger is the way onward, no status chip yet.",
                        code: `<LessonEditorPanel
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  courseTitle="Ship Your First AI Agent"
  lesson={lesson}
  lessonCount={4}
  video="none"
  onUploadVideo={upload}
  onSave={save}
  onDelete={askDelete}
  labels={labels}
/>`,
                        render: <ControlledLessonEditorPanel lesson={EXISTING_LESSON} video="none" />,
                    },
                    {
                        name: "video = \"processing\"",
                        why: "A video was just uploaded and is still transcoding — the status chip names it and the upload trigger locks so a second upload can't race the first.",
                        code: "<LessonEditorPanel video=\"processing\" … />",
                        render: <ControlledLessonEditorPanel lesson={EXISTING_LESSON} video="processing" />,
                    },
                    {
                        name: "video = \"ready\"",
                        why: "The video finished transcoding and its DASH manifest is ready to stream — both chips read positive, and re-uploading (replacing the video) is still available.",
                        code: "<LessonEditorPanel video=\"ready\" … />",
                        render: <ControlledLessonEditorPanel lesson={EXISTING_LESSON} video="ready" />,
                    },
                    {
                        name: "drafting a new lesson",
                        why: "A brand-new lesson (`id = null`, added at the end of the list): Delete is hidden — nothing exists on the server yet to delete — and Save reads \"Create lesson\" instead of \"Save\".",
                        code: "<LessonEditorPanel lesson={{ id: null, title: \"\", body: \"\", order: 5 }} … />",
                        render: <ControlledLessonEditorPanel lesson={DRAFT_LESSON} video="none" />,
                    },
                    {
                        name: "saveError set",
                        why: "The save failed: the alert names it, and every field still shows exactly what the expert typed — a failed save never discards content.",
                        code: "<LessonEditorPanel lesson={lesson} saveError=\"…\" … />",
                        render: (
                            <ControlledLessonEditorPanel
                                lesson={EXISTING_LESSON}
                                video="ready"
                                saveError="The server couldn't be reached. Your changes are kept — try saving again."
                            />
                        ),
                    },
                    {
                        name: "isSaving = true",
                        why: "A save is in flight: every field and both actions lock, and the Save button shows its busy label instead of a second, silent click doing nothing.",
                        code: "<LessonEditorPanel lesson={lesson} isSaving … />",
                        render: <ControlledLessonEditorPanel lesson={EXISTING_LESSON} video="ready" isSaving />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The drawer's own first fetch (the opened lesson's full body) is in flight, so the title and every field shimmer together, so nothing jumps when the real lesson lands.",
                        code: "<LessonEditorPanel isSkeleton … />",
                        render: (
                            <div data-tier="fixture" className="p-8">
                                <LessonEditorPanel
                                    isOpen
                                    onOpenChange={NOOP}
                                    courseTitle={COURSE_TITLE}
                                    lesson={EXISTING_LESSON}
                                    lessonCount={LESSON_COUNT}
                                    onChangeTitle={NOOP}
                                    onChangeBody={NOOP}
                                    onChangeOrder={NOOP}
                                    video="none"
                                    onUploadVideo={NOOP}
                                    onSave={NOOP}
                                    onDelete={NOOP}
                                    labels={LABELS}
                                    isSkeleton
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
