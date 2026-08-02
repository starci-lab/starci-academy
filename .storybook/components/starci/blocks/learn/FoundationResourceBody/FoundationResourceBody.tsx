import React from "react"
import { ArrowSquareOutIcon, VideoCameraIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * `FoundationResourceBody` — renders one foundation resource by `kind`: a markdown
 * article, a video slot (drawn as the card chrome plus an honest `EmptyState` gap,
 * since no video-playback primitive exists), or an "open link" button. `onOpenLink`
 * hands the resolved URL up to the screen rather than opening it here. Three
 * structural shapes, one per kind; `isSkeleton` is a state inside each.
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
     * neither `SurfaceCard` nor `EmptyState` is given a `label`/`description`
     * of their own to shimmer here.
     */
    isSkeleton?: boolean
}

/** Block-owned vocabulary for the video gap — see the file header's §B3 note. */
const VIDEO_GAP_TITLE = "Video can't be built in this frame yet"
const VIDEO_GAP_DESCRIPTION =
    "This frame has no video-playback primitive yet — the surrounding card is ready to plug in a real player later."

/** Fallback CTA label when the caller has no per-resource title to give (rule 4: the block owns its own wording). */
const DEFAULT_LINK_LABEL = "Open link"

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
}: FoundationResourceBodyProps) => {
    if (kind === "video") {
        return (
            <div>
                <SurfaceCard
                    isSkeleton={isSkeleton}

                    body={() => (
                        <EmptyState
                            icon={VideoCameraIcon}
                            title={VIDEO_GAP_TITLE}
                            description={VIDEO_GAP_DESCRIPTION}

                        />
                    )}
                />
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
            <div>
                <Button
                    label={linkTitle ?? DEFAULT_LINK_LABEL}
                    variant="primary"
                    suffixIcon={ArrowSquareOutIcon}
                    isSkeleton={isSkeleton}
                    onPress={() => onOpenLink?.(destination)}

                />
            </div>
        )
    }

    // "document" — the reading article, same card face the lesson body reads
    // in (matches `src`'s `Card`/`CardContent` wrapper for this kind).
    return (
        <div>
            <SurfaceCard
                isSkeleton={isSkeleton}

                body={() => (
                    <MarkdownContent
                        source={markdownBody ?? ""}
                        measure="reading"

                    />
                )}
            />
        </div>
    )
}

export { FoundationResourceBody }
