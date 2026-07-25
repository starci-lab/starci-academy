import { useEffect, useState } from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { ImageIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Image.Base`: framed image bọc `<img>` (HeroUI v3 KHÔNG có Image nên tự
 * thân), TỰ lo skeleton lúc fetch (như HeroUI v2 Image) + fallback khi lỗi/rỗng.
 *
 * 3 trạng thái tải (atom tự quản, hybrid C — không đẩy lên consumer):
 *   • loading  → HeroUI Skeleton phủ khung (ảnh opacity-0 tới khi onLoad).
 *   • loaded   → ảnh hiện.
 *   • error/rỗng → `fallbackSrc` (nếu có) hoặc glyph ảnh trên surface — KHÔNG
 *     bao giờ để khung trắng trống.
 *
 * `isSkeleton` = ép skeleton từ NGOÀI (parent còn fetch data) — cộng dồn với
 * loading nội bộ. STRICT §4: consumer chỉ truyền `src`/`alt`/tỉ-lệ, không đụng
 * cấu trúc khung. Icon lib = `@phosphor-icons/react` (MỘT bộ duy nhất, §5.0);
 * weight theo size (§5.0a): glyph fallback luôn ≥ `size-5` nên giữ `regular`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Tỉ lệ khung phổ biến → aspect class. */
const RATIO_CLS: Record<NonNullable<ImageBaseProps["ratio"]>, string> = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    portrait: "aspect-[3/4]",
    photo: "aspect-[4/3]",
}

/** Bo góc khung → radius class (khớp scale card §). */
const RADIUS_CLS = {
    none: "rounded-none",
    md: "rounded-lg",
    lg: "rounded-2xl",
    full: "rounded-full",
} as const

/** Props for {@link ImageBase}. */
export interface ImageBaseProps {
    /** URL ảnh. `null`/rỗng → coi như lỗi → fallback. */
    src?: string | null
    /** Alt text (bắt buộc cho a11y). */
    alt: string
    /** Tỉ lệ khung. Bỏ trống → không ép tỉ lệ (theo className/ảnh). */
    ratio?: "square" | "video" | "wide" | "portrait" | "photo"
    /** Cách lấp khung. Default `cover`. */
    fit?: "cover" | "contain"
    /** Bo góc khung. Default `lg`. */
    radius?: keyof typeof RADIUS_CLS
    /** Ảnh thay thế khi lỗi/rỗng. Bỏ trống → glyph ảnh (`ImageIcon`) trên surface. */
    fallbackSrc?: string
    /** Chiến lược tải native. Default `lazy` (perf cover-image); `eager` khi ảnh above-the-fold. */
    loading?: "lazy" | "eager"
    /** Ép skeleton từ ngoài (parent còn fetch). Cộng dồn loading nội bộ. */
    isSkeleton?: boolean
    /** `true` → tag `data-anat-part` cho BlockAnatomy panel. */
    showAnatomy?: boolean
    className?: string
}

/**
 * The framed image atom. See file header for the load/fallback contract.
 * @param props - {@link ImageBaseProps}
 */
const ImageBase = ({ src, alt, ratio, fit = "cover", radius = "lg", fallbackSrc, loading = "lazy", isSkeleton = false, showAnatomy = false, className }: ImageBaseProps) => {
    // Trạng thái tải nội bộ; reset về "loading" mỗi khi `src` đổi.
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
    )
    const imgFit = fit === "cover" ? "object-cover" : "object-contain"

    return (
        <div className={frameCls} data-anat-part={showAnatomy ? "Frame" : undefined}>
            {showSkeleton ? (
                <HeroSkeleton className="absolute inset-0 size-full" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
            ) : null}

            {showFallbackGlyph ? (
                <div className="text-muted absolute inset-0 flex items-center justify-center" data-anat-part={showAnatomy ? "Fallback" : undefined}>
                    {/* Glyph co theo khung (1/4), CHẶN SÀN `min-*-5` = size-5 để luôn ở nấc
                        weight `regular` (§5.0a: dưới size-5 mới phải bold) và không teo mất hình. */}
                    <ImageIcon className="size-1/4 max-h-10 max-w-10 min-h-5 min-w-5" aria-hidden />
                    <span className="sr-only">{alt}</span>
                </div>
            ) : (
                <img
                    // key theo src để onLoad/onError của ảnh cũ không rớt vào ảnh mới
                    key={showFallbackImg ? fallbackSrc : src ?? "none"}
                    src={showFallbackImg ? fallbackSrc : (src ?? undefined)}
                    alt={alt}
                    loading={loading}
                    onLoad={() => setStatus("loaded")}
                    onError={() => setStatus("error")}
                    className={cn("size-full", imgFit, status === "loading" && "opacity-0")}
                    data-anat-part={showAnatomy ? "Img" : undefined}
                />
            )}
        </div>
    )
}

/**
 * `Image` — framed-image atom. Bọc `<img>` với skeleton lúc fetch + fallback khi
 * lỗi/rỗng (media primitive như CoverImage compose nó).
 *
 * §12a: root GỌI THẲNG được (`<Image …/>`); `Image.Base` chỉ là alias giữ cho
 * call-site cũ — atom này một hình thái nên không mở thêm member.
 */
export const Image = Object.assign(ImageBase, {
    Base: ImageBase,
})
