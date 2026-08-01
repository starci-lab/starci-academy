import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * Storybook-local port of `src/components/blocks/media/CoverImage`. Does not
 * import from `@/components`.
 */

/** Props for the {@link CoverImage} block. */
export interface CoverImageProps {
    /** Image source URL (null/undefined → empty framed surface). */
    src?: string | null
    /** Accessible alt text. */
    alt: string
    /** `true` → shimmer the SAME frame (aspect-video/rounded-2xl footprint), no `<img>` mounted. */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
    /** `true` → tag the root with ``. */
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
    classNames,
}: CoverImageProps) => {
    if (isSkeleton) {
        // No wrapper: the shimmer box is both the root and the leaf skeleton.
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="CoverImage"
                className={cn("aspect-video w-full rounded-2xl", classNames)}

            />
        )
    }
    return (
        <div
            data-tier="atom"
            data-component="CoverImage"
            className={cn("aspect-video w-full overflow-hidden rounded-2xl bg-surface-secondary", classNames)}

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

export const meta = { tier: "atom", name: "CoverImage" } as const
