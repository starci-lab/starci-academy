"use client"

import React, { useEffect, useState } from "react"
import type { ComponentType, SVGProps } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/IconTile`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** Visual tone of the tile (drives the tinted background + icon colour). */
export type IconTileTone = "accent" | "success" | "warning" | "danger" | "neutral"

/** Size of the tile. */
export type IconTileSize = "sm" | "md" | "lg"

/**
 * Hình khung — vuông bo góc hay TRÒN. Mặc định TRÒN (thầy chốt 2026-07-26:
 * "tròn tròn nhìn duyên hơn"): tile đứng MỘT MÌNH giữa khoảng trống (empty state,
 * đầu dialog) không có cạnh nào quanh để canh, nên tròn đọc mềm hơn vuông.
 *  hợp khi tile xếp hàng cùng cạnh thẳng khác.
 *
 * Đây là ATOM nên mở trục hình ở đây ĐÚNG chỗ — §14d.1 chỉ cấm design trở lên.
 */
export type IconTileShape = "square" | "circle"

/** Hai nấc weight cho glyph — khớp §5.0a (glyph nhỏ hơn `size-5` mới cần `bold`). */
export type IconWeight = "regular" | "bold"

/**
 * Icon truyền vào dạng COMPONENT (vd `GraduationCapIcon`), atom tự render + tự ép
 * scale ở cỡ tile. Kiểu để MỞ (`SVGProps` + `weight` tuỳ chọn), KHÔNG khai `Icon`
 * của Phosphor — khai chặt theo một thư viện là khoá cả cây vào một nhà cung cấp (§5.0).
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/** Props chung — TRỪ cặp `icon`/`isSkeleton`, xem {@link IconTileProps}. */
interface IconTileOwnProps {
    /**
     * Optional cover image. When set, it FILLS the tile (`object-cover`, centered —
     * a 16:9 source is cropped to the square frame) instead of the icon; falls back
     * to `icon` when absent/empty.
     */
    src?: string | null
    /** Alt text for the cover image (decorative tile — usually the entity title). */
    alt?: string
    /** Tinted background + icon colour. Defaults to "accent". */
    tone?: IconTileTone
    /** Tile size. Defaults to "md" (64px). */
    size?: IconTileSize
    /** Hình khung — xem {@link IconTileShape}. Default . */
    shape?: IconTileShape
    /** `true` → gắn `data-anat-part` cho từng part để BlockAnatomy badge. */
    showAnatomy?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    className?: string
}

/**
 * `icon` BẮT BUỘC khi render tile thật, KHÔNG cần khi `isSkeleton` — ô shimmer
 * không có icon bên trong. Cùng khuôn union với `ChipBaseProps`/`TypographyProps`
 * (§12c: nội dung optional-khi-skeleton bằng UNION, không hạ optional đại trà).
 */
export type IconTileProps = IconTileOwnProps &
    (
        | {
            /** `true` → render ô shimmer đúng cỡ + đúng `shape` của tile, thay cho nội dung. */
            isSkeleton: true
            /** The icon component (vd phosphor `*Icon`) — fallback when no {@link IconTileOwnProps.src}. */
            icon?: IconComponent
        }
        | {
            isSkeleton?: false
            /** The icon component (vd phosphor `*Icon`) — fallback when no {@link IconTileOwnProps.src}. */
            icon: IconComponent
        }
    )

/** tone → tinted background + icon colour. */
const TONE: Record<IconTileTone, string> = {
    accent: "bg-accent-soft text-accent-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    danger: "bg-danger-soft text-danger-soft-foreground",
    neutral: "bg-default text-muted",
}

/** shape → bo góc. `circle` là MẶC ĐỊNH. */
const SHAPE: Record<IconTileShape, string> = {
    circle: "rounded-full",
    square: "rounded-2xl",
}

/**
 * size → HỘP tile (bo góc do {@link SHAPE} lo, không trộn vào đây).
 *
 * Mặc định `sm` = `size-12` + icon `size-5` (thầy chốt 2026-07-26) — cặp chuẩn cho
 * empty state. Icon là HÀM của size, caller không chỉnh riêng (§12d) — xem
 * {@link SIZE_ICON}.
 */
const SIZE_BOX: Record<IconTileSize, string> = {
    sm: "size-12",
    md: "size-16",
    lg: "size-20",
}

/**
 * size → cỡ ICON bên trong. Cả ba nấc đều `size-5` trở lên ⇒ theo §5.0a KHÔNG truyền
 * `weight` (glyph tự nhiên `regular`) — chỉ glyph dưới `size-5` mới cần ép `bold`, và
 * IconTile không có nấc nào nhỏ đến thế.
 */
const SIZE_ICON: Record<IconTileSize, string> = {
    sm: "size-5",
    md: "size-6",
    lg: "size-8",
}

/**
 * A framed icon tile — a soft tinted square (`bg-{tone}/20`) with the icon
 * centered inside, used as the avatar of a *thing* (course, project, section…)
 * to give it breathing room and a consistent identity. The icon auto-sizes and
 * inherits the tone colour; pass the icon COMPONENT (not JSX) and the tile
 * renders + scales it itself. Pure/props-only; owns its look.
 *
 * @param props - {@link IconTileProps}
 */
const IconTileBase = ({
    icon: Icon,
    src,
    alt = "",
    tone = "accent",
    shape = "circle",
    size = "sm",
    isSkeleton = false,
    className,
    showAnatomy = false,
    anatPart,
}: IconTileProps) => {
    // a broken cover URL (404 / unsynced asset) falls back to the icon instead of a
    // broken-image glyph; reset when the src changes.
    const [failed, setFailed] = useState(false)
    useEffect(() => setFailed(false), [src])
    const showImage = Boolean(src) && !failed

    // Skeleton CO-LOCATED (§12c): tile là một Ô ĐẶC (icon/ảnh lấp đầy nó), nên gạch
    // shimmer chính là cả ô — đúng cỡ {@link SIZE_BOX} + đúng {@link SHAPE} (mặc định
    // tròn). Xét TRƯỚC mọi nhánh rẽ hình (icon vs ảnh) để không lộ nội dung thật.
    if (isSkeleton) {
        return (
            <HeroSkeleton
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
                className={cn("shrink-0", SIZE_BOX[size], SHAPE[shape], className)}
            />
        )
    }

    return (
        <div
            aria-hidden
            data-anat-part={anatPart ?? (showAnatomy ? "Tile" : undefined)}
            className={cn(
                "flex shrink-0 items-center justify-center overflow-hidden",
                SIZE_BOX[size],
                SHAPE[shape],
                // skip the tint when a cover image fills the tile
                showImage ? null : TONE[tone],
                className,
            )}
        >
            {showImage ? (
                <img
                    src={src ?? undefined}
                    alt={alt}
                    data-anat-part={showAnatomy ? "Cover" : undefined}
                    className="size-full object-cover"
                    onError={() => setFailed(true)}
                />
            ) : Icon ? (
                <span aria-hidden data-anat-part={showAnatomy ? "Icon" : undefined} className="inline-flex shrink-0">
                    {/* Atom sở hữu scale glyph (§4): SIZE_ICON đã ≥ size-5 ở cả ba nấc nên
                        không truyền `weight` (§5.0a — chỉ glyph < size-5 mới ép "bold"). */}
                    <Icon className={SIZE_ICON[size]} />
                </span>
            ) : null}
        </div>
    )
}

/** `IconTile.*` — framed icon-tile namespace. */
export const IconTile = Object.assign(IconTileBase, {
    Base: IconTileBase,
})
