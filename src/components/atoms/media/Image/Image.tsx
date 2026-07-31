import { useEffect, useState } from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { ImageIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * `Image` — framed image wrapping `<img>` (HeroUI v3 has no Image component).
 * Manages its own load state:
 *   - loading → skeleton overlay, image hidden until `onLoad`.
 *   - loaded  → image shown.
 *   - error/empty → `fallbackSrc` if given, otherwise a placeholder glyph.
 *
 * `isSkeleton` forces the skeleton from outside (e.g. while a parent is still
 * fetching data), in addition to the internal loading state.
 */

/** Common frame ratios → aspect class. */
const RATIO_CLS: Record<NonNullable<ImageBaseProps["ratio"]>, string> = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    portrait: "aspect-[3/4]",
    photo: "aspect-[4/3]",
}

/** Frame corner radius → radius class. */
const RADIUS_CLS = {
    none: "rounded-none",
    md: "rounded-lg",
    lg: "rounded-2xl",
    full: "rounded-full",
} as const

/** Props for {@link ImageBase}. */
export interface ImageBaseProps {
    /** Image URL. `null`/empty is treated as an error and falls back. */
    src?: string | null
    /** Alt text (required for accessibility). */
    alt: string
    /** Frame aspect ratio. Omit to not force a ratio (falls back to className/image). */
    ratio?: "square" | "video" | "wide" | "portrait" | "photo"
    /** How the image fills the frame. Default `cover`. */
    fit?: "cover" | "contain"
    /** Frame corner radius. Default `lg`. */
    radius?: keyof typeof RADIUS_CLS
    /** Replacement image on error/empty. Omit to show a placeholder glyph (`ImageIcon`) instead. */
    fallbackSrc?: string
    /** Native loading strategy. Default `lazy`; use `eager` for above-the-fold images. */
    loading?: "lazy" | "eager"
    /** Forces the skeleton state from outside, in addition to internal loading. */
    isSkeleton?: boolean
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * The framed image atom. See file header for the load/fallback contract.
 * @param props - {@link ImageBaseProps}
 */
const ImageBase = ({ src, alt, ratio, fit = "cover", radius = "lg", fallbackSrc, loading = "lazy", isSkeleton = false, className, classNames }: ImageBaseProps) => {
    // Internal load state; resets to "loading" whenever `src` changes.
    const [status, setStatus] = useState<"loading" | "loaded" | "error">(src ? "loading" : "error")
    useEffect(() => {
        setStatus(src ? "loading" : "error")
    }, [src])

    const isError = status === "error" || !src
    const showFallbackImg = isError && fallbackSrc != null
    const showFallbackGlyph = isError && fallbackSrc == null
    const showSkeleton = !isError && (isSkeleton || status === "loading")

    const frameCls = cn(
        "bg-surface-secondary relative overflow-hidden",
        ratio != null && RATIO_CLS[ratio],
        RADIUS_CLS[radius],
        "w-full",
        className,
        classNames,
    )
    const imgFit = fit === "cover" ? "object-cover" : "object-contain"

    return (
        <div className={frameCls}>
            {showSkeleton ? (
                <HeroSkeleton className="absolute inset-0 size-full" />
            ) : null}

            {showFallbackGlyph ? (
                <div className="text-muted absolute inset-0 flex items-center justify-center">
                    {/* Glyph scales with the frame (1/4), floored at `size-5` so
                        weight stays `regular` and the icon never shrinks away. */}
                    <ImageIcon className="size-1/4 max-h-10 max-w-10 min-h-5 min-w-5" aria-hidden />
                    <span className="sr-only">{alt}</span>
                </div>
            ) : (
                <img
                    // Keyed by src so a stale image's onLoad/onError can't land on the new one.
                    key={showFallbackImg ? fallbackSrc : src ?? "none"}
                    src={showFallbackImg ? fallbackSrc : (src ?? undefined)}
                    alt={alt}
                    loading={loading}
                    onLoad={() => setStatus("loaded")}
                    onError={() => setStatus("error")}
                    className={cn("size-full", imgFit, status === "loading" && "opacity-0")}
                />
            )}
        </div>
    )
}

/**
 * `Image` — framed-image atom. Wraps `<img>` with a loading skeleton and a
 * fallback on error/empty. Used directly as `<Image …/>`.
 */
export { ImageBase as Image }
