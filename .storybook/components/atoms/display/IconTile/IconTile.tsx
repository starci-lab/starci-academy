"use client"

import React, { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/IconTile`. Authored in Storybook (not `src`);
 * synced to `src` later. The shared `WithClassNames` base is inlined locally to
 * keep the port free of `@/` imports.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

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

/** Props chung — TRỪ cặp `icon`/`isSkeleton`, xem {@link IconTileProps}. */
interface IconTileOwnProps extends WithClassNames<undefined> {
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
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
            /** The icon (phosphor `*Icon`) — fallback when no {@link IconTileOwnProps.src}. */
            icon?: ReactNode
        }
        | {
            isSkeleton?: false
            /** The icon (phosphor `*Icon`) — fallback when no {@link IconTileOwnProps.src}. */
            icon: ReactNode
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
 * size → cỡ ICON bên trong (tách khỏi {@link SIZE_BOX} để skeleton dùng lại được
 * đúng hộp — gạch shimmer không có svg nào bên trong nên không cần selector này).
 */
const SIZE_ICON: Record<IconTileSize, string> = {
    sm: "[&_svg]:size-5",
    md: "[&_svg]:size-6",
    lg: "[&_svg]:size-8",
}

/**
 * A framed icon tile — a soft tinted square (`bg-{tone}/20`) with the icon
 * centered inside, used as the avatar of a *thing* (course, project, section…)
 * to give it breathing room and a consistent identity. The icon auto-sizes and
 * inherits the tone colour; pass it bare. Pure/props-only; owns its look.
 *
 * @param props - {@link IconTileProps}
 */
const IconTileBase = ({
    icon,
    src,
    alt = "",
    tone = "accent",
    shape = "circle",
    size = "sm",
    isSkeleton = false,
    className,
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
                data-anat-part={anatPart}
                className={cn("shrink-0", SIZE_BOX[size], SHAPE[shape], className)}
            />
        )
    }

    return (
        <div
            aria-hidden
            data-anat-part={anatPart}
            className={cn(
                "flex shrink-0 items-center justify-center overflow-hidden",
                SIZE_BOX[size],
                SIZE_ICON[size],
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
                    className="size-full object-cover"
                    onError={() => setFailed(true)}
                />
            ) : (
                icon
            )}
        </div>
    )
}

/** `IconTile.*` — framed icon-tile namespace. */
export const IconTile = Object.assign(IconTileBase, {
    Base: IconTileBase,
})
