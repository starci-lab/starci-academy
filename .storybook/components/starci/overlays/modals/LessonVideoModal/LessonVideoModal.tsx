import React from "react"
import { ClockIcon, PlayIcon } from "@phosphor-icons/react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import { EnumChip } from "@sb-components/composites/chips/EnumChip/EnumChip"
import type { EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `LessonVideoModal` — fullscreen "watch this lesson video" dialog: kind chip,
 * duration, host platform, the player chrome (engine out of scope — see the
 * component file header), the external link, and optional description/caption.
 * Opened from anywhere via the app's global overlay store; this port takes
 * plain `isOpen`/`onOpenChange`/`video` props instead of reading Zustand/Redux
 * directly (Rule 13).
 */

/** Production stage / quality tier of a lesson video (mirrors `src`'s `LessonVideoKind`). */
export enum LessonVideoKind {
    /** Raw livestream recording (unprocessed). */
    RawStream = "rawStream",
    /** Edited livestream (cleaned, cut, structured). */
    EditedStream = "editedStream",
    /** Premium recorded version (high quality, curated). */
    PremiumRecord = "premiumRecord",
}

/** Where the lesson video is hosted (mirrors `src`'s `VideoHostPlatform`). */
export enum VideoHostPlatform {
    /** YouTube — public or unlisted video. */
    Youtube = "youtube",
    /** Google Drive — shared MP4 or streaming link. */
    GoogleDrive = "googleDrive",
    /** Vimeo — hosted video with privacy controls. */
    Vimeo = "vimeo",
    /** Cloudflare Stream — CDN-delivered adaptive video. */
    CloudflareStream = "cloudflareStream",
    /** Any other hosting platform not explicitly listed. */
    Other = "other",
}

/** The lesson video entity {@link LessonVideoModal} reads. */
export interface LessonVideo {
    /** Video title — rendered as the dialog header. */
    title: string
    /** Production stage / quality tier. */
    kind: LessonVideoKind
    /** Video length in milliseconds. */
    durationMs: number
    /** Where the video is hosted. */
    hostPlatform: VideoHostPlatform
    /** The external, watchable URL. */
    url: string
    /** Optional one-paragraph context, markdown. */
    description?: string
    /** Optional short caption/attribution, markdown, rendered italic. */
    caption?: string
}

/** Props for {@link LessonVideoModal}. */
export interface LessonVideoModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). */
    onOpenChange: (open: boolean) => void
    /**
     * The video being watched. `undefined` while the caller has not resolved
     * which video to show yet — meaningful together with {@link isLoading}.
     */
    video?: LessonVideo
    /** `true` → the meta row and link mirror their own skeleton; see file header. */
    isLoading?: boolean
}

/** {@link LessonVideoKind} → chip tone + tooltip. Every value is `warning` — a stage badge, not a verdict. */
const KIND_MAP: Record<LessonVideoKind, EnumChipEntry> = {
    [LessonVideoKind.RawStream]: {
        color: "warning",
        label: "Raw Stream",
        tooltip: "The original, unedited stream recording. Full content, but may still be rough, have minor glitches, or not be optimized for viewing.",
    },
    [LessonVideoKind.EditedStream]: {
        color: "warning",
        label: "Edited Stream",
        tooltip: "The stream recording after editing. Content is trimmed, clearer, and easier to follow.",
    },
    [LessonVideoKind.PremiumRecord]: {
        color: "warning",
        label: "Premium Record",
        tooltip: "The highest-quality version. Carefully produced visuals, audio, and learning experience.",
    },
}

/** {@link VideoHostPlatform} → display label (mirrors `videoHostPlatform.*` in `src/messages/vi.json`). */
const HOST_PLATFORM_LABEL: Record<VideoHostPlatform, string> = {
    [VideoHostPlatform.Youtube]: "YouTube",
    [VideoHostPlatform.GoogleDrive]: "Google Drive",
    [VideoHostPlatform.Vimeo]: "Vimeo",
    [VideoHostPlatform.CloudflareStream]: "Cloudflare Stream",
    // No key exists upstream for `other` — see file header.
    [VideoHostPlatform.Other]: "Other",
}

/** `durationMs` → `HH:mm`, zero-padded (mirrors the source's `dayjs.duration(...).format("HH:mm")`). */
const formatDuration = (durationMs: number): string => {
    const totalMinutes = Math.floor(durationMs / 60_000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

/** Block-owned vocabulary for the player gap — see the file header's scope-cut note. */
const PLAYER_GAP_TITLE = "No video player built into this framework yet"
const PLAYER_GAP_DESCRIPTION =
    "This framework has no video-player primitive yet — the surrounding card is ready to plug in a real player (YouTube / MPEG-DASH / standard video) later."

/** Props for the internal {@link PlayerGap} placeholder. */
interface PlayerGapProps {
}

/**
 * Clearly-marked placeholder standing in for the real video player (YouTube /
 * MPEG-DASH / standard `<video>`, chosen per {@link VideoHostPlatform}) — an
 * out-of-scope runtime, not ported here. See file header, "PLAYER ENGINE OUT
 * OF SCOPE": reuses the exact `SurfaceCard` + `EmptyState` pairing
 * `FoundationResourceBody` already established for this same situation,
 * rather than a new hand-rolled box.
 */
const PlayerGap = ({ }: PlayerGapProps) => (
    <SurfaceCard
        contentClassName="aspect-video"


        body={() => (
            <EmptyState
                icon={PlayIcon}
                title={PLAYER_GAP_TITLE}
                description={PLAYER_GAP_DESCRIPTION}

            />
        )}
    />
)

/**
 * Fullscreen "watch this lesson video" dialog. See the file header for the
 * full contract and the judgement calls made porting it off the
 * Zustand/Redux source.
 *
 * @param props - {@link LessonVideoModalProps}
 */
const LessonVideoModal = ({
    isOpen,
    onOpenChange,
    video,
    isLoading = false,
}: LessonVideoModalProps) => {
    const playerAndLink = [
        () => <PlayerGap />,
        ...(isLoading
            ? [() => <Typography size="sm" isSkeleton classNames={["w-3/4"]} />]
            : [() => (
                <Typography
                    size="sm"
                    isLink
                    href={video?.url ?? ""}
                    text={video?.url ?? ""}

                />
            )]),
    ]

    const descriptionAndCaption = [
        ...(video?.description?.trim() ? [() => (
            <MarkdownContent
                source={video.description ?? ""}
                measure="compact"


            />
        )] : []),
        ...(video?.caption?.trim() ? [() => (
            <MarkdownContent
                source={video.caption ?? ""}
                measure="compact"


            />
        )] : []),
    ]

    const metaAndPlayer = [
        () => (
            <Cluster
                gap={3}
                justify="center"

                items={[
                    () => (
                        <EnumChip
                            value={video?.kind ?? LessonVideoKind.RawStream}
                            map={KIND_MAP}
                            isSkeleton={isLoading}

                        />
                    ),
                    () => (
                        <InlineIconLabel
                            icon={ClockIcon}
                            tone="default"
                            size="sm"
                            isSkeleton={isLoading}
                            label={formatDuration(video?.durationMs ?? 0)}
                        />
                    ),
                    () => (isLoading ? (
                        <Typography
                            size="sm"
                            color="muted"
                            isSkeleton
                            classNames={["w-1/3"]}

                        />
                    ) : (
                        <Typography
                            size="sm"
                            color="muted"
                            text={HOST_PLATFORM_LABEL[video?.hostPlatform ?? VideoHostPlatform.Youtube]}

                        />
                    )),
                ]}
            />
        ),
        () => <StackV gap={4} align="center" isSkeleton={isLoading} items={playerAndLink} />,
        // ⚠️ Source renders description/caption `text-sm text-muted` (caption also
        // `italic`). `MarkdownContent`'s `className` only reaches its ARTICLE
        // WRAPPER — every child element (`p`, `em`…) hardcodes `text-foreground`
        // inside the viewer itself (§13z: the viewer owns its own tree, out of a
        // caller's reach), so a wrapper-level color/italic class here would be dead
        // code. Left at the composite's default tone rather than shipping a
        // className that silently does nothing — a real, marked gap, not this
        // port's to close (`MarkdownContent` is composite tier, out of scope here).
        ...(!isLoading && (video?.description?.trim() || video?.caption?.trim()) ? [() => (
            <StackV gap={4} isSkeleton={isLoading} items={descriptionAndCaption} />
        )] : []),
    ]

    return (
        <div>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="lg"
                scroll="inside"
                // `ModalShell` now owns its own title skeleton (COMPOSITE-8's `isSkeleton`
                // forwarding) — no more hand-built `Typography` stand-in for the title text.
                isSkeleton={isLoading}
                title={video?.title ?? ""}
                body={() => <StackV gap={6} isSkeleton={isLoading} items={metaAndPlayer} />}
            />
        </div>
    )
}

export { LessonVideoModal }
