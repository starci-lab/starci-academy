import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — a faithful, dependency-light port of
 * `src/components/blocks/media/CoverImage`, authored in Storybook (NOT `src`)
 * and synced back to `src` later. No `@/components` imports.
 */

/** Props for the {@link CoverImage} block. */
export interface CoverImageProps {
    /** Image source URL (null/undefined → empty framed surface). */
    src?: string | null
    /** Accessible alt text. */
    alt: string
    /** `true` → shimmer the SAME frame (aspect-video/rounded-2xl footprint), no `<img>` mounted. */
    isSkeleton?: boolean
    /** Extra classes on the frame. */
    className?: string
    /** Anatomy tag: names the ROOT part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** `true` → tag the skeleton box with `data-anat-part="Skeleton"`. */
    showAnatomy?: boolean
}

/**
 * A framed cover/thumbnail image: fixed 16:9 box, rounded surface, lazy-loaded,
 * `object-cover` so any aspect fills cleanly. Owns the whole look (radius /
 * surface / crop) so features pass only `src` + `alt`. Reusable for course /
 * blog / changelog covers.
 *
 * @param props - {@link CoverImageProps}
 */
const CoverImageBase = ({
    src,
    alt,
    isSkeleton = false,
    className,
    anatPart,
    showAnatomy = false,
}: CoverImageProps) => {
    if (isSkeleton) {
        // Skeleton CO-LOCATED (§12c): no wrapper — the shimmer box IS the whole
        // root, so it doubles as both the ROOT (`anatPart`) and the leaf skeleton
        // (`"Skeleton"`); `anatPart` wins when a parent has named this node
        // (matches `IconTile`'s single-node skeleton branch).
        return (
            <HeroSkeleton
                className={cn("aspect-video w-full rounded-2xl", className)}
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
            />
        )
    }
    return (
        <div
            className={cn("aspect-video w-full overflow-hidden rounded-2xl bg-surface-secondary", className)}
            data-anat-part={anatPart}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="size-full object-cover"
                />
            ) : null}
        </div>
    )
}

/** `CoverImage.*` — framed cover/thumbnail image. */
export { CoverImageBase as CoverImage }
