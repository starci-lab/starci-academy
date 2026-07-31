import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

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
     * Extra classes on the frame.
     * @deprecated pass `classNames` instead — a free string cannot be constrained.
     */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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
    classNames,
}: CoverImageProps) => {
    if (isSkeleton) {
        return (
            <HeroSkeleton
                className={cn("aspect-video w-full rounded-2xl", className, classNames)}
            />
        )
    }
    return (
        <div
            className={cn("aspect-video w-full overflow-hidden rounded-2xl bg-surface-secondary", className, classNames)}
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
