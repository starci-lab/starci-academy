import { useEffect, useState } from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { ImageIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `Image`: framed image wrapping `<img>`, handling its own skeleton while fetching +
 * a fallback on error/empty. Icon lib = `@phosphor-icons/react`. It composes no atom with its
 * own story ⇒ LEAF ATOM. `Frame`/`Img`/`Fallback` are internal slots, not components with a
 * home to jump to — no badge. `Skeleton` is HeroUI's own `Skeleton` rendered straight
 * through, so it gets a badge + `annotate: { "Skeleton": { tier: "heroui" } }` — the panel
 * only accepts a node with a `storyId` or `tier: "heroui"`.
 * 
 * TWO LEAVES (split by structure):
 *   • `WithImage` — the tree has an `Img` node. Loaded · loading (skeleton overlay) · using
 *     `fallbackSrc` · every `ratio`/`radius`/`fit` share the same DOM tree ⇒ states/variants
 *     inside ONE leaf, not separate stories.
 *   • `FallbackGlyph` — the `Img` node disappears, replaced by a `Fallback` node. A lost node
 *     ⇒ genuinely the second leaf.
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
const ImageBase = ({
    src,
    alt,
    ratio,
    fit = "cover",
    radius = "lg",
    fallbackSrc,
    loading = "lazy",
    isSkeleton = false,
    classNames,
}: ImageBaseProps) => {
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
        classNames,
    )
    const imgFit = fit === "cover" ? "object-cover" : "object-contain"

    return (
        // `Frame` (this wrapper) and `Img` below are internal geometry of this
        // atom, not badged.
        <div data-tier="atom" data-component="Image" className={frameCls}>
            {showSkeleton ? (
                // Renders a real HeroUI `Skeleton` — badged and declared `tier: "heroui"` in the story's `annotate`.
                <HeroSkeleton
                    className="absolute inset-0 size-full"

                />
            ) : null}

            {showFallbackGlyph ? (
                // Plain div holding the glyph — internal geometry, not badged.
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

export const meta = { tier: "atom", name: "Image" } as const
