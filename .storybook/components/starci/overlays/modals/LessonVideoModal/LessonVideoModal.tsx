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
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `LessonVideoModal`: the fullscreen "watch this lesson video" dialog,
 * opened from anywhere in the app (a lesson's video tab, a related-video card).
 *
 * OVERLAY, PRESENTATIONAL ONLY (Rule 13 / canon §11a "screen owns overlay
 * store"). The real `src/components/modals/LessonVideoModal/index.tsx` reads
 * `isOpen`/`setOpen` off `useLessonVideoOverlayState()` (Zustand) and the video
 * entity off Redux (`state.lessonVideo.entity`) directly — that wiring is
 * APP-LEVEL, same discipline as a page never wiring its own router. This port
 * takes the same two things as PLAIN PROPS instead (`isOpen`/`onOpenChange`),
 * plus a typed `video` prop for the entity. The caller — the real overlay-store
 * hook, in `src` — is responsible for supplying both.
 *
 * WHY IT EARNS A BLOCK LAYER (not a bare `ModalShell` call from the screen): it
 * decides the DOMAIN shape of a lesson video — a kind (raw/edited/premium), a
 * duration, a host platform, a player, an external link, and two optional
 * markdown fields — and the ORDER they read in: meta row, then player, then
 * commentary. None of `ModalShell`/`EnumChip`/`InlineIconLabel`/`MarkdownContent`
 * know any of that; each only knows its own single slot.
 *
 * `LessonVideoKind`/`VideoHostPlatform` are LOCAL mirrors of the `src` enums
 * (`@/modules/types/enums/lesson-video-kind`, `.../video-host-platform`) — this
 * port stays self-contained, no `@/components`/`@/modules` imports.
 *
 * PLAYER ENGINE OUT OF SCOPE (§B3 scope discipline) — SAME CUT, SAME FIX AS
 * `FoundationResourceBody`'s `kind === "video"` leaf. The real player
 * (`VideoRenderer` — YouTube/MPEG-DASH/standard `<video>` per host platform) is
 * a runtime with its own state machine; porting it is a separate piece of work,
 * not a detail of this dialog. `PlayerGap` below REUSES that exact precedent
 * rather than inventing a new one: `SurfaceCard` (`aspect-video` card face) +
 * `EmptyState` (icon + honest title/description) — both real composites with
 * their own stories, so the gap is a first-class, traceable node in the anatomy
 * tree instead of a bare hand-rolled `<div>` that looks like a player and lies
 * on first render.
 *
 * KIND CHIP TONE — `warning` for all three {@link LessonVideoKind} values,
 * mirroring the real `LessonVideoKindChip` (a "production stage" badge, not a
 * pass/fail signal, so it never reads as success/danger). The real chip also
 * carries a per-kind icon (Twitch/Sparkle/FilmReel) and a tooltip explaining the
 * stage; the tooltip is kept (real content, from `src/messages/vi.json`), the
 * icon is dropped — `EnumChip`'s local port here has no icon channel, and this
 * dialog's meta row is text/icon-label already, so a third icon source would
 * compete rather than add information.
 *
 * HOST PLATFORM IS PLAIN TEXT, NOT A CHIP. The real component reads it via
 * `t(HOST_PLATFORM_LABEL_KEY[...])` into a bare muted `<span>` — never a chip —
 * so this port matches: `Typography` `size="sm"` `color="muted"`, exactly like
 * the source's `text-sm text-muted`. `VideoHostPlatform.Other` has NO key under
 * `videoHostPlatform.*` in `src/messages/vi.json` (only youtube/googleDrive/
 * vimeo/cloudflareStream exist) — a real content gap upstream, not something to
 * silently fake here. Judgement call: fall back to the app's generic "Other"
 * (used the same way elsewhere in `vi.json`) rather than throw, since this is a
 * passive label, not a `EnumChip` map that must fail loudly on an unhandled key.
 *
 * EXTERNAL LINK HAS NO ICON (unlike the source's `LinkIcon`-suffixed `Link`).
 * The shared `Typography` atom's `isLink` branch is HeroUI `Link`-only — it
 * explicitly does not compose a prefix/suffix icon alongside `isLink` (see its
 * own doc comment: "No weight/icon alongside"). Matches this run's leaf list
 * (`Typography(isLink, external url)`, no icon), so nothing was lost porting it.
 *
 * `isLoading` IS A PROPOSED ADDITION — the source has no loading branch (Redux
 * either has the entity or it doesn't, synchronously). Kept because a real
 * caller opens this dialog on a click, before the video entity necessarily
 * resolves from the network. Judgement call: flip every leaf that HAS a
 * skeleton mirror (`EnumChip`, `InlineIconLabel`, `Typography`) to it; the two
 * `MarkdownContent` leaves have NO skeleton mirror of their own (view the
 * composite — it only knows `source`/`measure`), so they are withheld entirely
 * while loading rather than rendered against stale/empty text, mirroring how
 * `ContentPaywall` withholds a section it cannot skeleton faithfully. `PlayerGap`
 * stays static either way — it is scope chrome, not data.
 * ─────────────────────────────────────────────────────────────────────────────
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
    const playerAndLink = (
        <>
            <PlayerGap />
            {isLoading ? (
                <Typography size="sm" isSkeleton classNames={["w-3/4"]} />
            ) : (
                <Typography
                    size="sm"
                    isLink
                    href={video?.url ?? ""}
                    text={video?.url ?? ""}

                />
            )}
        </>
    )

    const descriptionAndCaption = (
        <>
            {video?.description?.trim() ? (
                <MarkdownContent
                    source={video.description}
                    measure="compact"


                />
            ) : null}
            {video?.caption?.trim() ? (
                <MarkdownContent
                    source={video.caption}
                    measure="compact"


                />
            ) : null}
        </>
    )

    const metaAndPlayer = (
        <>
            <Cluster
                gap={3}
                justify="center"

                items={[
                    {
                        key: "kind",
                        content: (
                            <EnumChip
                                value={video?.kind ?? LessonVideoKind.RawStream}
                                map={KIND_MAP}
                                isSkeleton={isLoading}

                            />
                        ),
                    },
                    {
                        key: "duration",
                        content: (
                            <InlineIconLabel
                                icon={ClockIcon}
                                tone="default"
                                size="sm"
                                isSkeleton={isLoading}

                            >
                                {formatDuration(video?.durationMs ?? 0)}
                            </InlineIconLabel>
                        ),
                    },
                    {
                        key: "hostPlatform",
                        content: isLoading ? (
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
                        ),
                    },
                ]}
            />
            <StackV gap={4} align="center" body={playerAndLink} />
            {!isLoading && (video?.description?.trim() || video?.caption?.trim()) ? (
                // ⚠️ Source renders description/caption `text-sm text-muted` (caption also
                // `italic`). `MarkdownContent`'s `className` only reaches its ARTICLE
                // WRAPPER — every child element (`p`, `em`…) hardcodes `text-foreground`
                // inside the viewer itself (§13z: the viewer owns its own tree, out of a
                // caller's reach), so a wrapper-level color/italic class here would be dead
                // code. Left at the composite's default tone rather than shipping a
                // className that silently does nothing — a real, marked gap, not this
                // port's to close (`MarkdownContent` is composite tier, out of scope here).
                <StackV gap={4} body={descriptionAndCaption} />
            ) : null}
        </>
    )

    return (
        <div>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="lg"
                scroll="inside"
                title={
                    // `ModalShell` has no `isSkeleton` of its own (composite tier, out of scope
                    // here) — the block calls the atom directly with the title's real weight and
                    // feeds the result into the slot, same idiom as `ContentHeader`'s `PageHeader`
                    // title skeleton.
                    isLoading ? (
                        <Typography weight="bold" isSkeleton />
                    ) : (
                        video?.title ?? ""
                    )
                }

            >
                <StackV gap={6} body={metaAndPlayer} />
            </ModalShell>
        </div>
    )
}

export { LessonVideoModal }
