import { Avatar as HeroAvatar, AvatarFallback as HeroAvatarFallback, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { AvatarBase, SIZE_MAP } from "./AvatarBase"
import type { AvatarSize, IconComponent } from "./AvatarBase"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Avatar.Group`: cụm avatar chồng mép ("who follows"): hàng avatar viền
 * `ring` + chip "+N" đếm phần dư. Khung `blocks/identity/AvatarGroup` xoá
 * 2026-07-25 (§13c — chỉ là atom mặc áo), năng lực chuyển XUỐNG đây thành MEMBER
 * của atom.
 *
 * ⭐ COMPONENT DUY NHẤT trong họ Avatar CÓ DEPS: nó `import { AvatarBase }` ở trên
 * (tách file 2026-07-26 để quan hệ này là `import` THẬT, cây deps đọc ra được).
 *
 *   • §12b — `items` DỮ LIỆU, cấm `children`; atom tự dựng từng `Avatar.Base`.
 *   • §12d — `size` đặt ở CẤP CỤM (hàng avatar luôn đồng cỡ), item không mang size.
 *   • §12c — `isSkeleton` truyền xuống, mỗi item tự mirror → giữ nguyên footprint.
 * ─────────────────────────────────────────────────────────────────────────── */

/** One avatar in an {@link AvatarGroup} row. */
export interface AvatarGroupItem {
    /** Stable key for the list. */
    key: string
    /** Uploaded image URL. Absent → generated (DiceBear) avatar, then initials/icon. */
    src?: string
    /** Stable identity to seed the generated avatar (email/username). Falls back to `name`. */
    seed?: string
    /** Display name: image `alt` + the initials fallback. */
    name?: string
    /** Fallback glyph as a COMPONENT reference (only reached once `fallback` allows it). */
    icon?: IconComponent
}

/** Props for {@link AvatarGroup}. */
export interface AvatarGroupProps {
    /** Avatars in display order. */
    items: Array<AvatarGroupItem>
    /** How many avatars to show before the "+N" overflow chip. Default `5`. */
    max?: number
    /**
     * Real total the row stands for — drives "+N" when the caller only loaded the
     * first page of members. Defaults to `items.length`.
     */
    total?: number
    /** Size preset for EVERY avatar in the row (§12d, cluster-level). Default `sm`. */
    size?: AvatarSize
    /** Render the row skeleton — each visible slot mirrors as a circle shimmer. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/** Ring that separates one overlapping avatar from the one beneath it. */
const GROUP_RING = "rounded-full ring-2 ring-background"

/**
 * Overlapping avatar row with an optional "+N" overflow chip.
 *
 * @param props - {@link AvatarGroupProps}
 */
export const AvatarGroup = ({
    items,
    max = 5,
    total,
    size = "sm",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: AvatarGroupProps) => {
    const visible = items.slice(0, max)
    const extra = Math.max((total ?? items.length) - visible.length, 0)

    return (
        <div className={cn("flex -space-x-2", className)}>
            {visible.map((item) => (
                // One badge per MEMBER (§11a): the row names each avatar as ONE opaque
                // part instead of drilling into Avatar.Base's own Image/Fallback parts.
                <span key={item.key} className="inline-flex" data-anat-part={showAnatomy ? "Avatar" : undefined}>
                    <AvatarBase
                        src={item.src}
                        seed={item.seed}
                        name={item.name}
                        icon={item.icon}
                        size={size}
                        isSkeleton={isSkeleton}
                        className={GROUP_RING}
                    />
                </span>
            ))}
            {extra > 0 ? (
                isSkeleton ? (
                    // §12c: đang skeleton thì chip "+N" cũng phải mirror thành shimmer —
                    // hiện "+3" thật giữa hàng đang loading là dữ liệu thật lọt vào state giả.
                    <HeroSkeleton
                        className={cn("rounded-full", SIZE_MAP[size].box, GROUP_RING)}
                        data-anat-part={showAnatomy ? "Overflow" : undefined}
                    />
                ) : (
                    // "+N" is a COUNT, not a person — rendered here rather than through
                    // Avatar.Base, whose initials fallback would clip "+12" to "+1".
                    <HeroAvatar size={size} className={GROUP_RING} data-anat-part={showAnatomy ? "Overflow" : undefined}>
                        <HeroAvatarFallback>+{extra}</HeroAvatarFallback>
                    </HeroAvatar>
                )
            ) : null}
        </div>
    )
}
