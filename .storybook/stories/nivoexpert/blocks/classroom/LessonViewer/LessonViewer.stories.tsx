import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    LessonViewer,
    type LessonViewerLabels,
} from "@sb-components/nivoexpert/blocks/classroom/LessonViewer/LessonViewer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LessonViewer` — one lesson opened in the classroom: title, an optional video
 * region, the body, and a "mark complete" action. The three pictures — `unread`,
 * `completed`, `no-video` — are DATA, so they are STATES of the single shape.
 * Grounded in the real `LessonEntity`, the `MediaAssetEntity` behind the video, and
 * `LessonProgressEntity.completedAt` behind the complete mark.
 */
const meta: Meta<typeof LessonViewer> = {
    title: "NivoExpert/Blocks/Classroom/LessonViewer/LessonViewer",
    component: LessonViewer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LessonViewer>

const LABELS: LessonViewerLabels = {
    videoTitle: "Lesson video",
    videoDescription: "Video attached",
    markCompleteLabel: "Mark complete",
    markingLabel: "Saving…",
    completedLabel: "Completed",
}

const LESSON = {
    title: "Wiring the tool loop",
    body: "An agent is a loop: read the goal, pick a tool, run it, read the result, decide whether to stop.\n\nIn this lesson we wire that loop end to end and watch it call a real webhook.",
}

const VIDEO = { name: "tool-loop.mp4", durationLabel: "12:40" }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the lesson card and the nested video placeholder" },
    EmptyState: { tier: "composite", role: "the labelled stand-in for the embedded DASH player" },
    Button: { tier: "atom", role: "the mark-complete action (locks + spinner while saving)" },
    Chip: { tier: "atom", role: "the \"Completed\" badge once the lesson is done" },
    Typography: { tier: "atom", role: "the lesson title and the body content region" },
}

/** LEAF — one shape; the three pictures are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LessonViewer"
                tier="block"
                leaf="Lesson"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Blocks take no `className`: the block owns the lesson entity, so its pictures are states of one shape. The video is a LABELLED placeholder region — the real DASH player is app wiring and never appears here. The complete mark collapses to a chip once `LessonProgressEntity.completedAt` is set."
                states={[
                    {
                        name: "video, not completed",
                        why: "The resting state of a video lesson: the video region shows, the body reads below it, and the Mark-complete button is live.",
                        code: "<LessonViewer lesson={lesson} video={video} isCompleted={false} onMarkComplete={mark} labels={labels} />",
                        render: (
                            <LessonViewer
                                lesson={LESSON}
                                video={VIDEO}
                                isCompleted={false}
                                onMarkComplete={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isCompleted = true",
                        why: "The learner has finished the lesson: the action collapses from a button to a success \"Completed\" chip, so there is nothing left to press.",
                        code: "<LessonViewer {...props} isCompleted />",
                        render: (
                            <LessonViewer
                                lesson={LESSON}
                                video={VIDEO}
                                isCompleted
                                onMarkComplete={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "video = null (text-only)",
                        why: "A text-only lesson (`videoAssetId` is null): the video region is gone entirely, leaving the body and the complete action.",
                        code: "<LessonViewer {...props} video={null} />",
                        render: (
                            <LessonViewer
                                lesson={LESSON}
                                video={null}
                                isCompleted={false}
                                onMarkComplete={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The block's own first fetch is in flight, so the same card renders its title, the video region, the body, and a shimmering complete button — matching the loaded shape so nothing jumps when the lesson lands.",
                        code: "<LessonViewer lesson={lesson} video={video} isCompleted={false} onMarkComplete={mark} labels={labels} isSkeleton />",
                        render: (
                            <LessonViewer
                                lesson={LESSON}
                                video={VIDEO}
                                isCompleted={false}
                                onMarkComplete={() => {}}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
