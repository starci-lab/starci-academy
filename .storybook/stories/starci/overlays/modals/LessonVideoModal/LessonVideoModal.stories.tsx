import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    LessonVideoKind,
    LessonVideoModal,
    VideoHostPlatform,
} from "@sb-components/starci/overlays/modals/LessonVideoModal/LessonVideoModal"
import type { LessonVideo, LessonVideoModalProps } from "@sb-components/starci/overlays/modals/LessonVideoModal/LessonVideoModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LessonVideoModal` — fullscreen "watch this lesson video" dialog: kind chip,
 * duration, host platform, the player chrome (engine out of scope — see the
 * component file header), the external link, and optional description/caption.
 * Opened from anywhere via the app's global overlay store; this port takes
 * plain `isOpen`/`onOpenChange`/`video` props instead of reading Zustand/Redux
 * directly (Rule 13).
 */
const meta: Meta<typeof LessonVideoModal> = {
    title: "StarCi/Overlays/Modals/LessonVideoModal/LessonVideoModal",
    component: LessonVideoModal,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof LessonVideoModal>

// Real DOM (size="lg" scroll="inside"): Modal.CloseTrigger + Modal.Header >
// Typography(title) + Modal.Body > StackV > Cluster(EnumChip + InlineIconLabel
// + Typography[host platform]) + StackV(SurfaceCard>EmptyState[player gap]
// + Typography[isLink url]) + StackV(MarkdownContent[description]? +
// MarkdownContent[caption]?).
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "Typography": { tier: "atom", role: "the video title (header) / host platform label / external link — three separate instances of this leaf, see each state's own leaf list", storyId: "atoms-text-typography-typography--plain" },
    "StackV": { tier: "frame", role: "the vertical rhythm between the meta row, the player+link region, and the optional commentary region — three instances of this frame, one per region seam", storyId: "frames-stack-stackv--default" },
    "Cluster": { tier: "frame", role: "the wrapping meta row — kind chip, duration, host platform", storyId: "frames-cluster-cluster--default" },
    "EnumChip": { tier: "composite", role: "production-stage chip (raw / edited / premium), always warning-toned", storyId: "composites-chips-enumchip--warning" },
    "InlineIconLabel": { tier: "composite", role: "clock icon + formatted HH:mm duration", storyId: "composites-texts-inlineiconlabel--count" },
    "SurfaceCard": { tier: "composite", role: "the aspect-video card face the player-gap placeholder sits in, reusing the exact pairing `FoundationResourceBody` already established for its own video gap", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "EmptyState": { tier: "composite", role: "the honest label naming the gap — play glyph, title, description — instead of a silent fake player", storyId: "composites-feedback-emptystate-emptystate--description" },
    "MarkdownContent (description)": { tier: "composite", role: "one-paragraph context under the player, compact measure", storyId: "composites-viewers-markdowncontent--compact" },
    "MarkdownContent (caption)": { tier: "composite", role: "short caption/attribution, compact measure", storyId: "composites-viewers-markdowncontent--compact" },
}

const RAW_STREAM_VIDEO: LessonVideo = {
    title: "Live session: Dependency Injection in NestJS",
    kind: LessonVideoKind.RawStream,
    durationMs: 87 * 60_000,
    hostPlatform: VideoHostPlatform.Youtube,
    url: "https://youtube.com/watch?v=di-nestjs-raw",
}

const PREMIUM_VIDEO: LessonVideo = {
    title: "Dependency Injection in NestJS — edited recording",
    kind: LessonVideoKind.PremiumRecord,
    durationMs: 14 * 60_000 + 32 * 1000,
    hostPlatform: VideoHostPlatform.CloudflareStream,
    url: "https://videos.starci.academy/di-nestjs-premium",
    description: "An edited cut of the original livestream, keeping just the Dependency Injection explanation and trimming the rambling Q&A.",
    caption: "Filmed at the StarCi studio, July 2026.",
}

/** Controlled wrapper — the trigger reopens the modal after it closes. */
const ControlledLessonVideoModal = ({
    triggerLabel,
    ...modalProps
}: {
    triggerLabel: string
} & Omit<LessonVideoModalProps, "isOpen" | "onOpenChange">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label={triggerLabel}
                variant="secondary"
                size="sm"
                classNames={["self-start"]}
                onPress={() => setIsOpen(true)}
            />
            <LessonVideoModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
               

                {...modalProps}
            />
        </div>
    )
}

/**
 * ONE LEAF. Every state below is the SAME structural tree — meta row, player
 * gap, link, optional commentary — only the DATA changes: a raw stream with no
 * commentary, a premium record with both description and caption, and the
 * `isLoading` mirror.
 */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="LessonVideoModal"
            tier="block"
            leaf="Default"
            parts={[]}
            annotate={ANNOTATE}
            reason="Owns the domain shape of a lesson video — kind, duration, host platform, player, link, optional commentary — and the reading order between them, none of which any single composed part (ModalShell / EnumChip / InlineIconLabel / MarkdownContent) knows on its own."
            states={[
                {
                    name: "kind = rawStream — no description/caption",
                    why: "A raw livestream recording rarely ships with authored commentary, so the optional markdown section renders nothing at all rather than an empty card.",
                    code: `<LessonVideoModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    video={{
        title: "Live session: Dependency Injection in NestJS",
        kind: LessonVideoKind.RawStream,
        durationMs: 87 * 60_000,
        hostPlatform: VideoHostPlatform.Youtube,
        url: "https://youtube.com/watch?v=di-nestjs-raw",
    }}
/>`,
                    render: (
                        <ControlledLessonVideoModal
                            triggerLabel="Open raw-stream video"
                            video={RAW_STREAM_VIDEO}
                        />
                    ),
                },
                {
                    name: "kind = premiumRecord — description + italic caption",
                    why: "A curated premium record carries both optional markdown fields: a plain description and an italic attribution caption underneath it.",
                    code: `<LessonVideoModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    video={{
        title: "Dependency Injection in NestJS — edited recording",
        kind: LessonVideoKind.PremiumRecord,
        durationMs: 14 * 60_000 + 32 * 1000,
        hostPlatform: VideoHostPlatform.CloudflareStream,
        url: "https://videos.starci.academy/di-nestjs-premium",
        description: "An edited cut of the original livestream...",
        caption: "Filmed at the StarCi studio, July 2026.",
    }}
/>`,
                    render: (
                        <ControlledLessonVideoModal
                            triggerLabel="Open premium-record video"
                            video={PREMIUM_VIDEO}
                        />
                    ),
                },
                {
                    name: "isLoading = true",
                    why: "The kind chip, duration label and host-platform label mirror their own skeleton; the player gap stays static (it is scope chrome, not data); the two MarkdownContent leaves have no skeleton mirror of their own, so they are withheld entirely rather than shown against empty text.",
                    code: "<LessonVideoModal isOpen={isOpen} onOpenChange={setIsOpen} isLoading />",
                    render: (
                        <ControlledLessonVideoModal
                            triggerLabel="Open loading video"
                            isLoading
                        />
                    ),
                },
            ]}
        />
    ),
}
