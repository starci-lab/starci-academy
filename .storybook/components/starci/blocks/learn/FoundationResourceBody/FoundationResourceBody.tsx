import React from "react"
import { ArrowSquareOutIcon, VideoCameraIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { FeedbackEmpty } from "@sb-components/composites/feedback/Feedback/Feedback"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationResourceBody`: renders ONE foundation resource by its
 * `kind`. Same name as the real `src` feature component
 * (`src/components/features/learn/Foundations/FoundationResourceBody`) — this
 * is the Storybook-driven rebuild of that switch, not a new idea.
 *
 * WHY A BLOCK OVER THE VIEWER/CARD DIRECTLY: neither `SurfaceCard` nor
 * `MarkdownContent` knows a "foundation resource" exists, or that the same slot
 * can hold a document, a video, or a bare link depending on data. The block
 * owns exactly that dispatch — the DOMAIN fact "this resource is a video, not
 * an article" — which is why it sits above the viewer instead of the caller
 * branching on `kind` itself.
 *
 * ⭐ SCOPE CUT (§B3, deliberate this pass) — VIDEO. No video-playback primitive
 * exists anywhere in the inventory (atoms/frames/composites/blocks) — `src`'s
 * `VideoRenderer` picks between a DASH and a standard HTML5 player per URL, a
 * real media engine this pass does not build. Faking it with a `<div>` that
 * "looks like a player" would pass every gate and lie on first render. Instead
 * this leaf draws the CHROME a video resource gets — the same card face the
 * other two kinds sit in — and an HONESTLY LABELED gap via `Feedback.Empty`
 * instead of a stub. This is the exact mistake the file header of
 * `ContentModeNav` warns against, applied on purpose in the other direction: a
 * marked absence, not a silent one.
 *
 * ⭐ DEVIATION FROM `src` (rule 7 — a block never performs a business-decided
 * action itself). The real component calls `window.open(url, "_blank", …)`
 * directly inside its `ExternalLink` branch. That is a side effect a BLOCK
 * does not get to own — whether a link opens in a new tab, inside an in-app
 * browser, or behind a confirmation, is the CALLER's call. This block instead
 * renders the button and hands the URL to `onOpenLink`; the screen decides
 * what "open" means.
 *
 * ⭐ JUDGEMENT CALL — `linkUrl` was not in the brief's prop list, but
 * `onOpenLink: (url: string) => void` cannot be satisfied without one: the
 * block has to hold the destination to pass it along. Added as the DATA path
 * parallel to `linkTitle`, mirroring the real entity's `value` field (URL for
 * `ExternalLink`, markdown for `Document`) — omitting it would leave the prop
 * declared but impossible to honor.
 *
 * 📐 LEAVES = the three `kind`s, because each draws a STRUCTURALLY different
 * tree (card+document vs. card+empty-state vs. a bare button) — not three
 * states of one shape. `isSkeleton` stays a STATE inside each leaf (§11f).
 *
 * ⛔ NO EMPTY-LINK LEAF. Mirrors `src`: an `ExternalLink` with no URL renders
 * NOTHING (matches the source's `if (!value?.trim()) return null`) rather than
 * a disabled button that dangles with no destination — inventing a "broken
 * link" affordance nobody asked for would be §14d.3's forbidden case.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Kind of resource this body renders — mirrors backend `FoundationKind` values 1:1. */
export type FoundationKind = "document" | "video" | "external_link"

/** Props for {@link FoundationResourceBody}. */
export interface FoundationResourceBodyProps {
    /** Which shape to draw — see the file header for why this is three LEAVES, not a state. */
    kind: FoundationKind
    /** The document body, as authored markdown. Read when `kind === "document"`. */
    markdownBody?: string
    /** CTA label for the link button. Read when `kind === "external_link"`. Falls back to a generic label — the block owns its own wording (rule 4). */
    linkTitle?: string
    /**
     * Destination URL for the link button. Read when `kind === "external_link"`.
     * A missing/blank URL renders nothing for this kind, matching `src`.
     */
    linkUrl?: string
    /**
     * Fired with the resolved URL when the reader presses the link button. The
     * CALLER owns what "open" means (new tab, in-app browser, confirmation) —
     * see the file header's rule-7 note.
     */
    onOpenLink?: (url: string) => void
    /**
     * `true` → the parts each leaf owns itself switch to shimmer, mirroring
     * `ContentArticle`'s precedent for this exact `SurfaceCard` + `MarkdownContent`
     * pairing. Only visibly changes the `external_link` leaf's `Button`, since
     * neither `SurfaceCard` nor `Feedback.Empty` is given a `label`/`description`
     * of their own to shimmer here.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Block-owned vocabulary for the video gap — see the file header's §B3 note. */
const VIDEO_GAP_TITLE = "Video chưa dựng được ở khung này"
const VIDEO_GAP_DESCRIPTION =
    "Bộ khung này chưa có primitive phát video nào — phần thẻ xung quanh đã sẵn sàng để cắm trình phát thật vào sau."

/** Fallback CTA label when the caller has no per-resource title to give (rule 4: the block owns its own wording). */
const DEFAULT_LINK_LABEL = "Mở liên kết"

/**
 * Renders one foundation resource by its `kind`. See the file header for the
 * full contract, the video scope cut, and the `onOpenLink` deviation.
 *
 * @param props - {@link FoundationResourceBodyProps}
 */
const FoundationResourceBody = ({
    kind,
    markdownBody,
    linkTitle,
    linkUrl,
    onOpenLink,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: FoundationResourceBodyProps) => {
    if (kind === "video") {
        return (
            <div data-anat-part={anatPart}>
                <SurfaceCard isSkeleton={isSkeleton} anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                    <FeedbackEmpty
                        icon={VideoCameraIcon}
                        title={VIDEO_GAP_TITLE}
                        description={VIDEO_GAP_DESCRIPTION}
                        anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
                    />
                </SurfaceCard>
            </div>
        )
    }

    if (kind === "external_link") {
        // Matches `src`: a link with nothing to point at renders nothing, rather
        // than a button that dangles with no destination (see file header).
        if (linkUrl == null || linkUrl.trim().length === 0) {
            return null
        }
        const destination = linkUrl
        return (
            <div data-anat-part={anatPart}>
                <Button
                    label={linkTitle ?? DEFAULT_LINK_LABEL}
                    variant="primary"
                    suffixIcon={ArrowSquareOutIcon}
                    isSkeleton={isSkeleton}
                    onPress={() => onOpenLink?.(destination)}
                    anatPart={showAnatomy ? "Button" : undefined}
                />
            </div>
        )
    }

    // "document" — the reading article, same card face the lesson body reads
    // in (matches `src`'s `Card`/`CardContent` wrapper for this kind).
    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard isSkeleton={isSkeleton} anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                <MarkdownContent
                    source={markdownBody ?? ""}
                    measure="reading"
                    anatPart={showAnatomy ? "MarkdownContent" : undefined}
                />
            </SurfaceCard>
        </div>
    )
}

export { FoundationResourceBody }
